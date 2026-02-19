"use strict";

window.DefineScript('Poobar Main Panel', {author:'Choya', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_aa.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_col.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\global_vars.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_tab_basic.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_mp_helpers.js');

let ppt = {
	hPanelScale : new _p ('_MAIN_DISPLAY: Horizontal Monitor Panel Division (0-1)', 0.5),
	vPanelScale : new _p ('_MAIN_DISPLAY: Vertical Monitor Panel Division (0-1)', 0.4),
	cpH : new _p ('_MAIN_DISPLAY: Control Panel Height (Horizontal mode)', 105),
	cpV : new _p ('_MAIN_DISPLAY: Control Panel Height (Vertical mode)', 108),

    bgShow : new _p('_DISPLAY: Show Wallpaper', true),
    bgBlur : new _p('_DISPLAY: Wallpaper Blurred', false),
    bgMode : new _p('_DISPLAY: Wallpaper Mode', false),
    col_mode : new _p('_PROPERTY: Color Mode (1,2,3)', 1),
    //borders : new _p('_PROPERTY: Show tab separators', true),
    //overlay : new _p('_DISPLAY: Show tab shadow/overlay', true),
    orientation : new _p('_DISPLAY: Tab Orientation', false),
    fontMode : new _p ('_DISPLAY: Switch  Icon or Text Font', false),
    bgPath : new _p('_PROPERTY: Default Wallpaper Path', "path\\to\\custom\\image"),
};

let ww = 0;
let wh = 0;
let psH, psV;
let cpH = _scale(ppt.cpH.value); // Control Panel Height in Horizontal orientation
let cpV = _scale(ppt.cpV.value); // Control Panel Height in vertical orientation
let paintRect = false;
let delay = 150;

update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value);
get_colours(ppt.col_mode.value, true);

function on_size(width, height) {
    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;

    // tabStack/playlistView placement ratio in horizontal orientation (.5 splitscreen)
    psH = (wh <= scaler.s730 && ww > scaler.s800 && ppt.hPanelScale.value >= 0.5) ? ppt.hPanelScale.value - 0.1 : ppt.hPanelScale.value;
    // (tabStack & smoothBrowser)/playlistView placement ratio in vertical orientation
    psV = (wh < scaler.s600) ? ppt.vPanelScale.value + 0.2 : ppt.vPanelScale.value;

    const layout = getLayoutType(ww, wh, scaler);

    updateLayout(layout, ww, wh, scaler);
}

// ensure update once with a delay after loading
window.SetTimeout(function() {
    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;
    const layout = getLayoutType(ww, wh, scaler);
    updateLayout(layout, ww, wh, scaler);
}, 180);

/* ==================================================
 * Main Layout code
================================================== */

// using GetPanel instead of GetPanelByIndex to make layout editing more flexible
let fluentControlPanel, playlistView, tabStack, smoothBrowser;
try { fluentControlPanel = window.GetPanel('Fluent Control Panel'); } catch (e) { fluentControlPanel = null; }
try { playlistView = window.GetPanel(''); } catch (e) { playlistView = null; } // Segoe Fluent Icons MusicNote, unicode: ec4f
try { tabStack = window.GetPanel(''); } catch (e) { tabStack = null; } // Segoe Fluent Icons MapLayers, unicode: e81e
try { smoothBrowser = window.GetPanel('Smooth Browser') } catch (e) { smoothBrowser = null; }

/* instruct comment
 * Function that decides layout depending on main JSplitter dimensions
 * 6 states
 * To make custom layout add desired panels in CUI layout editor & set panel objects (see vars above)
 * Adjust PanelObject Members/Methods (see JSplitter PanelObject docs)
 * Debounce panels that are heavier to resize. See debounced blocks below func.
 * Debouncing is optional, but eliminates stutter when manually resizing. See tabstack as example.
 * Debounce is only of relevance for manual resizing smoothness, using win 11 snap layouts is always smooth.
*/
function updateLayout(layout, ww, wh, scaler) {
    if (ww >= scaler.s300) { // stop updating at 300 ww or 100 wh to prevent control panel clipping, ideally constrain window size with a component like UIWizard
        if (layout === 'horizontal')  { // Block 1: Horizontal view
            paintRect = true;
            if (tabStack) tabStack.Hidden = true;
            if (smoothBrowser) smoothBrowser.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpH, ww, cpH); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            if (playlistView) { playlistView.Move(ww * psH, 0, ww - ww * psH, wh - cpH); playlistView.ShowCaption = false; playlistView.Locked = true; playlistView.Hidden = false; }
            debouncedHorizontalView();
        } else if (layout === 'halfscreen') { // Block 2: Half screen view
            paintRect = true;
            if (tabStack) tabStack.Hidden = true;
            if (smoothBrowser) smoothBrowser.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpV, ww, cpV); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            if (playlistView) { const remainingH = wh - cpV - ((wh - cpV) * psV); playlistView.Move(0, (wh - cpV) * psV, ww, remainingH); playlistView.ShowCaption = false; playlistView.Locked = true; playlistView.Hidden = false; }
            debouncedHalfScreen();
        } else if (layout === 'miniplayer') { // Block 3: Mini player view
            paintRect = false;
            if (tabStack) tabStack.Hidden = true;
            if (playlistView) playlistView.Hidden = true;
            if (smoothBrowser) smoothBrowser.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpV, ww, cpV); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            debouncedMiniPlayer();
        } else if (layout === 'miniplayer_2') { // Block 4: Mini player 2 (Control Panel Only)
            paintRect = true;
            exInitTabs([3]);
            try {
                for (let i = 0; i < tabs.length; i++) {
                    const p = window.GetPanelByIndex(tabs[i].index);
                    if (p) {
                        p.Hidden = true;
                    }
                }
            } catch (e) { /* Ignore expected errors, logged by previous GetPanelByIndex within poo_mp_tabs.js */ }
            if (fluentControlPanel) { fluentControlPanel.Move(0, 0, ww, wh); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
        } else if (layout === 'normalvertical') { // Block 5: Normal vertical view
            paintRect = true;
            if (smoothBrowser) smoothBrowser.Hidden = true;
            if (tabStack) tabStack.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpV, ww, cpV); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            if (playlistView) { const remainingH = wh - cpV - ((wh - cpV) * psV); playlistView.Move(0, (wh - cpV) * psV, ww, remainingH); playlistView.ShowCaption = false; playlistView.Locked = true; playlistView.Hidden = false; }
            debouncedNormalVertical();
        } else if (layout === 'narrowvertical') { // Block 6: Narrow vertical view
            paintRect = true;
            if (smoothBrowser) smoothBrowser.Hidden = true;
            if (tabStack) tabStack.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpV, ww, cpV); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            if (playlistView) { const remainingH = wh - cpV - ((wh - cpV) * psV); playlistView.Move(0, (wh - cpV) * psV, ww, remainingH); playlistView.ShowCaption = false; playlistView.Locked = true; playlistView.Hidden = false; }
            debouncedNarrowVertical();
        }
    }
}

const debouncedHorizontalView = debounce(function() {
    // Horizontal View
    if (tabStack) { tabStack.Move(0, 0, ww * psH, wh - cpH); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; }
}, delay);

const debouncedHalfScreen = debounce(function() {
    // Half screen view
    if (tabStack) { tabStack.Move(0, 0, ww * 0.5, (wh - cpV) * psV); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; }
    if (smoothBrowser) { smoothBrowser.Move(ww * 0.5, 0, ww * 0.5, (wh - cpV) * psV); smoothBrowser.ShowCaption = false; smoothBrowser.Locked = true; smoothBrowser.Hidden = false; }
}, delay);

const debouncedMiniPlayer = debounce(function() {
    // Mini Player
    exInitTabs([1, 3]);
    updateTabSize(ppt, true);

    let panelW = ppt.orientation.enabled ? ww - TAB_W : ww;
    let panelH = ppt.orientation.enabled ? wh - cpV : wh - cpV - TAB_H;
    let switchH = ppt.orientation.enabled ? 0 : TAB_H;
    let switchW = ppt.orientation.enabled ? TAB_W : 0;

    try {
        for (let i = 0; i < tabs.length; i++) {
            const p = window.GetPanelByIndex(tabs[i].index);
            if (p) {
                p.Move(switchW, switchH, panelW, panelH, true);
                p.ShowCaption = false;
                p.Locked = true;
                p.Hidden = false;
            }
        }
    } catch (e) { /* Ignore expected errors, logged by previous GetPanelByIndex within poo_mp_tabs.js */ }
}, delay);


const debouncedNormalVertical = debounce(function() {
    // Normal vertical view
    if (tabStack) { tabStack.Move(0, 0, ww * 0.7, (wh - cpV) * psV); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; }
    if (smoothBrowser) { smoothBrowser.Move(ww * 0.7, 0, ww - ww * 0.7, (wh - cpV) * psV); smoothBrowser.ShowCaption = false; smoothBrowser.Locked = true; smoothBrowser.Hidden = false; }
}, delay);

const debouncedNarrowVertical = debounce(function() {
    // Narrow vertical view
    if (tabStack) { tabStack.Move(0, 0, ww, (wh - cpV) * psV); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; }
}, delay);

/* ================================================== */

function on_paint(gr) {
    if (!paintRect) gr.FillSolidRect(0, 0, ww, wh, g_backcolour);

    if (ppt.bgShow.enabled && g_img) {
        let switchBgW = (ppt.orientation.enabled) ? TAB_W : ww; TAB_H;
        let switchBgH = (ppt.orientation.enabled) ? wh : TAB_H;
        _drawImage(gr, bg_img, 0, 0, switchBgW, switchBgH, image.crop);
        const overlayColor = window.IsDark ? _RGBA(0, 0, 0, 128) : _RGBA(255, 255, 255, 128);
        gr.FillSolidRect(0, 0, ww, wh, overlayColor);
    }

    tab.paint_mp(gr, ppt);

    if (paintRect) gr.FillSolidRect(0, 0, ww, wh, g_backcolour);
}

function on_mouse_lbtn_up(x, y) {
    updateTabSize(ppt, true);
    let switchTab_WH = (ppt.orientation.enabled) ? TAB_W : TAB_H;
    let switchTab_HW = (ppt.orientation.enabled) ? TAB_H : TAB_W;
    let switch_xy = (ppt.orientation.enabled) ? x : y;
    let switch_yx = (ppt.orientation.enabled) ? y : x;
    if (switch_xy <= switchTab_WH) {
        const clicked = Math.floor(switch_yx / switchTab_HW);
        if (clicked >= 0 && clicked < tabs.length && clicked !== activeTab) {
            activeTab = clicked;
            // Show clicked panel, hide others
            for (let i = 0; i < tabs.length; i++) {
                const p = window.GetPanelByIndex(tabs[i].index);
                if (p) p.Show(i === activeTab);
            }
            window.Repaint();
            return true;
        }
    }
    return false;
}

function on_mouse_move(x, y) {
    let TAB_WH = (ppt.orientation.enabled) ? TAB_H : TAB_W;
    let switch_xy = (ppt.orientation.enabled) ? x : y;
    let switch_yx = (ppt.orientation.enabled) ? y : x;
    if (switch_xy <= TAB_WH) {
        updateTabSize(ppt, true);
        const idx = Math.floor(switch_yx / TAB_WH);
        if (idx !== hoveredTab && idx >= 0 && idx < tabs.length) {
            hoveredTab = idx;
            window.Repaint();
        }
    }
}

function on_mouse_leave() {
    if (hoveredTab !== -1) {
        hoveredTab = -1;
        window.Repaint();
    }
}

function on_mouse_rbtn_up(x, y) {

    let m = window.CreatePopupMenu();
    let c = fb.CreateContextMenuManager();

    let _menu1 = window.CreatePopupMenu(); // Orientation menu
    let _menu2 = window.CreatePopupMenu(); // Background Wallpaper menu
    let _menu3 = window.CreatePopupMenu(); // Colours menu
    let _submenu3 = window.CreatePopupMenu(); // Button Highlight menu
    let _submenu31 = window.CreatePopupMenu(); // Tab Color menu
    let _menu4 = window.CreatePopupMenu(); // Font Menu

    _menu1.AppendMenuItem(MF_STRING, 90, 'Horizontal');
    _menu1.AppendMenuItem(MF_STRING, 91, 'Vertical');
    _menu1.CheckMenuRadioItem(90, 91, ppt.orientation.enabled ? 91 : 90);
    _menu1.AppendTo(m, MF_STRING, 'Orientation');
    m.AppendMenuSeparator();

    _menu2.AppendMenuItem(MF_STRING, 110, 'Enable');
    _menu2.CheckMenuItem(110, ppt.bgShow.enabled);
    _menu2.AppendMenuItem(MF_STRING, 111, 'Blur');
    _menu2.CheckMenuItem(111, ppt.bgBlur.enabled);
    _menu2.AppendMenuSeparator();
    _menu2.AppendMenuItem(MF_STRING, 112, 'Playing Album Cover');
    _menu2.AppendMenuItem(MF_STRING, 113, 'Default');
    _menu2.CheckMenuRadioItem(112, 113, ppt.bgMode.enabled ? 113 : 112);
    _menu2.AppendTo(m, MF_STRING, 'Background Wallpaper');

    _menu3.AppendMenuItem(MF_STRING, 210, 'System');
    _menu3.AppendMenuItem(MF_STRING, 211, 'Dynamic');
    _menu3.AppendMenuItem(MF_STRING, 212, 'Custom');
    _menu3.CheckMenuRadioItem(210, 212, Math.min(Math.max(210 + ppt.col_mode.value - 1, 210), 212));
    _menu3.AppendTo(m, MF_STRING, 'Colours');

    _menu4.AppendMenuItem(MF_STRING, 310, 'Segoe Fluent Icons');
    _menu4.AppendMenuItem(MF_STRING, 311, 'System');
    _menu4.CheckMenuRadioItem(310, 311, ppt.fontMode.enabled ? 311 : 310);
    _menu4.AppendTo(m, MF_STRING, 'Font');

    m.AppendMenuSeparator();

    m.AppendMenuItem(MF_STRING, 999, 'Panel Properties');
    m.AppendMenuItem(MF_STRING, 1000, 'Configure...');

    const idx = m.TrackPopupMenu(x, y);
    switch (idx) {
    case 0:
        break;
    case 90:
    case 91:
        ppt.orientation.toggle();
        update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value);
        on_size();
        window.Repaint();
        break;
    case 110:
        ppt.bgShow.toggle();
        ppt.col_mode.value = 1;
        get_colours(ppt.col_mode.value, true);
        update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value);
        window.Repaint();
        break;
    case 111:
        ppt.bgBlur.toggle();
        update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value);
        window.Repaint();
        break;
    case 112:
    case 113:
        ppt.bgMode.toggle();
        update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value);
        window.Repaint();
        break;
    case 210:
        ppt.col_mode.value = 1;
        ppt.bgShow.enabled = false;
        get_colours(ppt.col_mode.value, true);
        window.Repaint();
        break;
    case 211:
        ppt.col_mode.value = 2;
        ppt.bgShow.enabled = false;
        get_colours(ppt.col_mode.value, true);
        window.Repaint();
        break;
    case 212:
        ppt.col_mode.value = 3;
        ppt.bgShow.enabled = false;
        get_colours(ppt.col_mode.value, true);
        window.ShowProperties();
        window.Repaint();
        break;
    case 310:
    case 311:
        ppt.fontMode.toggle();
        window.Repaint();
        break;
    case 999:
        window.ShowProperties();
        break;
    case 1000:
        window.ShowConfigureV2();
        break;
    default:
        c.ExecuteByID(idx - 1);
        break;
    }
    return true;
}

function on_colours_changed() {
    get_colours(ppt.col_mode.value, true);
    window.Repaint();
}

function on_playback_new_track() {
    on_colours_changed();
    //get_colours(ppt.col_mode.value, true);
    update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value);
}
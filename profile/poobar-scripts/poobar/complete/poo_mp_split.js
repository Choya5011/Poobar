'use strict';

window.DefineScript('Poobar Main Panel', {author:'Choya', options:{grab_focus:false}});
window.DrawMode = +window.GetProperty('- Draw mode: GDI (false), D2D (true)', false);
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_aa.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_col.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\global_vars.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_tab_basic.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_mp_helpers.js');
include(fb.ProfilePath + 'poobar-scripts\\Menu-Framework-SMP\\helpers\\menu_xxx.js');

let ppt = {
	hPanelScale : new _p ('_PANEL_PLACEMENT: Horizontal Monitor Panel Division (0-1)', 0.5),
	vPanelScale : new _p ('_PANEL_PLACEMENT: Vertical Monitor Panel Division (0-1)', 0.4),
	cpH : new _p ('_PANEL_PLACEMENT: Control Panel Height (Horizontal mode)', 105),
	cpV : new _p ('_PANEL_PLACEMENT: Control Panel Height (Vertical mode)', 108),
	unified_bg : new _p('_PANEL_BEHAVIOR: Unify background across panels', false),

    bgShow : new _p('_TAB_DISPLAY: Show Wallpaper', false),
    bgBlur : new _p('_TAB_DISPLAY: Wallpaper Blurred', false),
    bgMode : new _p('_TAB_DISPLAY: Wallpaper Mode', false),
    col_mode : new _p('_TAB_PROPERTY: Color Mode (1,2,3)', 1),
    borders : new _p('_TAB_PROPERTY: Show tab separators', true),
    overlay : new _p('_TAB_DISPLAY: Show tab shadow/overlay', false),
    orientation : new _p('_TAB_DISPLAY: Tab Orientation', false),
    fontMode : new _p ('_TAB_DISPLAY: Switch  Icon or Text Font', false),
    bgPath : new _p('_TAB_PROPERTY: Default Wallpaper Path', "path\\to\\custom\\image"),
};

let ww = 0;
let wh = 0;
let psH, psV;
let cpH = _scale(ppt.cpH.value); // Control Panel Height in Horizontal orientation
let cpV = _scale(ppt.cpV.value); // Control Panel Height in vertical orientation
let paintRect = false;
let delay = 150;

update_art(ppt);
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

/*
 * ensure update once with a delay after loading
 * if foobar is closed while in miniplayer mode, it can cause update issues when opened again
*/
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
        if (ppt.unified_bg.enabled) {
            fluentControlPanel.SupportPseudoTransparency = true;
            playlistView.SupportPseudoTransparency = true;
            tabStack.SupportPseudoTransparency = true;
            smoothBrowser.SupportPseudoTransparency = true;
        } else {
            fluentControlPanel.SupportPseudoTransparency = false;
            playlistView.SupportPseudoTransparency = false;
            tabStack.SupportPseudoTransparency = false;
            smoothBrowser.SupportPseudoTransparency = false;
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
    if (!paintRect && !ppt.unified_bg.enabled) {
        const rX = (ppt.orientation.enabled) ? TAB_W : 0;
        const rY = (ppt.orientation.enabled) ? 0 : TAB_H;
        const rW = (ppt.orientation.enabled) ? ww - TAB_W : ww;
        const rH = (ppt.orientation.enabled) ? wh : wh - TAB_H;
        gr.FillSolidRect(rX, rY, rW, rH, g_backcolour);
    }

    if (ppt.bgShow.enabled && bg_img && !ppt.unified_bg.enabled) {
        const bgW = (ppt.orientation.enabled) ? TAB_W : ww;
        const bgH = (ppt.orientation.enabled) ? wh : TAB_H;
        _drawImage(gr, bg_img, 0, 0, bgW, bgH, image.crop);
        if (ppt.overlay.enabled) {
            const overlayColor = setAlpha(g_backcolour, 128);
            gr.FillSolidRect(0, 0, bgW, bgH, overlayColor);
        }
    } else if (ppt.bgShow.enabled && bg_img && ppt.unified_bg.enabled) {
        _drawImage(gr, bg_img, 0, 0, ww, wh, image.crop);
        if (ppt.overlay.enabled) {
            const overlayColor = setAlpha(g_backcolour, 128);
            gr.FillSolidRect(0, 0, ww, wh, overlayColor);
        }
    }

    tab.paint_mp(gr, ppt);

    if (paintRect && !ppt.unified_bg.enabled) gr.FillSolidRect(0, 0, ww, wh, g_backcolour);
}

function on_colours_changed() {
    get_colours(ppt.col_mode.value, true);
    window.Repaint();
}

function on_playback_new_track() {
    get_colours(ppt.col_mode.value, true);
    update_art(ppt);
    window.Repaint();
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
    let menu = new _menu();

    menu.newEntry({entryText: 'Configure main panel:', flags: MF_GRAYED});

    menu.newEntry({entryText: 'sep'});

    let or_menu = menu.newMenu('Orientation');
    menu.newCheckMenu(or_menu, 'Horizontal', 'Vertical', () => !ppt.orientation.enabled ? 0 : 1);
    menu.newEntry({menuName: or_menu, entryText: 'Horizontal', func: () => {ppt.orientation.enabled = false; update_art(ppt, true); on_size(); window.Repaint();}});
    menu.newEntry({menuName: or_menu, entryText: 'Vertical', func: () => {ppt.orientation.enabled = true; update_art(ppt, true); on_size(); window.Repaint();}});

    let show_menu = menu.newMenu('Show...');
    menu.newEntry({menuName: show_menu, entryText: 'Separators', func: () => {ppt.borders.toggle(); window.Repaint();}, flags: () => ppt.borders.enabled ? MF_CHECKED : MF_STRING});

    menu.newEntry({entryText: 'sep'});

    let tp_menu = menu.newMenu('Unified Background');
    menu.newEntry({menuName: tp_menu, entryText: 'Unify child-panel backgrounds', flags: MF_GRAYED});
    menu.newEntry({menuName: tp_menu, entryText: 'sep'});
    menu.newEntry({menuName: tp_menu, entryText: 'Enable', func: () => {ppt.unified_bg.toggle(); window.Repaint(); if (ppt.unified_bg.enabled) {let tp_readme; try { tp_readme = utils.ReadTextFile(fb.ProfilePath + 'poobar-scripts\\poobar\\readmes\\tp_readme.txt', 65001); } catch (e) { tp_readme = 'transparency readme file not found' }; fb.ShowPopupMessage(tp_readme, 'Unified background & pseudotransparency'); tp_readme = null;} }, flags: () => ppt.unified_bg.enabled ? MF_CHECKED : MF_STRING});

    const unif_flag = ppt.unified_bg.enabled ? MF_GRAYED : MF_STRING
    let bg_menu = menu.newMenu('Background', 'main', unif_flag);
    menu.newEntry({menuName: bg_menu, entryText: 'Background Wallpaper:', flags: MF_GRAYED});
    menu.newEntry({menuName: bg_menu, entryText: 'sep'});
    menu.newEntry({menuName: bg_menu, entryText: 'Enable', func: () => {ppt.bgShow.toggle(); get_colours(ppt.col_mode.value, true); update_art(ppt, true); refresh_pt_panel(); window.Repaint();}, flags: () => ppt.bgShow.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: bg_menu, entryText: 'Blur', func: () => {ppt.bgBlur.toggle(); update_art(ppt, true); refresh_pt_panel(); window.Repaint();}, flags: () => ppt.bgBlur.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: bg_menu, entryText: 'Shadow', func: () => {ppt.overlay.toggle(); window.Repaint();}, flags: () => ppt.overlay.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: bg_menu, entryText: 'sep'});
    menu.newCheckMenu(bg_menu, 'Playing album cover', 'Default', () => !ppt.bgMode.enabled ? 0 : 1);
    menu.newEntry({menuName: bg_menu, entryText: 'Playing album cover', func: () => {ppt.bgMode.enabled = false; update_art(ppt, true); window.Repaint();}});
    menu.newEntry({menuName: bg_menu, entryText: 'Default', func: () => {ppt.bgMode.enabled = true; if (ppt.bgMode.enabled && !/\.(bmp|gif|jpe?g|png|tiff?|ico)$/i.test(ppt.bgPath.value)) window.ShowProperties(); update_art(ppt, true); refresh_pt_panel(); window.Repaint();}});

    let col_menu = menu.newMenu('Colours');
    menu.newEntry({menuName: col_menu, entryText: 'System', func: () => {ppt.col_mode.value = 1; get_colours(ppt.col_mode.value, true); refresh_pt_panel(); window.Repaint();}, flags: () => ppt.col_mode.value === 1 ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: col_menu, entryText: 'Dynamic', func: () => {ppt.col_mode.value = 2; get_colours(ppt.col_mode.value, true); refresh_pt_panel(); window.Repaint();}, flags: () => ppt.col_mode.value === 2 ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: col_menu, entryText: 'Custom', func: () => {ppt.col_mode.value = 3; get_colours(ppt.col_mode.value, true); refresh_pt_panel(); window.ShowProperties(); window.Repaint();}, flags: () => ppt.col_mode.value === 3 ? MF_CHECKED : MF_STRING});

    let font_menu = menu.newMenu('Font');
    menu.newCheckMenu(font_menu, 'Segoe Fluent Icons', 'System', () => !ppt.fontMode.enabled ? 0 : 1);
    menu.newEntry({menuName: font_menu, entryText: 'Segoe Fluent Icons', func: () => {ppt.fontMode.enabled = false; window.Repaint();}});
    menu.newEntry({menuName: font_menu, entryText: 'System', func: () => {ppt.fontMode.enabled = true; window.Repaint();}});
    //menu.newEntry({menuName: font_menu, entryText: 'Custom', func: () => {}});

    menu.newEntry({entryText: 'sep'});

    menu.newEntry({entryText: 'Open readme...', func: () => {let readme; try { readme = utils.ReadTextFile(fb.ProfilePath + 'poobar-scripts\\poobar\\readmes\\ptpt_readme.txt', 65001); } catch (e) { readme = 'readme file not found' }; fb.ShowPopupMessage(readme, window.ScriptInfo.Name); readme = null;}});

    menu.newEntry({entryText: 'sep'});

    menu.newEntry({entryText: 'Panel Properties', func: () => {window.ShowProperties();}});
    menu.newEntry({entryText: 'Configure...', func: () => {window.ShowConfigureV2();}});

    return menu.btn_up(x, y);
}
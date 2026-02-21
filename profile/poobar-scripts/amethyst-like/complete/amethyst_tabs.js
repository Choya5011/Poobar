'use strict';

window.DefineScript('Horizontal/Vertical Poobar Tabs', {author:'Choya', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_aa.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_col.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\global_vars.js');

let ww = 0;
let wh = 0;

let ppt = {
    bgShow : new _p('_DISPLAY: Show Wallpaper', true),
    bgBlur : new _p('_DISPLAY: Wallpaper Blurred', false),
    bgMode : new _p('_DISPLAY: Wallpaper Mode', false),
    col_mode : new _p('_PROPERTY: Color Mode (1,2,3)', 1),
    fontMode : new _p ('_DISPLAY: Switch  Icon or Text Font', false),
    bgPath : new _p('_PROPERTY: Default Wallpaper Path', "path\\to\\custom\\image"),
};

let panel = new _panel();

let tabs = [];
let activeTab = 0;
let hoveredTab = -999;
const borgirIdx = -1;
const settingsIdx = -2;
let TAB_W = 0;
let TAB_H = 0;
const TAB_MIN_W = 45;
const TAB_MIN_H = 45;
let isExpanded = false;
let textPos = 0;

const SF_CENTER = 0x00000001;
const SF_VCENTER = 0x00000004;
const SF_CENTER_VCENTER = SF_CENTER | SF_VCENTER;
const DT_SINGLELINE = 0x00000020;

let chara = {
    globalNavButton : '\ue700',
    settings : '\ue713'
};

initTabs();
updateTabSize();
update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value);
get_colours(ppt.col_mode.value, true);

function initTabs() {
    tabs = [];
    for (let i = 0;; i++) {
        let p;
        try {
            p = window.GetPanelByIndex(i);
        } catch (e) {
            break;  // Stop if error occurs (no more panels)
        }
        if (!p) break;  // Also stop if null/undefined

        if (p.Text === 'poobar tabs' || p.Name === 'poobar tabs') continue;

        tabs.push({ index: i, name: p.Text || ('Panel ' + (i + 1)) });
    }
    if (!tabs.length) tabs.push({ index: 0, name: 'Panel 1' });

    for (let i = 0; i < tabs.length; i++) {
        try { const p = window.GetPanelByIndex(tabs[i].index); if (p) p.Show(i === activeTab); } catch (e) { console.log(window.ScriptInfo.Name + ': Missing Panels \nNo panels found inside main panel: re-import theme'); fb.ShowPopupMessage('Error: No Panels present\nPlease re-install the theme or insert panels according to main panel theme structure\n\nNote: use "ctrl + p" to access properties in case of errors', window.ScriptInfo.Name); }
    }
}

let font;
let { default_font, default_font_hover, fluent_font, fluent_font_hover } = get_font();
let tabFont;
let tabFont_hover;
let tab_textCol;

let buttons = new _buttons();
buttons.update = () => {
    let fluent_font = gdi.Font('Segoe Fluent Icons', TAB_W);
    let fluent_font_hover = gdi.Font('Segoe Fluent Icons', TAB_W);
    const w = TAB_W * 2
    const h = TAB_H * 2
    buttons.buttons.borgir = new _button(0 - w / 4, 0 - h / 4, w, h, {normal : _chrToImg(chara.globalNavButton, g_textcolour, tabFont), hover : _chrToImg(chara.globalNavButton, g_textcolour_hl, tabFont_hover)}, () => { isExpanded = !isExpanded; on_size(); window.Repaint(); }, '');
    buttons.buttons.settings = new _button(0 - w / 4, wh - h / 1.3, w, h, {normal : _chrToImg(chara.settings, g_textcolour, tabFont), hover : _chrToImg(chara.settings, g_textcolour_hl, tabFont_hover)}, () => { fb.ShowPreferences(); }, '');
}

let tabStack; try { tabStack = window.GetPanel('poobar tabs'); } catch (e) { tabStack = null; }
function on_size() {
    panel.size();
    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;

    updateTabSize();

    let expandSize; if (ww <= scaler.s600) { expandSize = ww - TAB_W; } else if (ww < scaler.s800) { expandSize = _scale(180) } else { expandSize = _scale(300) }
    const panelW = (isExpanded) ? window.Width - TAB_W - expandSize : window.Width - TAB_W;
    const panelH = window.Height;
    const panelX = (isExpanded) ? TAB_W + expandSize : TAB_W;
    const panelY = 0;

    for (let i = 0; i < tabs.length; i++) {
        const p = window.GetPanelByIndex(tabs[i].index);
        if (p) {
            p.Move(panelX, panelY, panelW, panelH, true);
            p.ShowCaption = false;
            p.Locked = true;
        }
        if (p.Name === 'ESLyric') {
            p.SupportPseudoTransparency = true;
        } else {
            continue;
        }
    }
    if (isExpanded) {
        if (tabStack) { tabStack.Move(TAB_W, 0, expandSize, wh); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; }
    } else {
        tabStack.Hidden = true;
    }

    buttons.update();
}

function on_paint(gr) {
    gr.FillSolidRect(TAB_W, 0, panel.w, panel.h, g_backcolour);

    if (ppt.bgShow.enabled && bg_img) {
        _drawImage(gr, bg_img, 0, 0, TAB_W, panel.h, image.crop);
        const overlayColor = window.IsDark ? _RGBA(0, 0, 0, 128) : _RGBA(255, 255, 255, 128);
        gr.FillSolidRect(0, 0, panel.w, panel.h, overlayColor);
    } else if (!ppt.bgShow.enabled) {
        gr.FillSolidRect(0, 0, TAB_W, panel.h, g_backcolour);
    }

    buttons.paint(gr);

    //drawIconBlock(gr, borgirIdx, 0, 0, TAB_W, TAB_H, hoveredTab === borgirIdx);
    //drawIconBlock(gr, settingsIdx, 0, wh - TAB_H, TAB_W, TAB_H, hoveredTab === settingsIdx);

    gr.SetSmoothingMode(2);
    tabFont = (ppt.fontMode.enabled) ? default_font : fluent_font;
    tabFont_hover = (ppt.fontMode.enabled) ? default_font_hover : fluent_font_hover;
    updateTabSize();
    for (let i = 0; i < tabs.length; i++) {
        //const text = !isExpanded ? tabs[i].name.charAt(0) : tabs[i].name;
        const text = tabs[i].name.charAt(0);
        font = (i === hoveredTab) ? tabFont_hover : tabFont;
        tab_textCol = i === hoveredTab ? g_textcolour_hl : g_textcolour;
        // Vertical tabs
        const y = TAB_H * (i + 1);
        //if (!ppt.bgShow.enabled) gr.FillSolidRect(0, y, TAB_W, h, g_backcolour);
        if (i === hoveredTab) gr.FillRoundRect(0, y, TAB_W - 1, TAB_H, 10, 10, g_color_highlight);
        if (i === activeTab && i !== hoveredTab) gr.FillRoundRect(0, y, TAB_W - 1, TAB_H, 10, 10, g_color_selected_bg);
        gr.GdiDrawText(text, font, tab_textCol, textPos, y, TAB_W, TAB_H, DT_SINGLELINE | DT_LEFT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
    }
}

function drawIconBlock(gr, id, x, y, w, h, isHover) {
    const col = isHover ? g_textcolour_hl : g_textcolour;
    const font = gdi.Font('Segoe Fluent Icons', w);

    const charaCode = (id === borgirIdx)
        ? chara.globalNavButton
        : chara.settings;

    gr.FillSolidRect(x, y, w, h, isHover ? g_color_highlight : g_backcolour);
    gr.GdiDrawText(charaCode, font, col, x, y, w, h, DT_CENTER | DT_VCENTER | DT_NOPREFIX);
}

function updateTabSize() {
    TAB_W = _scale(45);
    TAB_H = _scale(45);
    textPos = TAB_H / 3;
}

function on_mouse_lbtn_up(x, y) {
    updateTabSize();

    if (buttons && buttons.lbtn_up(x, y)) {
        return;
    }

    const clickedIndex = Math.floor((y - TAB_H) / TAB_H);

    if (clickedIndex >= 0 && clickedIndex < tabs.length && clickedIndex !== activeTab) {
        activeTab = clickedIndex;

        // Show clicked panel, hide others
        for (let i = 0; i < tabs.length; i++) {
            const p = window.GetPanelByIndex(tabs[i].index);
            if (p) p.Show(i === activeTab);
        }

        window.Repaint();
        return true;
    }

    return false;
}

function on_mouse_move(x, y) {
    const idx = Math.floor((y - TAB_H) / TAB_H);

    if (idx !== hoveredTab && idx >= 0 && idx < tabs.length) {
        hoveredTab = idx;
        window.Repaint();
    }

    if (buttons && buttons.move(x, y)) return;
}

function on_mouse_leave() {
    if (hoveredTab !== -1) {
        hoveredTab = -1;
        window.Repaint();
    }
    buttons.leave();
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

//    _menu1.AppendMenuItem(MF_STRING, 90, 'Horizontal');
//    _menu1.AppendMenuItem(MF_STRING, 91, 'Vertical');
//    _menu1.CheckMenuRadioItem(90, 91, ppt.orientation.enabled ? 91 : 90);
//    _menu1.AppendTo(m, MF_STRING, 'Orientation');
//    m.AppendMenuSeparator();

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
//    case 90:
//    case 91:
//        ppt.orientation.toggle();
//        update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value);
//        on_size();
//        window.Repaint();
//        break;
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
        refresh_pt_panel();
        window.Repaint();
        break;
    case 211:
        ppt.col_mode.value = 2;
        ppt.bgShow.enabled = false;
        get_colours(ppt.col_mode.value, true);
        refresh_pt_panel();
        window.Repaint();
        break;
    case 212:
        ppt.col_mode.value = 3;
        ppt.bgShow.enabled = false;
        get_colours(ppt.col_mode.value, true);
        refresh_pt_panel();
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
    panel.colours_changed();
    window.Repaint();
}

function on_playback_new_track() {
    on_colours_changed();
    //get_colours(ppt.col_mode.value, true);
    update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value);
    refresh_pt_panel();
}

function refresh_pt_panel() {
    const p = window.GetPanelByIndex(tabs[activeTab].index);
    if (p.Text === 'ESLyric' || p.Name === 'ESLyric') {
        p.Hidden = true;
        p.Hidden = false;
    }
}

function get_font() {
    let default_font, g_fstyle, g_fname;
    let g_fsize = 1;
    let g_fsize_hover = 1;
    let fluent_size = 1;
    let fluent_size_hover = 1;

    if (window.InstanceType == 0) {
        default_font = window.GetFontCUI(0);
    } else if (window.InstanceType == 1) {
        default_font = window.GetFontDUI(0);
    }

    try {
        g_fname = default_font.Name;
        g_fsize = default_font.Size;
        g_fstyle = default_font.Style;
    } catch (e) {
        console.log("JSplitter Error: Unable to use the default font. Using Arial instead.");
        g_fname = "Arial";
        g_fsize = 12;
        g_fstyle = 0;
    }

    fluent_size = Math.max(_scale(12), Math.min(_scale(18), Math.round(TAB_W * 0.4)));
    fluent_size_hover = Math.max(_scale(15), Math.min(_scale(24), Math.round(TAB_W * 0.5)));

    return {
        default_font: gdi.Font(g_fname, g_fsize, g_fstyle),
        default_font_hover: gdi.Font(g_fname, g_fsize_hover, g_fstyle),
        fluent_font: gdi.Font('Segoe Fluent Icons', fluent_size),
        fluent_font_hover: gdi.Font('Segoe Fluent Icons', fluent_size_hover)
    };
}

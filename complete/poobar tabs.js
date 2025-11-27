'use strict';

window.DefineScript('Horizontal/Vertical Poobar Tabs', {author:'Choya', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\poobar\\helpers\\poo_helpers.js');
include(fb.ComponentPath + 'samples\\poobar\\helpers\\poo_col_helper.js');

let ww = 0;
let wh = 0;

let ppt = {
    bgShow : new _p('_DISPLAY: Show Wallpaper', true),
    bgBlur : new _p('_DISPLAY: Wallpaper Blurred', false),
    bgMode : new _p('_DISPLAY: Wallpaper Mode', false),
    col_mode : new _p('_PROPERTY: Color Mode (1,2,3)', 1),
    orientation : new _p('_DISPLAY: Tab Orientation', false),
    fontMode : new _p ('_DISPLAY: Switch  Icon or Text Font', false),
    bgPath : new _p('_PROPERTY: Default Wallpaper Path', "path\\to\\custom\\image"),
};

let panel = new _panel();

let tabs = [];
let activeTab = 0;
let hoveredTab = -1;
let TAB_W = 0;
let TAB_H = 0;
const TAB_MIN_W = 45;
const TAB_MIN_H = 45;

const SF_CENTER = 0x00000001;
const SF_VCENTER = 0x00000004;
const SF_CENTER_VCENTER = SF_CENTER | SF_VCENTER;
const DT_SINGLELINE = 0x00000020;

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
        tabs.push({ index: i, name: p.Text || ('Panel ' + (i + 1)) });
    }
    if (!tabs.length) tabs.push({ index: 0, name: 'Panel 1' });

    for (let i = 0; i < tabs.length; i++) {
        const p = window.GetPanelByIndex(tabs[i].index);
        if (p) p.Show(i === activeTab);
    }
}

function on_size() {
    panel.size();
    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;

    updateTabSize();

    let panelW = (ppt.orientation.enabled) ? window.Width - TAB_W : window.Width;
    let panelH = (ppt.orientation.enabled) ? window.Height : window.Height - TAB_H;
    let switchH = (ppt.orientation.enabled) ? 0 : TAB_H;
    let switchW = (ppt.orientation.enabled) ? TAB_W : 0;

    for (let i = 0; i < tabs.length; i++) {
        const p = window.GetPanelByIndex(tabs[i].index);
        if (p) {
            p.Move(switchW, switchH, panelW, panelH, true);
            p.ShowCaption = false;
            p.Locked = true;
        }
    }
    window.Repaint();
}

function on_paint(gr) {
    const { default_font, default_font_hover, fluent_font, fluent_font_hover } = get_font();
    const tabFont = (ppt.fontMode.enabled) ? default_font : fluent_font;
    const tabFont_hover = (ppt.fontMode.enabled) ? default_font_hover : fluent_font_hover;

    if (ppt.bgShow.enabled && bg_img) {
        let switchBgW = (ppt.orientation.enabled) ? TAB_W : panel.w; TAB_H;
        let switchBgH = (ppt.orientation.enabled) ? panel.h : TAB_H;
        _drawImage(gr, bg_img, 0, 0, switchBgW, switchBgH, image.crop);
        const overlayColor = window.IsDark ? _RGBA(0, 0, 0, 128) : _RGBA(255, 255, 255, 128);
        gr.FillSolidRect(0, 0, panel.w, panel.h, overlayColor);
    }

    updateTabSize();
    for (let i = 0; i < tabs.length; i++) {
        const text = tabs[i].name;
        let font = (i === hoveredTab) ? tabFont_hover : tabFont;
        let tab_textCol = i === hoveredTab ? g_textcolour_hl : g_textcolour;
        if (ppt.orientation.enabled) {
            // Vertical tabs
            const y = i * TAB_H;
            const h = (i === tabs.length - 1) ? wh - TAB_H * (tabs.length - 1) : TAB_H;
            if (!ppt.bgShow.enabled) gr.FillSolidRect(0, y, TAB_W, h, g_backcolour);
            if (i === hoveredTab) gr.FillSolidRect(0, y, TAB_W, h, g_color_highlight);
            if (i === activeTab && i !== hoveredTab) gr.FillSolidRect(0, y, TAB_W, h, g_color_selected_bg);
            gr.GdiDrawText(text, font, tab_textCol, 0, y, TAB_W, h, DT_SINGLELINE | SF_CENTER_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
        } else {
            // Horizontal tabs
            const x = i * TAB_W;
            const w = (i === tabs.length - 1) ? ww - TAB_W * (tabs.length - 1) : TAB_W;
            if (!ppt.bgShow.enabled) gr.FillSolidRect(x, 0, w, TAB_H, g_backcolour);
            if (i === hoveredTab) gr.FillSolidRect(x, 0, w, TAB_H, g_color_highlight);
            if (i === activeTab && i !== hoveredTab) gr.FillSolidRect(x, 0, w, TAB_H, g_color_selected_bg);
            gr.GdiDrawText(text, font, tab_textCol, x + 5, 0, w - 10, TAB_H, DT_SINGLELINE | SF_CENTER_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
        }
    }
}

function updateTabSize() {
    if (ppt.orientation.enabled) {
        // scale height when vertical | 45-70 clamp in 1440p
        TAB_W = Math.max(_scale(26.25), Math.min(_scale(52.5), Math.round(ww / 28.44)));
        TAB_H = Math.max(TAB_MIN_H, Math.floor(wh / Math.max(1, tabs.length)));
    } else {
        // scale width when horizontal | 30-50 clamp in 1440p
        TAB_H = Math.max(_scale(22.5), Math.min(_scale(37.5), Math.round(wh / 41.36)));
        TAB_W = Math.max(TAB_MIN_W, Math.floor(ww / Math.max(1, tabs.length)));
    }
}

function on_mouse_lbtn_up(x, y) {
    updateTabSize();
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
        updateTabSize();
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
        if (ppt.bgMode.enabled && ppt.bgPath.value === "path\\to\\custom\\image") window.ShowProperties();
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
    panel.colours_changed();
    window.Repaint();
}

function on_playback_new_track() {
    on_colours_changed();
    //get_colours(ppt.col_mode.value, true);
    update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value);
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

    if (ppt.orientation.enabled) {
        // Vertical tabs | icons constrained by tab width
        fluent_size = Math.max(_scale(12), Math.min(_scale(18), Math.round(TAB_W * 0.4)));
        fluent_size_hover = Math.max(_scale(15), Math.min(_scale(24), Math.round(TAB_W * 0.5)));
    } else {
        // Horizontal tab text
        if (ppt.fontMode.enabled) {
            // text constrained by tab width
            g_fsize = Math.max(_scale(10.5), Math.min(_scale(18), Math.round(TAB_W * 0.07)));
            g_fsize_hover = Math.max(_scale(13.5), Math.min(_scale(25.5), Math.round(TAB_W * 0.09)));
        } else {
            // icons constrained by tab height
            fluent_size = Math.max(_scale(10.5), Math.min(_scale(18), Math.round(TAB_H * 0.6)));
            fluent_size_hover = Math.max(_scale(13.5), Math.min(_scale(25.5), Math.round(TAB_H * 0.7)));
        }
    }
    return {
        default_font: gdi.Font(g_fname, g_fsize, g_fstyle),
        default_font_hover: gdi.Font(g_fname, g_fsize_hover, g_fstyle),
        fluent_font: gdi.Font('Segoe Fluent Icons', fluent_size),
        fluent_font_hover: gdi.Font('Segoe Fluent Icons', fluent_size_hover)
    };
}

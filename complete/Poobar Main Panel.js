"use strict";

window.DefineScript('Poobar Main Panel', {author:'Choya', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\poobar\\helpers\\poo_helpers.js');
include(fb.ComponentPath + 'samples\\poobar\\helpers\\poo_col_helper.js');

let ppt = {
    // Main Panel properties
	hPanelScale : new _p ('_MAIN_DISPLAY: Horizontal Monitor Panel Division (0-1)', 0.5),
	vPanelScale : new _p ('_MAIN_DISPLAY: Vertical Monitor Panel Division (0-1)', 0.4),
	cpH : new _p ('_MAIN_DISPLAY: Control Panel Height (Horizontal mode)', 105),
	cpV : new _p ('_MAIN_DISPLAY: Control Panel Height (Vertical mode)', 108),
    // Tab logic properties for main panel
	bgShow : new _p('_TAB_DISPLAY: Show Wallpaper', true),
    bgBlur : new _p('_TAB_DISPLAY: Wallpaper Blurred', false),
    bgMode : new _p('_TAB_DISPLAY: Wallpaper Mode', false),
    col_mode : new _p('_TAB_PROPERTY: Color Mode (1,2,3)', 1),
    orientation : new _p('_TAB_DISPLAY: Tab Orientation', false),
    fontMode : new _p ('_TAB_DISPLAY: Switch  Icon or Text Font', false),
    bgPath : new _p('_TAB_PROPERTY: Default Wallpaper Path', "path\\to\\custom\\image"),
};

/**
 * storing in scaler instead of accessing _scale() directly
 * reason: easier to find back in script
 * s300 = 300px in 1440p
 */
const scaler = {
    s300: _scale(225),
    s320: _scale(240),
    s380: _scale(285),
    s400: _scale(300),
    s600: _scale(450),
    s730: _scale(547.5),
    s800: _scale(600),
};

let ww = 0;
let wh = 0;

/* ============================================================= */
/**
 * Ignore list for miniplayer mode
 * Same logic as poobar tabs being used
 * idx 1 & 3 are Smooth Browser & Fluent Control Panel
 */
const ignore = [1, 3];

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

update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value);
get_colours(ppt.col_mode.value, true);
/* ============================================================= */

let cpH = _scale(ppt.cpH.value); // Control Panel Height in Horizontal orientation
let cpV = _scale(ppt.cpV.value); // Control Panel Height in vertical orientation

let fluentControlPanel; let playlistView; let tabStack; let smoothBrowser;
try { fluentControlPanel = window.GetPanel('Fluent Control Panel'); } catch (e) { fluentControlPanel = null; }
try { playlistView = window.GetPanel(''); } catch (e) { playlistView = null; } // Segoe Fluent Icons MusicNote, unicode: ec4f
try { tabStack = window.GetPanel(''); } catch (e) { tabStack = null; } // Segoe Fluent Icons MapLayers, unicode: e81e
try { smoothBrowser = window.GetPanel('Smooth Browser') } catch (e) { smoothBrowser = null; }

const approximatelyEqual = (a, b, tolerance = 0.20) => {
  const diff = Math.abs(a - b);
  const largest = Math.max(Math.abs(a), Math.abs(b));
  return diff <= largest * tolerance;
};

const checkSizeAndRatio = (wh, ww, targetRatio, tolerance = 0.20) => {
  if (wh > ww && approximatelyEqual(wh / ww, targetRatio, tolerance)) return true;
  return false;
};

function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function on_size(width, height) {
    panel.size();

    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;
    console.log(wh);

    const psH = (wh <= scaler.s730 && ww > scaler.s800) ? ppt.hPanelScale.value - 0.1 : ppt.hPanelScale.value; // tabStack/playlistView placement ratio in horizontal orientation (.5 splitscreen)
    let psV = (wh < scaler.s600) ? ppt.vPanelScale.value + 0.2 : ppt.vPanelScale.value; // (tabStack & smoothBrowser)/playlistView placement ratio in vertical orientation

	if ((checkSizeAndRatio(ww, wh, 16 / 9, 0.2) || checkSizeAndRatio(ww, wh, 3, 0.3) || checkSizeAndRatio(ww, wh, 11.11, 0.4) || checkSizeAndRatio(ww, wh, 5.4, 0.2)) && wh > scaler.s380)  {
	    // Horizontal view
	    if (fluentControlPanel) {
            fluentControlPanel.Move(0, wh - cpH, ww, cpH);
            fluentControlPanel.ShowCaption = false;
            fluentControlPanel.Locked = true;
            fluentControlPanel.Hidden = false;
	    }
        if (tabStack) {
            tabStack.Move(0, 0, ww * psH, wh - cpH);
            tabStack.ShowCaption = false;
            tabStack.Locked = true;
            tabStack.Hidden = false;
        }
        if (smoothBrowser) smoothBrowser.Hidden = true;
        if (playlistView) {
            playlistView.Move(ww * psH, 0, ww - ww * psH, wh - cpH);
            playlistView.ShowCaption = false;
            playlistView.Locked = true;
            playlistView.Hidden = false;
        }
	} else if (checkSizeAndRatio(wh, ww, 8 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730 || checkSizeAndRatio(ww, wh, 8 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730 || checkSizeAndRatio(ww, wh, 1, 0.3) && ww > scaler.s600) {
	    // ~Half screen view
	    if (fluentControlPanel) {
            fluentControlPanel.Move(0, wh - cpV, ww, cpV);
            fluentControlPanel.ShowCaption = false;
            fluentControlPanel.Locked = true;
            fluentControlPanel.Hidden = false;
	    }
        if (tabStack) {
            tabStack.Move(0, 0, ww * 0.5, (wh - cpV) * psV);
            tabStack.ShowCaption = false;
            tabStack.Locked = true;
            tabStack.Hidden = false;
        }
        if (smoothBrowser) {
            smoothBrowser.Move(ww * 0.5, 0, ww * 0.5, (wh - cpV) * psV);
            smoothBrowser.ShowCaption = false;
            smoothBrowser.Locked = true;
            smoothBrowser.Hidden = false;
        }
        if (playlistView) {
            const remainingH = wh - cpV - ((wh - cpV) * psV);
            playlistView.Move(0, (wh - cpV) * psV, ww, remainingH);
            playlistView.ShowCaption = false;
            playlistView.Locked = true;
            playlistView.Hidden = false;
        }
    } else if ((ww <= scaler.s600 && wh <= scaler.s730 || ww < scaler.s320) && wh > scaler.s400) {
        // Mini player view
        initTabs(ignore);
        updateTabSize();

        let panelW = ppt.orientation.enabled ? ww - TAB_W : ww;
        let panelH = ppt.orientation.enabled ? wh - cpV : wh - cpV - TAB_H;
        let switchH = ppt.orientation.enabled ? 0 : TAB_H;
        let switchW = ppt.orientation.enabled ? TAB_W : 0;

        for (let i = 0; i < tabs.length; i++) {
            const p = window.GetPanelByIndex(tabs[i].index);
            if (p) {
                p.Move(switchW, switchH, panelW, panelH, true);
                p.ShowCaption = false;
                p.Locked = true;
                p.Hidden = false;
            }
        }

        if (fluentControlPanel) {
            fluentControlPanel.Move(0, wh - cpV, ww, cpV);
            fluentControlPanel.ShowCaption = false;
            fluentControlPanel.Locked = true;
            fluentControlPanel.Hidden = false;
        }
        if (smoothBrowser) smoothBrowser.Hidden = true;

        window.Repaint();
    } else if (wh <= scaler.s400) {
        // Mini player 2: Control Panel Only
        initTabs([3]);

        for (let i = 0; i < tabs.length; i++) {
            const p = window.GetPanelByIndex(tabs[i].index);
            if (p) {
                p.Hidden = true;
            }
        }

        if (fluentControlPanel) {
            fluentControlPanel.Move(0, 0, ww, wh);
            fluentControlPanel.ShowCaption = false;
            fluentControlPanel.Locked = true;
            fluentControlPanel.Hidden = false;
        }
    } else if (checkSizeAndRatio(wh, ww, 16 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730 || checkSizeAndRatio(wh, ww, 1.36, 0.3)) {
        // Normal vertical view
        if (fluentControlPanel) {
            fluentControlPanel.Move(0, wh - cpV, ww, cpV);
            fluentControlPanel.ShowCaption = false;
            fluentControlPanel.Locked = true;
            fluentControlPanel.Hidden = false;
        }
        if (tabStack) {
            tabStack.Move(0, 0, ww * 0.7, (wh - cpV) * psV);
            tabStack.ShowCaption = false;
            tabStack.Locked = true;
            tabStack.Hidden = false;
        }
        if (smoothBrowser) {
            smoothBrowser.Move(ww * 0.7, 0, ww - ww * 0.7, (wh - cpV) * psV);
            smoothBrowser.ShowCaption = false;
            smoothBrowser.Locked = true;
            smoothBrowser.Hidden = false;
        }
        if (playlistView) {
            const remainingH = wh - cpV - ((wh - cpV) * psV);
            playlistView.Move(0, (wh - cpV) * psV, ww, remainingH);
            playlistView.ShowCaption = false;
            playlistView.Locked = true;
            playlistView.Hidden = false;
        }
    } else if (checkSizeAndRatio(wh, ww, 1.9, 0.1) && ww >= scaler.s300 || checkSizeAndRatio(wh, ww, 4, 0.2) && ww >= scaler.s300 || checkSizeAndRatio(wh, ww, 2.2, 0.06) && ww >= scaler.s300 || checkSizeAndRatio(wh, ww, 2.7, 0.2) && ww >= scaler.s300) {
        // Narrow vertical view
        if (fluentControlPanel) {
            fluentControlPanel.Move(0, wh - cpV, ww, cpV);
            fluentControlPanel.ShowCaption = false;
            fluentControlPanel.Locked = true;
            fluentControlPanel.Hidden = false;
        }
        if (tabStack) {
            tabStack.Move(0, 0, ww, (wh - cpV) * psV);
            tabStack.ShowCaption = false;
            tabStack.Locked = true;
            tabStack.Hidden = false;
        }
        if (smoothBrowser) smoothBrowser.Hidden = true;
        if (playlistView) {
            const remainingH = wh - cpV - ((wh - cpV) * psV);
            playlistView.Move(0, (wh - cpV) * psV, ww, remainingH);
            playlistView.ShowCaption = false;
            playlistView.Locked = true;
            playlistView.Hidden = false;
        }
    }
}

/*==================================================================================================================
    Tab logic section
     * Same tab logic as poobar tabs script
     * With the addition of ignore list to initTabs
===================================================================================================================*/
function initTabs(ignoreArr) {
    tabs = [];
    for (let i = 0;; i++) {
        if (ignoreArr.includes(i)) continue;  // Skip ignored indexes

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

function on_paint(gr) {
    const { default_font, default_font_hover, fluent_font, fluent_font_hover } = get_font();
    const tabFont = (ppt.fontMode.enabled) ? default_font : fluent_font;
    const tabFont_hover = (ppt.fontMode.enabled) ? default_font_hover : fluent_font_hover;

    if (ppt.bgShow.enabled && g_img) {
        let switchBgW = (ppt.orientation.enabled) ? TAB_W : panel.w; TAB_H;
        let switchBgH = (ppt.orientation.enabled) ? panel.h : TAB_H;
        _drawImage(gr, bg_img, 0, 0, switchBgW, switchBgH, image.crop);
        const overlayColor = window.IsDark ? _RGBA(0, 0, 0, 128) : _RGBA(255, 255, 255, 128);
        gr.FillSolidRect(0, 0, panel.w, panel.h, overlayColor);
    }

    updateTabSize();
    let tab_hl_col = g_color_selected_bg;
    for (let i = 0; i < tabs.length; i++) {
        const text = tabs[i].name;
        let font = (i === hoveredTab) ? tabFont_hover : tabFont;
        let tab_textCol = i === hoveredTab ? g_textcolour_hl : g_textcolour;
        if (ppt.orientation.enabled) {
            // Vertical tabs
            const y = i * (TAB_H - cpV / 2); // Modified for MP
            const h = (i === tabs.length - 1) ? wh - TAB_H * (tabs.length - 1) : TAB_H;
            if (!ppt.bgShow.enabled) gr.FillSolidRect(0, y, TAB_W, h, g_backcolour);
            if (i === hoveredTab) gr.FillSolidRect(0, y, TAB_W, h, g_color_highlight);
            if (i === activeTab && i !== hoveredTab) gr.FillSolidRect(0, y, TAB_W, h, tab_hl_col);
            gr.GdiDrawText(text, font, tab_textCol, 0, y - cpV / 4, TAB_W, h, DT_SINGLELINE | SF_CENTER_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX); // Modified for MP
        } else {
            // Horizontal tabs
            const x = i * TAB_W;
            const w = (i === tabs.length - 1) ? ww - TAB_W * (tabs.length - 1) : TAB_W;
            if (!ppt.bgShow.enabled) gr.FillSolidRect(x, 0, w, TAB_H, g_backcolour);
            if (i === hoveredTab) gr.FillSolidRect(x, 0, w, TAB_H, g_color_highlight);
            if (i === activeTab && i !== hoveredTab) gr.FillSolidRect(x, 0, w, TAB_H, tab_hl_col);
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
/*==================================================================================================================
    End of tab logic section
===================================================================================================================*/
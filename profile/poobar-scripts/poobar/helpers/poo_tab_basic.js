/*
 * This file contains: variables, initTabs, exInitTabs, updateTabSize, get_font, p_tabs
 */

// Variables
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

// Get panels
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
        try { const p = window.GetPanelByIndex(tabs[i].index); if (p) p.Show(i === activeTab); } catch (e) { console.log(window.ScriptInfo.Name + ': Missing Panels \nNo panels found inside main panel: re-import theme'); fb.ShowPopupMessage('Error: No Panels present\nPlease re-install the theme or insert panels according to main panel theme structure\n\nNote: use "ctrl + p" to access properties in case of errors', window.ScriptInfo.Name); }
    }
}

// Get panels with exceptions. Used in poo main panel.
function exInitTabs(ignoreArr) {
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
        try { const p = window.GetPanelByIndex(tabs[i].index); if (p) p.Show(i === activeTab); } catch (e) { console.log(window.ScriptInfo.Name + ': Missing Panels \nNo panels found inside main panel: re-import theme'); fb.ShowPopupMessage('Error: No Panels present\nPlease re-install the theme or insert panels according to main panel theme structure\n\nNote: use "ctrl + p" to access properties in case of errors', window.ScriptInfo.Name); }
    }
}

// Tab size
function updateTabSize(ppt, mp) {
    if (ppt.orientation.enabled) {
        // scale height when vertical | 45-70 clamp in 1440p
        const height = mp ? wh - cpV : wh;
        TAB_W = Math.max(_scale(26.25), Math.min(_scale(52.5), Math.round(ww / 28.44)));
        TAB_H = Math.max(TAB_MIN_H, Math.floor(height / Math.max(1, tabs.length)));
    } else {
        // scale width when horizontal | 30-50 clamp in 1440p
        TAB_H = Math.max(_scale(22.5), Math.min(_scale(37.5), Math.round(wh / 41.36)));
        TAB_W = Math.max(TAB_MIN_W, Math.floor(ww / Math.max(1, tabs.length)));
    }
}

// Font
function get_font(orientation, fontMode) {
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

    if (orientation) {
        // Vertical tabs | icons constrained by tab width
        fluent_size = Math.max(_scale(12), Math.min(_scale(18), Math.round(TAB_W * 0.4)));
        fluent_size_hover = Math.max(_scale(15), Math.min(_scale(24), Math.round(TAB_W * 0.5)));
    } else {
        // Horizontal tab text
        if (fontMode) {
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

const tab = { // Tab painting logic, tab background painting is still handled in the script itself. Not here.
    paint_pt(gr, ppt) { // tabs
        const { default_font, default_font_hover, fluent_font, fluent_font_hover } = get_font(ppt.orientation.enabled, ppt.fontMode.enabled);
        const tabFont = (ppt.fontMode.enabled) ? default_font : fluent_font;
        const tabFont_hover = (ppt.fontMode.enabled) ? default_font_hover : fluent_font_hover;

        updateTabSize(ppt);
        for (let i = 0; i < tabs.length; i++) {
            const text = tabs[i].name;
            let font = (i === hoveredTab) ? tabFont_hover : tabFont;
            let tab_textCol = i === hoveredTab ? g_textcolour_hl : g_textcolour;
            if (ppt.orientation.enabled) {
                // Vertical tabs
                const y = i * TAB_H;
                const h = (i === tabs.length - 1) ? wh - TAB_H * (tabs.length - 1) : TAB_H;
                if (i === hoveredTab) gr.FillSolidRect(0, y, TAB_W, h, g_color_highlight);
                if (i === activeTab && i !== hoveredTab) gr.FillSolidRect(0, y, TAB_W, h, g_color_selected_bg);
                if (i >= 1 && i < tabs.length && ppt.borders.enabled) gr.DrawLine(_scale(6), TAB_H * i, TAB_W - _scale(6), TAB_H * i, 0.5, g_color_selected_bg);
                gr.GdiDrawText(text, font, tab_textCol, 0, y, TAB_W, h, DT_SINGLELINE | SF_CENTER_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
            } else {
                // Horizontal tabs
                const x = i * TAB_W;
                const w = (i === tabs.length - 1) ? ww - TAB_W * (tabs.length - 1) : TAB_W;
                if (i === hoveredTab) gr.FillSolidRect(x, 0, w, TAB_H, g_color_highlight);
                if (i === activeTab && i !== hoveredTab) gr.FillSolidRect(x, 0, w, TAB_H, g_color_selected_bg);
                if (i >= 1 && i < tabs.length && ppt.borders.enabled) gr.DrawLine(TAB_W * i, _scale(4), TAB_W * i, TAB_H - _scale(4), 0.5, g_color_selected_bg);
                gr.GdiDrawText(text, font, tab_textCol, x + 5, 0, w - 10, TAB_H, DT_SINGLELINE | SF_CENTER_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
            }
        }
    },

    paint_mp(gr, ppt) { // main panel tabs
        const { default_font, default_font_hover, fluent_font, fluent_font_hover } = get_font();
        const tabFont = (ppt.fontMode.enabled) ? default_font : fluent_font;
        const tabFont_hover = (ppt.fontMode.enabled) ? default_font_hover : fluent_font_hover;

        updateTabSize(ppt, true);
        let tab_hl_col = g_color_selected_bg;
        for (let i = 0; i < tabs.length; i++) {
            const text = tabs[i].name;
            let font = (i === hoveredTab) ? tabFont_hover : tabFont;
            let tab_textCol = i === hoveredTab ? g_textcolour_hl : g_textcolour;
            if (ppt.orientation.enabled) {
                // Vertical tabs
                const y = i * TAB_H;
                const h = (i === tabs.length - 1) ? wh - cpV - TAB_H * (tabs.length - 1) : TAB_H; // modified for MP
                if (!ppt.bgShow.enabled) gr.FillSolidRect(0, y, TAB_W, h, g_backcolour);
                if (i === hoveredTab) gr.FillSolidRect(0, y, TAB_W, h, g_color_highlight);
                if (i === activeTab && i !== hoveredTab) gr.FillSolidRect(0, y, TAB_W, h, tab_hl_col);
                gr.GdiDrawText(text, font, tab_textCol, 0, y, TAB_W, h, DT_SINGLELINE | SF_CENTER_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
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
};
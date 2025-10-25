'use strict';

/**
 * NOTE: some variables here are probably already declared in other helpers.
 * Warning in case of redeclaration.
 */

// Album art
let g_img = null; // album art for fluent control panel
let bg_img = null; // background image
let g_img_res = 0;
function update_album_art(bgShow, bgMode, bgBlur, bgPath, art) {
     if (!bgShow && !art) return;
     const metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
     if (metadb) {
         g_img = bgMode ? gdi.Image(bgPath) : utils.GetAlbumArtV2(metadb, 0);
         g_img_res = bgBlur ? 200 : g_img.Width;

         if (g_img) {
             const r = g_img_res / g_img.Width;
             if (art) g_img = g_img.Resize(g_img_res, g_img.Height * r, 2);
             bg_img = art ? g_img.Clone(0, 0, g_img.Width, g_img.Height) : g_img.Resize(g_img.Width, g_img.Height, 2);
             if (bgBlur) bg_img.StackBlur(24);
         }
         window.Repaint();
     }
}

/**
 * Colours
 */
const ColourTypeCUI = {
    text: 0,
    selection_text: 1,
    inactive_selection_text: 2,
    background: 3,
    selection_background: 4,
    inactive_selection_background: 5,
    active_item_frame: 6
};

const ColourTypeDUI = {
    text: 0,
    background: 1,
    highlight: 2,
    selection: 3
};

let g_is_default_ui = window.InstanceType;
let g_textcolour = 0;
let g_textcolour_hl = 0;
let g_backcolour = 0;
let g_color_selected_bg = 0;
let g_color_highlight = 0;

function get_colours(col_mode, flag) {
    let arr;
    let nowPlayingColours = [];
    if (col_mode === 2) nowPlayingColours = GetNowPlayingColours();

    if (col_mode === 3) {
        arr = window.GetProperty("CUSTOM COLOR TEXT NORMAL", "180-180-180").split("-");
        g_textcolour = RGB(arr[0], arr[1], arr[2]);
        arr = window.GetProperty("CUSTOM COLOR TEXT HIGHLIGHT", "000-000-000").split("-");
        g_textcolour_hl = RGB(arr[0], arr[1], arr[2]);
        arr = window.GetProperty("CUSTOM COLOR BACKGROUND NORMAL", "025-025-035").split("-");
        g_backcolour = RGB(arr[0], arr[1], arr[2]);
        if (flag) {
            arr = window.GetProperty("CUSTOM COLOR BACKGROUND SELECTED", "015-177-255").split("-");
            g_color_selected_bg = setAlpha(RGB(arr[0], arr[1], arr[2]), 144);
            arr = window.GetProperty("CUSTOM COLOR HIGHLIGHT", "255-175-050").split("-");
            g_color_highlight = RGB(arr[0], arr[1], arr[2]);
        }
    }

    if (col_mode !== 3) {
        if (g_is_default_ui) {
            if (col_mode === 1) {
                g_textcolour = window.GetColourDUI(ColourTypeDUI.text);
                g_textcolour_hl = window.GetColourDUI(ColourTypeDUI.highlight);
                g_backcolour = window.GetColourDUI(ColourTypeDUI.background);
                g_color_selected_bg = setAlpha(window.GetColourDUI(ColourTypeDUI.selection), 184);
                //g_color_selected_bg = window.GetColourDUI(ColourTypeDUI.selection);
                g_color_highlight = setAlpha(window.GetColourDUI(ColourTypeDUI.highlight), 144);
            } else if (col_mode === 2) {
                g_textcolour = nowPlayingColours[1];
                g_textcolour_hl = nowPlayingColours[3];
                g_backcolour = nowPlayingColours[0];
                g_color_selected_bg = setAlpha(nowPlayingColours[2], 144);
                g_color_highlight = setAlpha(nowPlayingColours[2], 200);
                //g_color_highlight = nowPlayingColours[2];
            }
        } else { // CUI
            if (col_mode === 1) {
                g_textcolour = window.GetColourCUI(ColourTypeCUI.text);
                g_textcolour_hl = window.GetColourCUI(ColourTypeCUI.selection_text);
                g_backcolour = window.GetColourCUI(ColourTypeCUI.background);
                g_color_selected_bg = setAlpha(window.GetColourCUI(ColourTypeCUI.inactive_selection_background), 184);
                //g_color_selected_bg = window.GetColourCUI(ColourTypeCUI.inactive_selection_background);
                g_color_highlight = setAlpha(window.GetColourCUI(ColourTypeCUI.selection_background), 144);
            } else if (col_mode === 2) {
                g_textcolour = nowPlayingColours[1];
                g_textcolour_hl = nowPlayingColours[3];
                g_backcolour = nowPlayingColours[0];
                g_color_selected_bg = setAlpha(nowPlayingColours[2], 144);
                g_color_highlight = setAlpha(nowPlayingColours[2], 200);
                //g_color_highlight = nowPlayingColours[2];
            }
        }
    }
}

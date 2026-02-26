'use strict';

/**
 * Album art functions
 * NOTE: some variables here are probably already declared in other helpers.
 * Warning in case of redeclaration.
 */

// Album art
let g_img = null; // album art for fluent control panel
let bg_img = null; // background image
let g_img_res = 200;
let bg_img_res = 0;
function update_background_art(bgShow, bgMode, bgBlur, bgPath) {
    bg_img = null;
    if (!bgShow) return;
    const metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
    if (metadb) {
       bg_img = bgMode ? gdi.Image(bgPath) : utils.GetAlbumArtV2(metadb, 0, false);
       if (bg_img) {
           // attempt to reduce RAM usage by reducing res; experimental/marginal results
           bg_img_res = bgBlur ? 200 : (bg_img.Width > 1280 ? 1280 : bg_img.Width);
           const r = bg_img_res / bg_img.Width;
           bg_img = bg_img.Resize(bg_img_res, bg_img.Height * r, 2);
           if (bgBlur) bg_img.StackBlur(24);
       }
       window.Repaint();
    }
}

function update_album_art(art) {
    g_img = null;
    if (!art) return;
    const metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
    if (metadb) {
        g_img = utils.GetAlbumArtV2(metadb, 0, false);
        const r = g_img_res / g_img.Width;
        g_img = g_img.Resize(g_img_res, g_img.Height * r, 2); apply_corners_mask(g_img, 0.1);
    }
    window.Repaint();
}

function apply_corners_mask(img, radius) {
    // mask by Seongbin on HA
    let mask = gdi.CreateImage(img.Width, img.Height), g = mask.GetGraphics();
    g.SetSmoothingMode(2);
    g.FillSolidRect(0, 0, img.Width, img.Height, 0xFFFFFFFF);
    g.FillRoundRect(0, 0, img.Width, img.Height, img.Width * radius, img.Height * radius, 0xFF000000);
    mask.ReleaseGraphics(g);
    img.ApplyMask(mask);
}
'use strict';

/**
 * Album art functions
 */

// Album art
let thumb_img = null; // thumb for fluent control panel
let aa_img = null; // album art for PT tabs
let bg_img = null; // background image (for all scripts)

function update_art(ppt, flag) {
    bg_img = aa_img = thumb_img = null;
    const metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
    if (!metadb) { window.Repaint(); return; }

    const bgShow = ppt?.bgShow?.enabled ?? false;
    const bgMode = ppt?.bgMode?.enabled ?? false;
    const bgBlur = ppt?.bgBlur?.enabled ?? false;
    const artEnabled = ppt?.art?.enabled ?? false;
    const bgPath = ppt?.bgPath?.value ?? '';

    if (ppt && flag) {
        aa_img = process_image(utils.GetAlbumArtV2(metadb, 0, false), 1280);
    }

    if (bgShow) {
        if (bgMode) {
            let def_img_path;
            if (typeof ppt.bgPath.value === 'string' && /\.(bmp|gif|jpe?g|png|tiff?|ico)$/i.test(ppt.bgPath.value)) { def_img_path = ppt.bgPath.value; } else { def_img_path = fb.ComponentPath + 'samples\\jsplaylist-mod\\images\\default.jpg'; }
            bg_img = gdi.Image(def_img_path);
        } else {
            bg_img = (flag && aa_img) ? aa_img : utils.GetAlbumArtV2(metadb, 0, false);
        }
        if (bg_img) bg_img = process_image(bg_img, bgBlur ? 200 : 1280, bgBlur);
    }

    if (artEnabled) {
        if (bg_img && !bgBlur && !bgMode) {
            thumb_img = bg_img.Resize(200, bg_img.Height * 200 / bg_img.Width, 2);
        } else {
            thumb_img = utils.GetAlbumArtV2(metadb, 0, false);
            thumb_img = thumb_img.Resize(200, thumb_img.Height * 200 / thumb_img.Width, 2);
        }
        apply_corners_mask(thumb_img, 0.1);
    }

    window.Repaint();
}

function process_image(img, max_w, blur) {
    if (!img || img.Width === 0) return;
    let res = img.Width > max_w ? max_w : img.Width;
    let new_height = Math.round(img.Height * (res / img.Width));
    let resized = img.Resize(res, new_height, 2);
    if (blur) resized.StackBlur(24);
    return resized;
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
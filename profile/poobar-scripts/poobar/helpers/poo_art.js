'use strict';

/**
 * Album art functions
 */

let art = {
    a: null,
    bg: null,
    thumb: null
}

function update_art(ppt, flag) {
    art.a, art.bg, art.thumb = null;
    const metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
    if (!metadb) { window.Repaint(); return; }
    let temp = utils.GetAlbumArtV2(metadb, 0, false);

    const bgShow = ppt?.bgShow?.enabled ?? false;
    const bgMode = ppt?.bgMode?.enabled ?? false;
    const bgBlur = ppt?.bgBlur?.enabled ?? false;
    const artEnabled = ppt?.art?.enabled ?? false;
    const bgPath = ppt?.bgPath?.value ?? '';

    if (ppt && flag) { art.a = temp; }

    if (bgShow) {
        if (bgMode) {
            let def_img_path;
            if (typeof ppt.bgPath.value === 'string' && /\.(bmp|gif|jpe?g|png|tiff?|ico)$/i.test(ppt.bgPath.value)) {
                def_img_path = ppt.bgPath.value;
            } else {
                def_img_path = fb.ProfilePath + 'poobar-scripts\\images\\default.jpg';
            }
            art.bg = gdi.Image(def_img_path);
        } else {
            art.bg = temp;
        }
        if (art.bg) art.bg = process_image(art.bg, bgBlur ? 200 : 1280, bgBlur);
    }

    if (artEnabled) {
        art.thumb = process_image(temp, 200);
        apply_corners_mask(art.thumb);
    }

    temp = null;

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

// mask by Seongbin on HA
function apply_corners_mask(img, radius_factor = 0.14) {
    let mask = gdi.CreateImage(img.Width, img.Height)
    const g = mask.GetGraphics();
    g.SetSmoothingMode(2);

    g.FillSolidRect(0, 0, img.Width, img.Height, 0xFFFFFFFF);
    g.FillRoundRect(0, 0, img.Width, img.Height, img.Width * radius_factor, img.Height * radius_factor, 0xFF000000);
    mask.ReleaseGraphics(g);
    img.ApplyMask(mask);
    mask = null;
}

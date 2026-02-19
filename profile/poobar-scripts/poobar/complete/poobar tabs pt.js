'use strict';

/**
  * 'poobar tabs pt' is specifically meant for the poobar theme
  * use 'poobar tabs' for custom themes unless psuedo transparency is desired for specific panels.
*/
window.DefineScript('Pseudo Transparency Poobar Tabs', {author:'Choya', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_aa.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_col.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_tab_basic.js');

let ppt = {
    bgShow : new _p('_DISPLAY: Show Wallpaper', true),
    bgBlur : new _p('_DISPLAY: Wallpaper Blurred', false),
    bgMode : new _p('_DISPLAY: Wallpaper Mode', false),
    col_mode : new _p('_PROPERTY: Color Mode (1,2,3)', 1),
    borders : new _p('_PROPERTY: Show tab separators', true),
    overlay : new _p('_DISPLAY: Show tab shadow/overlay', true),
    orientation : new _p('_DISPLAY: Tab Orientation', false),
    fontMode : new _p ('_DISPLAY: Switch  Icon or Text Font', false),
    bgPath : new _p('_PROPERTY: Default Wallpaper Path', "path\\to\\custom\\image")
};

// arr of panels that require pseudo transparency
let ptArr = window.GetProperty("_PROPERTY: Pseudo Transparent Panels (delimiter: ',')", ",,").split(",");

let ww = 0;
let wh = 0;

initTabs();
updateTabSize(ppt);
update_album_art_pt();
get_colours(ppt.col_mode.value, true);

function on_size() {
    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;

    updateTabSize(ppt);

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

            if (p.Name === 'ESLyric' || ptArr.includes(p.Text)) {
                p.SupportPseudoTransparency = true;
            } else {
                continue;
            }
        }
    }
}

function on_paint(gr) {
    if (g_img) {
        if (ppt.bgShow.enabled && !ppt.bgMode.enabled && !ppt.bgBlur.enabled) {
            _drawImage(gr, g_img, 0, 0, ww, wh, image.crop);
        } else if (!ppt.orientation.enabled && (!ppt.bgShow.enabled || ppt.bgBlur.enabled || (ppt.bgShow.enabled && !ppt.bgMode.enabled) || ppt.bgMode.enabled)) {
            _drawImage(gr, g_img, 0, 0 + TAB_H, ww, wh - TAB_H, image.crop);
        } else if (ppt.orientation.enabled && (!ppt.bgShow.enabled || ppt.bgBlur.enabled || (ppt.bgShow.enabled && !ppt.bgMode.enabled) || ppt.bgMode.enabled)) {
            _drawImage(gr, g_img, 0 + TAB_W, 0, ww - TAB_W, wh, image.crop);
        }
    }

    const p = window.GetPanelByIndex(tabs[activeTab].index);
    if (p.Name === 'ESLyric') gr.FillSolidRect(0, 0, ww, wh, g_backcolour);

    const switchBgW = (ppt.orientation.enabled) ? TAB_W : ww; TAB_H;
    const switchBgH = (ppt.orientation.enabled) ? wh : TAB_H;
    //const overlayColor = setAlpha(g_textcolour_hl, 128);
    const overlayColor = window.IsDark ? _RGBA(0, 0, 0, 128) : _RGBA(255, 255, 255, 128);
    if (p.Text === '' || p.Name === 'JS Smooth Playlist Manager') { gr.FillSolidRect(0, 0, ww, wh, overlayColor); } else if (p.Name !== 'ESLyric' && ppt.overlay.enabled && (ppt.bgShow.enabled || ppt.bgBlur.enabled)) { gr.FillSolidRect(0, 0, switchBgW, switchBgH, overlayColor); }

    if (bg_img && (ppt.bgBlur.enabled || ppt.bgMode.enabled)) {
        _drawImage(gr, bg_img, 0, 0, switchBgW, switchBgH, image.crop);
    } else if (!ppt.bgShow.enabled) {
        gr.FillSolidRect(0, 0, switchBgW, switchBgH, g_backcolour);
    }

    tab.paint_pt(gr, ppt);
}

function update_album_art_pt(artBlur) {
    bg_img = null; g_img = null;
    //if (!bgShow && !art) return;
    const metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
    if (metadb) {
        g_img = utils.GetAlbumArtV2(metadb, 0);
        g_img_res = artBlur ? 200 : (g_img.Width > 1280 ? 1280 : g_img.Width);
        const r = g_img_res / g_img.Width;
        g_img = g_img.Resize(g_img_res, g_img.Height * r, 2);
        if (ppt.bgShow.enabled) bg_img = ppt.bgMode.enabled ? gdi.Image(ppt.bgPath.value) : g_img.Clone(0, 0, g_img.Width, g_img.Height);
        if (artBlur) g_img.StackBlur(24);

        if (bg_img) {
          // attempt to reduce RAM usage by reducing res; experimental/marginal results
          bg_img_res = ppt.bgBlur.enabled ? 200 : (bg_img.Width > 1280 ? 1280 : bg_img.Width);
          const r = bg_img_res / bg_img.Width;
          bg_img = bg_img.Resize(bg_img_res, bg_img.Height * r, 2);
          if (ppt.bgBlur.enabled) bg_img.StackBlur(24);
        }

        window.Repaint();
    }
}

function on_mouse_lbtn_up(x, y) {
    updateTabSize(ppt);
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

            for (let i = 0; i < tabs.length; i++) {
                const p = window.GetPanelByIndex(tabs[i].index);
                if (p) {
                    p.Show(i === activeTab);
//                    if (i === activeTab) {
//                        if (p.Name === 'ESLyric') {
//                            update_album_art_pt(true);
//                        } else {
//                            update_album_art_pt();
//                        }
//                    }
                }
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
        updateTabSize(ppt);
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
    let _menu2 = window.CreatePopupMenu(); // Show... menu
    let _menu3 = window.CreatePopupMenu(); // Background Wallpaper menu
    let _menu4 = window.CreatePopupMenu(); // Colours menu
    let _submenu4 = window.CreatePopupMenu(); // Button Highlight menu
    let _submenu41 = window.CreatePopupMenu(); // Tab Color menu
    let _menu5 = window.CreatePopupMenu(); // Font Menu

    _menu1.AppendMenuItem(MF_STRING, 90, 'Horizontal');
    _menu1.AppendMenuItem(MF_STRING, 91, 'Vertical');
    _menu1.CheckMenuRadioItem(90, 91, ppt.orientation.enabled ? 91 : 90);
    _menu1.AppendTo(m, MF_STRING, 'Orientation');

    _menu2.AppendMenuItem(MF_STRING, 110, 'Borders');
    _menu2.CheckMenuItem(110, ppt.borders.enabled);
    _menu2.AppendTo(m, MF_STRING, 'Show...');

    m.AppendMenuSeparator();

    _menu3.AppendMenuItem(MF_STRING, 210, 'Enable');
    _menu3.CheckMenuItem(210, ppt.bgShow.enabled);
    _menu3.AppendMenuItem(MF_STRING, 211, 'Blur');
    _menu3.CheckMenuItem(211, ppt.bgBlur.enabled);
    _menu3.AppendMenuItem(MF_STRING, 212, 'Shadow');
    _menu3.CheckMenuItem(212, ppt.overlay.enabled);
    _menu3.AppendMenuSeparator();
    _menu3.AppendMenuItem(MF_STRING, 213, 'Playing Album Cover');
    _menu3.AppendMenuItem(MF_STRING, 214, 'Default');
    _menu3.CheckMenuRadioItem(213, 214, ppt.bgMode.enabled ? 214 : 213);
    _menu3.AppendTo(m, MF_STRING, 'Background Wallpaper');

    _menu4.AppendMenuItem(MF_STRING, 310, 'System');
    _menu4.AppendMenuItem(MF_STRING, 311, 'Dynamic');
    _menu4.AppendMenuItem(MF_STRING, 312, 'Custom');
    _menu4.CheckMenuRadioItem(310, 312, Math.min(Math.max(310 + ppt.col_mode.value - 1, 310), 312));
    _menu4.AppendTo(m, MF_STRING, 'Colours');

    _menu5.AppendMenuItem(MF_STRING, 410, 'Segoe Fluent Icons');
    _menu5.AppendMenuItem(MF_STRING, 411, 'System');
    _menu5.CheckMenuRadioItem(410, 411, ppt.fontMode.enabled ? 411 : 410);
    _menu5.AppendTo(m, MF_STRING, 'Font');

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
        update_album_art_pt();
        on_size();
        window.Repaint();
        break;
    case 110:
        ppt.borders.toggle();
        window.Repaint();
        break;
    case 210:
        ppt.bgShow.toggle();
        //ppt.col_mode.value = 1;
        get_colours(ppt.col_mode.value, true);
        update_album_art_pt();
        refresh_pt_panel();
        window.Repaint();
        break;
    case 211:
        ppt.bgBlur.toggle();
        update_album_art_pt();
        refresh_pt_panel();
        window.Repaint();
        break;
    case 212:
        ppt.overlay.toggle();
        window.Repaint();
        break;
    case 213:
    case 214:
        ppt.bgMode.toggle();
        if (ppt.bgMode.enabled && ppt.bgPath.value === "path\\to\\custom\\image") window.ShowProperties();
        update_album_art_pt();
        refresh_pt_panel();
        window.Repaint();
        break;
    case 310:
        ppt.col_mode.value = 1;
        //ppt.bgShow.enabled = false;
        get_colours(ppt.col_mode.value, true);
        refresh_pt_panel();
        window.Repaint();
        break;
    case 311:
        ppt.col_mode.value = 2;
        //ppt.bgShow.enabled = false;
        get_colours(ppt.col_mode.value, true);
        refresh_pt_panel();
        window.Repaint();
        break;
    case 312:
        ppt.col_mode.value = 3;
        //ppt.bgShow.enabled = false;
        get_colours(ppt.col_mode.value, true);
        refresh_pt_panel();
        window.ShowProperties();
        window.Repaint();
        break;
    case 410:
    case 411:
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
    update_album_art_pt();

    refresh_pt_panel();
}

function refresh_pt_panel() {
    const p = window.GetPanelByIndex(tabs[activeTab].index);
    if (ptArr.includes(p.Text)) {
        p.Hidden = true;
        p.Hidden = false;
    }
    //if (p.Name === 'ESLyric') { update_album_art_pt(true); } else { update_album_art_pt(); }
}

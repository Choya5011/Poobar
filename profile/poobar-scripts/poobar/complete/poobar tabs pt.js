'use strict';

/**
  * poo_pt_tabs.js is specifically meant for the poobar theme
  * use poo_tabs.js for custom themes unless psuedo transparency is desired for specific panels.
  * this script handles 2 images depending on background settings.
  * 1 image is used as the album art thumb, this requires a blank JSplitter panel with only: 'window.Repaint();' as well as all pseudo transparency settings enabled. This blank JSplitter will be the artwork view.
  * this makes it so the tab script handles the album art instead of a separate album art script or Artwork view panel
  * which also allows the artwork to seamlessly span across the whole panel and tabs when not blurred, poo_tabs.js can not.
  * it also does custom background for ESLyric panels (requires pseudo transparency settings on ESLyric to be enabled)
  * thus it is not recommended to use this script for custom themes as it could cause some very minor background processes that can not be seen in normal tab scenarios.
*/

window.DefineScript('Pseudo Transparency Poobar Tabs', {author:'Choya', options:{grab_focus:false}});
window.DrawMode = +window.GetProperty('- Draw mode: GDI (false), D2D (true)', false);
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_aa.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_col.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\global_vars.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_tab_basic.js');
include(fb.ProfilePath + 'poobar-scripts\\Menu-Framework-SMP\\helpers\\menu_xxx.js');

let ppt = {
    bgShow : new _p('_DISPLAY: Show Wallpaper', true),
    bgBlur : new _p('_DISPLAY: Wallpaper Blurred', false),
    bgMode : new _p('_DISPLAY: Wallpaper Mode', false),
    col_mode : new _p('_PROPERTY: Color Mode (1,2,3)', 1),
    borders : new _p('_PROPERTY: Show tab separators', true),
    hover : new _p('_PROPERTY: Color hover', true),
    selected : new _p('_PROPERTY: Color selected', true),
    overlay : new _p('_DISPLAY: Show tab shadow/overlay', true),
    orientation : new _p('_DISPLAY: Tab Orientation', false),
    fontMode : new _p ('_DISPLAY: Switch  Icon or Text Font', false),
    bgPath : new _p('_PROPERTY: Default Wallpaper Path', "path\\to\\custom\\image"),
};

// arr of panels that require pseudo transparency
let ptArr = window.GetProperty("_PROPERTY: Pseudo Transparent Panels (delimiter: ',')", ",,").split(",");

let ww, wh = 0;

initTabs();
updateTabSize(ppt);
update_art(ppt, true);
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
    if (aa_img) {
        if (ppt.bgShow.enabled && !ppt.bgMode.enabled && !ppt.bgBlur.enabled) {
            _drawImage(gr, aa_img, 0, 0, ww, wh, image.crop);
        } else if (!ppt.orientation.enabled && (!ppt.bgShow.enabled || ppt.bgBlur.enabled || (ppt.bgShow.enabled && !ppt.bgMode.enabled) || ppt.bgMode.enabled)) {
            _drawImage(gr, aa_img, 0, 0 + TAB_H, ww, wh - TAB_H, image.crop);
        } else if (ppt.orientation.enabled && (!ppt.bgShow.enabled || ppt.bgBlur.enabled || (ppt.bgShow.enabled && !ppt.bgMode.enabled) || ppt.bgMode.enabled)) {
            _drawImage(gr, aa_img, 0 + TAB_W, 0, ww - TAB_W, wh, image.crop);
        }
    } else {
        gr.FillSolidRect(0, 0, ww, wh, g_backcolour); let name; let font = window.InstanceType ? window.GetFontDUI(0) : window.GetFontCUI(0); if (font) {	name = font.Name; } else {	name = 'Segoe UI'; } gr.GdiDrawText('NO SELECTION', _gdiFont(name, _scale(20), 1), g_textcolour, (ww - _scale(400)) / 2, wh / 2, _scale(400), _scale(100), SF_CENTER_VCENTER | DT_END_ELLIPSIS);
    }

    const p = window.GetPanelByIndex(tabs[activeTab].index);
    if (p.Name === 'ESLyric') gr.FillSolidRect(0, 0, ww, wh, g_backcolour);

    const switchBgW = (ppt.orientation.enabled) ? TAB_W : ww; TAB_H;
    const switchBgH = (ppt.orientation.enabled) ? wh : TAB_H;
    const overlayColor = setAlpha(g_backcolour, 128); //const overlayColor = window.IsDark ? _RGBA(0, 0, 0, 128) : _RGBA(255, 255, 255, 128);
    if (p.Text === '' || p.Name === 'JS Smooth Playlist Manager') { gr.FillSolidRect(0, 0, ww, wh, overlayColor); } else if (p.Name !== 'ESLyric' && ppt.overlay.enabled && (ppt.bgShow.enabled || ppt.bgBlur.enabled)) { gr.FillSolidRect(0, 0, switchBgW, switchBgH, overlayColor); }

    if (bg_img && (ppt.bgBlur.enabled || ppt.bgMode.enabled)) {
        _drawImage(gr, bg_img, 0, 0, switchBgW, switchBgH, image.crop);
        if (ppt.overlay.enabled) gr.FillSolidRect(0, 0, switchBgW, switchBgH, overlayColor);
    } else if (!ppt.bgShow.enabled) {
        gr.FillSolidRect(0, 0, switchBgW, switchBgH, g_backcolour);
    }

    tab.paint_pt(gr, ppt);
}

function on_colours_changed() {
    get_colours(ppt.col_mode.value, true);
    window.Repaint();
}

function on_playback_new_track() {
    get_colours(ppt.col_mode.value, true);
    update_art(ppt, true);
    refresh_pt_panel();
}

function refresh_pt_panel() {
    const p = window.GetPanelByIndex(tabs[activeTab].index);
    if (ptArr.includes(p.Text)) {
        p.Hidden = true;
        p.Hidden = false;
    }
    //if (p.Name === 'ESLyric') { update_album_art_pt(true); } else { update_art(ppt, true); }
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
    let menu = new _menu();

    menu.newEntry({entryText: 'Configure tabs:', flags: MF_GRAYED});

    menu.newEntry({entryText: 'sep'});

    const or_menu = menu.newMenu('Orientation');
    menu.newCheckMenu(or_menu, 'Horizontal', 'Vertical', () => !ppt.orientation.enabled ? 0 : 1);
    menu.newEntry({menuName: or_menu, entryText: 'Horizontal', func: () => {ppt.orientation.enabled = false; update_art(ppt, true); on_size(); window.Repaint();}});
    menu.newEntry({menuName: or_menu, entryText: 'Vertical', func: () => {ppt.orientation.enabled = true; update_art(ppt, true); on_size(); window.Repaint();}});

    const show_menu = menu.newMenu('Show...');
    menu.newEntry({menuName: show_menu, entryText: 'Separators', func: () => {ppt.borders.toggle(); window.Repaint();}, flags: () => ppt.borders.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: show_menu, entryText: 'Selected highlight', func: () => {ppt.selected.toggle(); window.Repaint();}, flags: () => ppt.selected.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: show_menu, entryText: 'Hover highlight', func: () => {ppt.hover.toggle(); window.Repaint();}, flags: () => ppt.hover.enabled ? MF_CHECKED : MF_STRING});


    menu.newEntry({entryText: 'sep'});

//    let tp_menu = menu.newMenu('Transparency');
//    menu.newEntry({menuName: tp_menu, entryText: 'Panel transparency', flags: MF_GRAYED});
//    menu.newEntry({menuName: tp_menu, entryText: 'sep'});
//    menu.newEntry({menuName: tp_menu, entryText: 'Enable', func: () => {ppt.transparency.toggle(); window.Repaint(); if (ppt.transparency.enabled) {let tp_readme; try { tp_readme = utils.ReadTextFile(fb.ProfilePath + 'poobar-scripts\\poobar\\readmes\\tp_readme.txt', 65001); } catch (e) { tp_readme = 'Transparency readme not found.\nAvoid without instructions, will cause glitches otherwise.' }; fb.ShowPopupMessage(tp_readme, 'Unified background & pseudotransparency'); tp_readme = null;} }, flags: () => ppt.transparency.enabled ? MF_CHECKED : MF_STRING});
//
//    const tp_flag = ppt.transparency.enabled ? MF_GRAYED : MF_STRING
//    let bg_menu = menu.newMenu('Background', 'main', tp_flag);

    const bg_menu = menu.newMenu('Background');
    menu.newEntry({menuName: bg_menu, entryText: 'Background Wallpaper:', flags: MF_GRAYED});
    menu.newEntry({menuName: bg_menu, entryText: 'sep'});
    menu.newEntry({menuName: bg_menu, entryText: 'Enable', func: () => {ppt.bgShow.toggle(); get_colours(ppt.col_mode.value, true); update_art(ppt, true); refresh_pt_panel(); window.Repaint();}, flags: () => ppt.bgShow.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: bg_menu, entryText: 'Blur', func: () => {ppt.bgBlur.toggle(); update_art(ppt, true); refresh_pt_panel(); window.Repaint();}, flags: () => ppt.bgBlur.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: bg_menu, entryText: 'Shadow', func: () => {ppt.overlay.toggle(); window.Repaint();}, flags: () => ppt.overlay.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: bg_menu, entryText: 'sep'});
    menu.newCheckMenu(bg_menu, 'Playing album cover', 'Default', () => !ppt.bgMode.enabled ? 0 : 1);
    menu.newEntry({menuName: bg_menu, entryText: 'Playing album cover', func: () => {ppt.bgMode.enabled = false; update_art(ppt, true); window.Repaint();}});
    menu.newEntry({menuName: bg_menu, entryText: 'Default', func: () => {ppt.bgMode.enabled = true; if (ppt.bgMode.enabled && !/\.(bmp|gif|jpe?g|png|tiff?|ico)$/i.test(ppt.bgPath.value)) window.ShowProperties(); update_art(ppt, true); refresh_pt_panel(); window.Repaint();}});

    const col_menu = menu.newMenu('Colours');
    menu.newEntry({menuName: col_menu, entryText: 'System', func: () => {ppt.col_mode.value = 1; get_colours(ppt.col_mode.value, true); refresh_pt_panel(); window.Repaint();}, flags: () => ppt.col_mode.value === 1 ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: col_menu, entryText: 'Dynamic', func: () => {ppt.col_mode.value = 2; get_colours(ppt.col_mode.value, true); refresh_pt_panel(); window.Repaint();}, flags: () => ppt.col_mode.value === 2 ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: col_menu, entryText: 'Custom', func: () => {ppt.col_mode.value = 3; get_colours(ppt.col_mode.value, true); refresh_pt_panel(); window.ShowProperties(); window.Repaint();}, flags: () => ppt.col_mode.value === 3 ? MF_CHECKED : MF_STRING});

    const font_menu = menu.newMenu('Font');
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

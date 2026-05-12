'use strict';

window.DefineScript('Poobar Tabs', {author:'Choya', options:{grab_focus:false}});
window.DrawMode = +window.GetProperty('- Draw Mode: GDI (false), D2D (true)', false);
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_art.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_col.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_global.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_tab.js');
include(fb.ProfilePath + 'poobar-scripts\\Menu-Framework-SMP\\helpers\\menu_xxx.js');

// * required properties for _paint
let ppt = {
    art_p: new _p ('- PANELS: Album Art Panel', ''),
    plm_p: new _p ('- PANELS: Playlist Manager Panel', ''),

    bgShow: new _p('_DISPLAY: Show Wallpaper', true),
    bgBlur: new _p('_DISPLAY: Wallpaper Blurred', false),
    bgMode: new _p('_DISPLAY: Wallpaper Mode', false),
    overlay: new _p('_DISPLAY: Show Tab Shadow', true),
    borders: new _p('_DISPLAY: Show Tab Separators', true), // *
    hover: new _p('_DISPLAY: Show Hover Highlight', true), // *
    selected: new _p('_DISPLAY: Show Selected Highlight', true), // *
    round: new _p('_DISPLAY: Round Highlight Corners', false), // *
    orientation: new _p('_DISPLAY: Tab Orientation', false), // *
    fontMode: new _p ('_DISPLAY: Switch  Icon or Text Font', false), // *

    tp_oly: new _p('_OVERLAP: Show Panel Background Overlay in TP Mode', false),
    tp_aa: new _p ('_OVERLAP: Show Panel Background Album Art in TP Mode', false),

    col_mode: new _p('_PROPERTY: Color Mode: Sys(1), Dyn(2), Cus(3)', 1),
    tab_mode: new _p ('_PROPERTY: Background mode: nor(1), ovl(2), tp(3)', 1),
    bgPath: new _p('_PROPERTY: Default Wallpaper Path', "path\\to\\custom\\image")
};

// arr of panels that require pseudo transparency
let ptArr = window.GetProperty("- PANELS: Overlap/Transparent Panels (delimiter: ,)", ",,").split(","); // initiate default values as ,,

let ww, wh = 0;

const caption = {
    lyric: 'ESLyric',
    plm: ppt.plm_p.value,
    spec: 'Spectrum Analyzer'
}

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

            if (p.Name === caption.lyric || ptArr.includes(p.Text)) {
                p.SupportPseudoTransparency = true;
            } else {
                continue;
            }
        }
    }
}

function on_paint(gr) {
    const overlayColor = setAlpha(g_backcolour, 128);
    const bg_w = (ppt.orientation.enabled) ? TAB_W : ww;
    const bg_h = (ppt.orientation.enabled) ? wh : TAB_H;

    // paint background
    if (ppt.tab_mode.value === 1) {
        if (ppt.bgShow.enabled && art.bg) {
            _drawImage(gr, art.bg, 0, 0, bg_w, bg_h, image.crop);
            const overlayColor = window.IsDark ? _RGBA(0, 0, 0, 128) : _RGBA(255, 255, 255, 128);
            if (ppt.overlay.enabled) gr.FillSolidRect(0, 0, bg_w, bg_h, overlayColor);
        }

        if (_active(caption.lyric, activeTab)) {
            gr.FillSolidRect(0, 0, ww, wh, g_backcolour);
        }
    } else if (ppt.tab_mode.value === 2) {
        if (art.a) {
            if (!ppt.tp_aa.enabled || !_active(caption.spec, activeTab)) {
                if (ppt.bgShow.enabled && !ppt.bgMode.enabled && !ppt.bgBlur.enabled) {
                    _drawImage(gr, art.a, 0, 0, ww, wh, image.crop);
                } else if (!ppt.orientation.enabled && (!ppt.bgShow.enabled || ppt.bgBlur.enabled || (ppt.bgShow.enabled && !ppt.bgMode.enabled) || ppt.bgMode.enabled) && !_active(caption.lyric, activeTab)) {
                    _drawImage(gr, art.a, 0, 0 + TAB_H, ww, wh - TAB_H, image.crop);
                } else if (ppt.orientation.enabled && (!ppt.bgShow.enabled || ppt.bgBlur.enabled || (ppt.bgShow.enabled && !ppt.bgMode.enabled) || ppt.bgMode.enabled) && !_active(caption.lyric, activeTab)) {
                    _drawImage(gr, art.a, 0 + TAB_W, 0, ww - TAB_W, wh, image.crop);
                }
            }
        } else {
            const ns_txt_x = (ww - _scale(400)) / 2; const ns_txt_y = wh / 2; const ns_txt_w = _scale(400); const ns_txt_h = _scale(100);
            gr.FillSolidRect(ns_txt_x, ns_txt_y - _scale(30), ns_txt_w, ns_txt_h, g_backcolour); let name; let font = window.InstanceType ? window.GetFontDUI(0) : window.GetFontCUI(0); if (font) { name = font.Name; } else {	name = 'Segoe UI'; } gr.GdiDrawText('NO SELECTION', _gdiFont(name, _scale(20), 1), g_textcolour, ns_txt_x, ns_txt_y, ns_txt_w, ns_txt_h, SF_CENTER_VCENTER | DT_END_ELLIPSIS);
        }

        if (_active(caption.lyric, activeTab)) {
            gr.FillSolidRect(0, 0, ww, wh, g_backcolour);
        }

        if (_active(caption.plm, activeTab)) {
           gr.FillSolidRect(0, 0, ww, wh, overlayColor);
        } else if (!_active(caption.lyric, activeTab) && ppt.overlay.enabled && (ppt.bgShow.enabled || ppt.bgBlur.enabled)) {
           gr.FillSolidRect(0, 0, bg_w, bg_h, overlayColor);
        }

        if (art.bg && (ppt.bgBlur.enabled || ppt.bgMode.enabled)) {
            _drawImage(gr, art.bg, 0, 0, bg_w, bg_h, image.crop);
            if (ppt.overlay.enabled) gr.FillSolidRect(0, 0, bg_w, bg_h, overlayColor);
        } else if (!ppt.bgShow.enabled) {
            gr.FillSolidRect(0, 0, bg_w, bg_h, g_backcolour);
        }
    } else if (ppt.tab_mode.value === 3) {
        if (ppt.tp_aa.enabled && _active(ppt.art_p.value, activeTab)) {
            if (!ppt.orientation.enabled) {
                _drawImage(gr, art.a, 0, 0 + TAB_H, ww, wh - TAB_H, image.crop);
            } else {
                _drawImage(gr, art.a, 0 + TAB_W, 0, ww - TAB_W, wh, image.crop);
            }
        }

        if (ppt.tp_oly.enabled && !_active(ppt.art_p.value, activeTab)) {
            if (!ppt.orientation.enabled) {
                gr.FillSolidRect(0, 0 + TAB_H, ww, wh - TAB_H, overlayColor);
            } else {
                gr.FillSolidRect(0 + TAB_W, 0, ww - TAB_W, wh, overlayColor);
            }
        }
    }

    _paint(gr, ppt); // paint tabs
}

function _active(str, activeTab) {
    const p = window.GetPanelByIndex(tabs[activeTab].index); if (!p) return false;
    const match = (p.Text === str || p.Name === str);
    return match;
}

function _background(gr, mode = 1) {

}

function refresh_pt_panel() {
    const p = window.GetPanelByIndex(tabs[activeTab].index);
    if (ptArr.includes(p.Text)) {
        if (p.Name == caption.spec) {
            p.ShowCaption = true; p.ShowCaption = false;
        } else {
            p.Hidden = true; p.Hidden = false;
        }
    }
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

    menu.newSeparator();

    {
        const menuName = menu.newMenu('Orientation');
        menu.newCheckMenu(menuName, 'Horizontal', 'Vertical', () => !ppt.orientation.enabled ? 0 : 1);
        menu.newEntry({menuName, entryText: 'Horizontal', func: () => {ppt.orientation.enabled = false; update_art(ppt, true); on_size(); window.Repaint();}});
        menu.newEntry({menuName, entryText: 'Vertical', func: () => {ppt.orientation.enabled = true; update_art(ppt, true); on_size(); window.Repaint();}});
    }

    {
        const menuName = menu.newMenu('Show...');
        menu.newEntry({menuName, entryText: 'Separators', func: () => {ppt.borders.toggle(); window.Repaint();}, flags: () => ppt.borders.enabled ? MF_CHECKED : MF_STRING});
        menu.newEntry({menuName, entryText: 'Selected', func: () => {ppt.selected.toggle(); window.Repaint();}, flags: () => ppt.selected.enabled ? MF_CHECKED : MF_STRING});
        menu.newEntry({menuName, entryText: 'Hover', func: () => {ppt.hover.toggle(); window.Repaint();}, flags: () => ppt.hover.enabled ? MF_CHECKED : MF_STRING});
        menu.newEntry({menuName, entryText: 'Round highlights', func: () => {ppt.round.toggle(); window.Repaint();}, flags: () => ppt.round.enabled ? MF_CHECKED : MF_STRING});
    }

    menu.newSeparator();

    {
        const menuName = menu.newMenu('Background mode');
        menu.newEntry({menuName, entryText: 'Normal', func: () => {ppt.tab_mode.value = 1; update_art(ppt, true); on_size(); window.Repaint(); refresh_pt_panel();}, flags: () => ppt.tab_mode.value === 1 ? MF_CHECKED : MF_STRING});
        menu.newEntry({menuName, entryText: 'Overlap', func: () => {ppt.tab_mode.value = 2; update_art(ppt, true); on_size(); window.Repaint(); refresh_pt_panel();}, flags: () => ppt.tab_mode.value === 2 ? MF_CHECKED : MF_STRING});
        menu.newEntry({menuName, entryText: 'Transparent', func: () => {ppt.tab_mode.value = 3; on_size(); window.Repaint(); refresh_pt_panel();}, flags: () => ppt.tab_mode.value === 3 ? MF_CHECKED : MF_STRING});
    }

    {
        const menuName = menu.newMenu('Transparency', 'main', ppt.tab_mode.value === 3 ? MF_STRING : MF_GRAYED);
        menu.newEntry({menuName, entryText: 'Borrow Overlap Features:', flags: MF_GRAYED});
        menu.newSeparator(menuName);
        menu.newEntry({menuName, entryText: 'Album Art', func: () => { ppt.tp_aa.toggle(); window.Repaint(); refresh_pt_panel(); }, flags: () => ppt.tp_aa.enabled ? MF_CHECKED : MF_STRING});
        menu.newEntry({menuName, entryText: 'Panel Shadow', func: () => { ppt.tp_oly.toggle(); window.Repaint(); refresh_pt_panel(); }, flags: () => ppt.tp_oly.enabled ? MF_CHECKED : MF_STRING});
        menu.newSeparator(menuName);
        menu.newEntry({
            menuName,
            entryText: 'Readme...',
            func: () => {
                let readme;
                try {
                   readme = utils.ReadTextFile(fb.ProfilePath + 'poobar-scripts\\poobar\\readmes\\tp_readme.txt', 65001);
                } catch (e) {
                    readme = 'Transparency readme not found.\n\nAvoid without instructions, might cause glitches otherwise.'
                };
                fb.ShowPopupMessage(readme, 'Unified background & pseudotransparency');
                readme = null;
            }
        });
    }

    {
        const menuName = menu.newMenu('Background', 'main', ppt.tab_mode.value === 3 ? MF_GRAYED : MF_STRING);
        menu.newEntry({menuName, entryText: 'Background Wallpaper:', flags: MF_GRAYED});
        menu.newSeparator(menuName);
        menu.newEntry({menuName, entryText: 'Enable', func: () => {ppt.bgShow.toggle(); get_colours(ppt.col_mode.value, true); update_art(ppt, true); refresh_pt_panel(); window.Repaint();}, flags: () => ppt.bgShow.enabled ? MF_CHECKED : MF_STRING});
        menu.newEntry({menuName, entryText: 'Blur', func: () => {ppt.bgBlur.toggle(); update_art(ppt, true); refresh_pt_panel(); window.Repaint();}, flags: () => ppt.bgBlur.enabled ? MF_CHECKED : MF_STRING});
        menu.newEntry({menuName, entryText: 'Shadow', func: () => {ppt.overlay.toggle(); window.Repaint();}, flags: () => ppt.overlay.enabled ? MF_CHECKED : MF_STRING});
        menu.newSeparator(menuName);
        menu.newCheckMenu(menuName, 'Playing album cover', 'Default', () => !ppt.bgMode.enabled ? 0 : 1);
        menu.newEntry({menuName, entryText: 'Playing album cover', func: () => {ppt.bgMode.enabled = false; update_art(ppt, true); window.Repaint();}});
        menu.newEntry({menuName, entryText: 'Default', func: () => {ppt.bgMode.enabled = true; if (ppt.bgMode.enabled && !/\.(bmp|gif|jpe?g|png|tiff?|ico)$/i.test(ppt.bgPath.value)) window.ShowProperties(); update_art(ppt, true); refresh_pt_panel(); window.Repaint();}});
    }

    {
        const menuName = menu.newMenu('Colours');
        menu.newEntry({menuName, entryText: 'System', func: () => {ppt.col_mode.value = 1; get_colours(ppt.col_mode.value, true); refresh_pt_panel(); window.Repaint();}, flags: () => ppt.col_mode.value === 1 ? MF_CHECKED : MF_STRING});
        menu.newEntry({menuName, entryText: 'Dynamic', func: () => {ppt.col_mode.value = 2; get_colours(ppt.col_mode.value, true); refresh_pt_panel(); window.Repaint();}, flags: () => ppt.col_mode.value === 2 ? MF_CHECKED : MF_STRING});
        menu.newEntry({menuName, entryText: 'Custom', func: () => {ppt.col_mode.value = 3; get_colours(ppt.col_mode.value, true); refresh_pt_panel(); window.ShowProperties(); window.Repaint();}, flags: () => ppt.col_mode.value === 3 ? MF_CHECKED : MF_STRING});
    }

    {
        const menuName = menu.newMenu('Font');
        menu.newCheckMenu(menuName, 'Segoe Fluent Icons', 'System', () => !ppt.fontMode.enabled ? 0 : 1);
        menu.newEntry({menuName, entryText: 'Segoe Fluent Icons', func: () => {ppt.fontMode.enabled = false; window.Repaint();}});
        menu.newEntry({menuName, entryText: 'System', func: () => {ppt.fontMode.enabled = true; window.Repaint();}});
        //menu.newEntry({menuName, entryText: 'Custom', func: () => {}});
    }

    menu.newSeparator();

    menu.newEntry({
        entryText: 'Open readme...',
        func: () => {
            let readme;
            try {
                readme = utils.ReadTextFile(fb.ProfilePath + 'poobar-scripts\\poobar\\readmes\\tab_readme.txt', 65001);
            } catch (e) {
                readme = 'readme file not found'
            };
            fb.ShowPopupMessage(readme, window.ScriptInfo.Name);
            readme = null;
        }
    });

    menu.newSeparator();

    menu.newEntry({entryText: 'Panel Properties', func: () => {window.ShowProperties();}});
    menu.newEntry({entryText: 'Configure...', func: () => {window.ShowConfigureV2();}});

    return menu.btn_up(x, y);
}

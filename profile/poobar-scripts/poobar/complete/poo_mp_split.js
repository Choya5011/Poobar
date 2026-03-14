'use strict';

window.DefineScript('Poobar Main Panel', {author:'Choya', options:{grab_focus:false}});
window.DrawMode = +window.GetProperty('- Draw mode: GDI (false), D2D (true)', false);
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_aa.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_col.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_global.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_tab_basic.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_layout.js');
include(fb.ProfilePath + 'poobar-scripts\\Menu-Framework-SMP\\helpers\\menu_xxx.js');

let ppt = {
	hPanelScale : new _p ('- PANEL_PLACEMENT: Horizontal Monitor Panel Division (0-1)', 0.5),
	vPanelScale : new _p ('- PANEL_PLACEMENT: Vertical Monitor Panel Division (0-1)', 0.4),
	cpH : new _p ('- PANEL_PLACEMENT: Control Panel Height (Horizontal mode)', 105),
	cpV : new _p ('- PANEL_PLACEMENT: Control Panel Height (Vertical mode)', 108),
	unify : new _p('- PANEL_BEHAVIOR: Unify background across panels', false),

    bgShow : new _p('_TAB_DISPLAY: Show Wallpaper', false),
    bgBlur : new _p('_TAB_DISPLAY: Wallpaper Blurred', false),
    bgMode : new _p('_TAB_DISPLAY: Wallpaper Mode', false),
    col_mode : new _p('_TAB_PROPERTY: Color Mode (1,2,3)', 1),
    borders : new _p('_TAB_PROPERTY: Show tab separators', true),
    overlay : new _p('_TAB_DISPLAY: Show tab shadow/overlay', false),
    orientation : new _p('_TAB_DISPLAY: Tab Orientation', false),
    fontMode : new _p ('_TAB_DISPLAY: Switch  Icon or Text Font', false),
    bgPath : new _p('_TAB_PROPERTY: Default Wallpaper Path', "path\\to\\custom\\image"),
};

let ww, wh = 0;
let cpH = _scale(ppt.cpH.value); // Control Panel Height in Horizontal orientation
let cpV = _scale(ppt.cpV.value); // Control Panel Height in vertical orientation
let paintRect = false;

update_art(ppt);
get_colours(ppt.col_mode.value, true);

// _layout usage instruction found at: fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_layout.js'
const panelNames = ['Fluent Control Panel', '', '', 'Smooth Browser'];
let layout = new _layout(panelNames, 150, ppt.unify.enabled);

layout.horizontal({
    func: () => {
        paintRect = true;
        const psH = (wh <= scaler.s730 && ww > scaler.s800 && ppt.hPanelScale.value >= 0.5) ? ppt.hPanelScale.value - 0.1 : ppt.hPanelScale.value; // layout.p.p3/layout.p.p2 placement ratio in horizontal orientation (.5 splitscreen)
        if (layout.p.p3) layout.p.p3.Hidden = true;
        if (layout.p.p4) layout.p.p4.Hidden = true;
        if (ppt.unify.enabled) {layout.p.p1.Hidden = true; layout.p.p2.Hidden = true;}
        if (layout.p.p1) { layout.p.p1.Move(0, wh - cpH, ww, cpH); layout.p.p1.ShowCaption = false; layout.p.p1.Locked = true; layout.p.p1.Hidden = false; }
        if (layout.p.p2) { layout.p.p2.Move(ww * psH, 0, ww - ww * psH, wh - cpH); layout.p.p2.ShowCaption = false; layout.p.p2.Locked = true; layout.p.p2.Hidden = false; }
    },
    debouncefunc: () => {
        const psH = (wh <= scaler.s730 && ww > scaler.s800 && ppt.hPanelScale.value >= 0.5) ? ppt.hPanelScale.value - 0.1 : ppt.hPanelScale.value;
        if (layout.p.p3) { layout.p.p3.Move(0, 0, ww * psH, wh - cpH); layout.p.p3.ShowCaption = false; layout.p.p3.Locked = true; layout.p.p3.Hidden = false; }
    }
});

layout.halfscreen({
    func: () => {
        paintRect = true;
        const psV = (wh < scaler.s600) ? ppt.vPanelScale.value + 0.2 : ppt.vPanelScale.value; // (layout.p.p3 & layout.p.p4)/layout.p.p2 placement ratio in vertical orientation
        if (layout.p.p3) layout.p.p3.Hidden = true;
        if (layout.p.p4) layout.p.p4.Hidden = true;
        if (ppt.unify.enabled) {layout.p.p1.Hidden = true; layout.p.p2.Hidden = true;}
        if (layout.p.p1) { layout.p.p1.Move(0, wh - cpV, ww, cpV); layout.p.p1.ShowCaption = false; layout.p.p1.Locked = true; layout.p.p1.Hidden = false; }
        if (layout.p.p2) { const remainingH = wh - cpV - ((wh - cpV) * psV); layout.p.p2.Move(0, (wh - cpV) * psV, ww, remainingH); layout.p.p2.ShowCaption = false; layout.p.p2.Locked = true; layout.p.p2.Hidden = false; }
    },
    debouncefunc: () => {
        const psV = (wh < scaler.s600) ? ppt.vPanelScale.value + 0.2 : ppt.vPanelScale.value;
        if (layout.p.p3) { layout.p.p3.Move(0, 0, ww * 0.5, (wh - cpV) * psV); layout.p.p3.ShowCaption = false; layout.p.p3.Locked = true; layout.p.p3.Hidden = false; }
        if (layout.p.p4) { layout.p.p4.Move(ww * 0.5, 0, ww * 0.5, (wh - cpV) * psV); layout.p.p4.ShowCaption = false; layout.p.p4.Locked = true; layout.p.p4.Hidden = false; }
    }
});

layout.normalvertical({
    func: () => {
        paintRect = true;
        const psV = (wh < scaler.s600) ? ppt.vPanelScale.value + 0.2 : ppt.vPanelScale.value;
        if (layout.p.p4) layout.p.p4.Hidden = true;
        if (layout.p.p3) layout.p.p3.Hidden = true;
        if (ppt.unify.enabled) {layout.p.p1.Hidden = true; layout.p.p2.Hidden = true;}
        if (layout.p.p1) { layout.p.p1.Move(0, wh - cpV, ww, cpV); layout.p.p1.ShowCaption = false; layout.p.p1.Locked = true; layout.p.p1.Hidden = false; }
        if (layout.p.p2) { const remainingH = wh - cpV - ((wh - cpV) * psV); layout.p.p2.Move(0, (wh - cpV) * psV, ww, remainingH); layout.p.p2.ShowCaption = false; layout.p.p2.Locked = true; layout.p.p2.Hidden = false; }
    },
    debouncefunc: () => {
        const psV = (wh < scaler.s600) ? ppt.vPanelScale.value + 0.2 : ppt.vPanelScale.value;
        if (layout.p.p3) { layout.p.p3.Move(0, 0, ww * 0.7, (wh - cpV) * psV); layout.p.p3.ShowCaption = false; layout.p.p3.Locked = true; layout.p.p3.Hidden = false; }
        if (layout.p.p4) { layout.p.p4.Move(ww * 0.7, 0, ww - ww * 0.7, (wh - cpV) * psV); layout.p.p4.ShowCaption = false; layout.p.p4.Locked = true; layout.p.p4.Hidden = false; }
    }
});

layout.narrowvertical({
    func: () => {
        paintRect = true;
        const psV = (wh < scaler.s600) ? ppt.vPanelScale.value + 0.2 : ppt.vPanelScale.value;
        if (layout.p.p4) layout.p.p4.Hidden = true;
        if (layout.p.p3) layout.p.p3.Hidden = true;
        if (ppt.unify.enabled) {layout.p.p1.Hidden = true; layout.p.p2.Hidden = true;}
        if (layout.p.p1) { layout.p.p1.Move(0, wh - cpV, ww, cpV); layout.p.p1.ShowCaption = false; layout.p.p1.Locked = true; layout.p.p1.Hidden = false; }
        if (layout.p.p2) { const remainingH = wh - cpV - ((wh - cpV) * psV); layout.p.p2.Move(0, (wh - cpV) * psV, ww, remainingH); layout.p.p2.ShowCaption = false; layout.p.p2.Locked = true; layout.p.p2.Hidden = false; }
    },
    debouncefunc: () => {
        const psV = (wh < scaler.s600) ? ppt.vPanelScale.value + 0.2 : ppt.vPanelScale.value;
        if (layout.p.p3) { layout.p.p3.Move(0, 0, ww, (wh - cpV) * psV); layout.p.p3.ShowCaption = false; layout.p.p3.Locked = true; layout.p.p3.Hidden = false; }
    }
});

layout.miniplayer({
    func: () => {
        paintRect = false;
        if (layout.p.p3) layout.p.p3.Hidden = true;
        if (layout.p.p2) layout.p.p2.Hidden = true;
        if (layout.p.p4) layout.p.p4.Hidden = true;
        if (ppt.unify.enabled) layout.p.p1.Hidden = true;
        if (layout.p.p1) { layout.p.p1.Move(0, wh - cpV, ww, cpV); layout.p.p1.ShowCaption = false; layout.p.p1.Locked = true; layout.p.p1.Hidden = false; }
    },
    debouncefunc: () => {
        exInitTabs([1, 3]);
        updateTabSize(ppt, true);
        let panelW = ppt.orientation.enabled ? ww - TAB_W : ww;
        let panelH = ppt.orientation.enabled ? wh - cpV : wh - cpV - TAB_H;
        let switchH = ppt.orientation.enabled ? 0 : TAB_H;
        let switchW = ppt.orientation.enabled ? TAB_W : 0;
        try {
            for (let i = 0; i < tabs.length; i++) {
                const p = window.GetPanelByIndex(tabs[i].index);
                if (p) {
                    p.Move(switchW, switchH, panelW, panelH, true);
                    p.ShowCaption = false;
                    p.Locked = true;
                    p.Hidden = false;
                }
            }
        } catch (e) { /* Ignore expected errors, logged by previous GetPanelByIndex within poo_mp_tabs.js */ }
    }
});

layout.miniplayer_2({
    func: () => {
        paintRect = true;
        exInitTabs([3]);
        try {
            for (let i = 0; i < tabs.length; i++) {
                const p = window.GetPanelByIndex(tabs[i].index);
                if (p) {
                    p.Hidden = true;
                }
            }
        } catch (e) { /* Ignore expected errors, logged by previous GetPanelByIndex within poo_mp_tabs.js */ }
        if (layout.p.p1) { layout.p.p1.Move(0, 0, ww, wh); layout.p.p1.ShowCaption = false; layout.p.p1.Locked = true; layout.p.p1.Hidden = false; }
    }
});

function on_size(width, height) {
    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;

    layout.update();
}

/*
 * ensure update once with a delay after loading
 * if foobar is closed while in miniplayer mode, it can cause update issues when opened again
*/
window.SetTimeout(function() {
    layout.update();
}, 180);

function on_paint(gr) {
    if (!paintRect && !ppt.bgShow.enabled) {
        const rX = (ppt.orientation.enabled) ? TAB_W : 0;
        const rY = (ppt.orientation.enabled) ? 0 : TAB_H;
        const rW = (ppt.orientation.enabled) ? ww - TAB_W : ww;
        const rH = (ppt.orientation.enabled) ? wh : wh - TAB_H;
        gr.FillSolidRect(rX, rY, rW, rH, g_backcolour);
    }

    if (ppt.bgShow.enabled && bg_img && !ppt.unify.enabled) {
        const bgW = (ppt.orientation.enabled) ? TAB_W : ww;
        const bgH = (ppt.orientation.enabled) ? wh : TAB_H;
        _drawImage(gr, bg_img, 0, 0, bgW, bgH, image.crop);
        if (ppt.overlay.enabled) {
            const overlayColor = setAlpha(g_backcolour, 128);
            gr.FillSolidRect(0, 0, bgW, bgH, overlayColor);
        }
    } else if (ppt.bgShow.enabled && bg_img && ppt.unify.enabled) {
        _drawImage(gr, bg_img, 0, 0, ww, wh, image.crop);
        if (ppt.overlay.enabled) {
            const overlayColor = setAlpha(g_backcolour, 128);
            gr.FillSolidRect(0, 0, ww, wh, overlayColor);
        }
    }

    if (layout.layout() === 'miniplayer' && ww >= scaler.s300) tab.paint_mp(gr, ppt);

    if (paintRect && !ppt.bgShow.enabled) gr.FillSolidRect(0, 0, ww, wh, g_backcolour);
}

function on_colours_changed() {
    get_colours(ppt.col_mode.value, true);
    window.Repaint();
}

function on_playback_new_track() {
    get_colours(ppt.col_mode.value, true);
    update_art(ppt);
    window.Repaint();
    if ((layout.layout() !== ('halfscreen' || 'normalvertical' || 'narrowvertical')) && !ppt.bgMode.enabled) { layout.refresh_pt_panels([layout.p.p4]); } else if (!ppt.bgMode.enabled) { layout.refresh_pt_panels(); }
}

function on_mouse_lbtn_up(x, y) {
    updateTabSize(ppt, true);
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
        updateTabSize(ppt, true);
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

    menu.newEntry({entryText: 'Configure main panel:', flags: MF_GRAYED});

    menu.newEntry({entryText: 'sep'});

    const or_menu = menu.newMenu('Orientation');
    menu.newCheckMenu(or_menu, 'Horizontal', 'Vertical', () => !ppt.orientation.enabled ? 0 : 1);
    menu.newEntry({menuName: or_menu, entryText: 'Horizontal', func: () => {ppt.orientation.enabled = false; update_art(ppt, true); on_size(); window.Repaint();}});
    menu.newEntry({menuName: or_menu, entryText: 'Vertical', func: () => {ppt.orientation.enabled = true; update_art(ppt, true); on_size(); window.Repaint();}});

    const show_menu = menu.newMenu('Show...');
    menu.newEntry({menuName: show_menu, entryText: 'Separators', func: () => {ppt.borders.toggle(); window.Repaint();}, flags: () => ppt.borders.enabled ? MF_CHECKED : MF_STRING});

    menu.newEntry({entryText: 'sep'});

    const tp_menu = menu.newMenu('Unified Background');
    menu.newEntry({menuName: tp_menu, entryText: 'Unify child-panel backgrounds', flags: MF_GRAYED});
    menu.newEntry({menuName: tp_menu, entryText: 'sep'});
    menu.newEntry({menuName: tp_menu, entryText: 'Enable', func: () => {ppt.unify.toggle(); window.Repaint(); layout.refresh_pt_panels([layout.p.p4]); if (ppt.unify.enabled) {let tp_readme; try { tp_readme = utils.ReadTextFile(fb.ProfilePath + 'poobar-scripts\\poobar\\readmes\\tp_readme.txt', 65001); } catch (e) { tp_readme = 'Transparency readme not found.\nAvoid without instructions, will cause glitches otherwise.' }; fb.ShowPopupMessage(tp_readme, 'Unified background & pseudotransparency'); tp_readme = null;} }, flags: () => ppt.unify.enabled ? MF_CHECKED : MF_STRING});

    const bg_menu = menu.newMenu('Background');
    menu.newEntry({menuName: bg_menu, entryText: 'Background Wallpaper:', flags: MF_GRAYED});
    menu.newEntry({menuName: bg_menu, entryText: 'sep'});
    menu.newEntry({menuName: bg_menu, entryText: 'Enable', func: () => {ppt.bgShow.toggle(); get_colours(ppt.col_mode.value, true); update_art(ppt, true); if (ppt.unify.enabled) paintRect = false; window.Repaint(); layout.refresh_pt_panels([layout.p.p4]);}, flags: () => ppt.bgShow.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: bg_menu, entryText: 'Blur', func: () => {ppt.bgBlur.toggle(); update_art(ppt, true); window.Repaint(); layout.refresh_pt_panels([layout.p.p4]);}, flags: () => ppt.bgBlur.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: bg_menu, entryText: 'Shadow', func: () => {ppt.overlay.toggle(); window.Repaint(); layout.refresh_pt_panels([layout.p.p4]);}, flags: () => ppt.overlay.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: bg_menu, entryText: 'sep'});
    menu.newCheckMenu(bg_menu, 'Playing album cover', 'Default', () => !ppt.bgMode.enabled ? 0 : 1);
    menu.newEntry({menuName: bg_menu, entryText: 'Playing album cover', func: () => {ppt.bgMode.enabled = false; update_art(ppt, true); window.Repaint();}});
    menu.newEntry({menuName: bg_menu, entryText: 'Default', func: () => {ppt.bgMode.enabled = true; if (ppt.bgMode.enabled && !/\.(bmp|gif|jpe?g|png|tiff?|ico)$/i.test(ppt.bgPath.value)) window.ShowProperties(); update_art(ppt, true); window.Repaint();}});

    const col_menu = menu.newMenu('Colours');
    menu.newEntry({menuName: col_menu, entryText: 'System', func: () => {ppt.col_mode.value = 1; get_colours(ppt.col_mode.value, true); window.Repaint();}, flags: () => ppt.col_mode.value === 1 ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: col_menu, entryText: 'Dynamic', func: () => {ppt.col_mode.value = 2; get_colours(ppt.col_mode.value, true); window.Repaint();}, flags: () => ppt.col_mode.value === 2 ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: col_menu, entryText: 'Custom', func: () => {ppt.col_mode.value = 3; get_colours(ppt.col_mode.value, true); window.ShowProperties(); window.Repaint();}, flags: () => ppt.col_mode.value === 3 ? MF_CHECKED : MF_STRING});

    const font_menu = menu.newMenu('Font');
    menu.newCheckMenu(font_menu, 'Segoe Fluent Icons', 'System', () => !ppt.fontMode.enabled ? 0 : 1);
    menu.newEntry({menuName: font_menu, entryText: 'Segoe Fluent Icons', func: () => {ppt.fontMode.enabled = false; window.Repaint();}});
    menu.newEntry({menuName: font_menu, entryText: 'System', func: () => {ppt.fontMode.enabled = true; window.Repaint();}});
    //menu.newEntry({menuName: font_menu, entryText: 'Custom', func: () => {}});

    menu.newEntry({entryText: 'sep'});

    menu.newEntry({entryText: 'Open readme...', func: () => {let readme; try { readme = utils.ReadTextFile(fb.ProfilePath + 'poobar-scripts\\poobar\\readmes\\mp_readme.txt', 65001); } catch (e) { readme = 'readme file not found' }; fb.ShowPopupMessage(readme, window.ScriptInfo.Name); readme = null;}});

    menu.newEntry({entryText: 'sep'});

    menu.newEntry({entryText: 'Panel Properties', func: () => {window.ShowProperties();}});
    menu.newEntry({entryText: 'Configure...', func: () => {window.ShowConfigureV2();}});

    return menu.btn_up(x, y);
}

"use strict";

window.DefineScript('Amethyst Main Panel', {author:'Choya', options:{grab_focus:false}});
window.DrawMode = +window.GetProperty('- Draw mode: GDI (false), D2D (true)', false);
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_global.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_layout.js');

let ppt = {
	cph : new _p ('_DISPLAY: Control Panel & Visualizer Heights', 80),
};

let ww, wh = 0;
let cph = _scale(ppt.cph.value); // Control Panel & visualizer heights

// _layout usage instruction found at: fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_layout.js'
const panelNames = ['Control Panel', 'tabstack', 'Oscilloscope', 'Spectrum Analyzer', 'Radial Bars']; // controlpanel, tabstack, oscilloscope, curve, radial
let layout = new _layout(panelNames, 150);
let y, cpx;

layout.horizontal({
    func: () => {
        if (layout.p.p3) { layout.p.p3.Move(ww / 9, y, ww / 8, cph); layout.p.p3.ShowCaption = false; layout.p.p3.Locked = true; layout.p.p3.Hidden = false;}
        if (layout.p.p4) { layout.p.p4.Move(ww / 1.39, y, ww / 6, cph); layout.p.p4.ShowCaption = false; layout.p.p4.Locked = true; layout.p.p4.Hidden = false; }
        if (layout.p.p5) { layout.p.p5.Move(ww / 4.1, y, ww / 23.4, cph); layout.p.p5.ShowCaption = false; layout.p.p5.Locked = true; layout.p.p5.Hidden = false; }
        if (layout.p.p2) { layout.p.p2.Move(0, 0, ww, wh); layout.p.p2.ShowCaption = false; layout.p.p2.Locked = true; layout.p.p2.Hidden = false; layout.p.p2.TopMost = false; }
        if (layout.p.p1) { layout.p.p1.Move(ww / 3.4, y, ww / 2.4, cph); layout.p.p1.ShowCaption = false; layout.p.p1.Locked = true; layout.p.p1.Hidden = false; }
    }
});

layout.halfscreen({
    func: () => {
        if (layout.p.p3) { layout.p.p3.Move(ww / 9, y, ww / 8, cph); layout.p.p3.ShowCaption = false; layout.p.p3.Locked = true; layout.p.p3.Hidden = false;}
        if (layout.p.p4) { layout.p.p4.Move(ww / 1.39, y, ww / 6, cph); layout.p.p4.ShowCaption = false; layout.p.p4.Locked = true; layout.p.p4.Hidden = false; }
        if (layout.p.p5) { layout.p.p5.Move(ww / 4.1, y, ww / 23.4, cph); layout.p.p5.ShowCaption = false; layout.p.p5.Locked = true; layout.p.p5.Hidden = false; }
        if (layout.p.p2) { layout.p.p2.Move(0, 0, ww, wh); layout.p.p2.ShowCaption = false; layout.p.p2.Locked = true; layout.p.p2.Hidden = false; layout.p.p2.TopMost = false; }
        if (layout.p.p1) { layout.p.p1.Move(ww / 3.4, y, ww / 2.4, cph); layout.p.p1.ShowCaption = false; layout.p.p1.Locked = true; layout.p.p1.Hidden = false; }
    }
});

layout.normalvertical({
    func: () => {
        if (layout.p.p3) layout.p.p3.Hidden = true;
        if (layout.p.p4) layout.p.p4.Hidden = true;
        if (layout.p.p2) { layout.p.p2.Move(0, 0, ww, wh); layout.p.p2.ShowCaption = false; layout.p.p2.Locked = true; layout.p.p2.Hidden = false; layout.p.p2.TopMost = false; }
        if (ww >= scaler.s1080) {
            if (layout.p.p5) { layout.p.p5.Move(ww * 0.08, y, ww * 0.12, cph); layout.p.p5.ShowCaption = false; layout.p.p5.Locked = true; layout.p.p5.Hidden = false; }
            if (layout.p.p1) { layout.p.p1.Move(ww * 0.22, y, ww * 0.56, cph); layout.p.p1.ShowCaption = false; layout.p.p1.Locked = true; layout.p.p1.Hidden = false; }
            if (layout.p.p4) { layout.p.p4.Move(ww * 0.8, y, ww * 0.12, cph); layout.p.p4.ShowCaption = false; layout.p.p4.Locked = true; layout.p.p4.Hidden = false; }
        } else {
            if (layout.p.p5) layout.p.p5.Hidden = true;
            if (layout.p.p4) layout.p.p4.Hidden = true;
            if (layout.p.p1) { layout.p.p1.Move(ww * 0.12, y, ww * 0.75, cph); layout.p.p1.ShowCaption = false; layout.p.p1.Locked = true; layout.p.p1.Hidden = false; }
        }
    }
});

layout.narrowvertical({
    func: () => {
        if (layout.p.p3) layout.p.p3.Hidden = true;
        if (layout.p.p4) layout.p.p4.Hidden = true;
        if (layout.p.p5) layout.p.p5.Hidden = true;
        if (layout.p.p2) { layout.p.p2.Move(0, 0, ww, wh); layout.p.p2.ShowCaption = false; layout.p.p2.Locked = true; layout.p.p2.Hidden = false; layout.p.p2.TopMost = false; }
        if (layout.p.p1) { layout.p.p1.Move(_scale(60), y, ww - _scale(90), cph); layout.p.p1.ShowCaption = false; layout.p.p1.Locked = true; layout.p.p1.Hidden = false; }
    }
});

layout.miniplayer({
    func: () => {
        if (layout.p.p3) layout.p.p3.Hidden = true;
        if (layout.p.p4) layout.p.p4.Hidden = true;
        if (layout.p.p5) layout.p.p5.Hidden = true;
        if (layout.p.p2) { layout.p.p2.Move(0, 0, ww, wh - cph); layout.p.p2.ShowCaption = false; layout.p.p2.Locked = true; layout.p.p2.Hidden = false; layout.p.p2.TopMost = false; }
        if (layout.p.p1) { layout.p.p1.Move(0, wh - cph, ww, cph); layout.p.p1.ShowCaption = false; layout.p.p1.Locked = true; layout.p.p1.Hidden = false; }
    }
});

layout.miniplayer_2({
    func: () => {
        if (layout.p.p3) layout.p.p3.Hidden = true;
        if (layout.p.p4) layout.p.p4.Hidden = true;
        if (layout.p.p5) layout.p.p5.Hidden = true;
        if (layout.p.p2) layout.p.p2.Hidden = true;
        if (layout.p.p1) { layout.p.p1.Move(0, 0, ww, wh); layout.p.p1.ShowCaption = false; layout.p.p1.Locked = true; layout.p.p1.Hidden = false; }
    }
});

function on_size(width, height) {
    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;

    y = wh - cph - _scale(20);

    layout.update();
}
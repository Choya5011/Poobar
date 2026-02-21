"use strict";

window.DefineScript('Amethyst Main Panel', {author:'Choya', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\global_vars.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_mp_helpers.js');

let ppt = {
	cph : new _p ('_DISPLAY: Control Panel & Visualizer Heights', 80),
};

let ww = 0;
let wh = 0;
let cph = _scale(ppt.cph.value); // Control Panel & visualizer heights
let delay = 150;

function on_size(width, height) {
    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;

    const layout = getLayoutType(ww, wh, scaler);

    updateLayout(layout, ww, wh, scaler);
}

// using GetPanel instead of GetPanelByIndex to make layout editing more flexible
let controlPanel, plView, radial, oscilloscope, tabStack,curve;
try { controlPanel = window.GetPanel('Control Panel'); } catch (e) { nestedcph = null; }
try { tabStack = window.GetPanel('tabstack'); } catch (e) { tabStack = null; }
try { oscilloscope = window.GetPanel('Oscilloscope'); } catch (e) { oscilloscope = null; }
try { curve = window.GetPanel('Spectrum Analyzer'); } catch (e) { curve = null; }
try { radial = window.GetPanel('Radial Bars'); } catch (e) { radial = null; }

/* instruct comment
 * Function that decides layout depending on main JSplitter dimensions
 * 6 states
 * To make custom layout add desired panels in CUI layout editor & set panel objects (see vars above)
 * Adjust PanelObject Members/Methods (see JSplitter PanelObject docs)
 * Debounce panels that are heavier to resize. See debounced blocks below func.
 * Debouncing is optional, but eliminates stutter when manually resizing. See tabstack as example.
 * Debounce is only of relevance for manual resizing smoothness, using win 11 snap layouts is always smooth.
*/
function updateLayout(layout, ww, wh, scaler) {
    if (ww >= scaler.s300) {
        const y = wh - cph - _scale(20);
        let cpx;
        if (layout === 'horizontal')  { // Block 1: Horizontal view
            if (oscilloscope) { oscilloscope.Move(ww / 9, y, ww / 8, cph); oscilloscope.ShowCaption = false; oscilloscope.Locked = true; oscilloscope.Hidden = false;}
            if (curve) { curve.Move(ww / 1.39, y, ww / 6, cph); curve.ShowCaption = false; curve.Locked = true; curve.Hidden = false; }
            if (radial) { radial.Move(ww / 4.1, y, ww / 23.4, cph); radial.ShowCaption = false; radial.Locked = true; radial.Hidden = false; }
            if (tabStack) { tabStack.Move(0, 0, ww, wh); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; tabStack.TopMost = false; }
            if (controlPanel) { controlPanel.Move(ww / 3.4, y, ww / 2.4, cph); controlPanel.ShowCaption = false; controlPanel.Locked = true; controlPanel.Hidden = false; }
        } else if (layout === 'halfscreen') { // Block 2: Half screen view
            if (oscilloscope) { oscilloscope.Move(ww / 9, y, ww / 8, cph); oscilloscope.ShowCaption = false; oscilloscope.Locked = true; oscilloscope.Hidden = false;}
            if (curve) { curve.Move(ww / 1.39, y, ww / 6, cph); curve.ShowCaption = false; curve.Locked = true; curve.Hidden = false; }
            if (radial) { radial.Move(ww / 4.1, y, ww / 23.4, cph); radial.ShowCaption = false; radial.Locked = true; radial.Hidden = false; }
            if (tabStack) { tabStack.Move(0, 0, ww, wh); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; tabStack.TopMost = false; }
            if (controlPanel) { controlPanel.Move(ww / 3.4, y, ww / 2.4, cph); controlPanel.ShowCaption = false; controlPanel.Locked = true; controlPanel.Hidden = false; }
        } else if (layout === 'miniplayer') { // Block 3: Mini player view
            if (oscilloscope) oscilloscope.Hidden = true;
            if (curve) curve.Hidden = true;
            if (radial) radial.Hidden = true;
            if (tabStack) { tabStack.Move(0, 0, ww, wh - cph); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; tabStack.TopMost = false; }
            if (controlPanel) { controlPanel.Move(0, wh - cph, ww, cph); controlPanel.ShowCaption = false; controlPanel.Locked = true; controlPanel.Hidden = false; }
        } else if (layout === 'miniplayer_2') { // Block 4: Mini player 2 (Control Panel Only)
            if (oscilloscope) oscilloscope.Hidden = true;
            if (curve) curve.Hidden = true;
            if (radial) radial.Hidden = true;
            if (tabStack) tabstack.Hidden = true;
            if (controlPanel) { controlPanel.Move(0, 0, ww, wh); controlPanel.ShowCaption = false; controlPanel.Locked = true; controlPanel.Hidden = false; }
        } else if (layout === 'normalvertical') { // Block 5: Normal vertical view
            if (oscilloscope) oscilloscope.Hidden = true;
            if (curve) curve.Hidden = true;
            if (tabStack) { tabStack.Move(0, 0, ww, wh); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; tabStack.TopMost = false; }
            if (ww >= scaler.s1080) {
                if (radial) { radial.Move(ww * 0.08, y, ww * 0.12, cph); radial.ShowCaption = false; radial.Locked = true; radial.Hidden = false; }
                if (controlPanel) { controlPanel.Move(ww * 0.22, y, ww * 0.56, cph); controlPanel.ShowCaption = false; controlPanel.Locked = true; controlPanel.Hidden = false; }
                if (curve) { curve.Move(ww * 0.8, y, ww * 0.12, cph); curve.ShowCaption = false; curve.Locked = true; curve.Hidden = false; }
            } else {
                if (radial) radial.Hidden = true;
                if (curve) curve.Hidden = true;
                //if (controlPanel) { controlPanel.Move(_scale(100), y, ww - _scale(220), cph); controlPanel.ShowCaption = false; controlPanel.Locked = true; controlPanel.Hidden = false; }
                if (controlPanel) { controlPanel.Move(ww * 0.12, y, ww * 0.75, cph); controlPanel.ShowCaption = false; controlPanel.Locked = true; controlPanel.Hidden = false; }
            }
        } else if (layout === 'narrowvertical') { // Block 6: Narrow vertical view
            if (oscilloscope) oscilloscope.Hidden = true;
            if (curve) curve.Hidden = true;
            if (radial) radial.Hidden = true;
            if (tabStack) { tabStack.Move(0, 0, ww, wh); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; tabStack.TopMost = false; }
            if (controlPanel) { controlPanel.Move(_scale(60), y, ww - _scale(90), cph); controlPanel.ShowCaption = false; controlPanel.Locked = true; controlPanel.Hidden = false; }
        }
    }
}

/* ==================================================
 * Debounced code blocks
==================================================

const debouncedHorizontalView = debounce(function() {
    // Horizontal View
}, delay);

const debouncedHalfScreen = debounce(function() {
    // Half screen view
}, delay);

const debouncedMiniPlayer = debounce(function() {
    // Mini Player
}, delay);


const debouncedNormalVertical = debounce(function() {
    // Normal vertical view
}, delay);

const debouncedNarrowVertical = debounce(function() {
    // Narrow vertical view
}, delay);

================================================== */
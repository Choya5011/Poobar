"use strict";

window.DefineScript('Poobar Main Panel', {author:'Choya', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');

let ppt = {
	hPanelScale : new _p ('_MAIN_DISPLAY: Horizontal Monitor Panel Division (0-1)', 0.5),
	vPanelScale : new _p ('_MAIN_DISPLAY: Vertical Monitor Panel Division (0-1)', 0.4),
	cpH : new _p ('_MAIN_DISPLAY: Control Panel Height (Horizontal mode)', 105),
	cpV : new _p ('_MAIN_DISPLAY: Control Panel Height (Vertical mode)', 108),
};

/*
 * Imports after ppt declaration.
 * Items that were moved out of this script to declutter.
*/
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_mp_tab.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_mp_helpers.js');

function on_size(width, height) {
    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;

    // tabStack/playlistView placement ratio in horizontal orientation (.5 splitscreen)
    psH = (wh <= scaler.s730 && ww > scaler.s800 && ppt.hPanelScale.value >= 0.5) ? ppt.hPanelScale.value - 0.1 : ppt.hPanelScale.value;
    // (tabStack & smoothBrowser)/playlistView placement ratio in vertical orientation
    psV = (wh < scaler.s600) ? ppt.vPanelScale.value + 0.2 : ppt.vPanelScale.value;

    const layout = getLayoutType(ww, wh);

    updateLayout(layout, ww, wh, scaler);
}

// using GetPanel instead of GetPanelByIndex to make layout editing more flexible
let fluentControlPanel, playlistView, tabStack, smoothBrowser;
try { fluentControlPanel = window.GetPanel('Fluent Control Panel'); } catch (e) { fluentControlPanel = null; }
try { playlistView = window.GetPanel(''); } catch (e) { playlistView = null; } // Segoe Fluent Icons MusicNote, unicode: ec4f
try { tabStack = window.GetPanel(''); } catch (e) { tabStack = null; } // Segoe Fluent Icons MapLayers, unicode: e81e
try { smoothBrowser = window.GetPanel('Smooth Browser') } catch (e) { smoothBrowser = null; }

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
    if (ww >= scaler.s300 && wh >= scaler.s100) { // stop updating at 300 ww or 100 wh to prevent control panel clipping, ideally constrain window size with a component like UIWizard
        if (layout === 'horizontal')  { // Block 1: Horizontal view
            paintRect = true;
            if (tabStack) tabStack.Hidden = true;
            if (smoothBrowser) smoothBrowser.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpH, ww, cpH); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            if (playlistView) { playlistView.Move(ww * psH, 0, ww - ww * psH, wh - cpH); playlistView.ShowCaption = false; playlistView.Locked = true; playlistView.Hidden = false; }
            debouncedHorizontalView();
        } else if (layout === 'halfscreen') { // Block 2: Half screen view
            paintRect = true;
            if (tabStack) tabStack.Hidden = true;
            if (smoothBrowser) smoothBrowser.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpV, ww, cpV); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            if (playlistView) { const remainingH = wh - cpV - ((wh - cpV) * psV); playlistView.Move(0, (wh - cpV) * psV, ww, remainingH); playlistView.ShowCaption = false; playlistView.Locked = true; playlistView.Hidden = false; }
            debouncedHalfScreen();
        } else if (layout === 'miniplayer') { // Block 3: Mini player view
            paintRect = false;
            if (tabStack) tabStack.Hidden = true;
            if (playlistView) playlistView.Hidden = true;
            if (smoothBrowser) smoothBrowser.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpV, ww, cpV); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            debouncedMiniPlayer();
        } else if (layout === 'miniplayer_2') { // Block 4: Mini player 2 (Control Panel Only)
            paintRect = true;
            initTabs([3]);
            try {
                for (let i = 0; i < tabs.length; i++) {
                    const p = window.GetPanelByIndex(tabs[i].index);
                    if (p) {
                        p.Hidden = true;
                    }
                }
            } catch (e) { /* Ignore expected errors, logged by previous GetPanelByIndex within poo_mp_tabs.js */ }
            if (fluentControlPanel) { fluentControlPanel.Move(0, 0, ww, wh); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
        } else if (layout === 'normalvertical') { // Block 5: Normal vertical view
            paintRect = true;
            if (smoothBrowser) smoothBrowser.Hidden = true;
            if (tabStack) tabStack.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpV, ww, cpV); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            if (playlistView) { const remainingH = wh - cpV - ((wh - cpV) * psV); playlistView.Move(0, (wh - cpV) * psV, ww, remainingH); playlistView.ShowCaption = false; playlistView.Locked = true; playlistView.Hidden = false; }
            debouncedNormalVertical();
        } else if (layout === 'narrowvertical') { // Block 6: Narrow vertical view
            paintRect = true;
            if (smoothBrowser) smoothBrowser.Hidden = true;
            if (tabStack) tabStack.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpV, ww, cpV); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            if (playlistView) { const remainingH = wh - cpV - ((wh - cpV) * psV); playlistView.Move(0, (wh - cpV) * psV, ww, remainingH); playlistView.ShowCaption = false; playlistView.Locked = true; playlistView.Hidden = false; }
            debouncedNarrowVertical();
        }
    }
}

/* ==================================================
 * Debounced code blocks
================================================== */

const debouncedHorizontalView = debounce(function() {
    // Horizontal View
    if (tabStack) { tabStack.Move(0, 0, ww * psH, wh - cpH); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; }
}, delay);

const debouncedHalfScreen = debounce(function() {
    // Half screen view
    if (tabStack) { tabStack.Move(0, 0, ww * 0.5, (wh - cpV) * psV); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; }
    if (smoothBrowser) { smoothBrowser.Move(ww * 0.5, 0, ww * 0.5, (wh - cpV) * psV); smoothBrowser.ShowCaption = false; smoothBrowser.Locked = true; smoothBrowser.Hidden = false; }
}, delay);

const debouncedMiniPlayer = debounce(function() {
    // Mini Player
    initTabs(ignore);
    updateTabSize();

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
}, delay);


const debouncedNormalVertical = debounce(function() {
    // Normal vertical view
    if (tabStack) { tabStack.Move(0, 0, ww * 0.7, (wh - cpV) * psV); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; }
    if (smoothBrowser) { smoothBrowser.Move(ww * 0.7, 0, ww - ww * 0.7, (wh - cpV) * psV); smoothBrowser.ShowCaption = false; smoothBrowser.Locked = true; smoothBrowser.Hidden = false; }
}, delay);

const debouncedNarrowVertical = debounce(function() {
    // Narrow vertical view
    if (tabStack) { tabStack.Move(0, 0, ww, (wh - cpV) * psV); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; }
}, delay);

/* ================================================== */
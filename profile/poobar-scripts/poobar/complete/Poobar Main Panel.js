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
}; include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_mp_tab.js');

/**
 * storing in scaler instead of accessing _scale() directly
 * reason: easier to find back in script
 * s300 = 300px in 1440p
 */
const scaler = {
    s140: _scale(105),
    s300: _scale(225),
    s320: _scale(240),
    s380: _scale(285),
    s400: _scale(300),
    s600: _scale(450),
    s730: _scale(547.5),
    s800: _scale(600),
};

let ww = 0;
let wh = 0;

const delay = 150;

let cpH = _scale(ppt.cpH.value); // Control Panel Height in Horizontal orientation
let cpV = _scale(ppt.cpV.value); // Control Panel Height in vertical orientation
let psH;
let psV;

let fluentControlPanel; let playlistView; let tabStack; let smoothBrowser;
try { fluentControlPanel = window.GetPanel('Fluent Control Panel'); } catch (e) { fluentControlPanel = null; }
try { playlistView = window.GetPanel(''); } catch (e) { playlistView = null; } // Segoe Fluent Icons MusicNote, unicode: ec4f
try { tabStack = window.GetPanel(''); } catch (e) { tabStack = null; } // Segoe Fluent Icons MapLayers, unicode: e81e
try { smoothBrowser = window.GetPanel('Smooth Browser') } catch (e) { smoothBrowser = null; }

const approximatelyEqual = (a, b, tolerance = 0.20) => {
  const diff = Math.abs(a - b);
  const largest = Math.max(Math.abs(a), Math.abs(b));
  return diff <= largest * tolerance;
};

const checkSizeAndRatio = (wh, ww, targetRatio, tolerance = 0.20) => {
  if (wh > ww && approximatelyEqual(wh / ww, targetRatio, tolerance)) return true;
  return false;
};

function on_size(width, height) {
    //panel.size();

    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;

    psH = (wh <= scaler.s730 && ww > scaler.s800) ? ppt.hPanelScale.value - 0.1 : ppt.hPanelScale.value; // tabStack/playlistView placement ratio in horizontal orientation (.5 splitscreen)
    psV = (wh < scaler.s600) ? ppt.vPanelScale.value + 0.2 : ppt.vPanelScale.value; // (tabStack & smoothBrowser)/playlistView placement ratio in vertical orientation

    if (ww >= scaler.s300) {
        if ((checkSizeAndRatio(ww, wh, 16 / 9, 0.2) || checkSizeAndRatio(ww, wh, 3, 0.3) || checkSizeAndRatio(ww, wh, 11.11, 0.4) || checkSizeAndRatio(ww, wh, 5.4, 0.2)) && wh > scaler.s380)  {
            // Block 1: Horizontal view
            paintRect = true;
            if (tabStack) tabStack.Hidden = true;
            if (smoothBrowser) smoothBrowser.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpH, ww, cpH); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            if (playlistView) { playlistView.Move(ww * psH, 0, ww - ww * psH, wh - cpH); playlistView.ShowCaption = false; playlistView.Locked = true; playlistView.Hidden = false; }
            debouncedHorizontalView();
        } else if (checkSizeAndRatio(wh, ww, 8 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730 || checkSizeAndRatio(ww, wh, 8 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730 || checkSizeAndRatio(ww, wh, 1, 0.3) && ww > scaler.s600) {
            // Block 2: Half screen view
            paintRect = true;
            if (tabStack) tabStack.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpV, ww, cpV); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            if (smoothBrowser) { smoothBrowser.Move(ww * 0.5, 0, ww * 0.5, (wh - cpV) * psV); smoothBrowser.ShowCaption = false; smoothBrowser.Locked = true; smoothBrowser.Hidden = false; }
            if (playlistView) { const remainingH = wh - cpV - ((wh - cpV) * psV); playlistView.Move(0, (wh - cpV) * psV, ww, remainingH); playlistView.ShowCaption = false; playlistView.Locked = true; playlistView.Hidden = false; }
            debouncedHalfScreen();
        } else if ((ww <= scaler.s600 && wh <= scaler.s730 || ww < scaler.s320) && wh > scaler.s400) {
            // Block 3: Mini player view
            paintRect = false;
            if (tabStack) tabStack.Hidden = true;
            if (smoothBrowser) smoothBrowser.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpV, ww, cpV); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            debouncedMiniPlayer();
            //window.Repaint();
        } else if (wh <= scaler.s400) {
            // Block 4: Mini player 2 (Control Panel Only)
            paintRect = true;
            initTabs([3]);
            for (let i = 0; i < tabs.length; i++) {
                const p = window.GetPanelByIndex(tabs[i].index);
                if (p) {
                    p.Hidden = true;
                }
            }
            if (fluentControlPanel) { fluentControlPanel.Move(0, 0, ww, wh); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
        } else if (checkSizeAndRatio(wh, ww, 16 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730 || checkSizeAndRatio(wh, ww, 1.36, 0.3)) {
            // Block 5: Normal vertical view
            paintRect = true;
            if (tabStack) tabStack.Hidden = true;
            if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpV, ww, cpV); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
            if (smoothBrowser) { smoothBrowser.Move(ww * 0.7, 0, ww - ww * 0.7, (wh - cpV) * psV); smoothBrowser.ShowCaption = false; smoothBrowser.Locked = true; smoothBrowser.Hidden = false; }
            if (playlistView) { const remainingH = wh - cpV - ((wh - cpV) * psV); playlistView.Move(0, (wh - cpV) * psV, ww, remainingH); playlistView.ShowCaption = false; playlistView.Locked = true; playlistView.Hidden = false; }
            debouncedNormalVertical();
        } else if (checkSizeAndRatio(wh, ww, 1.9, 0.1) && ww >= scaler.s300 || checkSizeAndRatio(wh, ww, 4, 0.2) && ww >= scaler.s300 || checkSizeAndRatio(wh, ww, 2.2, 0.06) && ww >= scaler.s300 || checkSizeAndRatio(wh, ww, 2.7, 0.2) && ww >= scaler.s300) {
            // Block 6: Narrow vertical view
            paintRect = true;
            if (tabStack) tabStack.Hidden = true;
            if (smoothBrowser) smoothBrowser.Hidden = true;
            debouncedNarrowVertical();
        }
    }
}

// AI gen func, unverified. Verified when comment is removed.
const debounce = (fn, delay, immediate = false, parent = this) => {
  let timerId, lastWW = window.Width, lastWH = window.Height, lastTime = Date.now();

  return (...args) => {
    const now = Date.now();
    const ww = window.Width, wh = window.Height;
    const deltaW = Math.abs(ww - lastWW), deltaH = Math.abs(wh - lastWH);
    /*
    const velocity = (deltaW + deltaH) / (now - lastTime || 1); // px/ms

    // instant fire if velocity > 3px/ms (tune threshold)
    if (velocity > 3) {
      const boundFunc = fn.bind(parent, ...args);
      boundFunc(); // Execute immediately, ignore debounce
      lastWW = ww; lastWH = wh; lastTime = now;
      return;
    }
    */

    const boundFunc = fn.bind(parent, ...args);
    clearTimeout(timerId);
    if (immediate && !timerId) { boundFunc(); }
    const calleeFunc = immediate ? () => { timerId = null; } : boundFunc;
    timerId = setTimeout(calleeFunc, delay);
    lastWW = ww; lastWH = wh; lastTime = now;
    return timerId;
  };
};

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
}, delay);

const debouncedMiniPlayer = debounce(function() {
    // Mini Player
    initTabs(ignore);
    updateTabSize();

    let panelW = ppt.orientation.enabled ? ww - TAB_W : ww;
    let panelH = ppt.orientation.enabled ? wh - cpV : wh - cpV - TAB_H;
    let switchH = ppt.orientation.enabled ? 0 : TAB_H;
    let switchW = ppt.orientation.enabled ? TAB_W : 0;

    for (let i = 0; i < tabs.length; i++) {
        const p = window.GetPanelByIndex(tabs[i].index);
        if (p) {
            p.Move(switchW, switchH, panelW, panelH, true);
            p.ShowCaption = false;
            p.Locked = true;
            p.Hidden = false;
        }
    }
}, delay);


const debouncedNormalVertical = debounce(function() {
    // Normal vertical view
    if (tabStack) { tabStack.Move(0, 0, ww * 0.7, (wh - cpV) * psV); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; }
}, delay);

const debouncedNarrowVertical = debounce(function() {
    // Narrow vertical view
    if (fluentControlPanel) { fluentControlPanel.Move(0, wh - cpV, ww, cpV); fluentControlPanel.ShowCaption = false; fluentControlPanel.Locked = true; fluentControlPanel.Hidden = false; }
    if (tabStack) { tabStack.Move(0, 0, ww, (wh - cpV) * psV); tabStack.ShowCaption = false; tabStack.Locked = true; tabStack.Hidden = false; }
    if (playlistView) { const remainingH = wh - cpV - ((wh - cpV) * psV); playlistView.Move(0, (wh - cpV) * psV, ww, remainingH); playlistView.ShowCaption = false; playlistView.Locked = true; playlistView.Hidden = false; }
}, delay);

/* ================================================== */
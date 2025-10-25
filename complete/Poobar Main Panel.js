"use strict";

window.DefineScript('Poobar Main Panel', {author:'Choya', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\poobar\\poo_helpers.js');

let ppt = {
	hPanelScale : new _p ('_DISPLAY: Horizontal Monitor Panel Division (0-1)', 0.5),
	vPanelScale : new _p ('_DISPLAY: Vertical Monitor Panel Division (0-1)', 0.4),
	cpH : new _p ('_DISPLAY: Control Panel Height (Horizontal mode)', 105),
	cpV : new _p ('_DISPLAY: Control Panel Height Scale (Vertical mode)', 108),
};

/**
 * one quick play/pause at startup to fetch colors in other scripts
 * remove or comment out if not required for use case of main script
 */
const metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
if (metadb) {
    fb.Play();
    fb.Pause();
}

/**
 * storing in scaler instead of accessing _scale() directly
 * reason: easier to find back in script
 * s300 = 300px in 1440p
 */
const scaler = {
    s300: _scale(225),
    s320: _scale(240),
    s600: _scale(450),
    s730: _scale(547.5),
    s800: _scale(600),
};

let ww = 0;
let wh = 0;

let fluentControlPanel; let playlistView; let tabStack; let smoothBrowser; let essentialStack;
try { fluentControlPanel = window.GetPanel('Fluent Control Panel'); } catch (e) { fluentControlPanel = null; }
try { playlistView = window.GetPanel('Playlist View'); } catch (e) { playlistView = null; }
try { tabStack = window.GetPanel('Tab Stack'); } catch (e) { tabStack = null; }
try { smoothBrowser = window.GetPanel('Smooth Browser') } catch (e) { smoothBrowser = null; }
try { essentialStack = window.GetPanel('Essentials Fallback Stack'); } catch (e) { essentialStack = null; }

function on_size(width, height) {
    ww = window.Width;
    wh = window.Height;

	const psH = (wh <= scaler.s730 && ww > scaler.s800) ? ppt.hPanelScale.value - 0.1 : ppt.hPanelScale.value; // tabStack/playlistView placement ratio in horizontal orientation (.5 splitscreen)
    let psV = (wh < scaler.s600) ? ppt.vPanelScale.value + 0.2 : ppt.vPanelScale.value; // (tabStack & smoothBrowser)/playlistView placement ratio in vertical orientation
    let cpH = _scale(ppt.cpH.value); // Control Panel Height in Horizontal orientation
    let cpV = _scale(ppt.cpV.value); // Control Panel Height in vertical orientation

    const approximatelyEqual = (a, b, tolerance = 0.20) => {
      const diff = Math.abs(a - b);
      const largest = Math.max(Math.abs(a), Math.abs(b));
      return diff <= largest * tolerance;
    };

    const checkSizeAndRatio = (wh, ww, targetRatio, tolerance = 0.20) => {
      if (wh > ww && approximatelyEqual(wh / ww, targetRatio, tolerance)) return true;
      return false;
    };

	if (checkSizeAndRatio(ww, wh, 16 / 9, 0.2) || checkSizeAndRatio(ww, wh, 3, 0.3) || checkSizeAndRatio(ww, wh, 11.11, 0.4) || checkSizeAndRatio(ww, wh, 5.4, 0.2))  {
	    //if (wh < scaler.s730 && ww > scaler.s800) { psH - 0.2 }
	    // horizontal
	    if (fluentControlPanel) {
            fluentControlPanel.Move(0, wh - cpH, ww, cpH);
            fluentControlPanel.ShowCaption = false;
            fluentControlPanel.Locked = true;
	    }
        if (tabStack) {
            tabStack.Move(0, 0, ww * psH, wh - cpH);
            tabStack.ShowCaption = false;
            tabStack.Locked = true;
            tabStack.Hidden = false;
            essentialStack.Hidden = true;
        }
        if (smoothBrowser) smoothBrowser.Hidden = true;
        if (playlistView) {
            playlistView.Move(ww * psH, 0, ww - ww * psH, wh - cpH);
            playlistView.ShowCaption = false;
            playlistView.Locked = true;
            playlistView.Hidden = false;
        }
	} else if (checkSizeAndRatio(wh, ww, 8 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730 || checkSizeAndRatio(ww, wh, 8 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730 || checkSizeAndRatio(ww, wh, 1, 0.3) && ww > scaler.s600) {
	    // half screen
	    if (fluentControlPanel) {
            fluentControlPanel.Move(0, wh - cpV, ww, cpV);
            fluentControlPanel.ShowCaption = false;
            fluentControlPanel.Locked = true;
	    }
        if (tabStack) {
            tabStack.Move(0, 0, ww * 0.5, (wh - cpV) * psV);
            tabStack.ShowCaption = false;
            tabStack.Locked = true;
            tabStack.Hidden = false;
            essentialStack.Hidden = true;
        }
        if (smoothBrowser) {
            smoothBrowser.Move(ww * 0.5, 0, ww * 0.5, (wh - cpV) * psV);
            smoothBrowser.ShowCaption = false;
            smoothBrowser.Locked = true;
            smoothBrowser.Hidden = false;
        }
        if (playlistView) {
            const remainingH = wh - cpV - ((wh - cpV) * psV);
            playlistView.Move(0, (wh - cpV) * psV, ww, remainingH);
            playlistView.ShowCaption = false;
            playlistView.Locked = true;
            playlistView.Hidden = false;
        }
    } else if (ww <= scaler.s600 && wh <= scaler.s730 || ww < scaler.s320) {
        // vertical
        if (fluentControlPanel) {
            fluentControlPanel.Move(0, wh - cpV, ww, cpV);
            fluentControlPanel.ShowCaption = false;
            fluentControlPanel.Locked = true;
        }
        if (tabStack) tabStack.Hidden = true;
        if (smoothBrowser) smoothBrowser.Hidden = true;
        if (essentialStack) {
            essentialStack.Move(0, 0, ww, wh - cpV);
            essentialStack.ShowCaption = false;
            essentialStack.Locked = true;
            essentialStack.Hidden = false;
        }
        if (playlistView) playlistView.Hidden = true;
    } else if (checkSizeAndRatio(wh, ww, 16 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730 || checkSizeAndRatio(wh, ww, 1.36, 0.3)) {
        if (fluentControlPanel) {
            fluentControlPanel.Move(0, wh - cpV, ww, cpV);
            fluentControlPanel.ShowCaption = false;
            fluentControlPanel.Locked = true;
        }
        if (tabStack) {
        tabStack.Move(0, 0, ww * 0.7, (wh - cpV) * psV);
        tabStack.ShowCaption = false;
        tabStack.Locked = true;
        tabStack.Hidden = false;
        }
        if (essentialStack) essentialStack.Hidden = true;
        if (smoothBrowser) {
            smoothBrowser.Move(ww * 0.7, 0, ww - ww * 0.7, (wh - cpV) * psV);
            smoothBrowser.ShowCaption = false;
            smoothBrowser.Locked = true;
            smoothBrowser.Hidden = false;
        }
        if (playlistView) {
            const remainingH = wh - cpV - ((wh - cpV) * psV);
            playlistView.Move(0, (wh - cpV) * psV, ww, remainingH);
            playlistView.ShowCaption = false;
            playlistView.Locked = true;
            playlistView.Hidden = false;
        }
    } else if (checkSizeAndRatio(wh, ww, 1.9, 0.1) && ww >= scaler.s300 || checkSizeAndRatio(wh, ww, 4, 0.2) && ww >= scaler.s300 || checkSizeAndRatio(wh, ww, 2.2, 0.06) && ww >= scaler.s300 || checkSizeAndRatio(wh, ww, 2.7, 0.2) && ww >= scaler.s300)  {
        if (fluentControlPanel) {
            fluentControlPanel.Move(0, wh - cpV, ww, cpV);
            fluentControlPanel.ShowCaption = false;
            fluentControlPanel.Locked = true;
        }
        if (tabStack) {
            tabStack.Move(0, 0, ww, (wh - cpV) * psV);
            tabStack.ShowCaption = false;
            tabStack.Locked = true;
            tabStack.Hidden = false;
        }
        if (essentialStack) essentialStack.Hidden = true;
        if (smoothBrowser) smoothBrowser.Hidden = true;
        if (playlistView) {
            const remainingH = wh - cpV - ((wh - cpV) * psV);
            playlistView.Move(0, (wh - cpV) * psV, ww, remainingH);
            playlistView.ShowCaption = false;
            playlistView.Locked = true;
            playlistView.Hidden = false;
        }
    }

}

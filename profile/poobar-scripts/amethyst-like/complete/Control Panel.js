'use strict';

//let ww = 0;
//let wh = 0;

let nestedCP; let plView; let LUFs; let oscilloscope;
try { nestedCP = window.GetPanel('Nested Control Panel'); } catch (e) { nestedCP = null; }
try { plView = window.GetPanel('Playlist View'); } catch (e) { plView = null; }
try { oscilloscope = window.GetPanel('Oscilloscope (Direct2D)'); } catch (e) { oscilloscope = null; }
try { LUFs = window.GetPanel('LUFS'); } catch (e) { LUFs = null; }

/*
function on_size() {
    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;

    if (nestedCP) {
        nestedCP.Move(ww / 3, wh / 4, ww / 3, wh / 1.5);
        nestedCP.ShowCaption = false;
        nestedCP.Locked = true;
        nestedCP.Hidden = false;
    }
//    if (tabStack) {
//        tabStack.Move(0, 0, ww * psH, wh - cpH);
//        tabStack.ShowCaption = false;
//        tabStack.Locked = true;
//        tabStack.Hidden = false;
//    }
//    if (smoothBrowser) smoothBrowser.Hidden = true;
//    if (playlistView) {
//        playlistView.Move(ww * psH, 0, ww - ww * psH, wh - cpH);
//        playlistView.ShowCaption = false;
//        playlistView.Locked = true;
//        playlistView.Hidden = false;
//    }
}

function on_paint(gr) {}

function repaintLoop() {
    window.Repaint();
    setTimeout(repaintLoop, 33.33); // roughly 30fps
}
repaintLoop();
*/
let ww = 0;
let wh = 0;
let g_backcolour = 0xFFAAAAAA;

function on_size(width, height) {
    ww = width;
    wh = height;
}

function on_paint(gr) {
    //gr.FillSolidRect(0, 0, ww, wh, g_backcolour);
}

function repaintLoop() {
    window.Repaint();
    setTimeout(repaintLoop, 33.33); // roughly 30fps
}
repaintLoop();
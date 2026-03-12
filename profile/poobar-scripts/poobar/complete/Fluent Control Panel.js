'use strict';

// This script is a modified version of Fluent Control Panel version 0.9 by eurekagliese
window.DefineScript('Fluent Control Panel', {author:'eurekagliese & Choya', options:{grab_focus:false}});
window.DrawMode = +window.GetProperty('- Draw mode: GDI (false), D2D (true)', false);
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\complete\\js\\seekbar.js');
include(fb.ComponentPath + 'samples\\complete\\js\\rating.js');
include(fb.ComponentPath + 'samples\\complete\\js\\volume.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_aa.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_col.js');
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\global_vars.js');
include(fb.ProfilePath + 'poobar-scripts\\Menu-Framework-SMP\\helpers\\menu_xxx.js');

let ppt = {
    // show/hide
    art : new _p('_DISPLAY: Show Cover Art', true),
    vol : new _p('_DISPLAY: Show Volume', true),
    nxt : new _p('_DISPLAY: Show Next Track', true),
    db : new _p('_DISPLAY: Show dB permanently', false),
    rating : new _p('_DISPLAY: Show Rating', true),
    // colors
    col_mode : new _p('_PROPERTY: Color Mode (1,2,3)', 1),
    // modes
    mode: new _p('_DISPLAY: Seekbar Mode', true),
    loveMode : new _p('_PROPERTY: Love Mode', 1),
    pboMode : new _p('_PROPERTY: Playback Order Button Mode', true),
    bar_mode : new _p('_DISPLAY: Show Bar Core', false),
    roundBars : new _p('_DISPLAY: Show Rounded Bars', true),
    // background
    transparency : new _p ('_DISPLAY: Enable transparent background', false),
    bgShow : new _p('_DISPLAY: Show Wallpaper', false),
    bgBlur : new _p('_DISPLAY: Wallpaper Blurred', false),
    overlay : new _p('_DISPLAY: Show background shadow/overlay', false),
    bgMode : new _p('_DISPLAY: Wallpaper Mode', false),
    bgPath : new _p('_PROPERTY: Default Wallpaper Path', "path\\to\\custom\\image"),
};

let panel = new _panel();
let seekbar = new _seekbar(0, 0, 0, 0);
let buttons = new _buttons();
let rating = new _rating(0, 0, 14, 0); // x, y, size, colour
let volume = new _volume(0, 0, 100, 40);

let g_hot = false;
let seekbar_hover = false;
let volume_hover = false;
let errFlag_lv = true;
let errFlag_wf = true;
let dbShow = false;
let dbHideDelay = 300;
let isLoved = '';
let ratingHover = false;

let ww, wh = 0;
const bs = _scale(32);
let bx, by, cx, cy = 0;

let nextTrackInfo = "No next track."; // Stores the text to display
let isPlaying = false; // To track playback state
const SF_CENTER = 0x00000001;
const SF_VCENTER = 0x00000004;
const SF_CENTER_VCENTER = SF_CENTER | SF_VCENTER;

let colours = {
    white : _RGB(255, 255, 255),
    red : _RGB(255, 0, 0),
    seekbar_background : _RGBA(128, 128, 128, 128),
};

let tfo = {
    artist : fb.TitleFormat('%artist%'),
    title : fb.TitleFormat('%title%'),
    playback_time : fb.TitleFormat('%playback_time%  '),
    length : fb.TitleFormat('  %length%'),
    lov: fb.TitleFormat('$if2(%feedback%,0)'),
    lfm_loved: fb.TitleFormat('$if2(%lfm_loved%,0)')
};

let chara = {
    heart_on : '\ueb52',
    heart_off : '\ueb51',
    heart_break : '\ue00C',
    stop : '\uE71A',
    prev : '\uE892',
    play : '\uE768',
    pause : '\uE769',
    next : '\uE893',
    add_queue : '\ue109',
    search : '\uE721',
    consol : '\ue8e4',
    settings : '\uE713',
    volume : '\ue767',
    vol0 : '\uE992',
    vol1 : '\uE993',
    vol2 : '\uE994',
    vol3 : '\uE995',
    eject : '\uf847',
    // rating
    circleMask : '\ue91f',
    circleRing : '\uea3a',
    rating_on : '\ue735',
    rating_off : '\ue734',
    // pbo chars
	repeat_all : '\ue8ee',
	repeat_one : '\ue8ed',
	repeat_off : '\uf5e7',
	shuffle : '\ue8b1',
	shuffle : '\ue8b1',
	random : '\ue9ce',
	album : '\ue93c',
	folder : '\ued25',
};

const pbo_chars = [chara.repeat_off, chara.repeat_all, chara.repeat_one, chara.random, chara.shuffle, chara.album, chara.folder];
const pbo_names = ['Default', 'Repeat (playlist)', 'Repeat (track)', 'Random', 'Shuffle (tracks)', 'Shuffle (albums)', 'Shuffle (folders)'];

let waveformH = 0;
let waveformY = 0;
let spectrumW = 0;
let spectrumH = 0;
const js_wf_name = 'Not-A-Waveform-Seekbar-SMP';
const wf_instruct = 'Preferences -> Display -> Columns UI -> Layout -> JSplitter titled Fluent Control Panel -> Right click -> Insert panel -> Waveform panel of choice';
let waveformPanel; try { waveformPanel = window.GetPanelByIndex(0); if (waveformPanel.Name === 'JSplitter') { waveformPanel.Text = js_wf_name; } else if (waveformPanel.Name !== 'Waveform minibar (mod)') { waveformPanel = null; }  } catch (e) { waveformPanel = null; }
let spectrumPanel; try { spectrumPanel = window.GetPanel('Spectrum Analyzer'); } catch (e) { spectrumPanel = null; }

// Initial updates
get_colours(ppt.col_mode.value);
panel.item_focus_change();
update_art(ppt);
updateNextTrackInfo();

buttons.update = () => {
    const fluent_font = (ww < scaler.s1080 && !ppt.mode.enabled) ? gdi.Font('Segoe Fluent Icons', 38) : gdi.Font('Segoe Fluent Icons', 48);
    const fluent_font_hover = (ww < scaler.s1080 && !ppt.mode.enabled) ? gdi.Font('Segoe Fluent Icons', 44) : gdi.Font('Segoe Fluent Icons', 54);

    // Middle section button vars
    const x = ((ww - (bs * 7)) / 2);
    const y = ppt.mode.enabled ? seekbar.y - _scale(36) : _scale(4);
    const pbo = plman.PlaybackOrder;
    const pboText = (ppt.pboMode.enabled) ? '' : 'Playback Order: ' + pbo_names[pbo];

    // Right section button vars
    let xx, yy, vol_x, vol_y;
    if ((ww <= scaler.s520 && wh <= scaler.s130) || (ww > scaler.s520 && wh < scaler.s80)) { // out of bounds to hide, temp fix
        if (ww > scaler.s520) {
            xx = (ww > scaler.s800) ? (ww - (bs * 2)) : (ww - bs);
            yy = y;
        } else {
            xx = ww;
            yy = wh;
        }
    } else {
        xx = (ww > scaler.s800) ? (ww - (bs * 2)) : (ww - bs);
        yy = (ww > scaler.s520) ? Math.round((wh - bs) / 2) : wh - _scale(38);
    }

    // right section button offsets
    const is800 = ww > scaler.s800;
    const offsets = {
        s1: is800 ? 0 : -0.9,
        s2: is800 ? 0 : -1.4,
        s3: is800 ? 0 : -0.4,
        s4: is800 ? 0 : -0.6,
        s5: is800 ? 0 : -1.9
    };

    if (ppt.vol.enabled && ww >= scaler.s520 && wh >= scaler.s80) {
        vol_x = xx - (bs * (2.9 + offsets.s4));
        vol_y = volume.y - _scale(14);
    } else if (ppt.vol.enabled && ww <= scaler.s520 && wh > scaler.s130) {
        vol_x = xx - (bs * (2.9 + offsets.s4));
        vol_y = wh - _scale(24);
    } else if (!ppt.vol.enabled || (ppt.vol.enabled && wh < scaler.s100)) {
        vol_x = xx - (bs * (3.9 + offsets.s5));
        vol_y = yy + 1;
    } else {
        vol_x = ww;
        vol_y = wh;
    }

    // Middle section buttons
    const loveModeValue = ppt.loveMode.value || 1;
    if (!_cc('foo_lastfm_playcount_sync') || loveModeValue == 1) { // FEEDBACK mode
        errFlag_lv = true;
        let lv = tfo.lov.Eval();
        buttons.buttons.love = new _button(x, y, bs, bs, { normal : lv == 1 ? _chrToImg(chara.heart_on, g_textcolour, fluent_font) : _chrToImg(chara.heart_off, g_textcolour, fluent_font), hover : lv == 1 ? _chrToImg(chara.heart_break, g_textcolour, fluent_font_hover) : _chrToImg(chara.heart_on, g_textcolour, fluent_font_hover) }, () => { let selected_items = plman.GetPlaylistSelectedItems(plman.ActivePlaylist); if (selected_items && selected_items.Count !== 0) { let tags = {}; tags['FEEDBACK'] = isLoved ? '' : '1'; selected_items.UpdateFileInfoFromJSON(JSON.stringify(tags)); isLoved = !isLoved; } }, '');
    } else if (loveModeValue == 2) { // Last.fm mode
        let fav = tfo.lfm_loved.Eval();
        buttons.buttons.love = new _button(x, y, bs, bs, { normal: fav == 0 ? _chrToImg(chara.heart_off, g_textcolour, fluent_font) : _chrToImg(chara.heart_on, g_textcolour, fluent_font), hover: fav == 0 ? _chrToImg(chara.heart_on, g_textcolour, fluent_font_hover) : _chrToImg(chara.heart_break, g_textcolour, fluent_font_hover) }, () => { let selected_items = plman.GetPlaylistSelectedItems(plman.ActivePlaylist); if (selected_items && selected_items.Count !== 0) { fb.RunContextCommandWithMetadb("Last.fm Playcount Sync/" + (fav == 1 ? "Unlove" : "Love"), selected_items); } }, '');
    } else if (loveModeValue == 3) { // Dual mode
        let lv = tfo.lov.Eval();
        let fav = tfo.lfm_loved.Eval();
        buttons.buttons.love = new _button(x, y, bs, bs, { normal: (lv == 1 || fav == 1) ? _chrToImg(chara.heart_on, g_textcolour, fluent_font) : _chrToImg(chara.heart_off, g_textcolour, fluent_font), hover: (lv == 1 || fav == 1) ? _chrToImg(chara.heart_break, g_textcolour, fluent_font_hover) : _chrToImg(chara.heart_on, g_textcolour, fluent_font_hover) }, () => { let selected_items = plman.GetPlaylistSelectedItems(plman.ActivePlaylist); if (selected_items && selected_items.Count !== 0) { let tags = {}; tags['FEEDBACK'] = isLoved ? '' : '1'; selected_items.UpdateFileInfoFromJSON(JSON.stringify(tags)); isLoved = !isLoved; fb.RunContextCommandWithMetadb("Last.fm Playcount Sync/" + (fav == 1 ? "Unlove" : "Love"), selected_items); } }, '');
    } else {
        fb.ShowPopupMessage("Invalid love mode value, setting to FEEDBACK tag mode", window.ScriptInfo.Name);
        ppt.loveMode.value = 1;
    }
    if ((loveModeValue == 2 || loveModeValue == 3) && !_cc('foo_lastfm_playcount_sync') && errFlag_lv) {
        errFlag_lv = false;
        ppt.loveMode.value = 1;
        fb.ShowPopupMessage("Missing 'foo_lastfm_playcount_sync'.\nSwitched to FEEDBACK tag mode.", window.ScriptInfo.Name);
    }
    buttons.buttons.stop = new _button(x + bs, y, bs, bs, {normal : fb.StopAfterCurrent ? _chrToImg(chara.stop, colours.red, fluent_font) : _chrToImg(chara.stop, g_textcolour, fluent_font), hover : _chrToImg(chara.stop, g_textcolour_hl, fluent_font_hover)}, () => { fb.Stop(); }, '');
    buttons.buttons.previous = new _button(x + (bs * 2), y, bs, bs, {normal : _chrToImg(chara.prev, g_textcolour, fluent_font), hover : _chrToImg(chara.prev, g_textcolour_hl, fluent_font_hover)}, () => { plman.PlaybackOrder !== 3 ? fb.Prev() : fb.Next(); }, '');
    buttons.buttons.play = new _button(x + (bs * 3), y, bs, bs, {normal : !fb.IsPlaying || fb.IsPaused ? _chrToImg(chara.play, g_textcolour, fluent_font) : _chrToImg(chara.pause, g_textcolour, fluent_font), hover : !fb.IsPlaying || fb.IsPaused ? _chrToImg(chara.play, g_textcolour_hl, fluent_font_hover) : _chrToImg(chara.pause, g_textcolour_hl, fluent_font_hover)}, () => { fb.PlayOrPause(); }, !fb.IsPlaying || fb.IsPaused ? '' : '');
    buttons.buttons.next = new _button(x + (bs * 4), y, bs, bs, {normal : _chrToImg(chara.next, g_textcolour, fluent_font), hover : _chrToImg(chara.next, g_textcolour_hl, fluent_font_hover)}, () => { fb.Next(); }, '');
	buttons.buttons.pbo = new _button(x + (bs * 5), y, bs, bs, {normal: _chrToImg(pbo_chars[pbo], g_textcolour, fluent_font), hover: _chrToImg(pbo_chars[pbo], g_textcolour_hl, fluent_font_hover) }, () => { if (ppt.pboMode.enabled) { _pbo(x + (bs * 3.41), y); } else { plman.PlaybackOrder = (pbo >= pbo_chars.length - 1) ? 0 : pbo + 1; } }, pboText );
    buttons.buttons.add_queue = new _button(bx + (bs * 6), y, bs, bs, {normal : _chrToImg(chara.add_queue, g_textcolour, fluent_font), hover : _chrToImg(chara.add_queue, g_textcolour_hl, fluent_font_hover)}, () => { const selected_items = plman.GetPlaylistSelectedItems(plman.ActivePlaylist); if (selected_items && selected_items.Count !== 0) { fb.RunContextCommandWithMetadb("Add to playback queue", selected_items); } }, '');

    // Right section buttons
    buttons.buttons.volume = new _button(vol_x, vol_y, bs, bs, {normal : fb.Volume === -100 ? _chrToImg(chara.vol0, g_textcolour, fluent_font) : fb.Volume > -4 ? _chrToImg(chara.vol3, g_textcolour, fluent_font) : fb.Volume > -15 ? _chrToImg(chara.vol2, g_textcolour, fluent_font) : fb.Volume > -30 ? _chrToImg(chara.vol1, g_textcolour, fluent_font) : _chrToImg(chara.vol0, g_textcolour, fluent_font), hover : _chrToImg(chara.volume, g_textcolour_hl, fluent_font_hover)}, () => { fb.VolumeMute(); }, '');
    buttons.buttons.upd = new _button (xx - (bs * (3 + offsets.s2)), yy + 2, bs, bs, {normal: _chrToImg(chara.eject, g_textcolour, fluent_font),  hover : _chrToImg(chara.eject, g_textcolour_hl, fluent_font_hover)}, () => { switchOutputDevice(xx - (bs * (5.9 + offsets.s2)), yy) }, '');
    buttons.buttons.search = new _button(xx - (bs * (2 + offsets.s1)), yy, bs, bs, {normal : _chrToImg(chara.search, g_textcolour, fluent_font), hover : _chrToImg(chara.search, g_textcolour_hl, fluent_font_hover)}, () => { fb.RunMainMenuCommand('Library/Search'); }, '');
    buttons.buttons.consol = new _button(xx -  (bs * (1 + offsets.s3)), yy, bs, bs, {normal : _chrToImg(chara.consol, g_textcolour, fluent_font), hover : _chrToImg(chara.consol, g_textcolour_hl, fluent_font_hover)}, () => { fb.ShowConsole(); }, '');
    buttons.buttons.settings = new _button(xx, yy, bs, bs, {normal : _chrToImg(chara.settings, g_textcolour, fluent_font), hover : _chrToImg(chara.settings, g_textcolour_hl, fluent_font_hover)}, () => { fb.ShowPreferences(); }, '');
}

function on_size() {
    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;

    bx = ((ww - (bs * 7)) / 2);
    by = seekbar.y - _scale(36);

//    if (!ppt.art.enabled || ww < scaler.s600) {
//        cx = (ww - (bs * 2));
//        cy = Math.round((wh - bs) / 2);
//    }

    if (ww >= scaler.s1200) {
        seekbar.x = Math.round(ww * 0.22);
    } else if (ww <= scaler.s520 && wh) {
        seekbar.x = Math.round(ww * 0.18);
    } else if (ww > scaler.s520 && ww < scaler.s1200) {
        seekbar.x = Math.round(ww * 0.3);
    }
    seekbar.w = ww - seekbar.x * 2;
    seekbar.h = _scale(14);
    seekbar.y = wh * 0.6;

    volume.x = (ww > scaler.s800) ? ww - (bs * 4) : ww - (bs * 2.5);
    volume.y = (ww > scaler.s520) ? seekbar.y + _scale(12) : wh - _scale(10);
    volume.h =  _scale(4);
    volume.w = _scale(74);

    if (ppt.mode.enabled) {
        rating.x = bx - (bs * 3);
        rating.y = seekbar.y - _scale(24);

        if (waveformPanel) {
            waveformPanel.Hidden = true;
        }
    } else {
        // rating.x & y are in on_paint
        if (waveformPanel) {
            //waveformH = Math.round(wh / 3);
            waveformH = _scale(32);
            waveformY = _scale((wh / 2) - (waveformH / 2));
            if (wh > scaler.s100) { waveformPanel.Move(seekbar.x - _scale(40), waveformY, seekbar.w + _scale(80), waveformH); waveformPanel.SupportPseudoTransparency = true; waveformPanel.ShowCaption = false; waveformPanel.Hidden = false; waveformPanel.Locked = true; refresh_wf_panel(); } else { waveformPanel.Hidden = true; }
        } else if (errFlag_wf) {
            errFlag_wf = false;
            console.log(window.ScriptInfo.Name + ': Missing Panel \nNo Waveform panel found: make sure the waveform panel is the topmost panel inside the control panel. See instructions:\n' + wf_instruct);
        }
    }

    if (spectrumPanel && ww > scaler.s800 && wh > scaler.s80) { spectrumW = Math.min(seekbar.x - _scale(46), wh); spectrumH = wh; spectrumPanel.Move(0, 0, spectrumW, spectrumH); spectrumPanel.SupportPseudoTransparency = false; spectrumPanel.ShowCaption = false; spectrumPanel.Hidden = false; spectrumPanel.Locked = true; } else if (spectrumPanel) { spectrumPanel.Hidden = true; }

    buttons.update();
}

function on_paint(gr) {
    if (ppt.bgShow.enabled && bg_img) {
        _drawImage(gr, bg_img, 0, 0, ww, wh, image.crop);
        if (ppt.overlay.enabled) { const overlayColor = setAlpha(g_backcolour, 128); gr.FillSolidRect(0, 0, ww, wh, overlayColor); }
    } else if (!ppt.bgShow.enabled) {
        const bg_col = (ppt.transparency.enabled) ? _RGBA(0, 0, 0, 0) : g_backcolour;
        gr.FillSolidRect(0, 0, ww, wh, bg_col);
        console.log("paint called");
        //gr.FillGradRectV2(0, 0, ww, wh, 240, [0.0, g_backcolour, 1.0, 0x00000000]);
    }

    buttons.paint(gr);

    gr.SetSmoothingMode(2);
    let bar_h = _scale(4);
    let radius = bar_h / 2;
    //seekbar_bg
    if (ppt.mode.enabled) {
        if (ppt.roundBars.enabled) {
            gr.FillRoundRect(seekbar.x, seekbar.y + bar_h, seekbar.w + _scale(6), bar_h, radius, radius, colours.seekbar_background);
        } else {
            gr.FillSolidRect(seekbar.x, seekbar.y + bar_h, seekbar.w + _scale(6), bar_h, colours.seekbar_background);
        }
    } else if (!waveformPanel) {
        gr.FillRoundRect(seekbar.x, waveformY, seekbar.w, waveformH, 10, 10, colours.red);
        gr.GdiDrawText('No waveform panel present (see logs)', panel.fonts.title, colours.white, seekbar.x, waveformY, seekbar.w, waveformH, SF_CENTER_VCENTER | DT_END_ELLIPSIS);
        gr.GdiDrawText(wf_instruct, panel.fonts.normal, colours.white, seekbar.x, waveformY + 18, seekbar.w, waveformH, SF_CENTER_VCENTER | DT_END_ELLIPSIS);
    }

    if (fb.IsPlaying) {
        let size; let art_x; let art_y;
        if (ppt.art.enabled && thumb_img && ww > scaler.s800 && wh > scaler.s80 && !spectrumPanel) {
            size = Math.min(seekbar.x - _scale(46), wh * 0.86);
            art_x = wh * 0.06
            art_y = wh * 0.5 - size / 2
            _drawImage(gr, thumb_img, art_x, art_y, size, size, image.crop_top);
        }

        // Track information
        let title_w, artist_w;
        const track_info_x = (ppt.art.enabled && thumb_img && ww > scaler.s800 && wh > scaler.s80 && !spectrumPanel) ? art_y + size + 10 : (spectrumPanel && ww > scaler.s800 && wh > scaler.s80 ? spectrumW + _scale(12) : _scale(12));
        if (ppt.mode.enabled && ww > scaler.s600 && wh >= scaler.s80) {
            if (ppt.art.enabled && ww > scaler.s800) { title_w = ww / 5; artist_w = ww / 9; } else { title_w = ww / 4; artist_w = seekbar.x - wh - _scale(4); }
    		gr.GdiDrawText(tfo.title.Eval(), panel.fonts.title, g_textcolour, track_info_x, wh * 0.3, title_w, 0, LEFT | DT_END_ELLIPSIS);
    		gr.GdiDrawText(tfo.artist.Eval(), panel.fonts.normal, g_textcolour, track_info_x, wh * 0.6, artist_w, 0, LEFT | DT_END_ELLIPSIS);
        } else if (!ppt.mode.enabled && ww > scaler.s600 && wh >= scaler.s80) {
            if (ppt.rating.enabled) { rating.y = wh * 0.75; rating.x = track_info_x - _scale(2); }
            if (ppt.art.enabled && ww > scaler.s800) { title_w = (ww == scaler.s1080) ? ww / 9 : ww / 6.4; artist_w = ww * 0.13; } else { title_w = ww / 3.4; artist_w = ww * 0.23; }
            gr.GdiDrawText(tfo.title.Eval(), panel.fonts.title, g_textcolour, track_info_x, wh * 0.1, title_w, _scale(18), LEFT | DT_END_ELLIPSIS); // # w needs calibration
            gr.GdiDrawText(tfo.artist.Eval(), panel.fonts.normal, g_textcolour,  track_info_x, wh * 0.43, artist_w, _scale(18), LEFT | DT_END_ELLIPSIS);
        }

        if (ppt.rating.enabled && wh >= scaler.s80 && ((!ppt.mode.enabled && ww > scaler.s800) || (ppt.mode.enabled && ww > scaler.s1200))) {
            ratingHover = true;
            rating.paint(gr);
        } else {
            ratingHover = false;
        }

        // Draw the next track information
        var queueHandles = plman.GetPlaybackQueueHandles();
        if (((plman.PlaybackOrder === 0 || plman.PlaybackOrder === 1) && ppt.nxt.enabled) || queueHandles.Count > 0) {
            const text_w = ww / 2;
            const text_x = (ww - text_w) / 2;
            if (ppt.mode.enabled && ww >= scaler.s600) {
                gr.GdiDrawText(nextTrackInfo, panel.fonts.normal, g_textcolour, text_x, seekbar.y + _scale(16), text_w, _scale(18), SF_CENTER_VCENTER | DT_END_ELLIPSIS);
                //gr.DrawRect(text_x, seekbar.y + 18, text_w, _scale(18), 1, colours.red); //debugging border
            } else if (ww >= scaler.s600 && wh > scaler.s100) {
                if (ww < scaler.s1080) {
                    gr.GdiDrawText(nextTrackInfo, panel.fonts.normal, g_textcolour, text_x, seekbar.y + _scale(18), text_w, _scale(18), SF_CENTER_VCENTER | DT_END_ELLIPSIS);
                } else {
                    gr.GdiDrawText(nextTrackInfo, panel.fonts.normal, g_textcolour, (ww / 5) * 3.2, _scale(10), ww / 3.5, _scale(18), LEFT);
                }
            }
        }

        // seekbar
        if (fb.PlaybackLength > 0) {
            const pos = seekbar.pos();
            if (ppt.mode.enabled) {
                //progress_bar
                let barColor = getBarColor(seekbar_hover);
                let coreColor = getCoreColor(seekbar_hover);

                if (ppt.roundBars.enabled && pos >= bar_h) {
                    if (ppt.bar_mode.enabled) {
                        gr.FillRoundRect(seekbar.x, seekbar.y + _scale(4), pos, bar_h, radius, radius, coreColor); //bar core
                        gr.DrawRoundRect(seekbar.x, seekbar.y + _scale(4), pos, bar_h, radius, radius, _scale(2), g_textcolour); //bar outline
                    } else {
                        gr.FillRoundRect(seekbar.x, seekbar.y + _scale(4), pos, bar_h, radius, radius, barColor); // normal bar
                    }
                } else {
                    if (ppt.bar_mode.enabled) {
                        gr.FillSolidRect(seekbar.x, seekbar.y + _scale(4), pos, _scale(4), coreColor); //bar core
                        gr.DrawRect(seekbar.x, seekbar.y + _scale(4), pos, _scale(4), _scale(2), g_textcolour); //bar outline
                    } else {
                        gr.FillSolidRect(seekbar.x, seekbar.y + _scale(4), pos, _scale(4), barColor); //normal bar
                    }
                }

                gr.FillEllipse(seekbar.x + pos - 4, seekbar.y, _scale(12), _scale(12), g_textcolour); //knob
                if (ppt.bar_mode.enabled) gr.FillEllipse(seekbar.x + pos - 1.5, seekbar.y + 2.5, _scale(8), _scale(8), coreColor); //knob core
    			gr.GdiDrawText(tfo.playback_time.Eval(), panel.fonts.normal, g_textcolour, seekbar.x - _scale(45), seekbar.y + _scale(5), _scale(45), 0, RIGHT);
    			gr.GdiDrawText(tfo.length.Eval(), panel.fonts.normal, g_textcolour, seekbar.x + seekbar.w + _scale(6), seekbar.y + _scale(5), _scale(45), 0, LEFT);
            } else {
                // playback time and length
                if (ww >= scaler.s1080) {
                    gr.GdiDrawText(tfo.playback_time.Eval(), panel.fonts.title, g_textcolour, bx - (bs * 4), _scale(20), _scale(72), 0, RIGHT);
                    gr.GdiDrawText("/" + tfo.length.Eval(), panel.fonts.normal, g_textcolour, bx - (bs * 1.7), _scale(20), _scale(72), 0, LEFT);
                } else if (wh > scaler.s130) {
                    gr.GdiDrawText(tfo.playback_time.Eval(), panel.fonts.title, g_textcolour, (ww / 4) - _scale(17), seekbar.y - _scale(33), ww / 2, _scale(18), SF_CENTER_VCENTER);
                    gr.GdiDrawText("/" + tfo.length.Eval(), panel.fonts.title, g_textcolour, (ww / 4) + _scale(15), seekbar.y - _scale(33), ww / 2, _scale(18), SF_CENTER_VCENTER);
                }
                // test for playback time repaint
                //gr.FillSolidRect(bx - (bs * 4), _scale(12), _scale(72), _scale(18), colours.red);
            }
        }

        if (ppt.vol.enabled && ((ww > scaler.s520 && wh > scaler.s80) || (ww < scaler.s520 && wh > scaler.s130))) {
            let vol_pos = volume.pos();
            let barColor = getBarColor(volume_hover);
            let coreColor = getCoreColor(volume_hover);
            let volumeWidth = ww > scaler.s800 ? volume.w : volume.w.value * 0.8;

            if (ppt.roundBars.enabled && vol_pos >= volume.h && ww > scaler.s800) { // s800 check cause of unfound stripe bug likely related to volume icon
                let vol_radius = volume.h / 2;
                gr.FillRoundRect(volume.x, volume.y, volumeWidth, volume.h, vol_radius, vol_radius, colours.seekbar_background);
                if (ppt.bar_mode.enabled) {
                    gr.FillRoundRect(volume.x, volume.y, vol_pos, volume.h, vol_radius, vol_radius, coreColor);
                    gr.DrawRoundRect(volume.x, volume.y, vol_pos, volume.h, vol_radius, vol_radius, _scale(2), g_textcolour);
                } else {
                    gr.FillRoundRect(volume.x, volume.y, vol_pos, volume.h, vol_radius, vol_radius, barColor);
                }
            } else {
                gr.FillSolidRect(volume.x, volume.y, volumeWidth, volume.h, colours.seekbar_background);
                if (ppt.bar_mode.enabled) {
                    gr.FillSolidRect(volume.x, volume.y, vol_pos, volume.h, coreColor);
                    gr.DrawRect(volume.x, volume.y, vol_pos, volume.h, _scale(2), g_textcolour);
                } else {
                    gr.FillSolidRect(volume.x, volume.y, vol_pos, volume.h, barColor);
                }
            }
            var dbFont = gdi.Font(panel.fonts.normal.Name, 12);
            if (ww > scaler.s800 && (ppt.db.enabled || volume_hover || dbShow)) gr.GdiDrawText(fb.Volume.toFixed(2) + ' dB', dbFont, g_textcolour, _scale(8), volume.y + _scale(2), volume.x + _scale(106), 0, RIGHT);
        }
    }
}

function getBarColor(isHover) {
    return isHover ? g_textcolour_hl : g_textcolour;
}

function getCoreColor(isHover) {
    return isHover ? g_textcolour_hl : g_backcolour;
}

rating.paint = (gr) => {
    if (panel.metadb) {
        gr.SetTextRenderingHint(4);
        for (let i = 0; i < rating.get_max(); i++) {
            if (i + 1 > (rating.hover ? rating.hrating : rating.rating)) {
                gr.DrawString(chars.rating_off, rating.font, setAlpha(g_textcolour, 128), rating.x + (i * rating.h), rating.y, rating.h, rating.h, SF_CENTRE);
            } else {
                gr.DrawString(chars.rating_on, rating.font, g_textcolour_hl, rating.x + (i * rating.h), rating.y, rating.h, rating.h, SF_CENTRE);
            }
        }
    }
}

function refresh_wf_panel(panelName) {
    if (!ppt.mode.enabled) {
        let p; try { p = window.GetPanelByIndex(0); } catch (e) { return; }
        if (p.Text === panelName || p.Name === panelName) { p.Hidden = true; p.Hidden = false; }
        if (p.Name === 'Waveform minibar (mod)') { p.ShowCaption = true; p.ShowCaption = false; }
    }
}

function on_metadb_changed() {
    rating.metadb_changed();
}

function on_playback_new_track() {
    get_colours(ppt.col_mode.value);
    updateNextTrackInfo(); // When a new track starts, the "next" track might change.
    update_art(ppt);
    refresh_wf_panel();
    panel.item_focus_change();
    buttons.update();
}

// update the playback time
function on_playback_time() {
    window.RepaintRect(bx - (bs * 4), _scale(12), _scale(72), _scale(18));
}

function on_playback_edited() {
    buttons.update();
    window.Repaint();
}

function on_playback_seek() {
    seekbar.playback_seek();
}

function on_playback_stop() {
    buttons.update();
    window.Repaint();
}

function on_playback_stop(reason) {
    if (reason != 2) {
        panel.item_focus_change();
    }
}

function on_playback_pause() {
    buttons.update();
    window.Repaint();
}

function on_playback_starting() {
    buttons.update();
    window.Repaint();
}

function on_playback_dynamic_info_track() {
    panel.item_focus_change();
}

function _pbo(x, y) {
	var menu	= window.CreatePopupMenu();
	for (var i = 0; i < pbo_names.length; i++) {
		menu.AppendMenuItem(MF_STRING, i + 1, pbo_names[i]);
	}

	menu.CheckMenuRadioItem(1, pbo_names.length + 1, plman.PlaybackOrder + 1);

	var idx	= menu.TrackPopupMenu(x, y);

	if (idx) plman.PlaybackOrder = idx - 1;
}

function on_playback_order_changed() {
    updateNextTrackInfo(); // Playback order affects what the "next" track is.
    buttons.update();
    window.Repaint();
}

function on_playlist_switch() {
    updateNextTrackInfo(); // Switching playlists means the next track might be different.
    panel.item_focus_change();
}

function on_item_focus_change() {
    panel.item_focus_change();
}

function on_colours_changed() {
    get_colours(ppt.col_mode.value);
    buttons.update();
    panel.colours_changed();
    window.Repaint();
}

function on_volume_change() {
    buttons.update();
    volume.volume_change();
    window.Repaint();
}

function switchOutputDevice(x, y) {
    // Get output device list
    let str = fb.GetOutputDevices();
    let arr = JSON.parse(str);

    // Create popup menu
    var menu = window.CreatePopupMenu();
    for (var i = 0; i < arr.length; i++) {
        menu.AppendMenuItem(MF_STRING, i + 1, arr[i].name);
    }

    // Find active device index
    let activeIdx = arr.findIndex(d => d.active);
    if (activeIdx === -1) activeIdx = 0; // fallback if none active

    // Mark the active device as checked
    menu.CheckMenuRadioItem(1, arr.length, activeIdx + 1);

    // Show menu and get selection
    var idx = menu.TrackPopupMenu(x, y);
    if (idx && arr[idx - 1]) {
        // Set the selected device
        fb.SetOutputDevice(arr[idx - 1].output_id, arr[idx - 1].device_id);
    }
}

function vol2pos(v) {
    return (Math.pow(10, v / 50) - 0.01) / 0.99;
}

function pos2vol(pos) {
    return 50 * Math.log(0.99 * pos + 0.01) / Math.LN10;
}

/**
 * Updates the information about the next upcoming track.
 * Prioritizes tracks in the playback queue.
 */
function updateNextTrackInfo() {
    var nextTrack = null;
    // Use GetPlaybackQueueHandles to get a FbMetadbHandleList directly
    var queueHandles = plman.GetPlaybackQueueHandles();

    // 1. Check for tracks in the playback queue first
    if (queueHandles.Count > 0) {
        // The first item in the queueHandles list is the highest priority next track
        nextTrack = queueHandles[0];
        // console.log("Next track from queue (from updateNextTrackInfo):", nextTrack ? fb.TitleFormat("%title%").EvalWithMetadb(nextTrack) : "N/A"); // For debugging
    } else {
        // 2. If no queue, check the next track in the current playlist
        var currentPlaylistIndex = plman.PlayingPlaylist;
        // Ensure a valid playlist is currently playing and it has items
        if (currentPlaylistIndex !== -1 && plman.PlaylistItemCount(currentPlaylistIndex) > 0) {
            var playingItemLocation = plman.GetPlayingItemLocation();
            if (playingItemLocation.IsValid) {
                var currentIndex = playingItemLocation.PlaylistItemIndex;
                var playlistLength = plman.PlaylistItemCount(currentPlaylistIndex);

                // Check if there's a next track in the playlist
                if (currentIndex < playlistLength - 1) {
                    // Get all items in the current playlist and then access the next one by index
                    var playlistItems = plman.GetPlaylistItems(currentPlaylistIndex);
                    if (playlistItems && playlistItems.Count > currentIndex + 1) {
                        nextTrack = playlistItems[currentIndex + 1];
                        // console.log("Next track from playlist (from updateNextTrackInfo):", nextTrack ? fb.TitleFormat("%title%").EvalWithMetadb(nextTrack) : "N/A"); // For debugging
                    }
                }
            }
        }
    }

    // Format the track information for display
    if (nextTrack) {
        // Use TitleFormat to get artist and title reliably
        var tf = fb.TitleFormat("%artist% - %title%");
        nextTrackInfo = "Next: " + tf.EvalWithMetadb(nextTrack);
    } else {
        nextTrackInfo = "No next track.";
    }

    window.Repaint(); // Request a repaint to update the display
}

function on_playback_queue_changed() {
    // Add a small delay to ensure foobar2000 has fully processed the queue change
    window.SetTimeout(function() {
        updateNextTrackInfo();
    }, 50); // 50ms delay
}

// Add selected tracks to the queue in a random order (append to queue, do not flush)
function queueSelectedTracksRandomizedAppend() {
    const activePlaylistIndex = plman.ActivePlaylist;
    const selectedHandles = plman.GetPlaylistSelectedItems(activePlaylistIndex);

    if (!selectedHandles || selectedHandles.Count === 0) {
        fb.ShowPopupMessage("No tracks selected. Please select one or more tracks in your playlist.");
        return;
    }

    // Fisher-Yates shuffle
    for (let i = selectedHandles.Count - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = selectedHandles[i];
        selectedHandles[i] = selectedHandles[j];
        selectedHandles[j] = temp;
    }

    // Get all items in the playlist
    const playlistItems = plman.GetPlaylistItems(activePlaylistIndex);

    // Add shuffled tracks to the queue (append)
    for (let i = 0; i < selectedHandles.Count; i++) {
        const idx = playlistItems.Find(selectedHandles[i]);
        if (idx !== -1) {
            plman.AddPlaylistItemToPlaybackQueue(activePlaylistIndex, idx);
        }
    }
    // fb.ShowPopupMessage("Selected tracks appended to the queue in random order.");
}

// keyboard events
function on_key_down(vkey) {
    switch (vkey) {
        case 0x20: // VK_SPACEBAR
            fb.Pause();
            break;
        case VK_LEFT:
            plman.PlaybackOrder !== 3 ? fb.Prev() : fb.Next();
            break;
        case VK_RIGHT:
            fb.Next();
            break;
        case VK_UP:
            fb.VolumeUp();
            dbShow = true;
            window.SetTimeout(function() { dbShow = false; window.Repaint(); }, dbHideDelay);
            break;
        case VK_DOWN:
            fb.VolumeDown();
            dbShow = true;
            window.SetTimeout(function() { dbShow = false; window.Repaint(); }, dbHideDelay);
            break;
    }
}

// mouse events
function on_mouse_wheel(s) {
    if (!seekbar_hover) {
        volume.wheel(s);
        let easy_vol = vol2pos(fb.Volume);
            easy_vol += s / 20;
            fb.Volume = pos2vol(easy_vol);
        dbShow = true;
        window.SetTimeout(function() { dbShow = false; window.Repaint(); }, dbHideDelay);
    }
}

function on_mouse_move(x, y) {
    let isHoveringSeekbar;
    if (ppt.mode.enabled) {
        isHoveringSeekbar = (x >= seekbar.x && x <= seekbar.x + seekbar.w && y >= seekbar.y && y <= seekbar.y + seekbar.h);
    } else {
        const buffer = 1;
        isHoveringSeekbar = (x >= seekbar.x - buffer && x <= seekbar.x + seekbar.w + buffer && y >= waveformY - buffer && y <= waveformY + waveformH + buffer);
    }
    if (isHoveringSeekbar !== seekbar_hover) {
        seekbar_hover = isHoveringSeekbar;
        window.Repaint();
    }

    let isHoveringVolume = (x >= volume.x && x <= volume.x + volume.w && y >= volume.y && y <= volume.y + volume.h);
    if (isHoveringVolume !== volume_hover) {
        volume_hover = isHoveringVolume;
        window.Repaint();
    }

    if (!g_hot) {
        g_hot = true;
        window.SetCursor(IDC_HAND);
        window.Repaint();
    }
    if (buttons.move(x, y) || (ppt.rating.enabled && ratingHover && rating.move(x, y)) || seekbar.move(x, y) || volume.move(x, y)) return;
}

function on_mouse_leave() {
    if (g_hot) {
        g_hot = false;
        window.Repaint();
    }
    buttons.leave();
    rating.leave();
}

function on_mouse_lbtn_down(x, y) {
    seekbar.lbtn_down(x, y);
    volume.lbtn_down(x, y);
}

function on_mouse_lbtn_up(x, y) {
    if (
      [buttons, seekbar, rating, volume].some((el) => {
        if (el === rating) {
          return el.lbtn_up(x, y) && ratingHover;
        }
        return el.lbtn_up(x, y);
      })
    ) {
      return;
    }

    fb.RunMainMenuCommand('View/Show now playing in playlist');
    // search artist in library
    if (x < _scale(200) && x > _scale(12) && y < _scale(72) && y > _scale(12) && ppt.art.enabled && ww > scaler.s800) {
        fb.ShowLibrarySearchUI(tfo.artist.Eval());
    } return;
}

function on_mouse_lbtn_dblclk(x, y) {
    if (buttons.buttons.add_queue.trace(x, y)) {
        queueSelectedTracksRandomizedAppend(); // Add selected tracks to the queue in a random order (append to queue, do not flush)
        return true
    }
}

function on_mouse_mbtn_up(x, y) {
    // flush playback queue with middle click
    if (buttons.buttons.add_queue.trace(x, y)) {
        fb.RunMainMenuCommand("Flush playback queue");
        return true
    }
}

function on_mouse_rbtn_up(x, y) {
    if (buttons.buttons.stop.trace(x, y)) {
        fb.StopAfterCurrent = !fb.StopAfterCurrent;
        buttons.update();
        return true
    }
    // remove from queue
    if (buttons.buttons.add_queue.trace(x, y)) {
        let selected = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);

        if (selected.Count > 0) {
            let handle = selected[0]; // First selected item

            // Search for the index in the playback queue
            let queue = plman.GetPlaybackQueueHandles();
            for (let i = 0; i < queue.Count; i++) {
                if (queue[i].Compare(handle)) {
                    plman.RemoveItemFromPlaybackQueue(i);
                    break;
                }
            }
        }
        return true
    }

    if (buttons.buttons.search.trace(x, y)) {
        plman.SetActivePlaylistContext(); //activated the current playlist
        fb.RunMainMenuCommand('Edit/Search'); // search in current playlist
        return true
    }

    if (ppt.rating.enabled) {
        if (rating.trace(x, y)) return panel.rbtn_up(x, y, rating);
    }

    let menu = new _menu();

    const np_menu = menu.newMenu('Now playing', 'main', MF_STRING, {type: 'nowplaying'});

    menu.newEntry({entryText: 'sep'});

    const show_menu = menu.newMenu('Show...');
    menu.newEntry({menuName: show_menu, entryText: 'Album art', func: () => {ppt.art.toggle(); update_art(ppt); on_size(); window.Repaint(); if (spectrumPanel && ppt.art.enabled) fb.ShowPopupMessage('A Spectrum Analyzer panel is present.\nAlbum art hidden.', window.ScriptInfo.Name);}, flags: () => ppt.art.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: show_menu, entryText: 'Next track', func: () => {ppt.nxt.toggle(); window.Repaint();}, flags: () => ppt.nxt.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: show_menu, entryText: 'Rating', func: () => {ppt.rating.toggle(); window.Repaint();}, flags: () => ppt.rating.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: show_menu, entryText: 'Volume slider', func: () => {ppt.vol.toggle(); buttons.update(); window.Repaint();}, flags: () => ppt.vol.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: show_menu, entryText: 'dB permanent', func: () => {ppt.db.toggle(); window.Repaint();}, flags: () => ppt.db.enabled ? MF_CHECKED : MF_STRING});

    const sbar_menu = menu.newMenu('Bars');
    menu.newCheckMenu(sbar_menu, 'Normal', 'Waveform', () => ppt.mode.enabled ? 0 : 1);
    menu.newEntry({menuName: sbar_menu, entryText: 'Normal', func: () => {ppt.mode.enabled = true; on_size(); buttons.update(); window.Repaint();}});
    menu.newEntry({menuName: sbar_menu, entryText: 'Waveform', func: () => {ppt.mode.enabled = false; on_size(); buttons.update(); window.Repaint();}});
    menu.newEntry({menuName: sbar_menu, entryText: 'sep'});
    menu.newEntry({menuName: sbar_menu, entryText: 'Rounded bars', func: () => {ppt.roundBars.toggle(); window.Repaint();}, flags: () => ppt.roundBars.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: sbar_menu, entryText: 'Bar cores', func: () => {ppt.bar_mode.toggle(); window.Repaint();}, flags: () => ppt.bar_mode.enabled ? MF_CHECKED : MF_STRING});

    const but_menu = menu.newMenu('Buttons');
    const sub_but_2 = menu.newMenu('PBO Button', but_menu);
    menu.newCheckMenu(sub_but_2, 'List', 'Cycle', () => ppt.pboMode.enabled ? 0 : 1);
    menu.newEntry({menuName: sub_but_2, entryText: 'List', func: () => {ppt.pboMode.enabled = true; buttons.update();}});
    menu.newEntry({menuName: sub_but_2, entryText: 'Cycle', func: () => {ppt.pboMode.enabled = false; buttons.update();}});
    const sub_but_3 = menu.newMenu('Like Mode', but_menu);
    menu.newEntry({menuName: sub_but_3, entryText: 'FEEDBACK tag', func: () => {ppt.loveMode.value = 1; buttons.update();}, flags: () => ppt.loveMode.value === 1 ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: sub_but_3, entryText: 'last.fm sync', func: () => {ppt.loveMode.value = 2; buttons.update();}, flags: () => ppt.loveMode.value === 2 ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: sub_but_3, entryText: 'Dual mode', func: () => {ppt.loveMode.value = 3; buttons.update();}, flags: () => ppt.loveMode.value === 3 ? MF_CHECKED : MF_STRING});

    menu.newEntry({entryText: 'sep'});

    const tp_menu = menu.newMenu('Transparency');
    menu.newEntry({menuName: tp_menu, entryText: 'Panel transparency', flags: MF_GRAYED});
    menu.newEntry({menuName: tp_menu, entryText: 'sep'});
    menu.newEntry({menuName: tp_menu, entryText: 'Enable', func: () => {ppt.transparency.toggle(); window.Repaint(); refresh_wf_panel(js_wf_name); if (ppt.transparency.enabled) {let tp_readme; try { tp_readme = utils.ReadTextFile(fb.ProfilePath + 'poobar-scripts\\poobar\\readmes\\tp_readme.txt', 65001); } catch (e) { tp_readme = 'Transparency readme not found.\nAvoid without instructions, will cause glitches otherwise.' }; fb.ShowPopupMessage(tp_readme, 'Unified background & pseudotransparency'); tp_readme = null;} }, flags: () => ppt.transparency.enabled ? MF_CHECKED : MF_STRING});

    const tp_flag = ppt.transparency.enabled ? MF_GRAYED : MF_STRING
    const bg_menu = menu.newMenu('Background', 'main', tp_flag);
    menu.newEntry({menuName: bg_menu, entryText: 'Background Wallpaper:', flags: MF_GRAYED});
    menu.newEntry({menuName: bg_menu, entryText: 'sep'});
    menu.newEntry({menuName: bg_menu, entryText: 'Enable', func: () => {ppt.bgShow.toggle(); buttons.update(); update_art(ppt); window.Repaint(); refresh_wf_panel(js_wf_name);}, flags: () => ppt.bgShow.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: bg_menu, entryText: 'Blur', func: () => {ppt.bgBlur.toggle(); update_art(ppt); window.Repaint(); refresh_wf_panel(js_wf_name);}, flags: () => ppt.bgBlur.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: bg_menu, entryText: 'Shadow', func: () => {ppt.overlay.toggle(); window.Repaint(); refresh_wf_panel(js_wf_name);}, flags: () => ppt.overlay.enabled ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: bg_menu, entryText: 'sep'});
    menu.newCheckMenu(bg_menu, 'Playing album cover', 'Default', () => !ppt.bgMode.enabled ? 0 : 1);
    menu.newEntry({menuName: bg_menu, entryText: 'Playing album cover', func: () => {ppt.bgMode.enabled = false; update_art(ppt); window.Repaint(); refresh_wf_panel(js_wf_name);}});
    menu.newEntry({menuName: bg_menu, entryText: 'Default', func: () => {ppt.bgMode.enabled = true; if (!/\.(bmp|gif|jpe?g|png|tiff?|ico)$/i.test(ppt.bgPath.value)) window.ShowProperties(); update_art(ppt); window.Repaint(); refresh_wf_panel(js_wf_name);}});

    const col_menu = menu.newMenu('Colours');
    menu.newEntry({menuName: col_menu, entryText: 'System', func: () => {ppt.col_mode.value = 1; on_colours_changed(); window.Repaint(); refresh_wf_panel(js_wf_name);}, flags: () => ppt.col_mode.value === 1 ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: col_menu, entryText: 'Dynamic', func: () => {ppt.col_mode.value = 2; on_colours_changed(); window.Repaint(); refresh_wf_panel(js_wf_name);}, flags: () => ppt.col_mode.value === 2 ? MF_CHECKED : MF_STRING});
    menu.newEntry({menuName: col_menu, entryText: 'Custom', func: () => {ppt.col_mode.value = 3; on_colours_changed(); window.Repaint(); refresh_wf_panel(js_wf_name);}, flags: () => ppt.col_mode.value === 3 ? MF_CHECKED : MF_STRING});

    menu.newEntry({entryText: 'sep'});

    menu.newEntry({entryText: 'Open readme...', func: () => {let readme; try { readme = utils.ReadTextFile(fb.ProfilePath + 'poobar-scripts\\poobar\\readmes\\fcp_readme.txt', 65001); } catch (e) { readme = 'readme file not found' }; fb.ShowPopupMessage(readme, window.ScriptInfo.Name); readme = null;}});

    menu.newEntry({entryText: 'sep'});

    menu.newEntry({entryText: 'Panel Properties', func: () => {window.ShowProperties();}});
    menu.newEntry({entryText: 'Configure...', func: () => {window.ShowConfigureV2();}});

    return menu.btn_up(x, y);
}

'use strict';

window.DefineScript('Fluent Control Panel 0.9', {author:'eurekagliese', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\complete\\js\\seekbar.js');
include(fb.ComponentPath + 'samples\\complete\\js\\rating.js');
include(fb.ComponentPath + 'samples\\complete\\js\\volume.js');
include(fb.ComponentPath + 'samples\\poobar\\poo_helpers.js');
include(fb.ComponentPath + 'samples\\poobar\\poo_col_helper.js');

const scaler = {
    s600: _scale(450),
    s1080: _scale(810),
    s800:  _scale(600),
    s520:  _scale(390),
    s1200: _scale(900)
};

let g_hot = false;
let seekbar_hover = false;
let volume_hover = false;

let ww = 0;
let wh = 0;

let bx = 0;
let by = 0;
let cx = 0;
let cy = 0;

var nextTrackInfo = "No next track."; // Stores the text to display
var isPlaying = false; // To track playback state
const SF_CENTER = 0x00000001;
const SF_VCENTER = 0x00000004;
const SF_CENTER_VCENTER = SF_CENTER | SF_VCENTER;

let colours = {
    red : _RGB(255, 0, 0),
    love : _RGB(255, 0, 0),
    seekbar_background : _RGBA(128, 128, 128, 128),
    rating_bg : _RGBA(128, 128, 128, 224)
};

let ppt = {
    // show/hide
    art : new _p('_DISPLAY: Show Cover Art', true),
    vol : new _p('_DISPLAY: Show Volume', true),
    nxt : new _p('_DISPLAY: Show Next Track', true),
    rating : new _p('_DISPLAY: Show Rating', true),
    // colors
    rate : new _p('_PROPERTY: Rating Color', _RGB(255, 200, 0)),
    col_mode : new _p('_PROPERTY: Color Mode (1,2,3)', 1),
    // modes
    mode: new _p('_DISPLAY: Seekbar Mode', true),
    loveMode : new _p('_PROPERTY: Love Mode', false),
    pboMode : new _p('_PROPERTY: Playback Order Button Mode', false),
    roundBars : new _p('_DISPLAY: Show Rounded Bars', true),
    // background
    bgShow : new _p('_DISPLAY: Show Wallpaper', true),
    bgBlur : new _p('_DISPLAY: Wallpaper Blurred', false),
    bgMode : new _p('_DISPLAY: Wallpaper Mode', false),
    bgPath : new _p('_PROPERTY: Default Wallpaper Path', ".\\user-components\\foo_uie_jsplitter\\samples\\js-smooth\\images\\default.png"),
};

let tfo = {
    artist : fb.TitleFormat('%artist%'),
    title : fb.TitleFormat('%title%'),
    playback_time : fb.TitleFormat('%playback_time%  '),
    length : fb.TitleFormat('  %length%'),
    lov: fb.TitleFormat('$if2(%loved%,0)'),
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
    rating_on : '\ue735',
    rating_off : '\ue734',
    eject : '\uf847',
    //
	repeat_all : '\ue8ee',
	repeat_one : '\ue8ed',
	repeat_off : '\uf5e7',
	shuffle : '\ue8b1',
	shuffle : '\ue8b1',
	random : '\ue9ce',
	album : '\ue93c',
	folder : '\ued25',
};
//////////////////////////////////////////////////////////////

let panel = new _panel();

let seekbar = new _seekbar(0, 0, 0, 0);
let buttons = new _buttons();
let rating = new _rating(0, 0, 14, 0); // x, y, size, colour
let volume = new _volume(0, 0, 100, 40);
let isLoved = '';

const bs = _scale(32);

// playback order
const pbo_chars = [chara.repeat_off, chara.repeat_all, chara.repeat_one, chara.random, chara.shuffle, chara.album, chara.folder];
const pbo_names = ['Default', 'Repeat (playlist)', 'Repeat (track)', 'Random', 'Shuffle (tracks)', 'Shuffle (albums)', 'Shuffle (folders)'];

get_colours(ppt.col_mode.value);
panel.item_focus_change();
update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value, ppt.art.enabled);

updateNextTrackInfo(); // Initial update

buttons.update = () => {
    const x = ((panel.w - (bs * 7)) / 2);
    const y = ppt.mode.enabled ? seekbar.y - _scale(36) : _scale(4);
    let pbo = plman.PlaybackOrder;

    let fluent_font = (panel.w < scaler.s1080 && !ppt.mode.enabled) ? gdi.Font('Segoe Fluent Icons', 38) : gdi.Font('Segoe Fluent Icons', 48);
    let fluent_font_hover = (panel.w < scaler.s1080 && !ppt.mode.enabled) ? gdi.Font('Segoe Fluent Icons', 44) : gdi.Font('Segoe Fluent Icons', 54);

    if (ppt.loveMode.enabled) {
        let lv = tfo.lov.Eval();
        buttons.buttons.love = new _button(x, y, bs, bs, {
            normal : lv == 1 ? _chrToImg(chara.heart_on, colours.love, fluent_font) : _chrToImg(chara.heart_off, g_textcolour, fluent_font),
            hover : lv == 1 ? _chrToImg(chara.heart_break, colours.red, fluent_font_hover) : _chrToImg(chara.heart_on, colours.love, fluent_font_hover)}, () => {
            let selected_items = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
            if (selected_items && selected_items.Count !== 0) {
                let tags = {};
                tags['LOVED'] = isLoved ? '' : '1';
                selected_items.UpdateFileInfoFromJSON(JSON.stringify(tags));
                isLoved = !isLoved;
            }
         }, '');
    } else {
    	let fav = tfo.lfm_loved.Eval();
    	buttons.buttons.love = new _button(x, y, bs, bs, {
    	normal : fav == 0 ? _chrToImg(chara.heart_off, g_textcolour, fluent_font) : _chrToImg(chara.heart_on, colours.love, fluent_font),
    	hover : fav == 0 ? _chrToImg(chara.heart_on, colours.red, fluent_font_hover) : _chrToImg(chara.heart_break, colours.love, fluent_font_hover)}, () => {
    		let selected_items = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
    		if (selected_items && selected_items.Count !== 0) {
    		fb.RunContextCommandWithMetadb("Last.fm Playcount Sync/" + (fav == 1 ? "Unlove" : "Love"), selected_items);
    		}
    	 }, '');
    }

    buttons.buttons.stop = new _button(x + bs, y, bs, bs, {normal : fb.StopAfterCurrent ? _chrToImg(chara.stop, colours.red, fluent_font) : _chrToImg(chara.stop, g_textcolour, fluent_font), hover : _chrToImg(chara.stop, g_textcolour_hl, fluent_font_hover)}, () => { fb.Stop(); }, '');
    buttons.buttons.previous = new _button(x + (bs * 2), y, bs, bs, {normal : _chrToImg(chara.prev, g_textcolour, fluent_font), hover : _chrToImg(chara.prev, g_textcolour_hl, fluent_font_hover)}, () => { fb.Prev(); }, '');
    buttons.buttons.play = new _button( x + (bs * 3), y, bs, bs, {normal : !fb.IsPlaying || fb.IsPaused ? _chrToImg(chara.play, g_textcolour, fluent_font) : _chrToImg(chara.pause, g_textcolour, fluent_font), hover : !fb.IsPlaying || fb.IsPaused ? _chrToImg(chara.play, g_textcolour_hl, fluent_font_hover) : _chrToImg(chara.pause, g_textcolour_hl, fluent_font_hover)}, () => { fb.PlayOrPause(); }, !fb.IsPlaying || fb.IsPaused ? '' : '');
    buttons.buttons.next = new _button(x + (bs * 4), y, bs, bs, {normal : _chrToImg(chara.next, g_textcolour, fluent_font), hover : _chrToImg(chara.next, g_textcolour_hl, fluent_font_hover)}, () => { fb.Next(); }, '');
	if (ppt.pboMode.enabled) {
	    buttons.buttons.pbo = new _button(x + (bs * 5), y, bs, bs, {normal: _chrToImg(pbo_chars[pbo], g_textcolour, fluent_font), hover: _chrToImg(pbo_chars[pbo], g_textcolour_hl, fluent_font_hover) }, () => { _pbo(x + (bs * 3.41), y); }, '');
	} else {
	    buttons.buttons.pbo = new _button(x + (bs * 5), y, bs, bs, {normal: _chrToImg(pbo_chars[pbo], g_textcolour, fluent_font), hover: _chrToImg(pbo_chars[pbo], g_textcolour_hl, fluent_font_hover) }, () => { 	plman.PlaybackOrder = (pbo >= pbo_chars.length - 1) ? 0 : pbo + 1; }, 'Playback Order: ' + pbo_names[pbo]);
	}

    buttons.buttons.add_queue = new _button(bx + (bs * 6), y, bs, bs, {normal : _chrToImg(chara.add_queue, g_textcolour, fluent_font), hover : _chrToImg(chara.add_queue, g_textcolour_hl, fluent_font_hover)}, () => {
        let selected_items = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
        if (selected_items && selected_items.Count !== 0) {
            fb.RunContextCommandWithMetadb("Add to playback queue", selected_items);
        }
    }, '');

    const xx = (panel.w > scaler.s800) ? (panel.w - (bs * 2)) : (panel.w - bs);
    const yy = Math.round((panel.h - bs) / 2);
    // right section offsets
    const rOff_1 = (panel.w > scaler.s800) ? 0 : -0.9;
    const rOff_2 = (panel.w > scaler.s800) ? 0 : -1.4;
    const rOff_3 = (panel.w > scaler.s800) ? 0 : -0.4;
    const rOff_4 = (panel.w > scaler.s800) ? 0 : -0.6;
    const rOff_5 = (panel.w > scaler.s800) ? 0 : -1.9;
    const rY = (panel.w > scaler.s520) ? yy : yy + _scale(36);
    const vol_x = (ppt.vol.enabled) ? xx - (bs * (2.9 + rOff_4)) : xx - (bs * (3.9 + rOff_5));
    const vol_y = (ppt.vol.enabled) ? volume.y - _scale(14) : rY + 1;

    buttons.buttons.volume = new _button(vol_x, vol_y, bs, bs, {normal : fb.Volume === -100 ? _chrToImg(chara.vol0, g_textcolour, fluent_font) : fb.Volume > -4 ? _chrToImg(chara.vol3, g_textcolour, fluent_font) : fb.Volume > -15 ? _chrToImg(chara.vol2, g_textcolour, fluent_font) : fb.Volume > -30 ? _chrToImg(chara.vol1, g_textcolour, fluent_font) : _chrToImg(chara.vol0, g_textcolour, fluent_font), hover : _chrToImg(chara.volume, g_textcolour_hl, fluent_font_hover)}, () => { fb.VolumeMute(); }, '');
    buttons.buttons.upd = new _button (xx - (bs * (3 + rOff_2)), rY + 2, bs, bs, {normal: _chrToImg(chara.eject, g_textcolour, fluent_font),  hover : _chrToImg(chara.eject, g_textcolour_hl, fluent_font_hover)}, () => { switchOutputDevice(xx - (bs * (3 + rOff_2)), rY) }, '');
    buttons.buttons.search = new _button(xx - (bs * (2 + rOff_1)), rY, bs, bs, {normal : _chrToImg(chara.search, g_textcolour, fluent_font), hover : _chrToImg(chara.search, g_textcolour_hl, fluent_font_hover)}, () => { fb.RunMainMenuCommand('Library/Search'); }, '');
    buttons.buttons.consol = new _button(xx -  (bs * (1 + rOff_3)), rY, bs, bs, {normal : _chrToImg(chara.consol, g_textcolour, fluent_font), hover : _chrToImg(chara.consol, g_textcolour_hl, fluent_font_hover)}, () => { fb.ShowConsole(); }, '');
    buttons.buttons.settings = new _button(xx, rY, bs, bs, {normal : _chrToImg(chara.settings, g_textcolour, fluent_font), hover : _chrToImg(chara.settings, g_textcolour_hl, fluent_font_hover)}, () => { fb.ShowPreferences(); }, '');
}

function on_size() {
    panel.size();

    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;
    console.log(ww);

    bx = ((panel.w - (bs * 7)) / 2);
    by = seekbar.y - _scale(36);

    cx = (panel.w - (bs * 2));
    cy = Math.round((panel.h - bs) / 2);

    if (panel.w >= scaler.s1200) {
        seekbar.x = Math.round(panel.w * 0.22);
    } else if (panel.w <= scaler.s520) {
        seekbar.x = Math.round(panel.w * 0.18);
    } else if (panel.w > scaler.s520 && panel.w < scaler.s1200) {
        seekbar.x = Math.round(panel.w * 0.3);
    }
    seekbar.w = panel.w - seekbar.x * 2;
    seekbar.h = _scale(14);
    seekbar.y = panel.h * 0.6;

    let waveformPanel;
    try {
        waveformPanel = window.GetPanel('Waveform minibar (mod)');
    } catch (e) {
        waveformPanel = null;
    }
    if (ppt.mode.enabled) {
        rating.x = bx - (bs * 3);
        rating.y = seekbar.y - _scale(24);

        if (waveformPanel) {
            waveformPanel.Hidden = true;
        }
    } else {
        rating.x = ppt.art.enabled && ww > scaler.s800 ? panel.h + 10 : _scale(12);
        rating.y = panel.h - _scale(25);

        const waveformH = _scale(32);
        const waveformY = panel.h * 0.45;
        if (waveformPanel) {
            waveformPanel.Move(seekbar.x - _scale(40), waveformY, seekbar.w + _scale(80), waveformH, true);
            waveformPanel.SupportPseudoTransparency = true;
            waveformPanel.ShowCaption = false;
            waveformPanel.Hidden = false;
            waveformPanel.Locked = true;
        }
    }

    volume.x = (panel.w > scaler.s800) ? panel.w - (bs * 4) : panel.w - (bs * 2.5);
    volume.y = (panel.w > scaler.s520) ? seekbar.y + _scale(12) :  seekbar.y + _scale(36);
    volume.h =  _scale(4);
    volume.w = _scale(74);

    buttons.update();
}

function on_paint(gr) {
    if (ppt.bgShow.enabled && bg_img) {
        _drawImage(gr, bg_img, 0, 0, panel.w, panel.h, image.crop);
        const overlayColor = window.IsDark ? _RGBA(0, 0, 0, 128) : _RGBA(255, 255, 255, 128);
        gr.FillSolidRect(0, 0, panel.w, panel.h, overlayColor);
    } else if (!ppt.bgShow.enabled) {
        gr.FillSolidRect(0, 0, panel.w, panel.h, g_backcolour);
    }

    buttons.paint(gr);

    let bar_h = _scale(4);
    let radius = bar_h / 2;
    //seekbar_bg
    if (ppt.mode.enabled) {
        if (ppt.roundBars.enabled) {
            gr.FillRoundRect(seekbar.x, seekbar.y + bar_h, seekbar.w + _scale(6), bar_h, radius, radius, colours.seekbar_background);
        } else {
            gr.FillSolidRect(seekbar.x, seekbar.y + bar_h, seekbar.w + _scale(6), bar_h, colours.seekbar_background);
        }
    }
    // test for playback time repaint
    // gr.FillSolidRect(bx - (bs * 4), _scale(12), _scale(72), _scale(18), colours.red);

    if (fb.IsPlaying) {
        if ((!ppt.mode.enabled && ppt.rating.enabled && ww > scaler.s600) || (ppt.mode.enabled && ppt.rating.enabled && ww > scaler.s1200)) {
            rating.paint(gr);
        }

        if (ppt.art.enabled && g_img && ww > scaler.s800) {
            _drawImage(gr, g_img, 0, 0, panel.h, panel.h, image.crop_top);
        }

        // Track information
        if (ppt.mode.enabled && panel.w > scaler.s600) {
    		gr.GdiDrawText(tfo.title.Eval(), panel.fonts.title, g_textcolour, (ppt.art.enabled && ww > scaler.s800) ? panel.h + 10 : _scale(12), cy + _scale(4), (ppt.art.enabled && ww > scaler.s800) ? panel.w /5 : panel.w /4, 0, LEFT);
    		gr.GdiDrawText(tfo.artist.Eval(), panel.fonts.normal, g_textcolour,  (ppt.art.enabled && ww > scaler.s800) ? panel.h + 10 : _scale(12), cy + _scale(28), (ppt.art.enabled && ww > scaler.s800) ? panel.w /9 : seekbar.x - panel.h - _scale(4), 0, LEFT);
        } else if (panel.w > scaler.s600) {
            gr.GdiDrawText(tfo.title.Eval(), panel.fonts.title, g_textcolour, (ppt.art.enabled && ww > scaler.s800) ? panel.h + 10 : _scale(12), _scale(11), (ppt.art.enabled && ww > scaler.s800) ? panel.w / 4.7 : panel.w /4, _scale(18), LEFT);
            gr.GdiDrawText(tfo.artist.Eval(), panel.fonts.normal, g_textcolour,  (ppt.art.enabled && ww > scaler.s800) ? panel.h + 10 : _scale(12), Math.round((panel.h - _scale(18)) / 2), (ppt.art.enabled && ww > scaler.s800) ? panel.w * 0.13 : panel.w * 0.23, _scale(18), LEFT);
        }

        // Draw the next track information
        var queueHandles = plman.GetPlaybackQueueHandles();
        if (((plman.PlaybackOrder === 0 || plman.PlaybackOrder === 1) && ppt.nxt.enabled) || queueHandles.Count > 0) {
            const text_w = panel.w / 2;
            const text_x = (panel.w - text_w) / 2;
            if (ppt.mode.enabled && panel.w >= scaler.s600) {
                gr.GdiDrawText(nextTrackInfo, panel.fonts.normal, g_textcolour, text_x, seekbar.y + _scale(16), text_w, _scale(18), SF_CENTER_VCENTER | DT_END_ELLIPSIS);
                //gr.DrawRect(text_x, seekbar.y + 18, text_w, _scale(18), 1, colours.red); //debugging border
            } else if (panel.w >= scaler.s600) {
                if (panel.w < scaler.s1080) {
                    gr.GdiDrawText(nextTrackInfo, panel.fonts.normal, g_textcolour, text_x, seekbar.y + _scale(18), text_w, _scale(18), SF_CENTER_VCENTER | DT_END_ELLIPSIS);
                } else {
                    gr.GdiDrawText(nextTrackInfo, panel.fonts.normal, g_textcolour, (panel.w / 5) * 3.2, _scale(10), panel.w / 3.5, _scale(18), LEFT);
                }
            }
        }

        gr.SetSmoothingMode(2);
        // seekbar
        if (fb.PlaybackLength > 0) {
            const pos = seekbar.pos();
            if (ppt.mode.enabled) {
                //progress_bar
                let barColor = getBarColor(seekbar_hover);
                if (ppt.roundBars.enabled) {
                    if (pos >= bar_h) {
                        gr.FillRoundRect(seekbar.x, seekbar.y + _scale(4), pos, bar_h, radius, radius, barColor);
                    }
                } else {
                    gr.FillSolidRect(seekbar.x, seekbar.y + _scale(4), pos, _scale(4), barColor);
                }

                gr.FillEllipse(seekbar.x + pos - 4, seekbar.y, _scale(12), _scale(12), g_textcolour); //knob
    			gr.GdiDrawText(tfo.playback_time.Eval(), panel.fonts.normal, g_textcolour, seekbar.x - _scale(45), seekbar.y + _scale(5), _scale(45), 0, RIGHT);
    			gr.GdiDrawText(tfo.length.Eval(), panel.fonts.normal, g_textcolour, seekbar.x + seekbar.w + _scale(6), seekbar.y + _scale(5), _scale(45), 0, LEFT);
            } else {
                // playback time and length
                if (panel.w >= scaler.s1080) {
                    gr.GdiDrawText(tfo.playback_time.Eval(), panel.fonts.title, g_textcolour, bx - (bs * 4), _scale(20), _scale(72), 0, RIGHT);
                    gr.GdiDrawText("/" + tfo.length.Eval(), panel.fonts.normal, g_textcolour, bx - (bs * 1.7), _scale(20), _scale(72), 0, LEFT);
                } else {
                    gr.GdiDrawText(tfo.playback_time.Eval(), panel.fonts.title, g_textcolour, (panel.w / 4) - _scale(17), seekbar.y - _scale(33), panel.w / 2, _scale(18), SF_CENTER_VCENTER);
                    gr.GdiDrawText("/" + tfo.length.Eval(), panel.fonts.title, g_textcolour, (panel.w / 4) + _scale(15), seekbar.y - _scale(33), panel.w / 2, _scale(18), SF_CENTER_VCENTER);
                }
            }
        }

        if (ppt.vol.enabled) {
            let vol_pos = volume.pos();
            let barColor = getBarColor(volume_hover);
            let volumeWidth = panel.w > scaler.s800 ? volume.w : volume.w.value * 0.8;

            if (ppt.roundBars.enabled && ww > scaler.s800) { // s800 check cause of unfound stripe bug likely related to volume icon
                let vol_radius = volume.h / 2;
                gr.FillRoundRect(volume.x, volume.y, volumeWidth, volume.h, vol_radius, vol_radius, colours.seekbar_background);
                if (vol_pos >= volume.h) gr.FillRoundRect(volume.x, volume.y, vol_pos, volume.h, vol_radius, vol_radius, barColor); // Draw the filled volume bar with rounded corners if wide enough
            } else {
                gr.FillSolidRect(volume.x, volume.y, volumeWidth, volume.h, colours.seekbar_background);
                gr.FillSolidRect(volume.x, volume.y, vol_pos, volume.h, barColor);
            }
            var dbFont = gdi.Font(panel.fonts.normal.Name, 12);
            if (panel.w > scaler.s800 && volume_hover) gr.GdiDrawText(fb.Volume.toFixed(2) + ' dB', dbFont, g_textcolour, _scale(8), volume.y + _scale(2), volume.x + _scale(106), 0, RIGHT);
        }
    }
}

function getBarColor(isHover) {
    return isHover ? g_textcolour_hl : g_textcolour;
}

rating.paint = (gr) => {
    if (panel.metadb) {
        gr.SetTextRenderingHint(4);
        for (let i = 0; i < rating.get_max(); i++) {
            if (i + 1 > (rating.hover ? rating.hrating : rating.rating)) {
                gr.DrawString(chars.rating_off, rating.font, colours.rating_bg, rating.x + (i * rating.h), rating.y, rating.h, rating.h, SF_CENTRE);
            } else {
                gr.DrawString(chars.rating_on, rating.font, ppt.rate.value, rating.x + (i * rating.h), rating.y, rating.h, rating.h, SF_CENTRE);
            }
        }
    }
}

function on_metadb_changed() {
    rating.metadb_changed();
}

function on_playback_new_track() {
    get_colours(ppt.col_mode.value);
    updateNextTrackInfo(); // When a new track starts, the "next" track might change.
    update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value, ppt.art.enabled);
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

// mouse events
function on_mouse_wheel(s) {
    volume.wheel(s);
    let easy_vol = vol2pos(fb.Volume);
        easy_vol += s / 20;
        fb.Volume = pos2vol(easy_vol);
}

function on_mouse_move(x, y) {
    let isHoveringSeekbar = (x >= seekbar.x && x <= seekbar.x + seekbar.w && y >= seekbar.y && y <= seekbar.y + seekbar.h);
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
    if (buttons.move(x, y) || (ppt.rating.enabled && rating.move(x, y)) || seekbar.move(x, y) || volume.move(x, y)) return;
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
    if ([buttons, seekbar, rating, volume].some(el => el.lbtn_up(x, y))) {
        return;
    }

    fb.RunMainMenuCommand('View/Show now playing in playlist');
    // search artist in library
    if (x < _scale(200) && x > _scale(12) && y < _scale(72) && y > _scale(12) && ppt.art.enabled && ww > scaler.s800) {
        fb.ShowLibrarySearchUI(tfo.artist.Eval())
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

    // menu
    let m = window.CreatePopupMenu();
    let s = window.CreatePopupMenu();
    let c = fb.CreateContextMenuManager();

    let _menu1 = window.CreatePopupMenu(); // Modes menu
    let _submenu1 = window.CreatePopupMenu(); // Seekbar Mode menu
    let _submenu11 = window.CreatePopupMenu(); // PBO Button Mode menu
    let _submenu12 = window.CreatePopupMenu(); // // Love Mode menu
    let _menu2 = window.CreatePopupMenu(); // Show... menu
    let _menu3 = window.CreatePopupMenu(); // Background Wallpaper menu
    let _submenu4 = window.CreatePopupMenu(); // Background Colours
    let _menu4 = window.CreatePopupMenu(); // Colours menu

    if (fb.IsPlaying) {
        c.InitNowPlaying();
        c.BuildMenu(s, 1);
        s.AppendTo(m, MF_STRING, 'Now playing');
        m.AppendMenuSeparator();
    }

    // Modes menu
    _submenu1.AppendMenuItem(MF_STRING, 110, 'Normal');
    _submenu1.AppendMenuItem(MF_STRING, 111, 'Waveform');
    _submenu1.CheckMenuRadioItem(110, 111, ppt.mode.enabled ? 110 : 111);
    _submenu1.AppendTo(_menu1, MF_STRING, 'Seekbar');
    
    _submenu11.AppendMenuItem(MF_STRING, 112, 'List');
    _submenu11.AppendMenuItem(MF_STRING, 113, 'Cycle');
    _submenu11.CheckMenuRadioItem(112, 113, ppt.pboMode.enabled ? 112 : 113);
    _submenu11.AppendTo(_menu1, MF_STRING, 'PBO Button');
    
    _submenu12.AppendMenuItem(MF_STRING, 114, 'last.fm sync');
    _submenu12.AppendMenuItem(MF_STRING, 115, 'LOVED tag');
    _submenu12.CheckMenuRadioItem(114, 115, ppt.loveMode.enabled ? 115 : 114);
    _submenu12.AppendTo(_menu1, MF_STRING, 'Love Mode');
    
    _menu1.AppendTo(m, MF_STRING, 'Modes');

    _menu2.AppendMenuItem(MF_STRING, 210, 'Album art');
    _menu2.CheckMenuItem(210, ppt.art.enabled);
    _menu2.AppendMenuItem(MF_STRING, 211, 'Volume slider');
    _menu2.CheckMenuItem(211, ppt.vol.enabled);
    _menu2.AppendMenuItem(MF_STRING, 212, 'Rating');
    _menu2.CheckMenuItem(212, ppt.rating.enabled);
    _menu2.AppendMenuItem(MF_STRING, 213, 'Rounded bars');
    _menu2.CheckMenuItem(213, ppt.roundBars.enabled);
    _menu2.AppendMenuItem(MF_STRING, 214, 'Next track');
    _menu2.CheckMenuItem(214, ppt.nxt.enabled);
    _menu2.AppendTo(m, MF_STRING, 'Show...');

    m.AppendMenuSeparator();

    _menu3.AppendMenuItem(MF_STRING, 310, 'Enable');
    _menu3.CheckMenuItem(310, ppt.bgShow.enabled);
    _menu3.AppendMenuItem(MF_STRING, 311, 'Blur');
    _menu3.CheckMenuItem(311, ppt.bgBlur.enabled);
    _menu3.AppendMenuSeparator();
    _menu3.AppendMenuItem(MF_STRING, 312, 'Playing Album Cover');
    _menu3.AppendMenuItem(MF_STRING, 313, 'Default');
    _menu3.CheckMenuRadioItem(312, 313, ppt.bgMode.enabled ? 313 : 312);
    _menu3.AppendTo(m, MF_STRING, 'Background Wallpaper');

    _submenu4.AppendMenuItem(MF_STRING, 410, 'System');
    _submenu4.AppendMenuItem(MF_STRING, 411, 'Dynamic');
    _submenu4.AppendMenuItem(MF_STRING, 412, 'Custom');
    _submenu4.CheckMenuRadioItem(410, 412, Math.min(Math.max(410 + ppt.col_mode.value - 1, 410), 412));
    _submenu4.AppendTo(_menu4, MF_STRING, 'Colors');
    _menu4.AppendMenuItem(MF_STRING, 413, 'Rating');
    _menu4.AppendTo(m, MF_STRING, 'Colours');

    m.AppendMenuSeparator();

    m.AppendMenuItem(MF_STRING, 999, 'Panel Properties');
    m.AppendMenuItem(MF_STRING, 1000, 'Configure...');

    const idx = m.TrackPopupMenu(x, y);
    switch (idx) {
    case 0:
        break;
    case 110:
    case 111:
        ppt.mode.toggle();
        on_size();
        buttons.update();
        window.Repaint();
        break;
    case 112:
    case 113:
        ppt.pboMode.toggle();
        buttons.update();
        break;
    case 114:
    case 115:
        ppt.loveMode.toggle();
        buttons.update();
        break;
    case 210:
        ppt.art.toggle();
        update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value, ppt.art.enabled);
        on_size();
        window.Repaint();
        break;
    case 211:
        ppt.vol.toggle();
        buttons.update();
        window.Repaint();
        break;
    case 212:
        ppt.rating.toggle();
        window.Repaint();
        break;
    case 213:
        ppt.roundBars.toggle();
        window.Repaint();
        break;
    case 214:
        ppt.nxt.toggle();
        window.Repaint();
        break;
    case 310:
        ppt.bgShow.toggle();
        ppt.col_mode.value = 1;
        get_colours(ppt.col_mode.value);
        buttons.update();
		update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value, ppt.art.enabled);
        window.Repaint();
        break;
    case 311:
        ppt.bgBlur.toggle();
        update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value, ppt.art.enabled);
        window.Repaint();
        break;
    case 312:
    case 313:
        ppt.bgMode.toggle();
        update_album_art(ppt.bgShow.enabled, ppt.bgMode.enabled, ppt.bgBlur.enabled, ppt.bgPath.value, ppt.art.enabled);
        window.Repaint();
        break;
    case 410:
        ppt.bgShow.enabled = false;
        ppt.col_mode.value = 1;
        on_colours_changed();
        window.Repaint();
        break;
    case 411:
        ppt.bgShow.enabled = false;
        ppt.col_mode.value = 2;
        on_colours_changed();
        window.Repaint();
        break;
    case 412:
        ppt.bgShow.enabled = false;
        ppt.col_mode.value = 3;
        on_colours_changed();
        window.ShowProperties();
        window.Repaint();
        break;
    case 413:
        ppt.rate.value = utils.ColourPicker(window.ID, ppt.rate.value);
        get_colours(ppt.col_mode.value);
        buttons.update();
        window.Repaint();
        break;
    case 999:
        window.ShowProperties();
        break;
    case 1000:
        window.ShowConfigureV2();
        break;
    default:
        c.ExecuteByID(idx - 1);
        break;
    }
    return true;
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
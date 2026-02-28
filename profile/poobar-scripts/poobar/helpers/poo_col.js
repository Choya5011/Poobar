/**
 * Color related functions
 */

/**
 * JSP3 Helpers by marc 2003
 * Slight modification done to GetNowPlayingColours
 */

function getRed(colour) {
	return ((colour >> 16) & 0xff);
}

function getGreen(colour) {
	return ((colour >> 8) & 0xff);
}

function getBlue(colour) {
	return (colour & 0xff);
}

function RGB(r, g, b) {
	return (0xff000000 | (r << 16) | (g << 8) | (b));
}

function setAlpha(colour, a) {
	return ((colour & 0x00ffffff) | (a << 24));
}

// Lunminance and DetermineTextColour are based on code from the foobar2000 SDK.
function Luminance(colour) {
	var r = getRed(colour);
	var g = getGreen(colour)
	var b = getBlue(colour);
	return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0;
}

function DetermineTextColour(background) {
	if (Luminance(background) > 0.6) {
		return RGB(0, 0, 0);
	}
	return RGB(255, 255, 255);
}

function GetNowPlayingColours() {
 	const metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();

 	if (metadb) {
 		var img = utils.GetAlbumArtV2(metadb, 0, false); // 3rd arg is want_stub - we don't
 		if (img) {
 			var extracted_colours = img.GetColourScheme(10).map(function (item) {
                return {
                    colour: item,
                    luminance: Luminance(item),
                };
            });

            img = null;

            let background_colour = extracted_colours[0].colour;
 			// Find least gray/white/black color
            for (let item of extracted_colours) {
              let rgba = intToRGBA(item.colour);
              if (!isGrayWhiteBlack(rgba)) {
                background_colour = item.colour;
                break; // stop at first non-gray color found
              }
            }

 			var text_colour = DetermineTextColour(background_colour);

 			// extreme edge case where image is solid :/
 			if (extracted_colours.length == 1) {
 				// invert
 				var selected_background_colour = text_colour;
 				var selected_text_colour = background_colour;
 			} else {
 				var l = extracted_colours[0].luminance;
 				extracted_colours.pop();

 				var diff = 0;
 				var idx = 0;
 				extracted_colours.forEach(function (item, i) {
 					var tmp = Math.abs(l - item.luminance);
 					if (tmp > diff) {
 						diff = tmp;
 						idx = i;
 					}
 				});

 				var selected_background_colour = extracted_colours[idx].colour;
 				var selected_text_colour = DetermineTextColour(selected_background_colour);
 			}
 			return [background_colour, text_colour, selected_background_colour, selected_text_colour];
 		}
 	}
 	return [window.GetColourCUI(ColourTypeCUI.background), window.GetColourCUI(ColourTypeCUI.text), window.GetColourCUI(ColourTypeCUI.inactive_selection_background), window.GetColourCUI(ColourTypeCUI.selection_text)];
}
////////////////////////////////////////////////////////////////////////////

function intToRGBA(colour) {
  return [
    getRed(colour),
    getGreen(colour),
    getBlue(colour),
    (colour >>> 24) & 0xff  // extract alpha (unsigned)
  ];
}

function isGrayWhiteBlack([r, g, b, a], threshold = 8) {
    if (
        Math.abs(r - g) < threshold &&
        Math.abs(r - b) < threshold &&
        Math.abs(g - b) < threshold
    ) {
        if (r > 245 && g > 245 && b > 245) return true; // White
        if (r < 10 && g < 10 && b < 10) return true;    // Black
        return true; // Gray
    }
    return false;
}

/**
 * Colours
 */
const ColourTypeCUI = {
    text: 0,
    selection_text: 1,
    inactive_selection_text: 2,
    background: 3,
    selection_background: 4,
    inactive_selection_background: 5,
    active_item_frame: 6
};

const ColourTypeDUI = {
    text: 0,
    background: 1,
    highlight: 2,
    selection: 3
};

let g_is_default_ui = window.InstanceType;
let g_textcolour = 0;
let g_textcolour_hl = 0;
let g_backcolour = 0;
let g_color_selected_bg = 0;
let g_color_highlight = 0;

function get_colours(col_mode, flag) {
    let arr;
    let nowPlayingColours = [];
    if (col_mode === 2) nowPlayingColours = GetNowPlayingColours();

    if (col_mode === 3) {
        arr = window.GetProperty("CUSTOM COLOR TEXT NORMAL", "180-180-180").split("-");
        g_textcolour = RGB(arr[0], arr[1], arr[2]);
        arr = window.GetProperty("CUSTOM COLOR TEXT HIGHLIGHT", "000-000-000").split("-");
        g_textcolour_hl = RGB(arr[0], arr[1], arr[2]);
        arr = window.GetProperty("CUSTOM COLOR BACKGROUND NORMAL", "025-025-035").split("-");
        g_backcolour = RGB(arr[0], arr[1], arr[2]);
        if (flag) {
            arr = window.GetProperty("CUSTOM COLOR BACKGROUND SELECTED", "015-177-255").split("-");
            g_color_selected_bg = setAlpha(RGB(arr[0], arr[1], arr[2]), 144);
            arr = window.GetProperty("CUSTOM COLOR HIGHLIGHT", "255-175-050").split("-");
            g_color_highlight = RGB(arr[0], arr[1], arr[2]);
        }
    }

    if (g_is_default_ui && col_mode !== 3) {
        if (col_mode === 1) {
            g_textcolour = window.GetColourDUI(ColourTypeDUI.text);
            g_textcolour_hl = window.GetColourDUI(ColourTypeDUI.highlight);
            g_backcolour = window.GetColourDUI(ColourTypeDUI.background);
            g_color_selected_bg = setAlpha(window.GetColourDUI(ColourTypeDUI.selection), 184);
            //g_color_selected_bg = window.GetColourDUI(ColourTypeDUI.selection);
            g_color_highlight = setAlpha(window.GetColourDUI(ColourTypeDUI.highlight), 144);
        } else if (col_mode === 2) {
            g_textcolour = nowPlayingColours[1];
            g_textcolour_hl = nowPlayingColours[3];
            g_backcolour = nowPlayingColours[0];
            g_color_selected_bg = setAlpha(nowPlayingColours[2], 144);
            g_color_highlight = setAlpha(nowPlayingColours[2], 200);
            //g_color_highlight = nowPlayingColours[2];
        }
    } else { // CUI
        if (col_mode === 1) {
            g_textcolour = window.GetColourCUI(ColourTypeCUI.text);
            g_textcolour_hl = window.GetColourCUI(ColourTypeCUI.selection_text);
            g_backcolour = window.GetColourCUI(ColourTypeCUI.background);
            g_color_selected_bg = setAlpha(window.GetColourCUI(ColourTypeCUI.inactive_selection_background), 184);
            //g_color_selected_bg = window.GetColourCUI(ColourTypeCUI.inactive_selection_background);
            g_color_highlight = setAlpha(window.GetColourCUI(ColourTypeCUI.selection_background), 144);
        } else if (col_mode === 2) {
            g_textcolour = nowPlayingColours[1];
            g_textcolour_hl = nowPlayingColours[3];
            g_backcolour = nowPlayingColours[0];
            g_color_selected_bg = setAlpha(nowPlayingColours[2], 144);
            g_color_highlight = setAlpha(nowPlayingColours[2], 200);
            //g_color_highlight = nowPlayingColours[2];
        }
    }
}
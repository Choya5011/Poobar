'use strict';
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
 			//img.Dispose();

 			// Find least gray/white/black color
            let background_colour = extracted_colours[0].colour;
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
 	return [];
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
/* ==================================================
 * Variables
================================================== */

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

let psH;
let psV;

let delay = 150;

/* ==================================================
 * Functions
================================================== */

const approximatelyEqual = (a, b, tolerance = 0.20) => {
  const diff = Math.abs(a - b);
  const largest = Math.max(Math.abs(a), Math.abs(b));
  return diff <= largest * tolerance;
};

const checkSizeAndRatio = (wh, ww, targetRatio, tolerance = 0.20) => {
  if (wh > ww && approximatelyEqual(wh / ww, targetRatio, tolerance)) return true;
  return false;
};

function getLayoutType(ww, wh) {
    if ((checkSizeAndRatio(ww, wh, 16 / 9, 0.2) || checkSizeAndRatio(ww, wh, 3, 0.3) || checkSizeAndRatio(ww, wh, 11.11, 0.4) || checkSizeAndRatio(ww, wh, 5.4, 0.2)) && wh > scaler.s380) return 'horizontal';
    if (checkSizeAndRatio(wh, ww, 8 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730 || checkSizeAndRatio(ww, wh, 8 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730 || checkSizeAndRatio(ww, wh, 1, 0.3) && ww > scaler.s600)  return 'halfscreen';
    if ((ww <= scaler.s600 && wh <= scaler.s730 || ww < scaler.s320) && wh > scaler.s400) return 'miniplayer';
    if (wh <= scaler.s400) return 'miniplayer_2';
    if (checkSizeAndRatio(wh, ww, 16 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730 || checkSizeAndRatio(wh, ww, 1.36, 0.3)) return 'normalvertical'
    if (checkSizeAndRatio(wh, ww, 1.9, 0.1) && ww >= scaler.s300 || checkSizeAndRatio(wh, ww, 4, 0.2) && ww >= scaler.s300 || checkSizeAndRatio(wh, ww, 2.2, 0.06) && ww >= scaler.s300 || checkSizeAndRatio(wh, ww, 2.7, 0.2) && ww >= scaler.s300) return 'narrowvertical';
    return null;
}

// debounce func from https://github.com/regorxxx/Infinity-Tools-SMP/blob/main/helpers/helpers_xxx_basic_js.js
const debounce = (fn, delay, immediate = false, parent = this) => {
	let timerId;
	return (...args) => {
		const boundFunc = fn.bind(parent, ...args);
		clearTimeout(timerId);
		if (immediate && !timerId) { boundFunc(); }
		const calleeFunc = immediate ? () => { timerId = null; } : boundFunc;
		timerId = setTimeout(calleeFunc, delay);
		return timerId;
	};
};
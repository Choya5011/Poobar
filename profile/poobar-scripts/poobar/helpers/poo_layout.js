'use strict';

/*
 [poo_layout]
 * used in poobar main panel scripts (e.g. poo_mp_split.js, poo_mp_multi.js, amethyst_mp.js)

 [description]
 * Function that decides layout depending on main JSplitter dimensions.
 * 6 states: horizontal, halfscreen, normalvertical, narrowvertical, miniplayer, miniplayer_2.
 * Debounce panels that are heavier to resize. See debouncefunc blocks.
 * Debouncing is optional, but eliminates stutter when manually resizing. See tabstack as example.
 * Debounce is only of relevance for manual resizing smoothness, using win 11 snap layouts is always smooth.

 [Instruction]
 * To make custom layout add desired panels in CUI layout editor with custom titles to keep track.
 * Example:
    * Store names (CUI layout editor panel titles):
        * const panelNames = ['Fluent Control Panel', '', '', 'Smooth Browser'];
        * fluent control panel, playlist view, tabstack, smooth browser in that order
        * will be renamed to p1, p2... on layout creation.
        * panel example: layout.p.pidx (idx = e.g. 1).
    * Create layout:
        * let layout = new _layout(panelNames, 150, ppt.unified_bg.enabled);
        * syntax: _layout([names], debouncedelay, unify background boolean);
    * Set layout funcs:
        * layout.type({func (regular exec), debouncefunc (delayed exec), customdelay});
        * example: layout.horizontal({func: () => {code}, debouncefunc: {code}, delay: 100});
        * customdelay: uses this delay instead of default set at _layout creation for this block.
        * code: Adjust PanelObject Members/Methods (see JSplitter PanelObject docs).
*/

function _layout(panelNames, defaultDelay, unify = false) {
    this.p = {};
    this.layoutConfigs = {};
    this.paintRect = false;
    this.config = null;
    this.defaultDelay = defaultDelay || 100;
    this.unify = unify;

    this.scale = function(size) {
        return Math.round(size * window.DPI / 72);
    };

    this.scaler = {
        s100: this.scale(75),
        s600: this.scale(450),
        s800: this.scale(600),
        s140: this.scale(105),
        s300: this.scale(225),
        s320: this.scale(240),
        s380: this.scale(285),
        s400: this.scale(300),
        s730: this.scale(547.5)
    };

    for (let i = 0; i < panelNames.length; i++) {
        try {
            const panel = window.GetPanel(panelNames[i]);
            if (panel) {
                this.p['p' + (i + 1)] = panel;
            }
        } catch (e) {}
    }

    this.debounce = function(fn, delay, immediate, parent) {
        let timerId;
        return function(ww, wh) {
            const boundFunc = fn.bind(parent || this, ww, wh);
            clearTimeout(timerId);
            if (immediate && !timerId) { boundFunc(); }
            const calleeFunc = immediate ? function() { timerId = null; } : boundFunc;
            timerId = setTimeout(calleeFunc, delay);
            return timerId;
        };
    };

    this.updatePseudoTransparency = function(enabled) {
        for (let key in this.p) {
            if (this.p[key]) {
                this.p[key].SupportPseudoTransparency = enabled;
            }
        }
    };

    this.horizontal = function(params) {
        let debouncedFunc = params.debouncefunc ? this.debounce(params.debouncefunc, params.delay || this.defaultDelay, false, this) : null;

        this.layoutConfigs.horizontal = {
            type: 'horizontal',
            func: params.func,
            debouncefunc: debouncedFunc
        };
        this.config = { ...this.layoutConfigs.horizontal, ww: window.Width, wh: window.Height, scaler: this.scaler };
        this.applyLayout();
        return this;
    };

    this.halfscreen = function(params) {
        let debouncedFunc = params.debouncefunc ? this.debounce(params.debouncefunc, params.delay || this.defaultDelay, false, this) : null;

        this.layoutConfigs.halfscreen = {
            type: 'halfscreen',
            func: params.func,
            debouncefunc: debouncedFunc
        };
        this.config = { ...this.layoutConfigs.halfscreen, ww: window.Width, wh: window.Height, scaler: this.scaler };
        this.applyLayout();
        return this;
    };

    this.normalvertical = function(params) {
        let debouncedFunc = params.debouncefunc ? this.debounce(params.debouncefunc, params.delay || this.defaultDelay, false, this) : null;

        this.layoutConfigs.normalvertical = {
            type: 'normalvertical',
            func: params.func,
            debouncefunc: debouncedFunc
        };
        this.config = { ...this.layoutConfigs.normalvertical, ww: window.Width, wh: window.Height, scaler: this.scaler };
        this.applyLayout();
        return this;
    };

    this.narrowvertical = function(params) {
        let debouncedFunc = params.debouncefunc ? this.debounce(params.debouncefunc, params.delay || this.defaultDelay, false, this) : null;

        this.layoutConfigs.narrowvertical = {
            type: 'narrowvertical',
            func: params.func,
            debouncefunc: debouncedFunc
        };
        this.config = { ...this.layoutConfigs.narrowvertical, ww: window.Width, wh: window.Height, scaler: this.scaler };
        this.applyLayout();
        return this;
    };

    this.miniplayer = function(params) {
        let debouncedFunc = params.debouncefunc ? this.debounce(params.debouncefunc, params.delay || this.defaultDelay, false, this) : null;

        this.layoutConfigs.miniplayer = {
            type: 'miniplayer',
            func: params.func,
            debouncefunc: debouncedFunc
        };
        this.config = { ...this.layoutConfigs.miniplayer, ww: window.Width, wh: window.Height, scaler: this.scaler };
        this.applyLayout();
        return this;
    };

    this.miniplayer_2 = function(params) {
        let debouncedFunc = params.debouncefunc ? this.debounce(params.debouncefunc, params.delay || this.defaultDelay, false, this) : null;

        this.layoutConfigs.miniplayer_2 = {
            type: 'miniplayer_2',
            func: params.func,
            debouncefunc: debouncedFunc
        };
        this.config = { ...this.layoutConfigs.miniplayer_2, ww: window.Width, wh: window.Height, scaler: this.scaler };
        this.applyLayout();
        return this;
    };

    this.applyLayout = function() {
        if (!this.config || this.config.ww < this.scaler.s300) return null;
        this.paintRect = this.config.type !== 'miniplayer';
        this.config.func(this.config.ww, this.config.wh);
        this.config.debouncefunc?.(this.config.ww, this.config.wh);
        this.updatePseudoTransparency(this.unify);
        return this.getLayoutType(this.config.ww, this.config.wh, this.scaler);
    };

    this.update = function() {
        const ww = window.Width; const wh = window.Height;
        if (!ww || ww < this.scaler.s300) return null;

        const newLayoutType = this.getLayoutType(ww, wh, this.scaler);
        if (newLayoutType && this.layoutConfigs[newLayoutType]) {
            this.config = {
                ...this.layoutConfigs[newLayoutType],
                ww, wh, scaler: this.scaler
            };
            this.applyLayout();
            return newLayoutType;
        }
        if (this.config) {
            this.config.ww = ww; this.config.wh = wh;
            this.applyLayout();
        }
    };

    this.layout = function() {
        return this.config ? this.config.type : null;
    };

    // Layout detection methods...
    this.approximatelyEqual = function(a, b, tolerance) {
        tolerance = tolerance || 0.20;
        const diff = Math.abs(a - b);
        const largest = Math.max(Math.abs(a), Math.abs(b));
        return diff <= largest * tolerance;
    };

    this.checkSizeAndRatio = function(wh, ww, targetRatio, tolerance) {
        return wh > ww && this.approximatelyEqual(wh / ww, targetRatio, tolerance);
    };

    this.getLayoutType = function(ww, wh, scaler) {
        if ((this.checkSizeAndRatio(ww, wh, 16 / 9, 0.2) || this.checkSizeAndRatio(ww, wh, 3, 0.3) || this.checkSizeAndRatio(ww, wh, 11.11, 0.4) || this.checkSizeAndRatio(ww, wh, 5.4, 0.2)) && wh > scaler.s380) return 'horizontal';
        if ((this.checkSizeAndRatio(wh, ww, 8 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730) || (this.checkSizeAndRatio(ww, wh, 8 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730) || (this.checkSizeAndRatio(ww, wh, 1, 0.3) && ww > scaler.s600)) return 'halfscreen';
        if ((ww <= scaler.s600 && wh <= scaler.s730 || ww < scaler.s320) && wh > scaler.s400) return 'miniplayer';
        if (wh <= scaler.s400) return 'miniplayer_2';
        if (this.checkSizeAndRatio(wh, ww, 16 / 9, 0.4) && ww > scaler.s600 && wh > scaler.s730 || this.checkSizeAndRatio(wh, ww, 1.36, 0.3)) return 'normalvertical';
        if ((this.checkSizeAndRatio(wh, ww, 1.9, 0.1) && ww >= scaler.s300) || (this.checkSizeAndRatio(wh, ww, 4, 0.2) && ww >= scaler.s300) || (this.checkSizeAndRatio(wh, ww, 2.2, 0.06) && ww >= scaler.s300) || (this.checkSizeAndRatio(wh, ww, 2.7, 0.2) && ww >= scaler.s300)) return 'narrowvertical';
        return null;
    };
}
/**
 * Any variables that are used in multiple scripts
 * Current list that imports this file are:
    * Fluent Control Panel
    * Main Panel
 */

/**
 * storing in scaler instead of accessing _scale() directly
 * reason: easier to find back in script
 * s300 = 300px in 1440p
 */
const scaler = {
    //global
    s100: _scale(75),
    s600: _scale(450),
    s800: _scale(600),
    // Fluent Control Panel
    s80: _scale(60),
    s130: _scale(97.5),
    s520: _scale(390),
    s1080: _scale(810),
    s1200: _scale(900),
    // Main Panel
    s140: _scale(105),
    s300: _scale(225),
    s320: _scale(240),
    s380: _scale(285),
    s400: _scale(300),
    s730: _scale(547.5)
};

const log = {
    memory: () => {
        return "MB | " + window.ScriptInfo.Name + ": " + Math.round(window.JsMemoryStats.MemoryUsage / 1048576 * 10) / 10 + "\n" +
               "MB | total: " + Math.round(window.JsMemoryStats.TotalMemoryUsage / 1048576 * 10) / 10 + "\n" +
               "Byt | " + window.ScriptInfo.Name + ": " + window.JsMemoryStats.MemoryUsage + "\n" +
               "Byt | total: " + window.JsMemoryStats.TotalMemoryUsage + "\n------------";
    },
    dimensions: () => {
        return "Window W: ", window.Width + "\n" +
               "Window H: ", window.Height;
    },
};
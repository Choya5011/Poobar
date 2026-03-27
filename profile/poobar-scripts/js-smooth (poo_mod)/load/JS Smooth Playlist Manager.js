'use strict';

window.DefinePanel("JS Smooth Playlist Manager", { author : "Br3tt aka Falstaff", features : { drag_n_drop : true }});
window.DrawMode = +window.GetProperty('- Draw mode: GDI (false), D2D (true)', false);
include(fb.ComponentPath + "samples\\js-smooth\\js\\JScommon.js");
include(fb.ComponentPath + "samples\\js-smooth\\js\\JSinputbox.js");
include(fb.ProfilePath + 'poobar-scripts\\poobar\\helpers\\poo_col.js');
include(fb.ProfilePath + "poobar-scripts\\js-smooth (poo_mod)\\js\\jsspm.js");
include(fb.ProfilePath + 'poobar-scripts\\Menu-Framework-SMP\\helpers\\menu_xxx.js');

"use strict";

include('..\\helpers\\menu_xxx.js');

include('01_simple_menu.js'); // Uses the first menu
include('02_concatenate_manual_menu.js');  // And 2 copies of the other menu as 'otherObj'

var menuTwo = new _anotherMenu();
var menuThree = new _anotherMenu();

// And adds another menu using the framework
var menuFour = new _menu();
menuFour.newEntry({entryText: 'Bye', func: () => {console.log('Bye');}});
menuFour.newSeparator();
menuFour.newEntry({entryText: 'Bye 2', func: () => {console.log('Bye 2');}});

// Note that mixing manual and entire framework objs has a limitation. Manual entries are always added at the end unless attached to a submenu
// Because using AppendMenuItem directly on the menus, add them to the end of the list. But you can append items to an existing submenu instead.
// i.e. otherObj = [menuTwo, menuThree, menuFour] is equivalent to [menuFour, menuTwo, menuThree] in any case, since menuTwo and menutThree,
// being manual menus are always called after the rest
var otherObj = ['sep', 'sep', menuFour, 'sep', 'sep', menuTwo, menuThree];

function on_mouse_rbtn_up(x, y) {return menu.btn_up(x, y, otherObj);} // actually uses the first one that was defined
"use strict";

include('..\\helpers\\menu_xxx.js');

include('01_simple_menu.js'); // Uses the first menu
include('02_concatenate_manual_menu.js');  // And 2 copies of the other menu as 'otherObj'

var menuTwo = new _anotherMenu();
var menuThree = new _anotherMenu();
var otherObj = [menuTwo, menuThree];

function on_mouse_rbtn_up(x, y) {return menu.btn_up(x, y, otherObj);} // actually uses the first one that was defined
'use strict';

include('..\\helpers\\menu_xxx.js');

var menu = new _menu();
menu.newEntry({entryText: 'Hello', func: () => {console.log('Hello');}}); // Shorthand notation
menu.newEntry({entryText: 'Hello 2', func: () => {console.log('Hello 2');}}); // Or omit the menu, to append directly to main one
menu.newSeparator();
const subMenu = menu.newMenu('This is a submenu'); // It will be added just after the last declared entry!
menu.newEntry({menuName: subMenu, entryText: 'This is my func', func: yourFunc});
var bSubMenu = true;
const funct = () => {return (bSubMenu) ? 'SubMenu 1' : 'SubMenu 2';};
menu.newMenu(funct);
menu.newEntry({menuName: funct, entryText: 'Change SubMenu', func: () => {bSubMenu = !bSubMenu;}});
menu.newEntry({menuName: funct, entryText:'Hello 3', func: () => {console.log('Hello 3');}, flags: () => {return (bSubMenu) ? MF_STRING : MF_GRAYED;}});

var otherObj; // Used on other examples

function on_mouse_rbtn_up(x, y) {return menu.btn_up(x, y, otherObj);} // actually uses the first one that was defined

function yourFunc() {
    console.log('This is my func');
}
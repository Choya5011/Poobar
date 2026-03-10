"use strict";

include('..\\helpers\\menu_xxx.js');

include('01_simple_menu.js'); // Uses the first menu and the next one as 'otherObj'

var menuTwo = new _anotherMenu();
function _anotherMenu() {
	this.idxInitial = 0;
	this.idxEnd = 0;

	this.btn_up = (idxInitial) => {
		this.idxInitial = idxInitial;
		this.idxEnd = idxInitial;
		const menuName = menu.getMainMenuName(); // here menu is the first menu created
		menu.getMenu(menuName).AppendMenuItem(MF_STRING, ++this.idxEnd, 'Manual entry 1');
		menu.getMenu(menuName).AppendMenuItem(MF_STRING, ++this.idxEnd, 'Manual entry 2');
		return this.idxEnd;
	};
	
	this.btn_up_done = (currIdx) => {
		this.idxEnd = this.idxInitial;
		if (currIdx === ++this.idxEnd) {
			console.log('Manual entry 1');
			return;
		}
		if (currIdx === ++this.idxEnd) {
			console.log('Manual entry 2');
			return;
		}
		return;
	};
}

var otherObj = menuTwo;

function on_mouse_rbtn_up(x, y) {return menu.btn_up(x, y, otherObj);} // actually uses the first one that was defined
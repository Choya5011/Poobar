"use strict";

window.DrawMode = 1;
window.EraseOnRepaint = false;

let ww = 0;
let wh = 0;

const alphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
const fontSize = 16;
const font = gdi.Font("Consolas", fontSize, 1);
const drops = [];

function on_size(width, height) {
    ww = width;
    wh = height;
	if(ww > 0 && wh > 0) {
		const columns = Math.floor(ww / fontSize);
		drops.length = columns;
		for (let i = 0; i < columns; i++) if (isNaN(drops[i])) drops[i] = 0;
	}
}

function on_paint(gr) {
	gr.FillSolidRect(0, 0, ww, wh, 0x0D000000);

	for (let i = 0; i < drops.length; i++) {
		const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
		const x = i * fontSize;
		const y = drops[i] * fontSize;

		gr.GdiDrawText(text, font, 0xFF00FF00, x, y, fontSize, fontSize * 4 / 3);

		if (y > wh && Math.random() > 0.975)
			drops[i] = 0;
		else
			drops[i]++;
	}	
}

window.SetInterval(() => { window.Repaint(); }, 50);

"use strict";

const img = gdi.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Field.jpg`);

let imgPixelData = img.GetPixelData();

utils.WriteBinaryFile("D:\\Field.bin", imgPixelData);

let rData = utils.ReadBinaryFile("D:\\Field.bin");

let rImg = gdi.CreateImageFromPixelData(rData, 2208, 1242);

function on_paint(gr) {
	gr.DrawImage(rImg, 0, 0, img.Width, img.Height, 0, 0, img.Width, img.Height);
}

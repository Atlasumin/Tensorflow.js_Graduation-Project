let bodypix;
let segmentation;
let img_canvas;
let canvas;
let ctx;
let width = 971;
let height = 601;

async function make() {
	img_canvas = new Image();

	var imgs = document.getElementById('img');

	img_canvas.src = imgs.src;
	console.log('aaa' + img_canvas.src)
	bodypix = await ml5.bodyPix();

	segmentation = await bodypix.segment(img_canvas);


	canvas = createCanvas(width, height);

	ctx = canvas.getContext('2d');


	ctx.drawImage(img_canvas, 0, 0);
	//在canvas画板上绘制img
	let maskedBackground = await imageDataToCanvas(segmentation.raw.backgroundMask.data, segmentation.raw.backgroundMask.width, segmentation.raw.backgroundMask.height);

	ctx.drawImage(maskedBackground, 0, 0);
	var image = new Image();
	image = canvas.toDataURL("image/png", 1.0);
	document.getElementsByTagName('canvas')[0].style.display='none'

	console.log(image);
	//	this.file = image;
	let img1 = new Image();
	img1.src = image;
	img1.onload = function() {　　　　
		w = img1.width;　　　　
		h = img1.height;　　　　
		console.log(w + "  " + h)
		fitch(w, h, img1);　　
	}

}


function imageDataToCanvas(imageData, x, y) {
	const arr = Array.from(imageData);
	console.log(Array.from(imageData));
	//根据imageData得到一个浅拷贝的数组实例

	const canvas = document.createElement('canvas'); // Consider using offScreenCanvas when it is ready?
	const ctx = canvas.getContext('2d');

	canvas.width = x;
	canvas.height = y;

	const imgData = ctx.createImageData(x, y);
	const {
		data
	} = imgData;

	for(let i = 0; i < x * y * 4; i += 1)
		data[i] = arr[i];
	ctx.putImageData(imgData, 0, 0);

	return ctx.canvas;
};

function createCanvas(w, h) {
	const canvas = document.createElement("canvas");

	canvas.width = w;
	canvas.height = h;

	document.body.appendChild(canvas);

	return canvas;
}

function fitch(width, height, img) {
	let dataUrl;
	let c = document.createElement("canvas");
	c.width = width;
	c.height = height;
	width1 = width;
	height1 = height;
	let ctx = c.getContext("2d");
	ctx.drawImage(img, 0, 0);
	/**
	 * 取图片四个脚边的像素点rgba
	 * @type {*}
	 */
	let tl = Array.prototype.slice.call(ctx.getImageData(0, 0, 1, 1).data).join(',');
	let tr = Array.prototype.slice.call(ctx.getImageData(width - 1, 0, 1, 1).data).join(',');
	let br = Array.prototype.slice.call(ctx.getImageData(width - 1, height - 1, 1, 1).data).join(',');
	let bl = Array.prototype.slice.call(ctx.getImageData(0, height - 1, 1, 1).data).join(',');
	let imgdata = [tl, tr, bl, br]; // 四个取色点
	let selfImageData = []; // 当前rgba
	imgdata.sort();
	// 目前只支持纯色背景抠图，简单的判断是否为纯色
	let deferNum = this.unique(imgdata).length;
	if(deferNum <= 1) {
		{
			selfImageData = imgdata[1].split(","); // 设置要扣除的主题色
			let isPNG = true; // 判断是否已经扣过
			console.log(width, height)
			let imgDataUrl = ctx.getImageData(0, 0, width, height); //获取像素点
			let data = imgDataUrl.data;
			for(let i = 0; i < data.length; i += 4) {
				// 得到 RGBA 通道的值
				let r = data[i];
				let g = data[i + 1];
				let b = data[i + 2];

				/**
				 * function 判断颜色是不是属于背景色
				 * @param numerical
				 * @param index
				 * @returns {boolean}
				 */
				let isIn = (numerical, index) => {
					if(selfImageData[3] == 0) {
						isPNG = false;
						return false;
					}
					return numerical > parseInt(selfImageData[index]) - 20 && numerical < parseInt(selfImageData[index]) + 20; // 去掉边缘色
				};

				if([r, g, b].every(isIn)) {
					data[i + 3] = 0; // 设置背景透明
				}
			}
			// 将修改后的代码复制回画布中
			ctx.putImageData(imgDataUrl, 0, 0);
			dataUrl = c.toDataURL("image/png");
			if(isPNG) {
				/**
				 * 创建下载链接 进行图片下载
				 * @type {Element}
				 */
                document.getElementById('img2').src=dataUrl
                document.getElementById('down').style.display='block'
                document.getElementById('mengban1').style.display='block'

			} else {
				alert('背景已抠除！');
			}
		}
	} else {
		alert('只支持纯色背景抠图！');
	}
}

/**
 * function 数组去重
 * @param arry
 * @returns {Array}
 */
function unique(arry) {
	let res = [];
	let json = {};
	arry.forEach(function(item, i) {
		if(!json[item]) {
			res.push(item);
			json[item] = 1;
		}
	});
	return res;
}

window.onload = make()
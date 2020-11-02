import { Ripple } from './ripple.js';
import { Dot } from './dot.js';
import { collide } from './utils.js';

class App {
	constructor() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		document.body.appendChild(this.canvas);

		this.tempCanvas = document.createElement('canvas');
		this.tempCtx = this.tempCanvas.getContext('2d');

		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

		this.ripple = new Ripple();

		window.addEventListener('resize', this.resize.bind(this), false);
		this.resize();

		this.radius = 10;
		this.pixelSize = 30;
		this.dots = [];

		this.isLoaded = false;
		this.imgPos = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
		};

		this.image = new Image();
		this.image.src = 'starry-night.jpg';
		this.image.onload = () => {
			this.isLoaded = true;
			this.drawImage();
		};
	}

	resize() {
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;
		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		this.tempCanvas.width = this.stageWidth * this.pixelRatio;
		this.tempCanvas.height = this.stageHeight * this.pixelRatio;
		this.ripple.resize(this.stageWidth, this.stageHeight);

		if (this.isLoaded) {
			this.drawImage();
		}

		window.requestAnimationFrame(this.animate.bind(this));
		this.canvas.addEventListener('click', this.onClick.bind(this), false);
	}

	drawImage() {
		const stageRatio = this.stageWidth / this.stageHeight;
		const imgRatio = this.image.width / this.image.height;

		this.imgPos.width = this.stageWidth;
		this.imgPos.height = this.stageHeight;

		// taking care of imags that is larger than browser size?
		if (imgRatio > stageRatio) {
			// console.log(`image: ${imgRatio} > stage: ${stageRatio}`);

			// wide image
			this.imgPos.width = Math.round(
				this.image.width * (this.stageHeight / this.image.height)
			);
			this.imgPos.x = Math.round(
				(this.stageWidth - this.imgPos.width) / 2
			); // centering
		} else {
			// console.log(`image: ${imgRatio} < stage: ${stageRatio}`);

			// long image
			this.imgPos.height = Math.round(
				this.image.height * (this.stageWidth / this.image.width)
			);
			this.imgPos.y = Math.round(
				(this.stageHeight - this.imgPos.width) / 2
			); // centering
		}

		this.ctx.drawImage(
			this.image,
			0,
			0,
			this.image.width,
			this.image.height,
			this.imgPos.x,
			this.imgPos.y,
			this.imgPos.width,
			this.imgPos.height
		);

		this.tempCtx.drawImage(
			this.image,
			0,
			0,
			this.image.width,
			this.image.height,
			this.imgPos.x,
			this.imgPos.y,
			this.imgPos.width,
			this.imgPos.height
		);

		this.imgData = this.tempCtx.getImageData(
			0,
			0,
			this.stageWidth,
			this.stageHeight
		);

		this.drawDots();
	}

	drawDots() {
		this.dots = [];

		this.columns = Math.ceil(this.stageWidth / this.pixelSize);
		this.rows = Math.ceil(this.stageHeight / this.pixelSize);

		for (let i = 0; i < this.rows; i++) {
			const y = (i + 0.5) * this.pixelSize; // .5 for the margin - essentially looking how far is this n-th dot is from left or top
			const pixelY = Math.max(Math.min(y, this.stageHeight), 0); // not sure how it works

			for (let j = 0; j < this.columns; j++) {
				const x = (j + 0.5) * this.pixelSize;
				const pixelX = Math.max(Math.min(x, this.stageWidth), 0);

				const pixelIndex = (pixelX + pixelY * this.stageWidth) * 4; // not sure how it works
				const red = this.imgData.data[pixelIndex + 0];
				const green = this.imgData.data[pixelIndex + 1];
				const blue = this.imgData.data[pixelIndex + 2];

				const dot = new Dot(
					x,
					y,
					this.radius,
					this.pixelSize,
					red,
					green,
					blue
				);
				this.dots.push(dot);
			}
		}
	}

	animate(t) {
		window.requestAnimationFrame(this.animate.bind(this));

		this.ripple.animate(this.ctx);

		for (let i = 0; i < this.dots.length; i++) {
			const dot = this.dots[i];
			if (
				collide(
					dot.x,
					dot.y,
					this.ripple.x,
					this.ripple.y,
					this.ripple.radius
				)
			) {
				dot.animate(this.ctx);
			}
		}
	}

	onClick(e) {
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

		for (let i = 0; i < this.dots.length; i++) {
			this.dots[i].reset();
		}

		this.ctx.drawImage(
			this.image,
			0,
			0,
			this.image.width,
			this.image.height,
			this.imgPos.x,
			this.imgPos.y,
			this.imgPos.width,
			this.imgPos.height
		);

		this.ripple.start(e.offsetX, e.offsetY);
	}
}

window.onload = () => {
	new App();
};

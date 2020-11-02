import { Point } from './point.js';

export class Wave {
	constructor(index, totalPoints, color) {
		this.index = index; // i-th wave
		this.totalPoints = totalPoints;
		this.color = color;
		this.points = [];
	}

	resize(stageWidth, stageHeight) {
		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;

		this.centerX = this.stageWidth / 2;
		this.centerY = this.stageHeight / 2;

		this.pointGap = this.stageWidth / (this.totalPoints - 1);

		this.init();
	}

	init() {
		this.points = [];

		for (let i = 0; i < this.totalPoints; i++) {
			const point = new Point(
				this.index + i,
				this.pointGap * i,
				this.centerY
			);
			this.points[i] = point;
		}
	}

	draw(ctx) {
		// drawing is actually happening with ctx.fill()
		// this.point is object that holds appropriate (x,y)
		ctx.beginPath();
		ctx.fillStyle = this.color;

		let prevX = this.points[0].x;
		let prevY = this.points[0].y;

		ctx.moveTo(prevX, prevY);

		for (let i = 1; i < this.totalPoints; i++) {
			// draw five lines to connect six dots (assigned value)
			if (i < this.totalPoints - 1) {
				this.points[i].update();
			}

			const cx = (prevX + this.points[i].x) / 2; // for the curve line?
			const cy = (prevY + this.points[i].y) / 2;

			ctx.quadraticCurveTo(prevX, prevY, cx, cy);

			prevX = this.points[i].x;
			prevY = this.points[i].y;
		}

		// closing the shape
		ctx.lineTo(prevX, prevY); // this takes care of the last point (which is not actually Point)
		ctx.lineTo(this.stageWidth, this.stageHeight);
		ctx.lineTo(this.points[0].x, this.stageHeight);
		ctx.fill();
		ctx.closePath();
	}
}

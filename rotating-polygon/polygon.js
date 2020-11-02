const PI2 = Math.PI * 2;

export class Polygon {
	constructor(x, y, radius, sides) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.sides = sides;
		this.rotate = 0;
	}

	animate(ctx, moveX) {
		// REGULAR FILLED POLYGON
		// ctx.save();
		// ctx.fillStyle = '#000';
		// ctx.beginPath();
		// const angle = PI2 / this.sides;
		// ctx.translate(this.x, this.y); // translate origin of canvs to x,y
		// this.rotate += moveX * 0.008;
		// ctx.rotate(this.rotate);
		// for (let i = 0; i < this.sides; i++) {
		// 	const x = this.radius * Math.cos(angle * i);
		// 	const y = this.radius * Math.sin(angle * i);
		// 	i == 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
		// }
		// ctx.fill();
		// ctx.closePath();
		// ctx.restore();

		// SIMILAR TO FFF
		ctx.save();
		ctx.fillStyle = '#000';
		// ctx.beginPath();

		const angle = PI2 / this.sides;
		const angle2 = PI2 / 4; // for square individual points

		ctx.translate(this.x, this.y); // translate origin of canvs to x,y

		this.rotate += moveX * 0.008;
		ctx.rotate(this.rotate);

		for (let i = 0; i < this.sides; i++) {
			const x = this.radius * Math.cos(angle * i);
			const y = this.radius * Math.sin(angle * i);

			//i == 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);

			ctx.save();
			ctx.translate(x, y);
			ctx.rotate((((360 / this.sides) * i + 255) * Math.PI) / 180);
			ctx.beginPath();

			const w = 120;
			const h = 150;
			ctx.rect(w / 2, h / 2, w, h);
			// for (let j = 0; j < 4; j++) {
			// 	const x2 = 70 * Math.cos(angle2 * j);
			// 	const y2 = 70 * Math.sin(angle2 * j);

			// 	j == 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);

			// 	console.log(x2, y2);
			// }

			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}

		// ctx.fill();
		// ctx.closePath();
		ctx.restore();
	}
}

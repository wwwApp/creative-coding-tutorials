/**
 * wave is more like an object that consists of multiple coordinates (x,y)
 * and the movement of wave is done via the increase/decrese in y-coord.
 */

export class Point {
	constructor(index, x, y) {
		this.x = x;
		this.y = y;
		this.fixedY = y;
		this.speed = 0.1;
		this.curr = index;
		this.max = Math.random() * 100 + 150; // 150 ~ 250
	}

	update() {
		this.curr += this.speed;
		this.y = this.fixedY + Math.sin(this.curr) * this.max; // getting 1 / -1 depending on the value passed
	}
}

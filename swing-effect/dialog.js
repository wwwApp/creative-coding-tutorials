import { Point } from './point.js';

const FOLLOW_SPEED = 0.08;
const ROTATE_SPEED = 0.12;
const MAX_ANGLE = 30;
const FPS = 1000 / 60;
const WIDTH = 260;
const HEIGHT = 260;

export class Dialog {
	constructor() {
		this.pos = new Point();
		this.target = new Point();
		this.prevPos = new Point();
		this.downPos = new Point();
		this.startPos = new Point();
		this.mousePos = new Point();
		this.centerPos = new Point();
		this.origin = new Point();
		this.rotation = 0;
		this.sideValue = 0;
		this.isDown = false;
	}

	resize(stageWidth, stageHeight) {
		this.pos.x = Math.random() * (stageWidth - WIDTH);
		this.pos.y = Math.random() * (stageHeight - HEIGHT);
		this.target = this.pos.clone();
		this.prevPos = this.pos.clone();
	}

	animate(ctx) {
		const move = this.target
			.clone()
			.subtract(this.pos)
			.reduce(FOLLOW_SPEED);
		this.pos.add(move);

		// this is really where you clicked on the diagog
		this.centerPos = this.pos.clone().add(this.mousePos);

		this.swingDrag(ctx);

		this.prevPos = this.pos.clone();
	}

	swingDrag(ctx) {
		const dx = this.pos.x - this.prevPos.x;
		const speedX = Math.abs(dx) / FPS;
		const speed = Math.min(Math.max(speedX, 0), 1);

		let rotation = (MAX_ANGLE / 1) * speed;
		rotation = rotation * (dx > 0 ? 1 : -1) - this.sideValue; // determines the direction of rotation depends on the direction you're dragging

		this.rotation += (rotation - this.rotation) * ROTATE_SPEED;

		const tmpPos = this.pos.clone().add(this.origin);
		ctx.save();
		ctx.translate(tmpPos.x, tmpPos.y);
		ctx.rotate((this.rotation * Math.PI) / 180);
		ctx.beginPath();
		ctx.fillStyle = `#f4e55a`;
		ctx.fillRect(-this.origin.x, -this.origin.y, WIDTH, HEIGHT); // not quite sure why using negative origin values
		ctx.restore();
	}

	/**
	 *
	 * @param {Point} point Mouse position on pointerdown event
	 */
	down(point) {
		// on mousedown, check the current box is clicked
		if (point.collide(this.pos, WIDTH, HEIGHT)) {
			this.isDown = true;
			this.startPos = this.pos.clone();
			this.downPos = point.clone();
			this.mousePos = point.clone().subtract(this.pos); // how far is your clicked point is from the origin of the dialog

			this.origin.x = this.mousePos.x;
			this.origin.y = this.mousePos.y;

			const xRatioValue = this.mousePos.x / WIDTH;
			this.sideValue = xRatioValue - 0.5;

			return this;
		} else {
			return null;
		}
	}

	/**
	 *
	 * @param {Point} point Mouse position on pointermove event
	 */
	move(point) {
		if (this.isDown) {
			// essentially, you zero out by subtracting downPos
			// and add downPos to targetPos
			this.target = this.startPos
				.clone()
				.add(point)
				.subtract(this.downPos);
		}
	}

	up() {
		this.isDown = false;
	}
}

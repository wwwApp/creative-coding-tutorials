import { Particle } from './particle.js';

const COLORS = [
	{ r: 45, g: 74, b: 227 }, // blue
	{ r: 250, g: 255, b: 89 }, // yellow
	{ r: 255, g: 104, b: 248 }, // purple
	{ r: 44, g: 209, b: 252 }, // skyblue
	{ r: 54, g: 233, b: 84 }, // green
];

class App {
	constructor() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		document.body.appendChild(this.canvas);

		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

		this.totalParticles = 15;
		this.particles = [];
		this.maxRadius = 900;
		this.minRadius = 400;

		window.addEventListener('resize', this.resize.bind(this), false);
		this.resize();

		requestAnimationFrame(this.animate.bind(this));
	}

	resize() {
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;
		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		this.ctx.globalCompositeOperation = 'saturation';

		this.createParticles();
	}

	createParticles() {
		let currColor = 0;
		this.particles = [];

		for (let i = 0; i < this.totalParticles; i++) {
			const particle = new Particle(
				Math.random() * this.stageWidth,
				Math.random() * this.stageHeight,
				Math.random() * (this.maxRadius - this.minRadius) +
					this.minRadius,
				COLORS[currColor]
			);

			if (++currColor >= COLORS.length) {
				currColor = 0;
			}

			this.particles[i] = particle;
		}
	}

	animate(t) {
		requestAnimationFrame(this.animate.bind(this));

		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

		for (let i = 0; i < this.totalParticles; i++) {
			const particle = this.particles[i];
			particle.animate(this.ctx, this.stageWidth, this.stageHeight);
		}
	}
}

window.onload = () => {
	new App();
};

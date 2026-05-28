class Pickup {
	constructor(x, y, ySpeed, height, width, sprite, className) {
		this.x = x;
		this.y = y;
		this.ySpeed = ySpeed;
		this.height = height;
		this.width = width;
		this.sprite = sprite;
		this.className = className;
		this.element = null;
	}

	move() {
		this.y += this.ySpeed;
		this.updatePosition();
	}

	buildElement() {
		this.element = document.createElement("div");
		this.element.className = this.className;
		Object.assign(this.element.style, {
			height: this.height + "px",
			width: this.width + "px"
		});
		this.updatePosition();

		const image = document.createElement("img");
		image.src = this.sprite;
		image.width = this.width;
		image.height = this.height;
		this.element.appendChild(image);

		return this.element;
	}

	updatePosition() {
		this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
	}

	die() {
		this.element.remove();
		this.element = null;
	}
}

class FastFirePickup extends Pickup {}

class FastMovePickup extends Pickup {}

window.FastFirePickup = FastFirePickup;
window.FastMovePickup = FastMovePickup;

class Enemy {
	constructor(x, y, id, height, width, sprite) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.height = height;
		this.width = width;
		this.sprite = sprite;
		this.element = null;
		this.imageElement = null;
		this.isUsingTemporarySprite = false;
	}

	buildElement() {
		//Build required DOM for the Enemy
		this.element = document.createElement("div");
		this.element.id = this.id;
		this.element.className = "enemy";
		Object.assign(this.element.style, {
			height: this.height + "px",
			width: this.width + "px"
		});
		this.updatePosition();

		this.imageElement = document.createElement("img");
		this.imageElement.src = this.sprite;
		this.imageElement.className = "enemy-img";
		this.element.appendChild(this.imageElement);

		return this.element;
	}

	changeImage(sprite) {
		//Change this enemies sprite to the passed in sprite
		this.sprite = sprite;
		this.imageElement.src = this.sprite;
	}

	showTemporaryImage(sprite) {
		this.isUsingTemporarySprite = true;
		this.imageElement.src = sprite;
	}

	resumeAnimation(sprite) {
		this.isUsingTemporarySprite = false;
		this.changeImage(sprite);
	}

	shouldQueueLaser(loopMs, averageMs) {
		return !this.isUsingTemporarySprite && Math.random() < loopMs / averageMs;
	}

	move(xMove, yMove) {
		//Move the enemy by the provided coordinates
		this.x += xMove;
		this.y += yMove;
		this.updatePosition();
	}

	updatePosition() {
		this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
	}

	die() {
		//Get rid of the enemy from the document
		this.element.remove();
		this.element = null;
		this.imageElement = null;
	}
}

window.Enemy = Enemy;

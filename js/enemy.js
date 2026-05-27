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
	}

	buildElement() {
		//Build required DOM for the Enemy
		this.element = document.createElement("div");
		this.element.id = this.id;
		this.element.className = "enemy";
		Object.assign(this.element.style, {
			height: this.height + "px",
			width: this.width + "px",
			top: this.y + "px",
			left: this.x + "px"
		});

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

	move(xMove, yMove) {
		//Move the enemy by the provided coordinates
		this.x += xMove;
		this.y += yMove;
		Object.assign(this.element.style, {
			top: this.y + "px",
			left: this.x + "px"
		});
	}

	die() {
		//Get rid of the enemy from the document
		this.element.remove();
	}
}

window.Enemy = Enemy;

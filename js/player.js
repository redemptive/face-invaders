class Player {
	constructor(x, y, height, width, lives, sprites) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.lives = lives;
		this.sprites = sprites;
		this.element = null;
		this.imageElement = null;
	}

	move(xMove, yMove) {
		//Function for moving the player
		this.x += xMove;
		this.y += yMove;
		this.updatePosition();
	}

	buildElement() {
		//Put together the required DOM for the player
		this.element = document.createElement("div");
		this.element.id = "player";
		this.updatePosition();

		this.imageElement = document.createElement("img");
		this.imageElement.id = "playerImg";
		this.imageElement.src = this.sprites[this.lives - 1];
		this.imageElement.width = this.width;
		this.imageElement.height = this.height;
		this.element.appendChild(this.imageElement);

		return this.element;
	}

	updatePosition() {
		this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
	}

	changeSprite() {
		//Change the player sprite if the player has been shot and is damaged
		this.imageElement.src = this.sprites[this.lives - 1];
	}
}

window.Player = Player;

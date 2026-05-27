class Player {
	constructor(x, y, height, width, lives, sprites) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.lives = lives;
		this.sprites = sprites;
	}

	move(xMove, yMove) {
		//Function for moving the player
		this.x += xMove;
		this.y += yMove;
		window.gameDom.setStyles("#player", {
			top: this.y + "px",
			left: this.x + "px"
		});
	}

	buildHtml() {
		//Put together the required HTML for the player
		return `<div id="player"><img id="playerImg" src="${this.sprites[this.lives - 1]}" width="${this.width}" height="${this.height}"></div>`;
	}

	changeSprite() {
		//Change the player sprite if the player has been shot and is damaged
		document.querySelector("#playerImg").setAttribute("src", this.sprites[this.lives - 1]);
	}
}

window.Player = Player;

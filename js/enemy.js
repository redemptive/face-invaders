class Enemy {
	constructor(x, y, id, height, width, sprite) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.height = height;
		this.width = width;
		this.sprite = sprite;
	}

	buildHtml() {
		//Build required HTML for the Enemy
		return `<div id="${this.id}" class="enemy" style="height:${this.height}px; width: ${this.width}px; top: ${this.y}px;left: ${this.x}px;"><img src="${this.sprite}" class="enemy-img"></div>`;
	}

	changeImage(sprite) {
		//Change this enemies sprite to the passed in sprite
		this.sprite = sprite;
		const image = window.gameDom.getEnemyElement(this.id).querySelector("img");
		image.setAttribute("src", this.sprite);
	}

	move(xMove, yMove) {
		//Move the enemy by the provided coordinates
		this.x += xMove;
		this.y += yMove;
		Object.assign(window.gameDom.getEnemyElement(this.id).style, {
			top: this.y + "px",
			left: this.x + "px"
		});
	}

	die() {
		//Get rid of the enemy from the document
		window.gameDom.getEnemyElement(this.id).remove();
	}
}

window.Enemy = Enemy;

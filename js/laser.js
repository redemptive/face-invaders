class Laser {
	constructor(x, y, ySpeed, height, width, id, className) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.id = id;
		this.ySpeed = ySpeed;
		this.className = className;
	}

	move() {
		//Function for moving the laser based on it's ySpeed
		this.y += this.ySpeed;
		window.gameDom.setStyles("." + this.className, { top: this.y + "px" });
	}

	buildHtml() {
		//Build required HTML for the laser
		return `<div id="${this.id}" class="${this.className}" style="height: ${this.height}px; width: ${this.width}px; top: ${this.y}px;left: ${this.x}px;"></div>`;
	}

	die() {
		//Get rid of the laser when this function is called
		window.gameDom.removeAll("." + this.className);
	}
}

window.Laser = Laser;

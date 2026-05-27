class Laser {
	constructor(x, y, ySpeed, height, width, id, className) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.id = id;
		this.ySpeed = ySpeed;
		this.className = className;
		this.element = null;
	}

	move() {
		//Function for moving the laser based on it's ySpeed
		this.y += this.ySpeed;
		this.element.style.top = this.y + "px";
	}

	buildElement() {
		//Build required DOM for the laser
		this.element = document.createElement("div");
		this.element.id = this.id;
		this.element.className = this.className;
		Object.assign(this.element.style, {
			height: this.height + "px",
			width: this.width + "px",
			top: this.y + "px",
			left: this.x + "px"
		});

		return this.element;
	}

	die() {
		//Get rid of the laser when this function is called
		this.element.remove();
	}
}

window.Laser = Laser;

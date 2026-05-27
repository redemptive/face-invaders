document.addEventListener("DOMContentLoaded", () => {

	let game;

	const appendHtml = (html) => document.body.insertAdjacentHTML("beforeend", html);
	const setText = (selector, text) => {
		const element = document.querySelector(selector);
		if (element) {
			element.textContent = text;
		}
	};
	const setStyles = (selector, styles) => {
		document.querySelectorAll(selector).forEach((element) => {
			Object.assign(element.style, styles);
		});
	};
	const removeAll = (selector) => {
		document.querySelectorAll(selector).forEach((element) => element.remove());
	};
	const getAlienElement = (id) => document.querySelector(".alien[id=\"" + id + "\"]");
	
	//Game constructor
	function Game(player, playerLaser, aliens, alienLaser, alienSprites, alienNumber, aliensPerRow, alienDirection, alienFireCounter, alienFireCooldown, animateCounter, animateIndex, animateSpeed, endGame, keyMap, score) {
		this.player = player;
		this.playerLaser = playerLaser;
		this.aliens = aliens;
		this.alienLaser = alienLaser;
		this.alienSprites = alienSprites;
		this.alienNumber = alienNumber;
		this.aliensPerRow = aliensPerRow;
		this.alienDirection = alienDirection;
		this.alienFireCounter = alienFireCounter;
		this.alienFireCooldown = alienFireCooldown;
		this.animateCounter = animateCounter;
		this.animateIndex = animateIndex;
		this.animateSpeed = animateSpeed;
		this.endGame = endGame;
		this.keyMap = keyMap;
		this.score = score;
		//function calls
		this.spawnAliens();
		this.initScreen();
		this.interval = setInterval(() => this.gameLoop(), 20);
	}

	Game.prototype.initScreen = function() {
		//Draw player, score and lives to the screen
		appendHtml(this.player.buildHtml());
		appendHtml("<div id=\"score\">Score: " + this.score + "</div>");
		appendHtml("<div id=\"lives\">Lives: " + this.player.lives + "</div>");
	}

	Game.prototype.updateHud = function() {
		//Update score and lives when they change
		setText("#score", "Score: " + this.score);
		setText("#lives", "Lives: " + this.player.lives);
	}
                          
	Game.prototype.spawnAliens = function() {
		//For the current number of aliens, put a new Alien in the aliens array and put it on the screen
		this.alienNumber ++;
		for (let i = 0; i <	this.alienNumber; i++) {
			if (i < this.aliensPerRow) {
				this.aliens[i] = new Alien(i*100, 0, i, 100, 100, this.alienSprites[this.animateIndex]);
			} else {
				this.aliens[i] = new Alien((i - 5)*100, 120, i, 100, 100, this.alienSprites[this.animateIndex]);
			}
			appendHtml(this.aliens[i].buildHtml());
		}
	}

	Game.prototype.checkKeys = function() {
		//Check the keys and perform appropriate actions
		//D key (right)
		if (this.keyMap[68] && this.player.x < window.innerWidth - 10 - this.player.width) {
			this.player.move(10,0);
		} else if (this.keyMap[65] && this.player.x > 10) {
			//A key (left)
			this.player.move(-10,0);
		} else if (this.keyMap[71] && this.playerLaser === "") {
			//G key (fire)
			this.playerLaser = new Laser(this.player.x, this.player.y, -10, 25, 10, 0, "bullet");
			appendHtml(this.playerLaser.buildHtml());
		}
	}

	Game.prototype.collission = function(x1,y1,w1,h1,x2,y2,w2,h2) {
		//Check for collissions (bounding box)
		const r1 = w1 + x1;
		const b1 = h1 + y1;
		const r2 = w2 + x2;
		const b2 = h2 + y2;
						
		return x1 < r2 && r1 > x2 && y1 < b2 && b1 > y2;
	}

	Game.prototype.manageLasers = function() {
		//Remove the lasers when they leave the screen
		if (this.playerLaser !== "") {
			this.playerLaser.move(0,-10);
			if (this.playerLaser.y < 0) {
				this.playerLaser.die();
				this.playerLaser = "";
			}
		}
		if (this.alienLaser !== "") {
			this.alienLaser.move();
			if (this.alienLaser.y > window.innerHeight) {
				this.alienLaser.die();
				this.alienLaser = "";
			}
		}
	}

	Game.prototype.manageAliens = function() {
		//Find the leftmost and rightmost aliens
		let highestX = 0;
		let lowestX = 0;
		for (let i = 0; i < this.aliens.length; i++) {
			if (this.aliens[i].x > this.aliens[highestX].x) {
				highestX = i;
			} else if (this.aliens[i].x < this.aliens[lowestX].x) {
				lowestX = i;
			}
		}
		//Find which direction the aliens should be going
		if (this.aliens[highestX].x > window.innerWidth - this.aliens[0].width && this.alienDirection === "right") {
			this.alienDirection = "left";
		} else if (this.aliens[lowestX].x < 0 && this.alienDirection === "left") {
			this.alienDirection = "right";
		}
		//Manage the animate counter for animating the aliens by changing sprites
		if (this.animateCounter > this.animateSpeed) {
			this.animateCounter = 0;
			if (this.animateIndex < this.alienSprites.length) {
				this.animateIndex ++;
			} else {
				this.animateIndex = 0;
			}
		} else {
			this.animateCounter ++;
		}
		//Loop through all aliens
		for (let i = 0; i < this.aliens.length; i++) {
			//Change the alien sprites for animation if it is time
			if (this.alienSprites[this.animateIndex] !== this.aliens[i].sprite) {
				this.aliens[i].changeImage(this.alienSprites[this.animateIndex]);
			}
			//Move the aliens based on the current direction
			if (this.alienDirection === "right") {
				this.aliens[i].move(5 + (this.score/2),this.score / 40);
			} else {
				this.aliens[i].move(-5 - (this.score/2),this.score / 40);
			}
			//Check if the player has shot an alien
			if (this.playerLaser !== "") {
				if (this.collission(this.aliens[i].x, this.aliens[i].y, this.aliens[i].width, this.aliens[i].height,this.playerLaser.x, this.playerLaser.y, this.playerLaser.width, this.playerLaser.height)) {
					this.score ++;
					this.updateHud();
					this.aliens[i].die();
					this.aliens.splice(this.aliens.indexOf(this.aliens[i]),1);
					this.playerLaser.die();
					this.playerLaser = "";
				}
			}
		}
		//Make a random alien shoot a laser if it is time
		if (this.alienFireCooldown < this.alienFireCounter && this.alienLaser === "") {
			const randomAlien = Math.floor(Math.random() * this.aliens.length);
			this.alienLaser = new Laser(this.aliens[randomAlien].x, this.aliens[randomAlien].y, 6 + this.score, 25, 10, 0, "alienLaser");
			appendHtml(this.alienLaser.buildHtml());
			this.alienFireCounter = 0;
		} else {
			this.alienFireCounter++;
			this.alienFireCooldown = 200 - (this.score * 4);
		}
		//Spawn more aliens if there is none left
		if (this.aliens.length < 1) {
			this.spawnAliens();
		}
	}

	Game.prototype.gameLoop = function() {
		//Main game loop
		//If the player has not died yet
		if (!this.endGame) {
			this.manageLasers();
			this.checkKeys();
			this.manageAliens();
			if (this.alienLaser !== "") {
				if (this.collission(this.player.x, this.player.y, this.player.width, this.player.height, this.alienLaser.x, this.alienLaser.y, this.alienLaser.width, this.alienLaser.height)) {
					this.alienLaser.die();
					this.alienLaser = "";
					this.player.lives --;
					this.updateHud();
					this.player.changeSprite();
					if (this.player.lives < 1) {
						this.endGame = true;
					}
				}
			}
			//End game if the aliens reach the bottom of the screen
			if (this.aliens[0].y > window.innerHeight - this.player.height - this.aliens[0].height) {
				this.endGame = true;
			}
		//If the game has ended
		} else {
			//Stop running game loop and display the score
			clearInterval(this.interval);
			document.body.innerHTML = "";
			appendHtml("<div class=\"endGame\"><h2>You died! Score: " + this.score + "</h2></div>");
		}
	}

	//Player constructor
	function Player(x, y, height, width, lives, sprites) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.lives = lives;
		this.sprites = sprites;
	}

	Player.prototype.move = function(xMove, yMove) {
		//Function for moving the player
		this.x += xMove;
		this.y += yMove;
		setStyles("#player", {
			top: this.y + "px",
			left: this.x + "px"
		});
	}

	Player.prototype.buildHtml = function() {
		//Put together the required HTML for the player
		return "<div id=\"player\"><img id=\"playerImg\" src=\"" + this.sprites[this.lives - 1] + "\" width=\"" + this.width + "\" height=\"" + this.height + "\"></div>";
	}

	Player.prototype.changeSprite = function() {
		//Change the player sprite if the player has been shot and is damaged
		document.querySelector("#playerImg").setAttribute("src", this.sprites[this.lives - 1]);
	}

	//Laser constructor
	function Laser(x, y, ySpeed, height, width, id, className) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.id = id;
		this.ySpeed = ySpeed;
		this.className = className;
	}

	Laser.prototype.move = function() {
		//Function for moving the laser based on it's ySpeed
		this.y += this.ySpeed;
		setStyles("." + this.className, { top: this.y + "px" });
	}

	Laser.prototype.buildHtml = function() {
		//Build required HTML for the laser
		return "<div id=\"" + this.id + "\" class=\""+ this.className + "\" style=\"height: " + this.height + "px; width: " + this.width + "px; top: " + this.y + "px;left: " + this.x + "px;\"></div>";
	}

	Laser.prototype.die = function() {
		//Get rid of the laser when this function is called
		removeAll("." + this.className);
	}

	//Alien constructor
	function Alien(x, y, id, height, width, sprite) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.height = height;
		this.width = width;
		this.sprite = sprite;
	}

	Alien.prototype.buildHtml = function() {
		//Build required HTML for the Alien
		return "<div id=\"" + this.id + "\" class=\"alien\" style=\"height:" + this.height + "px; width: " + this.width + "px; top: " + this.y + "px;left: " + this.x + "px;\"><img src=\"" + this.sprite + "\" class=\"alien-img\"></div>";
	}

	Alien.prototype.changeImage = function(sprite) {
		//Change this aliens sprite to the passed in sprite
		this.sprite = sprite;
		const image = getAlienElement(this.id).querySelector("img");
		image.setAttribute("src", this.sprite);
	}

	Alien.prototype.move = function(xMove, yMove) {
		//Move the alien by the provided coordinates
		this.x += xMove;
		this.y += yMove;
		Object.assign(getAlienElement(this.id).style, {
			top: this.y + "px",
			left: this.x + "px"
		});
	}

	Alien.prototype.die = function() {
		//Get rid of the alien from the document
		getAlienElement(this.id).remove();
	}

	function init() {
		//Create a new game object
		game = new Game(new Player(20, window.innerHeight - 60, 50, 50, 3,["assets/player2.png","assets/player1.png","assets/player.png"]), "", [], "", ["assets/alien.png", "assets/alien1.png", "assets/alien2.png"], 0, 5,"right", 0, 200, 0, 0, 25, false, {68: false, 65: false, 71: false}, 0);
	}

	//Key handlers
	document.addEventListener("keydown", (e) => {
		if (e.keyCode in game.keyMap) {
			game.keyMap[e.keyCode] = true;
		}
	});
	document.addEventListener("keyup", (e) => {
		if (e.keyCode in game.keyMap) {
			game.keyMap[e.keyCode] = false;
		}
	});
	init();
});

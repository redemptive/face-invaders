class Game {
	constructor(player, playerLaser, enemies, enemyLaser, enemySprites, enemyNumber, enemiesPerRow, enemyDirection, enemyFireCounter, enemyFireCooldown, animateCounter, animateIndex, animateSpeed, endGame, keyMap, score) {
		this.player = player;
		this.playerLaser = playerLaser;
		this.enemies = enemies;
		this.enemyLaser = enemyLaser;
		this.enemySprites = enemySprites;
		this.enemyNumber = enemyNumber;
		this.enemiesPerRow = enemiesPerRow;
		this.enemyDirection = enemyDirection;
		this.enemyFireCounter = enemyFireCounter;
		this.enemyFireCooldown = enemyFireCooldown;
		this.animateCounter = animateCounter;
		this.animateIndex = animateIndex;
		this.animateSpeed = animateSpeed;
		this.endGame = endGame;
		this.keyMap = keyMap;
		this.score = score;
		//function calls
		this.spawnEnemies();
		this.initScreen();
		this.interval = setInterval(() => this.gameLoop(), window.gameConfig.game.loopMs);
	}

	initScreen() {
		//Draw player, score and lives to the screen
		window.gameDom.appendHtml(this.player.buildHtml());
		window.gameDom.appendHtml(`<div id="score">Score: ${this.score}</div>`);
		window.gameDom.appendHtml(`<div id="lives">Lives: ${this.player.lives}</div>`);
	}

	updateHud() {
		//Update score and lives when they change
		window.gameDom.setText("#score", `Score: ${this.score}`);
		window.gameDom.setText("#lives", `Lives: ${this.player.lives}`);
	}

	spawnEnemies() {
		const config = window.gameConfig;

		//For the current number of enemies, put a new Enemy in the enemies array and put it on the screen
		this.enemyNumber ++;
		for (let i = 0; i <	this.enemyNumber; i++) {
			if (i < this.enemiesPerRow) {
				this.enemies[i] = new window.Enemy(
					i * config.enemies.spacingX,
					config.enemies.initialY,
					i,
					config.enemies.height,
					config.enemies.width,
					this.enemySprites[this.animateIndex]
				);
			} else {
				this.enemies[i] = new window.Enemy(
					(i - this.enemiesPerRow) * config.enemies.spacingX,
					config.enemies.spacingY,
					i,
					config.enemies.height,
					config.enemies.width,
					this.enemySprites[this.animateIndex]
				);
			}
			window.gameDom.appendHtml(this.enemies[i].buildHtml());
		}
	}

	checkKeys() {
		const config = window.gameConfig;

		//Check the keys and perform appropriate actions
		if (this.keyMap[config.controls.right] && this.player.x < window.innerWidth - config.player.screenPadding - this.player.width) {
			this.player.move(config.player.moveStep, 0);
		} else if (this.keyMap[config.controls.left] && this.player.x > config.player.screenPadding) {
			this.player.move(-config.player.moveStep, 0);
		} else if (this.keyMap[config.controls.fire] && this.playerLaser === "") {
			this.playerLaser = new window.Laser(
				this.player.x,
				this.player.y,
				config.playerLaser.speed,
				config.playerLaser.height,
				config.playerLaser.width,
				config.playerLaser.id,
				config.playerLaser.className
			);
			window.gameDom.appendHtml(this.playerLaser.buildHtml());
		}
	}

	collision(x1,y1,w1,h1,x2,y2,w2,h2) {
		//Check for collisions (bounding box)
		const r1 = w1 + x1;
		const b1 = h1 + y1;
		const r2 = w2 + x2;
		const b2 = h2 + y2;

		return x1 < r2 && r1 > x2 && y1 < b2 && b1 > y2;
	}

	manageLasers() {
		//Remove the lasers when they leave the screen
		if (this.playerLaser !== "") {
			this.playerLaser.move();
			if (this.playerLaser.y < 0) {
				this.playerLaser.die();
				this.playerLaser = "";
			}
		}
		if (this.enemyLaser !== "") {
			this.enemyLaser.move();
			if (this.enemyLaser.y > window.innerHeight) {
				this.enemyLaser.die();
				this.enemyLaser = "";
			}
		}
	}

	manageEnemies() {
		const config = window.gameConfig;

		//Find the leftmost and rightmost enemies
		let highestX = 0;
		let lowestX = 0;
		for (let i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].x > this.enemies[highestX].x) {
				highestX = i;
			} else if (this.enemies[i].x < this.enemies[lowestX].x) {
				lowestX = i;
			}
		}
		//Find which direction the enemies should be going
		if (this.enemies[highestX].x > window.innerWidth - this.enemies[0].width && this.enemyDirection === "right") {
			this.enemyDirection = "left";
		} else if (this.enemies[lowestX].x < 0 && this.enemyDirection === "left") {
			this.enemyDirection = "right";
		}
		//Manage the animate counter for animating the enemies by changing sprites
		if (this.animateCounter > this.animateSpeed) {
			this.animateCounter = 0;
			if (this.animateIndex < this.enemySprites.length) {
				this.animateIndex ++;
			} else {
				this.animateIndex = 0;
			}
		} else {
			this.animateCounter ++;
		}
		//Loop through all enemies
		for (let i = 0; i < this.enemies.length; i++) {
			//Change the enemy sprites for animation if it is time
			if (this.enemySprites[this.animateIndex] !== this.enemies[i].sprite) {
				this.enemies[i].changeImage(this.enemySprites[this.animateIndex]);
			}
			//Move the enemies based on the current direction
			if (this.enemyDirection === "right") {
				this.enemies[i].move(config.enemies.moveStep + (this.score / config.enemies.speedScoreDivisor), this.score / config.enemies.descentScoreDivisor);
			} else {
				this.enemies[i].move(-config.enemies.moveStep - (this.score / config.enemies.speedScoreDivisor), this.score / config.enemies.descentScoreDivisor);
			}
			//Check if the player has shot an enemy
			if (this.playerLaser !== "") {
				if (this.collision(this.enemies[i].x, this.enemies[i].y, this.enemies[i].width, this.enemies[i].height,this.playerLaser.x, this.playerLaser.y, this.playerLaser.width, this.playerLaser.height)) {
					this.score ++;
					this.updateHud();
					this.enemies[i].die();
					this.enemies.splice(this.enemies.indexOf(this.enemies[i]),1);
					this.playerLaser.die();
					this.playerLaser = "";
				}
			}
		}
		//Make a random enemy shoot a laser if it is time
		if (this.enemyFireCooldown < this.enemyFireCounter && this.enemyLaser === "") {
			const randomEnemy = Math.floor(Math.random() * this.enemies.length);
			this.enemyLaser = new window.Laser(
				this.enemies[randomEnemy].x,
				this.enemies[randomEnemy].y,
				config.enemyLaser.speedBase + this.score,
				config.enemyLaser.height,
				config.enemyLaser.width,
				config.enemyLaser.id,
				config.enemyLaser.className
			);
			window.gameDom.appendHtml(this.enemyLaser.buildHtml());
			this.enemyFireCounter = 0;
		} else {
			this.enemyFireCounter++;
			this.enemyFireCooldown = config.enemies.fireCooldown - (this.score * config.enemies.fireCooldownScoreMultiplier);
		}
		//Spawn more enemies if there is none left
		if (this.enemies.length < 1) {
			this.spawnEnemies();
		}
	}

	gameLoop() {
		//Main game loop
		//If the player has not died yet
		if (!this.endGame) {
			this.manageLasers();
			this.checkKeys();
			this.manageEnemies();
			if (this.enemyLaser !== "") {
				if (this.collision(this.player.x, this.player.y, this.player.width, this.player.height, this.enemyLaser.x, this.enemyLaser.y, this.enemyLaser.width, this.enemyLaser.height)) {
					this.enemyLaser.die();
					this.enemyLaser = "";
					this.player.lives --;
					this.updateHud();
					this.player.changeSprite();
					if (this.player.lives < 1) {
						this.endGame = true;
					}
				}
			}
			//End game if the enemies reach the bottom of the screen
			if (this.enemies[0].y > window.innerHeight - this.player.height - this.enemies[0].height) {
				this.endGame = true;
			}
		//If the game has ended
		} else {
			//Stop running game loop and display the score
			clearInterval(this.interval);
			document.body.innerHTML = "";
			window.gameDom.appendHtml(`<div class="endGame"><h2>You died! Score: ${this.score}</h2></div>`);
		}
	}
}

window.Game = Game;

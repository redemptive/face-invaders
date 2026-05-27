class Game {
	constructor(player, playerLaser, enemies, enemyLasers, enemySprites, enemyNumber, enemiesPerRow, enemyDirection, animateCounter, animateIndex, animateSpeed, endGame, keyMap, score) {
		this.player = player;
		this.playerLaser = playerLaser;
		this.enemies = enemies;
		this.enemyLasers = enemyLasers;
		this.enemySprites = enemySprites;
		this.enemyNumber = enemyNumber;
		this.enemiesPerRow = enemiesPerRow;
		this.enemyDirection = enemyDirection;
		this.animateCounter = animateCounter;
		this.animateIndex = this.enemySprites.length ? animateIndex % this.enemySprites.length : 0;
		this.animateSpeed = animateSpeed;
		this.endGame = endGame;
		this.keyMap = keyMap;
		this.score = score;
		this.scoreElement = null;
		this.livesElement = null;
		//function calls
		this.spawnEnemies();
		this.initScreen();
		this.interval = setInterval(() => this.gameLoop(), window.gameConfig.game.loopMs);
	}

	initScreen() {
		//Draw player, score and lives to the screen
		window.gameDom.appendElement(this.player.buildElement());

		this.scoreElement = document.createElement("div");
		this.scoreElement.id = "score";
		this.scoreElement.textContent = `Score: ${this.score}`;
		window.gameDom.appendElement(this.scoreElement);

		this.livesElement = document.createElement("div");
		this.livesElement.id = "lives";
		this.livesElement.textContent = `Lives: ${this.player.lives}`;
		window.gameDom.appendElement(this.livesElement);
	}

	updateHud() {
		//Update score and lives when they change
		this.scoreElement.textContent = `Score: ${this.score}`;
		this.livesElement.textContent = `Lives: ${this.player.lives}`;
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
			window.gameDom.appendElement(this.enemies[i].buildElement());
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
				config.playerLaser.className,
				config.playerLaser.sprite
			);
			window.gameDom.appendElement(this.playerLaser.buildElement());
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
		for (let i = this.enemyLasers.length - 1; i >= 0; i--) {
			this.enemyLasers[i].move();
			if (this.enemyLasers[i].y > window.innerHeight) {
				this.enemyLasers[i].die();
				this.enemyLasers.splice(i, 1);
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
			if (this.enemySprites.length > 0) {
				this.animateIndex = (this.animateIndex + 1) % this.enemySprites.length;
			}
		} else {
			this.animateCounter ++;
		}
		//Loop through all enemies
		for (let i = 0; i < this.enemies.length; i++) {
			//Change the enemy sprites for animation if it is time
			if (!this.enemies[i].isUsingTemporarySprite && this.enemySprites[this.animateIndex] !== this.enemies[i].sprite) {
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
		this.queueRandomEnemyLaser();
		//Spawn more enemies if there is none left
		if (this.enemies.length < 1) {
			this.spawnEnemies();
		}
	}

	queueRandomEnemyLaser() {
		const config = window.gameConfig;

		if (this.enemies.length < 1) {
			return;
		}

		for (let i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].shouldQueueLaser(config.game.loopMs, config.enemies.fireAverageMs)) {
				this.queueEnemyLaser(this.enemies[i]);
			}
		}
	}

	queueEnemyLaser(enemy) {
		const config = window.gameConfig;

		enemy.showTemporaryImage(config.enemyLaser.warningSprite);

		setTimeout(() => {
			if (this.endGame || !this.enemies.includes(enemy) || !enemy.element) {
				return;
			}

			const enemyLaser = new window.Laser(
				enemy.x,
				enemy.y,
				config.enemyLaser.speedBase + this.score,
				config.enemyLaser.height,
				config.enemyLaser.width,
				config.enemyLaser.id,
				config.enemyLaser.className,
				config.enemyLaser.sprite
			);
			this.enemyLasers.push(enemyLaser);
			window.gameDom.appendElement(enemyLaser.buildElement());
			enemy.showTemporaryImage(config.enemyLaser.firedSprite);

			setTimeout(() => {
				if (!this.endGame && this.enemies.includes(enemy) && enemy.element) {
					enemy.resumeAnimation(this.enemySprites[this.animateIndex]);
				}
			}, config.enemyLaser.recoveryMs);
		}, config.enemyLaser.warningMs);
	}

	checkEnemyLaserHits() {
		for (let i = this.enemyLasers.length - 1; i >= 0; i--) {
			if (this.collision(this.player.x, this.player.y, this.player.width, this.player.height, this.enemyLasers[i].x, this.enemyLasers[i].y, this.enemyLasers[i].width, this.enemyLasers[i].height)) {
				this.enemyLasers[i].die();
				this.enemyLasers.splice(i, 1);
				this.player.lives --;
				this.updateHud();
				this.player.changeSprite();
				if (this.player.lives < 1) {
					this.endGame = true;
					return;
				}
			}
		}
	}

	gameLoop() {
		//Main game loop
		//If the player has not died yet
		if (!this.endGame) {
			this.manageLasers();
			this.checkKeys();
			this.manageEnemies();
			this.checkEnemyLaserHits();
			//End game if the enemies reach the bottom of the screen
			if (this.enemies[0].y > window.innerHeight - this.player.height - this.enemies[0].height) {
				this.endGame = true;
			}
		//If the game has ended
		} else {
			//Stop running game loop and display the score
			clearInterval(this.interval);
			document.body.replaceChildren();

			const endGameElement = document.createElement("div");
			endGameElement.className = "endGame";
			const heading = document.createElement("h2");
			heading.textContent = `You died! Score: ${this.score}`;
			endGameElement.appendChild(heading);
			window.gameDom.appendElement(endGameElement);
		}
	}
}

window.Game = Game;

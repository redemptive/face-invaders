window.gameConfig = {
	game: {
		loopMs: 20,
		initialScore: 0
	},
	controls: {
		left: "KeyA",
		right: "KeyD",
		fire: "KeyG"
	},
	player: {
		x: 20,
		bottomOffset: 60,
		height: 50,
		width: 50,
		lives: 3,
		moveStep: 10,
		screenPadding: 10,
		sprites: [
			"assets/player2.png",
			"assets/player1.png",
			"assets/player.png"
		]
	},
	playerLaser: {
		speed: -10,
		height: 25,
		width: 10,
		id: 0,
		className: "bullet"
	},
	aliens: {
		initialNumber: 0,
		perRow: 5,
		direction: "right",
		height: 100,
		width: 100,
		spacingX: 100,
		spacingY: 120,
		initialY: 0,
		moveStep: 5,
		speedScoreDivisor: 2,
		descentScoreDivisor: 40,
		fireCounter: 0,
		fireCooldown: 200,
		fireCooldownScoreMultiplier: 4,
		sprites: [
			"assets/alien.png",
			"assets/alien1.png",
			"assets/alien2.png"
		]
	},
	alienLaser: {
		speedBase: 6,
		height: 25,
		width: 10,
		id: 0,
		className: "alienLaser"
	},
	animation: {
		counter: 0,
		index: 0,
		speed: 25
	}
};

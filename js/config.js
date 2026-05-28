window.gameConfig = {
	game: {
		loopMs: 20,
		initialScore: 0
	},
	controls: {
		left: "KeyA",
		right: "KeyD",
		fire: "Space"
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
			"assets/skull.png",
			"assets/imp.png",
			"assets/smiling_imp.png"
		]
	},
	playerLaser: {
		speed: -15,
		height: 25,
		width: 25,
		id: 0,
		className: "bullet",
		sprite: "assets/middle_finger.png",
		cooldownMs: 1000
	},
	enemies: {
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
		fireAverageMs: 5000,
		sprites: [
			"assets/smile.png",
			"assets/grin.png",
			"assets/laughing.png"
		]
	},
	enemyLaser: {
		speedBase: 8,
		height: 25,
		width: 25,
		id: 0,
		className: "enemyLaser",
		sprite: "assets/microbe.png",
		warningSprite: "assets/nauseated_face.png",
		firedSprite: "assets/face_vomiting.png",
		warningMs: 1000,
		recoveryMs: 1000
	},
	animation: {
		counter: 0,
		index: 0,
		speed: 25
	}
};

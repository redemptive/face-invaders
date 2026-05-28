document.addEventListener("DOMContentLoaded", () => {
	let game;
	const config = window.gameConfig;

	function init() {
		//Create a new game object
		const player = new window.Player(
			config.player.x,
			window.innerHeight - config.player.bottomOffset - config.player.height,
			config.player.height,
			config.player.width,
			config.player.lives,
			config.player.sprites
		);
		const keyMap = {
			[config.controls.left]: false,
			[config.controls.right]: false,
			[config.controls.fire]: false
		};

		game = new window.Game(
			player,
			[],
			[],
			[],
			config.enemies.sprites,
			config.enemies.initialNumber,
			config.enemies.perRow,
			config.enemies.direction,
			config.animation.counter,
			config.animation.index,
			config.animation.speed,
			false,
			keyMap,
			config.game.initialScore
		);
	}

	//Key handlers
	document.addEventListener("keydown", (e) => {
		if (e.code in game.keyMap) {
			game.keyMap[e.code] = true;
		}
	});
	document.addEventListener("keyup", (e) => {
		if (e.code in game.keyMap) {
			game.keyMap[e.code] = false;
		}
	});
	init();
});

document.addEventListener("DOMContentLoaded", () => {
	let game;
	const config = window.gameConfig;
	const touchControlsQuery = window.matchMedia("(hover: none) and (pointer: coarse)");

	function isTouchControlsEnabled() {
		return touchControlsQuery.matches;
	}

	function init() {
		const playerBottomOffset = isTouchControlsEnabled() ? config.player.mobileBottomOffset : config.player.bottomOffset;

		//Create a new game object
		const player = new window.Player(
			config.player.x,
			window.innerHeight - playerBottomOffset - config.player.height,
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

		if (isTouchControlsEnabled()) {
			initTouchControls();
		}
	}

	function initTouchControls() {
		if (document.getElementById("touchControls")) {
			return;
		}

		const controls = document.createElement("div");
		controls.id = "touchControls";
		controls.setAttribute("aria-label", "Touch controls");

		addTouchButton(controls, "Left", config.controls.left);
		addTouchButton(controls, "Fire", config.controls.fire);
		addTouchButton(controls, "Right", config.controls.right);

		document.body.appendChild(controls);
	}

	function addTouchButton(controls, label, keyCode) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = `touchControl touchControl${label}`;
		button.textContent = label;
		button.setAttribute("aria-label", label);

		button.addEventListener("pointerdown", (e) => {
			e.preventDefault();
			button.setPointerCapture(e.pointerId);
			game.keyMap[keyCode] = true;
		});

		button.addEventListener("pointerup", (e) => {
			e.preventDefault();
			game.keyMap[keyCode] = false;
		});

		button.addEventListener("pointercancel", () => {
			game.keyMap[keyCode] = false;
		});

		button.addEventListener("lostpointercapture", () => {
			game.keyMap[keyCode] = false;
		});

		controls.appendChild(button);
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

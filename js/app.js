document.addEventListener("DOMContentLoaded", () => {
	let game;
	const config = window.gameConfig;
	const touchControlsQuery = window.matchMedia("(hover: none) and (pointer: coarse)");

	function isTouchControlsEnabled() {
		return touchControlsQuery.matches;
	}

	function applyMobileSizing() {
		if (config.game.isMobileSized) {
			return;
		}

		const scale = config.game.mobileScale;
		config.player.x *= scale;
		config.player.height *= scale;
		config.player.width *= scale;
		config.player.moveStep *= scale;
		config.player.screenPadding *= scale;
		config.enemies.height *= scale;
		config.enemies.width *= scale;
		config.enemies.spacingX *= scale;
		config.enemies.spacingY *= scale;
		config.enemies.moveStep *= scale;
		config.game.isMobileSized = true;
	}

	function init() {
		if (isTouchControlsEnabled()) {
			applyMobileSizing();
		}

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

		function pressButton(e) {
			e.preventDefault();
			game.keyMap[keyCode] = true;
		}

		function releaseButton(e) {
			if (e) {
				e.preventDefault();
			}
			game.keyMap[keyCode] = false;
		}

		button.addEventListener("pointerdown", (e) => {
			if (button.setPointerCapture) {
				button.setPointerCapture(e.pointerId);
			}
			pressButton(e);
		});

		button.addEventListener("pointerup", releaseButton);
		button.addEventListener("pointercancel", releaseButton);
		button.addEventListener("lostpointercapture", releaseButton);
		button.addEventListener("touchstart", pressButton, { passive: false });
		button.addEventListener("touchend", releaseButton, { passive: false });
		button.addEventListener("touchcancel", releaseButton, { passive: false });
		button.addEventListener("contextmenu", (e) => e.preventDefault());

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

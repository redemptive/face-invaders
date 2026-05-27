window.gameDom = {
	appendHtml(html) {
		document.body.insertAdjacentHTML("beforeend", html);
	},

	setText(selector, text) {
		const element = document.querySelector(selector);
		if (element) {
			element.textContent = text;
		}
	},

	setStyles(selector, styles) {
		document.querySelectorAll(selector).forEach((element) => {
			Object.assign(element.style, styles);
		});
	},

	removeAll(selector) {
		document.querySelectorAll(selector).forEach((element) => element.remove());
	},

	getEnemyElement(id) {
		return document.querySelector(`.enemy[id="${id}"]`);
	}
};

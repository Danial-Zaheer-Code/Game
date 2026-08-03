export class DOMDisplay {
	static scale = 15;
	static lives = 3;

	static element(name, className) {
		const elem = document.createElement(name);
		if (className) elem.className = className;
		return elem;
	}

	constructor(parent, level, currentLevelIndex = 0, totalLevels = 9) {
		this.level = level;
		this.currentLevelIndex = currentLevelIndex;
		this.totalLevels = totalLevels;
		this.wrap = parent.appendChild(DOMDisplay.element('div', 'game'));
		this.actorLayer = null;
		this.wrap.style.position = "relative";

		this._setupHUD();
		this.wrap.appendChild(this._drawBackground());
		this.drawFrame();
	}

	_setupHUD() {
		const hudLevel = document.getElementById('hudLevel');
		if (hudLevel) hudLevel.textContent = `Level ${this.currentLevelIndex + 1} / ${this.totalLevels}`;

		const hudMode = document.getElementById('hudMode');
		if (hudMode) {
			const difficulty = (this.level.difficulty || 'normal').toUpperCase();
			hudMode.textContent = difficulty;
			hudMode.className = `hud-mode mode-${difficulty.toLowerCase()}`;
		}

		this._updateLivesDisplay();
	}

	_updateLivesDisplay() {
		const hudLives = document.getElementById('hudLives');
		if (!hudLives) return;
		hudLives.innerHTML = '';

		for (let i = 0; i < DOMDisplay.lives; i++) {
			const heartImg = document.createElement("img");
			heartImg.src = "../images/heart.png";
			heartImg.alt = "Heart";
			heartImg.style.width = "22px";
			heartImg.style.marginLeft = "4px";
			hudLives.appendChild(heartImg);
		}
	}

	_updateCoinsDisplay() {
		const hudCoins = document.getElementById('hudCoins');
		if (hudCoins) {
			hudCoins.textContent = `🪙 ${this.level.collectedCoins} / ${this.level.totalCoins}`;
		}
	}

	_drawBackground() {
		const table = DOMDisplay.element('table', 'background');
		table.style.width = this.level.width * DOMDisplay.scale + 'px';
		table.style.height = this.level.height * DOMDisplay.scale + 'px';

		this.level.grid.forEach(row => {
			const rowElement = table.appendChild(DOMDisplay.element('tr'));
			rowElement.style.height = DOMDisplay.scale + 'px';
			row.forEach(type => {
				rowElement.appendChild(DOMDisplay.element('td', type));
			});
		});

		return table;
	}

	_drawActors() {
		const wrap = DOMDisplay.element('div');

		this.level.actors.forEach(actor => {
			const rect = wrap.appendChild(DOMDisplay.element('div', 'actor ' + actor.type));
			rect.style.width = actor.size.x * DOMDisplay.scale + 'px';
			rect.style.height = actor.size.y * DOMDisplay.scale + 'px';
			rect.style.left = actor.pos.x * DOMDisplay.scale + 'px';
			rect.style.top = actor.pos.y * DOMDisplay.scale + 'px';

			if (actor.type === 'turret') {
				const barrel = rect.appendChild(DOMDisplay.element('div', 'turret-barrel'));
				barrel.style.transform = `rotate(${actor.angle}rad)`;
			} else if (actor.type === 'cannon') {
				const barrel = rect.appendChild(DOMDisplay.element('div', 'cannon-barrel'));
				barrel.style.transform = `rotate(${actor.angle}rad)`;
			} else if (actor.type === 'bullet' && actor.angle !== undefined) {
				rect.style.transform = `rotate(${actor.angle}rad)`;
			} else if (actor.type === 'cannonBall' && actor.angle !== undefined) {
				rect.style.transform = `rotate(${actor.angle}rad)`;
			} else if (actor.type === 'explosion') {
				const scale = actor.progress !== undefined ? actor.progress : 1;
				const opacity = 1 - (actor.progress || 0);
				rect.style.transform = `scale(${0.3 + scale * 0.7})`;
				rect.style.opacity = Math.max(0.1, opacity);
			} else if (actor.emitterPos) {
				rect.classList.add('laser-beam', `laser-${actor.axis}`);
				// Render Laser Emitter Starting Block
				const emitter = wrap.appendChild(DOMDisplay.element('div', `actor laser-emitter laser-${actor.axis} ${actor.state}`));
				emitter.style.width = DOMDisplay.scale + 'px';
				emitter.style.height = DOMDisplay.scale + 'px';
				emitter.style.left = actor.emitterPos.x * DOMDisplay.scale + 'px';
				emitter.style.top = actor.emitterPos.y * DOMDisplay.scale + 'px';
				emitter.appendChild(DOMDisplay.element('div', 'laser-nozzle'));
				emitter.appendChild(DOMDisplay.element('div', 'laser-barrel'));

				// Position beam element
				if (actor.beamPos && actor.beamSize) {
					rect.style.width = actor.beamSize.x * DOMDisplay.scale + 'px';
					rect.style.height = actor.beamSize.y * DOMDisplay.scale + 'px';
					rect.style.left = actor.beamPos.x * DOMDisplay.scale + 'px';
					rect.style.top = actor.beamPos.y * DOMDisplay.scale + 'px';
				}

				if (actor.state === 'off') {
					rect.style.display = 'none';
				} else {
					rect.style.display = 'block';
					rect.appendChild(DOMDisplay.element('div', 'laser-energy-flow'));
				}
			}
		});

		return wrap;
	}

	drawFrame() {
		if (this.actorLayer) {
			this.wrap.removeChild(this.actorLayer);
		}
		this.actorLayer = this.wrap.appendChild(this._drawActors());
		this.wrap.className = 'game ' + (this.level.status || '');
		this._updateCoinsDisplay();
		this._updateLivesDisplay();
		this._scrollPlayerIntoView();
	}

	_scrollPlayerIntoView() {
		const width = this.wrap.clientWidth;
		const height = this.wrap.clientHeight;
		const margin = width / 3;

		const left = this.wrap.scrollLeft;
		const right = left + width;
		const top = this.wrap.scrollTop;
		const bottom = top + height;

		const player = this.level.player;
		if (!player) return;
		const center = player.pos.plus(player.size.times(0.5)).times(DOMDisplay.scale);

		if (center.x < left + margin) {
			this.wrap.scrollLeft = center.x - margin;
		} else if (center.x > right - margin) {
			this.wrap.scrollLeft = center.x + margin - width;
		}

		if (center.y < top + margin) {
			this.wrap.scrollTop = center.y - margin;
		} else if (center.y > bottom - margin) {
			this.wrap.scrollTop = center.y + margin - height;
		}
	}

	clear() {
		this.wrap.parentNode.removeChild(this.wrap);
	}
}

export class DOMDisplay {
	static scale = 15;

	static element(name, className) {
		const elem = document.createElement(name);
		if (className) elem.className = className;
		return elem;
	}

	constructor(parent, level) {
		this.level = level;
		this.wrap = parent.appendChild(DOMDisplay.element('div', 'game'));
		this.actorLayer = null;

		this.wrap.appendChild(this._drawBackground());
		this.drawFrame();
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
		});

		return wrap;
	}

	drawFrame() {
		if (this.actorLayer) {
			this.wrap.removeChild(this.actorLayer);
		}
		this.actorLayer = this.wrap.appendChild(this._drawActors());
		this.wrap.className = 'game ' + (this.level.status || '');
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

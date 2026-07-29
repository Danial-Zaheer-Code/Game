export class KeyTracker {
	constructor(keyMap) {
		this.pressed = Object.create(null);
		this.keyMap = keyMap || {
			37: 'left', 65: 'left',   // Left Arrow or 'A'
			38: 'up', 87: 'up', 32: 'up', // Up Arrow or 'W' or Space
			39: 'right', 68: 'right', // Right Arrow or 'D'
			27: 'pause', 80: 'pause'  // Escape or 'P'
		};
		this._handle = this._handler.bind(this);
		this._registerEvents();
	}

	_handler(event) {
		if (this.keyMap.hasOwnProperty(event.keyCode)) {
			const isDown = event.type === 'keydown';
			this.pressed[this.keyMap[event.keyCode]] = isDown;
			if (event.keyCode !== 116 && event.keyCode !== 123) { // Allow F5 / F12
				event.preventDefault();
			}
		}
	}

	_registerEvents() {
		addEventListener('keydown', this._handle);
		addEventListener('keyup', this._handle);
	}

	get keys() {
		return this.pressed;
	}
}
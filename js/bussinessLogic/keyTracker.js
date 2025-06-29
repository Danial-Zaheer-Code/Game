export class KeyTracker {
	constructor(keyMap) {
		this.pressed = Object.create(null);
		this.keyMap = keyMap;
		this._handle = this._handler.bind(this);
		this._registerEvents();
	}

	_handler(event) {
		if (this.keyMap.hasOwnProperty(event.keyCode)) {
			const isDown = event.type === 'keydown';
			this.pressed[this.keyMap[event.keyCode]] = isDown;
			event.preventDefault();
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
import { Vector } from '../vector.js';

export class Spring {
    constructor(pos) {
        // Slightly offset down so it sits nicely on the floor tile
        this.pos = pos.plus(new Vector(0, 0.4));
        this.size = new Vector(1, 0.6);
        this.bounceForce = 30;
    }

    get type() {
        return 'spring';
    }

    act(step) {
        // Spring static/idle logic
    }
}

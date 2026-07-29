import { Vector } from '../vector.js';

export class Enemy {
    constructor(pos, speedMultiplier = 1) {
        this.pos = pos;
        this.size = new Vector(0.9, 0.9);
        this.speed = new Vector(3 * speedMultiplier, 0);
    }

    get type() {
        return 'enemy';
    }

    act(step, level) {
        const newPos = this.pos.plus(this.speed.times(step));
        if (!level.obstacleAt(newPos, this.size)) {
            this.pos = newPos;
        } else {
            this.speed = this.speed.times(-1);
        }
    }
}

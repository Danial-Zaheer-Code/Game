import { Vector } from '../vector.js';

export class TrackingEnemy {
    constructor(pos, speedMultiplier = 1) {
        this.pos = pos;
        this.size = new Vector(0.9, 0.9);
        this.speedMultiplier = speedMultiplier;
        this.speed = new Vector(0, 0);
    }

    get type() {
        return 'trackingEnemy';
    }

    act(step, level) {
        const player = level.player;
        if (!player) return;

        // Calculate horizontal direction towards player
        let moveX = 0;
        if (player.pos.x > this.pos.x + 0.2) {
            moveX = 2.5 * this.speedMultiplier;
        } else if (player.pos.x < this.pos.x - 0.2) {
            moveX = -2.5 * this.speedMultiplier;
        }

        this.speed.x = moveX;
        const motion = new Vector(this.speed.x * step, 0);
        const newPos = this.pos.plus(motion);

        if (!level.obstacleAt(newPos, this.size)) {
            this.pos = newPos;
        }
    }
}

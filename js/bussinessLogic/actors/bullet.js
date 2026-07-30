import { Vector } from '../vector.js';

export class Bullet {
    constructor(pos, dir, speedMultiplier = 1) {
        this.pos = pos;
        this.dir = dir; // Normalized direction vector
        this.size = new Vector(0.4, 0.4);
        this.speed = 9.0 * speedMultiplier;
        this.angle = Math.atan2(dir.y, dir.x);
    }

    get type() {
        return 'bullet';
    }

    act(step, level) {
        // Move straight along direction vector
        const motion = this.dir.times(this.speed * step);
        this.pos = this.pos.plus(motion);

        // Check collision with world grid (walls, lava, out of bounds)
        const obstacle = level.obstacleAt(this.pos, this.size);
        if (obstacle) {
            level.actors = level.actors.filter(a => a !== this);
            return;
        }

        // Check collision with player
        const hitActor = level.actorAt(this);
        if (hitActor && hitActor.type === 'player') {
            level.playerTouched('bullet', this);
            level.actors = level.actors.filter(a => a !== this);
        }
    }
}

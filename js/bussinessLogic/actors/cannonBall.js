import { Vector } from '../vector.js';
import { Explosion } from './explosion.js';

export class CannonBall {
    constructor(pos, dir, speedMultiplier = 1) {
        this.pos = pos;
        this.dir = dir; // Normalized direction vector
        this.size = new Vector(0.5, 0.5);
        this.speed = 7.0 * speedMultiplier; // Slightly slower than bullets
        this.angle = Math.atan2(dir.y, dir.x);
    }

    get type() {
        return 'cannonBall';
    }

    act(step, level) {
        // Move straight along direction vector
        const motion = this.dir.times(this.speed * step);
        this.pos = this.pos.plus(motion);

        // Check collision with world grid (walls, lava, out of bounds)
        const obstacle = level.obstacleAt(this.pos, this.size);
        if (obstacle) {
            // Spawn explosion at impact position (center of cannon ball)
            const impactPos = this.pos.plus(this.size.times(0.5));
            const explosion = new Explosion(impactPos);
            level.actors.push(explosion);

            // Remove the cannon ball
            level.actors = level.actors.filter(a => a !== this);
            return;
        }

        // Direct hit on player also damages
        const hitActor = level.actorAt(this);
        if (hitActor && hitActor.type === 'player') {
            level.playerTouched('cannonBall', this);
            level.actors = level.actors.filter(a => a !== this);
        }
    }
}

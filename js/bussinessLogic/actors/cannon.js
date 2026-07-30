import { Vector } from '../vector.js';
import { CannonBall } from './cannonBall.js';

export class Cannon {
    constructor(pos, speedMultiplier = 1) {
        this.pos = pos;
        this.size = new Vector(1.5, 1.5);
        this.speedMultiplier = speedMultiplier;
        this.shootTimer = 0;
        this.fireInterval = 3.0 / speedMultiplier; // Firerate scales with difficulty
        this.angle = 0;
    }

    get type() {
        return 'cannon';
    }

    act(step, level) {
        const player = level.player;
        if (!player) return;

        // Calculate center of cannon and center of player
        const cannonCenter = this.pos.plus(this.size.times(0.5));
        const playerCenter = player.pos.plus(player.size.times(0.5));

        const dir = playerCenter.minus(cannonCenter);
        const dist = Math.sqrt(dir.x * dir.x + dir.y * dir.y);

        if (dist > 0.001) {
            this.angle = Math.atan2(dir.y, dir.x);
            const normDir = dir.times(1 / dist);

            this.shootTimer += step;
            if (this.shootTimer >= this.fireInterval) {
                this.shootTimer -= this.fireInterval;

                // Spawn cannon ball at center of cannon
                const ballSize = new Vector(1.0, 1.0);
                const spawnPos = cannonCenter.minus(ballSize.times(0.5));
                const cannonBall = new CannonBall(spawnPos, normDir, this.speedMultiplier);

                level.actors.push(cannonBall);
            }
        }
    }
}

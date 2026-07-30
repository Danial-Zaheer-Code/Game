import { Vector } from '../vector.js';
import { Bullet } from './bullet.js';

export class Turret {
    constructor(pos, speedMultiplier = 1) {
        this.pos = pos;
        this.size = new Vector(0.9, 0.9);
        this.speedMultiplier = speedMultiplier;
        this.shootTimer = 0;
        this.fireInterval = 2.0; // 0.5 bullets per second
        this.angle = 0;
    }

    get type() {
        return 'turret';
    }

    act(step, level) {
        const player = level.player;
        if (!player) return;

        // Calculate center of turret and center of player
        const turretCenter = this.pos.plus(this.size.times(0.5));
        const playerCenter = player.pos.plus(player.size.times(0.5));

        const dir = playerCenter.minus(turretCenter);
        const dist = Math.sqrt(dir.x * dir.x + dir.y * dir.y);

        if (dist > 0.001) {
            this.angle = Math.atan2(dir.y, dir.x);
            const normDir = dir.times(1 / dist);

            this.shootTimer += step;
            if (this.shootTimer >= this.fireInterval) {
                this.shootTimer -= this.fireInterval;

                // Spawn bullet at center of turret
                const bulletSize = new Vector(0.4, 0.4);
                const spawnPos = turretCenter.minus(bulletSize.times(0.5));
                const bullet = new Bullet(spawnPos, normDir, this.speedMultiplier);

                level.actors.push(bullet);
            }
        }
    }
}

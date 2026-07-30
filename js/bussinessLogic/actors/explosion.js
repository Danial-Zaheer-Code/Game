import { Vector } from '../vector.js';

export class Explosion {
    constructor(pos) {
        // Explosion is centered on impact point
        this.blastRadius = 4.0; // grid units
        this.duration = 0.5;    // seconds the visual lasts
        this.timer = 0;
        this.size = new Vector(this.blastRadius * 2, this.blastRadius * 2);
        // Center the explosion around the impact position
        this.pos = pos.plus(new Vector(-this.blastRadius, -this.blastRadius));
        this.hasDamaged = false;
        this.progress = 0; // 0 to 1, for visual scaling
    }

    get type() {
        return 'explosion';
    }

    act(step, level) {
        this.timer += step;
        this.progress = Math.min(this.timer / this.duration, 1);

        // Check player proximity on first few frames (before the blast fades)
        if (!this.hasDamaged && this.timer < this.duration * 0.6) {
            const player = level.player;
            if (player) {
                const explosionCenter = this.pos.plus(this.size.times(0.5));
                const playerCenter = player.pos.plus(player.size.times(0.5));
                const dir = playerCenter.minus(explosionCenter);
                const dist = Math.sqrt(dir.x * dir.x + dir.y * dir.y);

                if (dist < this.blastRadius) {
                    this.hasDamaged = true;
                    level.playerTouched('explosion', this);
                }
            }
        }

        // Remove explosion after duration
        if (this.timer >= this.duration) {
            level.actors = level.actors.filter(a => a !== this);
        }
    }
}

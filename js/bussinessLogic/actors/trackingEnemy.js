import { Vector } from '../vector.js';

export class TrackingEnemy {
    constructor(pos, speedMultiplier = 1) {
        this.pos = pos;
        this.size = new Vector(0.9, 0.9);
        // Player speed is 10. Tracking enemy speed 6.5 is fast but allows player to outrun it.
        this.baseSpeed = 6.5 * speedMultiplier;
    }

    get type() {
        return 'trackingEnemy';
    }

    act(step, level) {
        const player = level.player;
        if (!player) return;

        // Calculate 2D direction vector towards player center
        const centerSelf = this.pos.plus(this.size.times(0.5));
        const centerPlayer = player.pos.plus(player.size.times(0.5));
        
        const dir = centerPlayer.minus(centerSelf);
        const dist = Math.sqrt(dir.x * dir.x + dir.y * dir.y);

        if (dist > 0.05) {
            const normX = dir.x / dist;
            const normY = dir.y / dist;

            const velocity = new Vector(normX * this.baseSpeed, normY * this.baseSpeed);
            // Penetrates through walls - moves directly towards player anywhere in 2D space
            this.pos = this.pos.plus(velocity.times(step));
        }
    }
}

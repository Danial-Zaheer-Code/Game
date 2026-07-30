import { Vector } from '../vector.js';

export class Laser {
    constructor(pos, ch) {
        this.emitterPos = pos;
        this.ch = ch;
        // 'H' or 'L' for X-axis (horizontal), 'V' or 'l' for Y-axis (vertical)
        this.axis = (ch === 'V' || ch === 'l') ? 'y' : 'x';
        
        // Beam geometry (calculated once grid is available)
        this.beamPos = pos;
        this.beamSize = new Vector(1, 1);

        // AABB collision pos & size (matches beam)
        this.pos = pos;
        this.size = new Vector(1, 1);
        
        this.timer = 0;
        this.state = 'off'; // 'off', 'charging', 'on'
        this.isOn = false;
        this.initialized = false;
    }

    get type() {
        return this.state === 'on' ? 'laserOn' : (this.state === 'charging' ? 'laserCharging' : 'laserOff');
    }

    _calculateBeam(level) {
        const ex = Math.floor(this.emitterPos.x);
        const ey = Math.floor(this.emitterPos.y);

        if (this.axis === 'x') {
            // Determine direction: shoot right if open, otherwise shoot left
            let endX = ex + 1;
            while (endX < level.width && level.grid[ey][endX] !== 'wall') {
                endX++;
            }

            const startX = ex + 0.75; // Starts at emitter nozzle
            const width = Math.max(0.1, endX - startX);
            
            this.beamPos = new Vector(startX, ey + 0.35);
            this.beamSize = new Vector(width, 0.3);

        } else { // Y-axis
            // Extend down until wall
            let endY = ey + 1;
            while (endY < level.height && level.grid[endY][ex] !== 'wall') {
                endY++;
            }

            const startY = ey + 0.75; // Starts at emitter nozzle
            const height = Math.max(0.1, endY - startY);

            this.beamPos = new Vector(ex + 0.35, startY);
            this.beamSize = new Vector(0.3, height);
        }

        this.pos = this.beamPos;
        this.size = this.beamSize;
    }

    act(step, level) {
        if (!this.initialized) {
            this._calculateBeam(level);
            this.initialized = true;
        }

        this.timer += step;

        // Total cycle = 5.0 seconds:
        // 0.0s - 1.5s: OFF (1.5 seconds cooldown)
        // 1.5s - 2.0s: CHARGING (0.5 seconds warning phase)
        // 2.0s - 5.0s: ON (3.0 seconds active lethal phase)
        const cycle = this.timer % 5.0;

        if (cycle < 1.5) {
            this.state = 'off';
            this.isOn = false;
        } else if (cycle < 2.0) {
            this.state = 'charging';
            this.isOn = false;
        } else {
            this.state = 'on';
            this.isOn = true;
        }

        // Deal damage to player when ON
        if (this.isOn) {
            const hitActor = level.actorAt(this);
            if (hitActor && hitActor.type === 'player') {
                level.playerTouched('laser', this);
            }
        }
    }
}

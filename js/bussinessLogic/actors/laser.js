import { Vector } from '../vector.js';

export class Laser {
    constructor(pos, ch) {
        this.emitterPos = pos;
        this.ch = ch;
        // 'H' or 'L' for X-axis (horizontal), 'V' or 'l' for Y-axis (vertical)
        this.axis = (ch === 'V' || ch === 'l') ? 'y' : 'x';
        
        // Initial dummy size until grid is fully built
        this.pos = pos;
        this.size = new Vector(1, 1);
        
        this.timer = 0;
        this.isOn = false;
        this.initialized = false;
    }

    get type() {
        return this.isOn ? 'laser' : 'laserCharging';
    }

    _calculateBeam(level) {
        const ex = Math.floor(this.emitterPos.x);
        const ey = Math.floor(this.emitterPos.y);

        if (this.axis === 'x') {
            // Extend left until wall
            let startX = ex;
            while (startX > 0 && level.grid[ey][startX - 1] !== 'wall') {
                startX--;
            }

            // Extend right until wall
            let endX = ex + 1;
            while (endX < level.width && level.grid[ey][endX] !== 'wall') {
                endX++;
            }

            const width = endX - startX;
            this.pos = new Vector(startX, ey + 0.3);
            this.size = new Vector(width, 0.4);

        } else { // Y-axis
            // Extend up until wall
            let startY = ey;
            while (startY > 0 && level.grid[startY - 1][ex] !== 'wall') {
                startY--;
            }

            // Extend down until wall
            let endY = ey + 1;
            while (endY < level.height && level.grid[endY][ex] !== 'wall') {
                endY++;
            }

            const height = endY - startY;
            this.pos = new Vector(ex + 0.3, startY);
            this.size = new Vector(0.4, height);
        }
    }

    act(step, level) {
        if (!this.initialized) {
            this._calculateBeam(level);
            this.initialized = true;
        }

        this.timer += step;
        // Cycle: 0.5s OFF (charging warning), 3.0s ON (active lethal beam), repeats every 3.5s
        const cycle = this.timer % 3.5;
        this.isOn = cycle >= 0.5;

        if (this.isOn) {
            const hitActor = level.actorAt(this);
            if (hitActor && hitActor.type === 'player') {
                level.playerTouched('laser', this);
            }
        }
    }
}

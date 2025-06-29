import {Vector} from '../vector.js';

export class Player {
    static playerXSpeed = 10;
    static jumpSpeed = 17;
    static gravity = 30;

    constructor(pos) {
        this.pos = pos.plus(new Vector(0, -0.5));
        this.size = new Vector(0.5, 1);
        this.speed = new Vector(0, 0);
    }

    get type() {
        return 'player';
    }

    _moveX(step, level, keys) {
        this.speed.x = 0;
        if (keys.left) this.speed.x -= Player.playerXSpeed;
        if (keys.right) this.speed.x += Player.playerXSpeed;

        const motion = new Vector(this.speed.x * step, 0);
        const newPos = this.pos.plus(motion);
        const obstacle = level.obstacleAt(newPos, this.size);
        if (obstacle) {
            level.playerTouched(obstacle);
        } else {
            this.pos = newPos;
        }
    }

    _moveY(step, level, keys) {
        this.speed.y += step * Player.gravity;
        const motion = new Vector(0, this.speed.y * step);
        const newPos = this.pos.plus(motion);
        const obstacle = level.obstacleAt(newPos, this.size);

        if (obstacle) {
            level.playerTouched(obstacle);
            if (keys.up && this.speed.y > 0) {
                this.speed.y = -Player.jumpSpeed;
            } else {
                this.speed.y = 0;
            }
        } else {
            this.pos = newPos;
        }
    }

    act(step, level, keys) {
        this._moveX(step, level, keys);
        this._moveY(step, level, keys);

        const otherActor = level.actorAt(this);
        if (otherActor) {
            level.playerTouched(otherActor.type, otherActor);
        }

        // Losing animation
        if (level.status === 'lost') {
            this.pos.y += step;
            this.size.y -= step;
        }
    }
}

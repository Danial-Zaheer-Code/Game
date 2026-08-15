import {Vector} from '../vector.js';

export class Player {
    static playerXSpeed = 10;
    static jumpSpeed = 17;
    static gravity = 30;
    static climbSpeed = 8;

    constructor(pos) {
        this.pos = pos.plus(new Vector(0, -0.5));
        this.size = new Vector(0.5, 1);
        this.speed = new Vector(0, 0);
        this.isCrouched = false;
        this.hasShield = false;
        this.invulnerableTimer = 0;
    }

    get type() {
        return 'player';
    }

    _handleCrouch(level, keys) {
        if (keys.down) {
            if (!this.isCrouched) {
                this.isCrouched = true;
                this.size = new Vector(0.5, 0.5);
                this.pos = this.pos.plus(new Vector(0, 0.5));
            }
        } else if (this.isCrouched) {
            const standingPos = this.pos.plus(new Vector(0, -0.5));
            const standingSize = new Vector(0.5, 1);
            if (!level.obstacleAt(standingPos, standingSize)) {
                this.isCrouched = false;
                this.pos = standingPos;
                this.size = standingSize;
            }
        }
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

    _isOnLadder(level) {
        return level.actors.some(actor => 
            actor.type === 'ladder' &&
            this.pos.x + this.size.x > actor.pos.x &&
            this.pos.x < actor.pos.x + actor.size.x &&
            this.pos.y + this.size.y > actor.pos.y &&
            this.pos.y < actor.pos.y + actor.size.y
        );
    }

    _moveY(step, level, keys) {
        const onLadder = this._isOnLadder(level);

        if (onLadder) {
            this.speed.y = 0;
            if (keys.up) {
                this.speed.y = -Player.climbSpeed;
            } else if (keys.down) {
                this.speed.y = Player.climbSpeed;
            }

            const motion = new Vector(0, this.speed.y * step);
            const newPos = this.pos.plus(motion);
            const obstacle = level.obstacleAt(newPos, this.size);

            if (obstacle) {
                level.playerTouched(obstacle);
            } else {
                this.pos = newPos;
            }
        } else {
            // Off ladder: gravity pulls player down (player falls)
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
    }

    act(step, level, keys) {
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer = Math.max(0, this.invulnerableTimer - step);
        }

        const onLadder = this._isOnLadder(level);
        if (!onLadder) {
            this._handleCrouch(level, keys);
        } else if (this.isCrouched) {
            const standingPos = this.pos.plus(new Vector(0, -0.5));
            const standingSize = new Vector(0.5, 1);
            if (!level.obstacleAt(standingPos, standingSize)) {
                this.isCrouched = false;
                this.pos = standingPos;
                this.size = standingSize;
            }
        }

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

import { Vector } from "../vector.js";

export class Coin {
    static wobbleSpeed = 8;
    static wobbleDist = 0.07;

    constructor(pos) {
        this.basePos = this.pos = pos;
        this.size = new Vector(0.6, 0.6);
        this.wobble = Math.random() * Math.PI * 2;
    }

    get type() {
        return 'coin';
    }

    act(step) {
        this.wobble += step * Coin.wobbleSpeed;
        const wobblePos = Math.sin(this.wobble) * Coin.wobbleDist;
        this.pos = this.basePos.plus(new Vector(0, wobblePos));
    }
}


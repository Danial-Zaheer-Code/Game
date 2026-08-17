import { Vector } from "../vector.js";

export class Shield {
    static wobbleSpeed = 4;
    static wobbleDist = 0.08;

    constructor(pos) {
        this.basePos = this.pos = pos;
        this.size = new Vector(1.8, 1.8);
        this.wobble = Math.random() * Math.PI * 2;
    }

    get type() {
        return 'shield';
    }

    act(step) {
        this.wobble += step * Shield.wobbleSpeed;
        const wobblePos = Math.sin(this.wobble) * Shield.wobbleDist;
        this.pos = this.basePos.plus(new Vector(0, wobblePos));
    }
}

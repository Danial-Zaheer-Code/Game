import { Vector } from "../vector.js";

export class Ladder {
    constructor(pos, ch) {
        this.pos = pos;
        this.size = new Vector(1, 1);
        this.ch = ch;
    }

    get type() {
        return 'ladder';
    }

    act(step) {
        // Ladder is static
    }
}

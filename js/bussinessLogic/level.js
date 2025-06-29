import { Player } from './actors/player.js';
import { Lava } from './actors/lava.js';
import {Vector} from '../bussinessLogic/vector.js';
import { Coin } from './actors/coin.js';

var actorchars = {
    '@': Player,
    o: Coin,
    '=': Lava,
    '|': Lava,
    v: Lava,
};

export class Level {
    static maxStep = 0.05;

    constructor(plan) {
        this.width = plan[0].length;
        this.height = plan.length;
        this.grid = [];
        this.actors = [];

        //I dont know what i am doing
        this.lives = 3;

        for (let y = 0; y < this.height; y++) {
            let line = plan[y];
            let gridLine = [];

            for (let x = 0; x < this.width; x++) {
                let ch = line[x];
                let fieldType = null;

                let Actor = actorchars[ch];
                if (Actor) {
                    this.actors.push(new Actor(new Vector(x, y), ch));
                } else if (ch === 'x') {
                    fieldType = 'wall';
                } else if (ch === '!' || ch === '|' || ch === '=' || ch === 'v') {
                    fieldType = 'lava';
                    if (ch === 'v') console.log(fieldType);
                }

                gridLine.push(fieldType);
            }

            this.grid.push(gridLine);
        }

        this.player = this.actors.filter(actor => actor.type === 'player')[0];
        this.status = null;
        this.finishDelay = null;
    }

    isFinished() {
        return this.status != null && this.finishDelay < 0;
    }

    obstacleAt (pos, size) {
        var xStart = Math.floor(pos.x);
        var xEnd = Math.ceil(pos.x + size.x);
        var yStart = Math.floor(pos.y);
        var yEnd = Math.ceil(pos.y + size.y);

        if (xStart < 0 || xEnd > this.width || yStart < 0) return 'wall';
        if (yEnd > this.height) return 'lava';
        
        for (var y = yStart; y < yEnd; y++) {
            for (var x = xStart; x < xEnd; x++) {
                var fieldType = this.grid[y][x];
                if (fieldType) return fieldType;
            }
        }
    }

    actorAt(actor) {
        for (var i = 0; i < this.actors.length; i++) {
            var other = this.actors[i];
            
            if (
                other != actor &&
                actor.pos.x + actor.size.x > other.pos.x &&
                actor.pos.x < other.pos.x + other.size.x &&
                actor.pos.y + actor.size.y > other.pos.y &&
                actor.pos.y < other.pos.y + other.size.y
                )
                    return other;
        }
    }

    animate(step, keys) {
        if (this.status != null) this.finishDelay -= step;

        while (step > 0) {
            var thisStep = Math.min(step, Level.maxStep);
            this.actors.forEach(function (actor) {
                actor.act(thisStep, this, keys);
            }, this);
            step -= thisStep;
        }
    }

    playerTouched(type, actor) {
        if (type == 'lava' && this.status == null) {
                this.status = 'lost';
                this.finishDelay = 1;

        } else if (type == 'coin') {
            this.actors = this.actors.filter(function (other) {
                return other != actor; 
            });
        
            if (!this.actors.some(function (actor) { return actor.type == 'coin';})) {
                this.status = 'won';
                this.finishDelay = 1;
            }
        }
    }
}
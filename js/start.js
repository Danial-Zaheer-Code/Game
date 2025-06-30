'use strict'
import { LEVELS } from './data/levelsData.js';
import { AnimationRunner } from './frontEndRendering/animation.js';
import { KeyTracker } from './bussinessLogic/keyTracker.js';
import { DOMDisplay } from './frontEndRendering/domDisplay.js';
import { Level } from './bussinessLogic/level.js';
var lives = 3;
class LevelManager {
	static arrowKeyMap = { 37: 'left', 38: 'up', 39: 'right' };
	constructor(levelPlans) {
		this.levelPlans = levelPlans;
		this.currentLevelIndex = 0;
		//this.lives = 3;
		this._startLevel(this.currentLevelIndex);
	}

	_startLevel(index) {
		const level = new Level(this.levelPlans[index]);
		const display = new DOMDisplay(document.body, level);
		const keyTracker = new KeyTracker(LevelManager.arrowKeyMap);

		const frameStep = (step) => {
			level.animate(step, keyTracker.keys);
			display.drawFrame();

			if (level.isFinished()) {
				display.clear();
				this._handleLevelEnd(level.status);
				return false;
			}
		};

		AnimationRunner.run(frameStep);
	}

	_handleLevelEnd(status) {
		if (status === 'lost') {
			//this.lives--;
			lives--;
			if(lives <= 0){//this.lives <= 0){
				window.location.href = "lost.html";
			}

			this._startLevel(this.currentLevelIndex); // retry

		} else if (this.currentLevelIndex < this.levelPlans.length - 1) {
			this.currentLevelIndex++;
			this.lives = 3;
			this._startLevel(this.currentLevelIndex); // next level
		} else {
			alert('You win!');
		}
	}
}

new LevelManager(LEVELS);
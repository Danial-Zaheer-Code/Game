'use strict'
import { LEVELS } from './data/levelsData.js';
import { AnimationRunner } from './frontEndRendering/animation.js';
import { KeyTracker } from './bussinessLogic/keyTracker.js';
import { DOMDisplay } from './frontEndRendering/domDisplay.js';
import { Level } from './bussinessLogic/level.js';

class LevelManager {
	constructor(levelPlans) {
		this.levelPlans = levelPlans;
		this.currentLevelIndex = 0;
		this.difficulty = localStorage.getItem('fateRunnerDifficulty') || 'normal';
		
		// Configure lives based on difficulty
		if (this.difficulty === 'easy') {
			DOMDisplay.lives = 5;
		} else if (this.difficulty === 'hardcore') {
			DOMDisplay.lives = 1;
		} else {
			DOMDisplay.lives = 3;
		}

		this._startLevel(this.currentLevelIndex);
	}

	_startLevel(index) {
		const level = new Level(this.levelPlans[index], this.difficulty);
		const display = new DOMDisplay(document.body, level, index, this.levelPlans.length);
		const keyTracker = new KeyTracker();

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
			DOMDisplay.lives--;
			if (DOMDisplay.lives <= 0) {
				window.location.href = "lost.html";
				return;
			}

			this._startLevel(this.currentLevelIndex); // retry current level

		} else if (this.currentLevelIndex < this.levelPlans.length - 1) {
			this.currentLevelIndex++;
			this._startLevel(this.currentLevelIndex); // proceed to next level
		} else {
			alert('🏆 CONGRATULATIONS! YOU HAVE CONQUERED ALL LEVELS IN FATE RUNNER! 🏆');
			window.location.href = "../index.html";
		}
	}
}

new LevelManager(LEVELS);//
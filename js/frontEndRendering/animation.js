export class AnimationRunner {
	static run(frameFunction) {
		let lastTime = null;

		function frame(currentTime) {
			let stop = false;

			if (lastTime != null) {
				const delta = Math.min(currentTime - lastTime, 100) / 1000;
				stop = frameFunction(delta) === false;
			}
			lastTime = currentTime;
			if (!stop) requestAnimationFrame(frame);
		}

		requestAnimationFrame(frame);
	}
}
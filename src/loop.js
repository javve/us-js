module.exports = (() => {
  const loop = {
    _animations: [],
    _completedAnimations: [],
    push: a => {
      loop._animations.push(a);
      if (!loop._animating) {
        loop._animate();
        loop._animating = true;
      }
    },
    _animate() {
      if (loop._animations.length) {
        requestAnimationFrame(() => loop._animate());
      } else {
        loop._animating = false;
      }

      for (let i = 0; i < loop._animations.length; i++) {
        let animation = loop._animations[i];
        let running = animation.tick();
        if (!running) {
          loop._completedAnimations.push(animation);
        }
      }
      while (loop._completedAnimations.length) {
        let a = loop._completedAnimations.pop();
        loop._animations.splice(loop._animations.indexOf(a), 1);
      }
    }
  };

  return loop;
})();

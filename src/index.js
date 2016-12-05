const assign = require('object-assign'),
      states = require('./states'),
      containers = require('./containers'),
      USA = require('./usa'),
      styles = require('./styles'),
      size = require('./utils/size'),
      easing = require('./utils/easing'),
      css = require('./utils/css'),
      common = require('./utils/common');

const us = {
  _animations: [],
  _completedAnimations: [],
  show(name, container = null) {
    if (!container) throw new Error('no container?!');

    let current = states.current(container)
      , next = states.get(name, container);

    if (next == null || current == null) return;
    if (current == next) return;

    let currentHeight = this.currentHeight = size.height(current)
      , nextHeight = this.nextHeight = size.height(next)
      , currentOptions = common.getOptions(current, container)
      , nextOptions = common.getOptions(next, container)
      , containerOptions = common.getOptions(container, container);

    assign(currentOptions, {
      from: styles[currentOptions.style].show,
      to: styles[currentOptions.style].previous,
      after: () => {
        states.hide(current);
      },
      hide: true
    });
    assign(nextOptions, {
      from: styles[nextOptions.style].next,
      to: styles[nextOptions.style].show,
      after: () => {
        states.show(next);
      }
    });
    assign(containerOptions, {
      from: { height: currentHeight + 'px' },
      to: { height: nextHeight + 'px' },
      after: () => {
        size.clearHeight(container);
      },
      static: true,
      wait: common.calculateContainerWait(currentOptions, nextOptions, containerOptions)
    })

    this.a(current, currentOptions);
    this.a(next, nextOptions);
    this.a(container, containerOptions);
  },
  hide(name) {
    // already hidden?
    let current = this.current = states.current();

    let currentHeight = this.currentHeight = size.height(current)
      , nextHeight = this.nextHeight = 0;

    states.previous(current);
    size.height(this.el, currentHeight);

    this.loop();
  },
  a(el, options) {
    let a = new USA(el, options)
    this._animations.push(a);
    if (!this._animating) {
      this.animate();
      this._animating = true;
    }
  },
  animate() {
    if (this._animations.length) {
      requestAnimationFrame(() => this.animate());
    } else {
      this._animating = false;
    }
    for (let animation of this._animations) {
      let running = animation.tick()
      if (!running) {
        this._completedAnimations.push(animation);
      }
    }
    while(this._completedAnimations.length) {
      let a = this._completedAnimations.pop()
      this._animations.splice(this._animations.indexOf(a), 1);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    e.stopPropagation();
    const el = e.target;

    let showStates = common.parseTrigger(el.getAttribute('data-us-show'))
      , hideStates = common.parseTrigger(el.getAttribute('data-us-hide'))
      , container = null;

    const getContainer = (o) => {
      if (o.containerName) {
        return document.querySelector('[data-us="'+o.containerName+'"]');
      } else {
        return containers.closest(el);
      }
    }

    for (let show of showStates) {
      us.show(show.stateName, getContainer(show));
    }
    for (let hide of hideStates) {
      us.hide(hide.stateName, getContainer(hide));
    }
  });
}, false);

module.exports = us;

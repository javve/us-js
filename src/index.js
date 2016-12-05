const assign = require('object-assign'),
      states = require('./states'),
      containers = require('./containers'),
      USA = require('./usa'),
      styles = require('./styles'),
      size = require('./utils/size'),
      easing = require('./utils/easing'),
      css = require('./utils/css'),
      common = require('./utils/common');

class Switcher {
  constructor(id, options = {}) {
    this.animations = [];
    this.completedAnimations = [];

    document.body.addEventListener('click', (e) => {
      e.stopPropagation();
      this.click(e.target);
    });

    for (let container of containers.all()) {
      this.setInitialState(container);
    }
  }
  setInitialState(container) {
    let first = true;
    for (let state of states.all(container)) {
      if (first) {
        first = false;
      } else {
        states.hide(state);
      }
    }
  }
  click(el) {
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
      this.show(show.stateName, getContainer(show));
    }
    for (let hide of hideStates) {
      this.hide(hide.stateName, getContainer(hide));
    }
  }
  show(name, container = null) {
    if (!container) throw new Error('no container?!');

    let current = states.current(container)
      , next = states.get(name, container);

    if (next == null || current == null) return;
    if (current == next) return;

    let currentHeight = this.currentHeight = size.height(current)
      , nextHeight = this.nextHeight = size.height(next)
      , me = this
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
      from: {
        height: currentHeight + 'px'
      },
      to: {
        height: nextHeight + 'px'
      },
      after: () => {
        size.clearHeight(container);
      },
      static: true,
      wait: common.calculateContainerWait(currentOptions, nextOptions, containerOptions)
    })

    this.a(current, currentOptions);
    this.a(next, nextOptions);
    this.a(container, containerOptions);
  }
  hide(name) {
    // already hidden?
    let current = this.current = states.current()
      , me = this;

    let currentHeight = this.currentHeight = size.height(current)
      , nextHeight = this.nextHeight = 0;

    states.previous(current);
    size.height(this.el, currentHeight);

    this.loop();
  }
  a(el, options) {
    let a = new USA(el, options)
    this.animations.push(a);
    if (!this.animating) {
      this.animate();
      this.animating = true;
    }
  }
  animate() {
    if (this.animations.length) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.animating = false;
    }
    for (let animation of this.animations) {
      let running = animation.tick()
      if (!running) {
        this.completedAnimations.push(animation);
      }
    }
    while(this.completedAnimations.length) {
      let a = this.completedAnimations.pop()
      this.animations.splice(this.animations.indexOf(a), 1);
    }
  }
}

module.exports = Switcher

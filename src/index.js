const assign = require('object-assign'),
      states = require('./states'),
      containers = require('./containers'),
      USA = require('./usa'),
      styles = require('./styles'),
      size = require('./utils/size'),
      easing = require('./utils/easing'),
      css = require('./utils/css'),
      parseTrigger = require('./utils/parse-trigger');

class Switcher {
  constructor(id, options = {}) {
    this.containers = containers(this);
    this.animations = [];
    this.completedAnimations = [];

    assign(this, options);

    // this.styles = {}
    // for (const stateName of ['next', 'show', 'previous']) {
    //   this.styles[stateName] = css.parseStyle(styles[this.style][stateName]);
    // }

    // this.el = document.getElementById(id);
    document.body.addEventListener('click', (e) => {
      e.stopPropagation();
      this.click(e.target);
    });
    //this.el.classList.add('us-style-'+this.style);

    for (let container of this.containers.all()) {
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
    let showStates = parseTrigger(el.getAttribute('data-us-show'))
      , hideStates = parseTrigger(el.getAttribute('data-us-hide'))
      , container = null;

    const getContainer = (o) => {
      if (o.containerName) {
        return document.querySelector('[data-us="'+o.containerName+'"]');
      } else {
        return this.containers.closest(el);
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
      , currentStyle =
          styles[current.getAttribute('data-us-hide-style')
          || current.getAttribute('data-us-style')
          || container.getAttribute('data-us-hide-style')
          || container.getAttribute('data-us-style')
          || 'default']
      , nextStyle =
          styles[next.getAttribute('data-us-show-style')
          || next.getAttribute('data-us-style')
          || container.getAttribute('data-us-show-style')
          || container.getAttribute('data-us-style')
          || 'default']
      , currentDuration =
          current.getAttribute('data-us-hide-duration')
          || current.getAttribute('data-us-duration')
          || container.getAttribute('data-us-hide-duration')
          || container.getAttribute('data-us-duration')
      , nextDuration =
          next.getAttribute('data-us-show-duration')
          || next.getAttribute('data-us-duration')
          || container.getAttribute('data-us-show-duration')
          || container.getAttribute('data-us-duration')
      , currentDelay =
          current.getAttribute('data-us-hide-delay')
          || current.getAttribute('data-us-delay')
          || container.getAttribute('data-us-hide-delay')
          || container.getAttribute('data-us-delay')
      , nextDelay =
          next.getAttribute('data-us-show-delay')
          || next.getAttribute('data-us-delay')
          || container.getAttribute('data-us-show-delay')
          || container.getAttribute('data-us-delay');
    this.a(current, {
      from: currentStyle.show,
      to: currentStyle.previous,
      after: () => {
        states.hide(current);
      },
      hide: true,
      duration: currentDuration,
      delay:currentDelay
    });
    this.a(next, {
      after: () => {
        states.show(next);
      },
      from: nextStyle.next,
      to: nextStyle.show,
      duration: nextDuration,
      delay:nextDelay
    });
    this.a(container, {
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
      duration: 400,
      delay:0
    });

    // this.el.classList.remove('us-'+states.name(current));
    // this.el.classList.add('us-'+name);
    //states.next(next);
    //states.previous(current);
    // size.height(container, currentHeight);
    //
    // this.loop(() => {
    //   me.states.show(next);
    //   me.states.hide(current);
    //   me.currentStyle = null
    //   me.nextStyle = null
    //   size.clearHeight(container);
    // });
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

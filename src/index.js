const assign = require('object-assign'),
      states = require('./states'),
      containers = require('./containers'),
      USA = require('./usa'),
      styles = require('./styles'),
      size = require('./utils/size'),
      easing = require('./utils/easing'),
      css = require('./utils/css')(),
      parseTrigger = require('./utils/parse-trigger');

class Switcher {
  constructor(id, options = {}) {
    this.states = states(this);
    this.containers = containers(this);
    this.animations = [];
    this.completedAnimations = [];

    this.style = 'default';
    this.duration = 600;
    this.easing = 'inOutQuad';
    assign(this, styles[options.style || this.style].options, options);

    this.styles = {}
    for (const stateName of ['next', 'show', 'previous']) {
      this.styles[stateName] = css.parseStyle(styles[this.style][stateName]);
    }

    this.el = document.getElementById(id);
    document.body.addEventListener('click', (e) => {
      e.stopPropagation();
      this.click(e.target);
    });
    this.el.classList.add('us-style-'+this.style);

    for (let container of this.containers.all()) {
      this.setInitialState(container);
    }
  }
  setInitialState(container) {
    let first = true;
    for (let state of this.states.all(container)) {
      if (first) {
        this.el.classList.add('us-'+this.states.name(state));
        first = false;
      } else {
        this.states.hide(state);
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
    if (!container) {
      throw new Error('no container?!')
    }
    let current = this.states.current(container)
      , next = this.states.get(name, container);

    console.log('container', container);
    console.log('current', current);

    if (next == null || current == null) {
      return;
    }
    if (current == next) {
      return;
    }

    let currentHeight = this.currentHeight = size.height(current)
      , nextHeight = this.nextHeight = size.height(next)
      , me = this;

    this.a(current, {
      from: this.styles.show,
      to: this.styles.previous,
      after: () => {
        //end ()
        me.states.hide(current);
      },
      duration: 400,
      delay:0
    });
    this.a(next, {
      before: () => {
        //show()
        me.states.show(next);
      },
      from: this.styles.next,
      to: this.styles.show,
      duration: 400,
      delay:0
    });
    this.a(container, {
      from: {
        height: { val: currentHeight, unit: 'px' }
      },
      to: {
        height: { val: nextHeight, unit: 'px' }
      },
      static: true,
      duration: 400,
      delay:0
    });

    // this.el.classList.remove('us-'+this.states.name(current));
    // this.el.classList.add('us-'+name);
    //this.states.next(next);
    //this.states.previous(current);
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
    let current = this.current = this.states.current()
      , me = this;

    let currentHeight = this.currentHeight = size.height(current)
      , nextHeight = this.nextHeight = 0;

    this.states.previous(current);
    size.height(this.el, currentHeight);

    this.loop();
  }
  a(el, options) {
    let a = new USA(el, options)
    this.animations.push(a);
    console.log('is animating', this.animating);
    if (!this.animating) {
      console.log('start now')
      this.animate();
      this.animating = true;
    }
    // add custom animation
    //us.a(el, 'style');
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
  //animate() {

    // let now = Date.now()
    // if (now - this.start >= this.duration) {
    //   this.complete = true;
    // }
    // let p = (now - this.start) / this.duration;
    // let val = easing[this.easing](p);
    //
    // if (this.nextStyle) { // No style if hide
    //   for (const key in this.styles.show) {
    //     let start = this.styles.next[key].val
    //     let goal = this.styles.show[key].val
    //     this.nextStyle[key].val = (start + (goal - start) * val);
    //   }
    //   css.set(this.next, this.nextStyle);
    // }
    //
    // for (const key in this.styles.previous) {
    //   let start = this.styles.show[key].val
    //   let goal = this.styles.previous[key].val
    //   this.currentStyle[key].val = (start + (goal - start) * val);
    // }
    // css.set(this.current, this.currentStyle);
    //
    // let newHeight = (this.currentHeight + (this.nextHeight - this.currentHeight) * val);
    // size.height(this.el, newHeight);
  //}
}

module.exports = Switcher

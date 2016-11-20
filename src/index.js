require('./style.scss');

const assign = require('object-assign'),
      states = require('./states'),
      styles = require('./styles'),
      size = require('./utils/size'),
      easing = require('./utils/easing'),
      css = require('./utils/css')();

class Switcher {
  constructor(id, options) {
    this.style = 'default';
    this.duration = 600;
    this.easing = 'inOutBack';
    assign(this, styles[options.style || this.style].options, options);
    this.styles = {}
    for (const stateName of ['next', 'show', 'previous']) {
      this.styles[stateName] = css.parseStyle(styles[this.style][stateName]);
    }
    this.states = states(this);

    this.el = document.getElementById(id);
    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.click(e.target);
    });
    this.el.classList.add(this.style);
    this.static()
    this.setInitialState()
  }
  setInitialState() {
    let first = true;
    for (let state of this.states.all()) {
      if (first) {
        this.states.show(state);
        first = false;
      } else {
        this.states.hide(state);
      }
    }
  }
  click(el) {
    let trigger = el.getAttribute('data-state-trigger');
    if (trigger) {
      this.show(trigger);
    }
  }
  show(name) {
    let current = this.current = this.states.current();
    let next = this.next = this.states.get(name);

    let currentHeight = this.currentHeight = size.height(current)
      , nextHeight = this.nextHeight = size.height(next)
      , me = this;

    if (this.current == this.next) {
      return;
    }
    this.states.next(next);
    this.states.previous(current);

    this.start = Date.now();
    this.complete = false;
    size.height(this.el, currentHeight);
    this.loop(() => {
      me.states.show(next);
      me.states.hide(current);
      size.clearHeight(this.el);
    });
  }
  loop(callback) {
    if (this.complete) {
      return callback();
    }
    requestAnimationFrame(() => this.loop(callback));
    this.animate()
  }
  animate() {
    let now = Date.now()
    if (now - this.start >= this.duration) {
      this.complete = true;
    }
    let p = (now - this.start) / this.duration;
    let val = easing[this.easing](p);

    for (const key in this.styles.show) {
      let start = this.styles.next[key].val
      let goal = this.styles.show[key].val
      this.nextStyle[key].val = (start + (goal - start) * val);
    }
    for (const key in this.styles.previous) {
      let start = this.styles.show[key].val
      let goal = this.styles.previous[key].val
      this.currentStyle[key].val = (start + (goal - start) * val);
    }
    let newHeight = (this.currentHeight + (this.nextHeight - this.currentHeight) * val);
    css.set(this.next, this.nextStyle);
    css.set(this.current, this.currentStyle);
    size.height(this.el, newHeight);
  }
  static() {
    size.clear(this.el);
    this.el.classList.remove('animate');
    this.el.classList.add('static');
  }
}

module.exports = Switcher

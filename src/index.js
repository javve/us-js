const assign = require('object-assign'),
      states = require('./states'),
      styles = require('./styles'),
      size = require('./utils/size'),
      easing = require('./utils/easing'),
      css = require('./utils/css')();

class Switcher {
  constructor(id, options = {}) {
    this.states = states(this);

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

    for (let container of this.states.allContainers()) {
      this.setInitialState(container);
    }
  }
  setInitialState(container) {
    let first = true;
    for (let state of this.states.all(container)) {
      if (first) {
        this.states.show(state);
        this.el.classList.add('us-'+this.states.name(state));
        first = false;
      } else {
        this.states.hide(state);
      }
    }
  }
  click(el) {
    let show = el.getAttribute('data-us-show')
      , hide = el.getAttribute('data-us-hide')
      , container = null;

    if (show) {
      container = this.states.closestContainer(el);
      console.log('contai:', container)
      this.show(show, container);
    }
    if (hide) {
      container = this.states.closestContainer(el);
      this.hide(hide, container);
    }
  }
  show(name, container = null) {
    if (!container) {
      throw new Error('no container?!')
    }
    console.log(container, name);
    let current = this.states.current(container)
      , next = this.states.get(name, container);

    if (next == null || current == null) {
      return;
    }
    if (current == next) {
      return;
    }
    this.current = current;
    this.next = next;

    let currentHeight = this.currentHeight = size.height(current)
      , nextHeight = this.nextHeight = size.height(next)
      , me = this;

    this.el.classList.remove('us-'+this.states.name(current));
    this.el.classList.add('us-'+name);
    this.states.next(next);
    this.states.previous(current);
    size.height(container, currentHeight);

    this.loop(() => {
      me.states.show(next);
      me.states.hide(current);
      me.currentStyle = null
      me.nextStyle = null
      size.clearHeight(container);
    });
  }
  hide(name) {
    // already hidden?
    let current = this.current = this.states.current()
      , me = this;

    let currentHeight = this.currentHeight = size.height(current)
      , nextHeight = this.nextHeight = 0;

    this.states.previous(current);
    size.height(this.el, currentHeight);

    this.loop(() => {
      me.currentStyle = null
      me.states.hide(current);
      size.clearHeight(this.el);
    });
  }
  loop(callback) {
    if (this.complete) {
      this.start = undefined;
      this.complete = false;
      return callback();
    }
    if (!this.start) {
      this.start = Date.now();
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

    if (this.nextStyle) { // No style if hide
      for (const key in this.styles.show) {
        let start = this.styles.next[key].val
        let goal = this.styles.show[key].val
        this.nextStyle[key].val = (start + (goal - start) * val);
      }
      css.set(this.next, this.nextStyle);
    }

    for (const key in this.styles.previous) {
      let start = this.styles.show[key].val
      let goal = this.styles.previous[key].val
      this.currentStyle[key].val = (start + (goal - start) * val);
    }
    css.set(this.current, this.currentStyle);

    let newHeight = (this.currentHeight + (this.nextHeight - this.currentHeight) * val);
    size.height(this.el, newHeight);
  }
}

module.exports = Switcher

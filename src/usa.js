const assign = require('object-assign'),
      easing = require('./utils/easing'),
      css = require('./utils/css'),
      STYLES = {
        absolute: {
          position: { val:'absolute', unit:'' },
          left: { val:0, unit: '' },
          top: { val:0, unit: '' }
        },
        hide: {
          position: { val:'absolute', unit:'' },
          left: { val:-3000, unit: 'px' }
        }
      };

class USA {
  constructor(el, options) {
    this.el = el;
    this.from = css.parseStyle(options.from);
    this.to = css.parseStyle(options.to);
    this.duration = parseInt(options.duration || 400);
    this.delay = parseInt(options.delay || 0);
    this.before = options.before;
    this.after = options.after;
    this.easing = options.easing || 'inOutQuad';
    this.static = options.static || false;

    this.ended = false;
    this.current = {};

    // Set defaults
    this.start()
  }
  start() {
    // Show the item
    this.start = Date.now()
    if (!this.static) {
      css.set(this.el, STYLES.absolute);
    } else {
      if (window.getComputedStyle(this.el).position == 'static') {
        this.el.style.position = 'relative';
      }
    }
    css.set(this.el, this.from);

    if (this.before) {
      this.before()
    }
  }
  complete() {
    // css.set(this.el, {
    //   absolute: {
    //     position: { val:'relative', unit:'' },
    //   }
    // });
    // Clear the set state
    if (this.hide) {
      css.set(this.el, STYLES.hide);
    } else {
      css.clear(this.el, STYLES.absolute);
    }
    if (this.after) {
      this.after()
    }
  }
  tick() {
    let now = Date.now();

    if ((now - this.start) < this.delay) return true;

    let p = (now - this.delay - this.start) / this.duration
      , val = easing[this.easing](p);

    if (now - this.start >= (this.duration + this.delay)) {
      this.complete();
      return false;
    }


    for (const key in this.to) {
      let start = this.from[key].val
      let goal = this.to[key].val
      this.current[key] = this.current[key] || {}
      this.current[key].val = (start + (goal - start) * val);
      this.current[key].unit = this.from[key].unit;
    }
    css.set(this.el, this.current);
    return true;
  }
}

module.exports = USA;

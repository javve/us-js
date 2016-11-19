require('./style.scss');

const assign = require('object-assign'),
      states = require('./states'),
      size = require('./size'),
      transition = require('./transition')(),
      easing = require('./utils/easing'),
      styles = require('./styles'),
      css = require('./utils/css')();

class Switcher {
  constructor(id, options) {
    this.style = 'default';
    this.duration = 400;
    assign(this, options);
    this.styles = {}
    for (const stateName in styles[this.style]) {
      this.styles[stateName] = css.parseStyle(styles[this.style][stateName]);
    }
    this.states = states(this);

    this.el = document.getElementById(id);
    this.el.addEventListener('click', (e) => { this.click(e.target); });
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
  findStates() {
    return this.el.getElementsByClassName('state');
  }
  click(el) {
    let states = this.findStates();
    let trigger = el.getAttribute('data-state-trigger');
    if (trigger) {
      this.show(trigger);
    } else {

    }
  }
  show(name) {
    let current = this.current = this.states.current();
    let next = this.next = this.states.get(name);

    let currentSize = size.get(current)
      , nextSize = size.get(next)
      , me = this;

    if (this.current == this.next) {
      return;
    }
    this.startLoop();
    // size.set(this.el, currentSize);
    // this.states.next(next);
    // setTimeout(() => {
    //   this.animate()
    //   //size.set(this.el, nextSize);
    //   this.states.previous(current);
    //   if (current) {
    //     this.states.hide(current);
    //   }
    //   this.states.show(next);
    //   next.addEventListener(transition.end, function fn(e) {
    //     me.el.removeEventListener(transition.end, fn);
    //     me.static();
    //     me.states.clearNext(next);
    //     me.states.clearPrevious(current);
    //   });
    // }, 10);
  }
  startLoop() {
    css.set(this.next, this.styles.next);
    css.set(this.current, this.styles.show);

    this.nextStyle = JSON.parse(JSON.stringify(this.styles.next));
    this.currentStyle = JSON.parse(JSON.stringify(this.styles.show));

    // Set values for next
    // Set show for current
    // Animate next to show
    // Animate current to previous

    // When complete, set previous to regular hide

    // NEEDS SET METHOD
    // Scale height instead of animate?

    this.start = Date.now();
    this.complete = false;
    this.loop()
    this.max = 0;
  }
  loop() {
    if (this.complete) {
      console.log('complete');
      return;
    }
    requestAnimationFrame(() => this.loop());
    this.animate()
  }
  animate() {
    let now = Date.now()
    if (now - this.start >= this.duration) {
      this.complete = true;
    }
    let p = (now - this.start) / this.duration;
    let val = easing.linear(p);

    for (const key in this.styles.show) {
      let start = this.styles.next[key].val
      let goal = this.styles.show[key].val
      this.nextStyle[key].val = (start + (goal - start) * val);
    }
    for (const key in this.styles.previous) {
      let start = this.styles.show[key].val
      let goal = this.styles.previous[key].val
      this.currentStyle[key].val = (start + (goal - start) * val);
      if (key == 'opacity') {
        console.log(this.currentStyle[key].val, start, goal, val);
      }
    }
    css.set(this.next, this.nextStyle);
    css.set(this.current, this.currentStyle);

    //x = startx + (destx - startx) * val;
    // this.max++;
    // if (this.max > 20) {
    //   this.complete = true;
    // }
  }
  static() {
    size.clear(this.el);
    this.el.classList.remove('animate');
    this.el.classList.add('static');
  }
}

module.exports = Switcher

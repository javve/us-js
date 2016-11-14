require('./style.scss');

const assign = require('object-assign'),
      states = require('./states'),
      size = require('./size'),
      transition = require('./transition')();

class Switcher {
  constructor(id, options) {
    this.style = 'default';
    assign(this, options);
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
    let current = this.states.current()
      , next = this.states.get(name)
      , currentSize = size.get(current)
      , nextSize = size.get(next)
      , me = this;

    if (current == next) {
      return;
    }

    size.set(this.el, currentSize);
    this.states.next(next);
    setTimeout(() => {
      this.animate()
      size.set(this.el, nextSize);
      this.states.previous(current);
      if (current) {
        this.states.hide(current);
      }
      this.states.show(next);
      next.addEventListener(transition.end, function fn(e) {
        me.el.removeEventListener(transition.end, fn);
        me.static();
        me.states.clearNext(next);
        me.states.clearPrevious(current);
      });
    }, 10);
  }
  animate() {
    this.el.classList.remove('static');
    this.el.classList.add('animate');
  }
  static() {
    size.clear(this.el);
    this.el.classList.remove('animate');
    this.el.classList.add('static');
  }
}

module.exports = Switcher

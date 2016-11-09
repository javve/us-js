require('./style.css');

const assign = require('object-assign'),
      states = require('./states'),
      size = require('./size');

class Switcher {
  constructor(id, options) {
    assign(this, options);
    this.states = states(this);

    this.el = document.getElementById(id);
    this.el.addEventListener('click', (e) => { this.click(e.target); });
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
      , currentHeight = size.height(current)
      , nextHeight = size.height(next);

    size.height(this.el, currentHeight);
    setTimeout(() => {
      this.animate()
      size.height(this.el, nextHeight);
      if (current) {
        this.states.hide(current);
      }
      this.states.show(next);
      setTimeout(() => {
        this.static();
      }, 400);
    }, 10);
  }
  animate() {
    this.el.classList.remove('static');
    this.el.classList.add('animate');
  }
  static() {
    size.clearHeight(this.el);
    this.el.classList.remove('animate');
    this.el.classList.add('static');
  }
}

module.exports = Switcher

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
    // let currentHeight = $this.outerHeight(true)
    //   , currentWidth = $this.width(false);

    let current = this.states.current()
      , next = this.states.get(name);

    console.log(current, next);
    if (current) {
      this.states.hide(current);
    }
    this.states.show(next);
  }
}

module.exports = Switcher

module.exports = (s) => {
  return {
    current() {
      return s.el.querySelector('.state-show');
    },
    get(name) {
      return s.el.querySelector('[data-state-name="'+name+'"]');
    },
    show(state) {
      state.classList.remove('state-hide');
      state.classList.add('state-show');
    },
    hide(state) {
      state.classList.remove('state-show');
      state.classList.add('state-hide');
    },
    all() {
      return s.el.getElementsByClassName('state');
    }
  }
}

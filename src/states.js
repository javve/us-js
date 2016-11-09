module.exports = (s) => {
  return {
    current() {
      return s.el.querySelector('.state-show');
    },
    next(state) {
      state.classList.add('state-next');
    },
    previous(state) {
      state.classList.add('state-previous');
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
    },
    clearNext(state) {
      state.classList.remove('state-next');
    },
    clearPrevious(state) {
      state.classList.remove('state-previous');
    }
  }
}

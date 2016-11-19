const css = require('./utils/css')();

module.exports = (s) => {
  const styles = {
    absolute: {
      position: { val:'absolute', unit:'' },
      left: { val:0, unit: '' }
    },
    hide: {
      position: { val:'absolute', unit:'' },
      left: { val:-3000, unit: 'px' }
    }
  };

  return {
    current() {
      return s.el.querySelector('.state-show');
    },
    next(state) {
      css.set(state, styles.absolute);
      css.set(state, s.styles.next);
      s.nextStyle = JSON.parse(JSON.stringify(s.styles.next));
    },
    previous(state) {
      css.set(state, styles.absolute);
      css.set(state, s.styles.show);
      s.currentStyle = JSON.parse(JSON.stringify(s.styles.show));
    },
    get(name) {
      return s.el.querySelector('[data-state-name="'+name+'"]');
    },
    show(state) {
      css.clear(state, styles.hide);
      state.classList.add('state-show');
    },
    hide(state) {
      state.classList.remove('state-show');
      css.clear(state, s.styles.previous);
      css.clear(state, s.styles.show);
      css.set(state, styles.hide);
    },
    all() {
      return s.el.getElementsByClassName('state');
    }
  }
}

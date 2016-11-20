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

  const states = {
    current() {
      for (let state of states.all()) {
        if (state.classList.contains('state-show')) {
          return state;
        }
      }
      return null;
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
      for (let state of states.all()) {
        if (state.getAttribute('data-state-name') == name) {
          return state;
        }
      }
      return null;
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
      let nodes = s.el.childNodes
        , states = [];
      for (let node of nodes) {
        if (node.data === undefined) {
          states.push(node);
        }
      }
      return states;
    }
  }

  return states;
}

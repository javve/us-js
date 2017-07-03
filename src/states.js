const css = require('./utils/css');

module.exports = (() => {
  const styles = {
    hide: {
      display: { val: 'none', unit: '' }
    }
  };

  const states = {
    current(container) {
      let all = states.all(container);
      for (let state of all) {
        if (state.classList.contains('state-show')) {
          return state;
        }
      }
      if (all.length && !states.isHidden(all[0])) {
        return all[0];
      } else {
        return null;
      }
    },
    get(name, container) {
      for (let state of states.all(container)) {
        if (state.getAttribute('data-us-name') == name) {
          return state;
        }
      }
      return null;
    },
    name(state) {
      return state.getAttribute('data-us-name');
    },
    show(state) {
      //css.clear(state, styles.hide);
      state.classList.add('state-show');
    },
    hide(state) {
      state.classList.remove('state-show');
      //css.clear(state, s.styles.previous);
      //css.clear(state, s.styles.show);
      css.set(state, styles.hide);
    },
    isHidden(state) {
      return window.getComputedStyle(state).display == 'none';
    },
    all(container) {
      let nodes = container.childNodes,
        states = [];
      for (let node of nodes) {
        if (node.data === undefined) {
          states.push(node);
        }
      }
      return states;
    }
  };

  return states;
})();

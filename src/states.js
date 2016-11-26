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
    current(container) {
      for (let state of states.all(container)) {
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
    get(name, container) {
      for (let state of states.all(container)) {
        console.log('->', state.getAttribute('data-us-name'))
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
      css.clear(state, styles.hide);
      state.classList.add('state-show');
    },
    hide(state) {
      state.classList.remove('state-show');
      css.clear(state, s.styles.previous);
      css.clear(state, s.styles.show);
      css.set(state, styles.hide);
    },
    all(container) {
      let nodes = container.childNodes
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

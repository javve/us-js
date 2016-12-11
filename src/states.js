const css = require('./utils/css');

module.exports = (() => {
  const styles = {
    absolute: {
      position: { val:'absolute', unit:'' },
      left: { val:0, unit: '' },
      top: { val:0, unit: '' }
    },
    hide: {
      position: { val:'absolute', unit:'' },
      left: { val:-3000, unit: 'px' }
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
    // next(state) {
    //   css.set(state, styles.absolute);
    //   css.set(state, s.styles.next);
    //   s.nextStyle = JSON.parse(JSON.stringify(s.styles.next));
    // },
    // previous(state) {
    //   css.set(state, styles.absolute);
    //   css.set(state, s.styles.show);
    //   s.currentStyle = JSON.parse(JSON.stringify(s.styles.show));
    // },
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
      //css.set(state, styles.absolute);
    },
    hide(state) {
      state.classList.remove('state-show');
      //css.clear(state, s.styles.previous);
      //css.clear(state, s.styles.show);
      css.set(state, styles.hide);
    },
    next(container) {
      let all = states.all(container)
        , index = all.indexOf(states.current(container))
        , next = index + 1;
      if (next < all.length) {
        return all[next];
      } else {
        return all[0];
      }
    },
    back(container) {
      let all = states.all(container)
        , index = all.indexOf(states.current(container))
        , next = index - 1;
      if (next > -1) {
        return all[next];
      } else {
        return all[all.length - 1];
      }
    },
    isHidden(state) {
      return ((window.getComputedStyle(state).left == '-3000px') || (window.getComputedStyle(state).display == 'none'));
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
})()

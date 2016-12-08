const css = require('./utils/css');

module.exports = (() => {
  const containers = {
    all() {
      let states = document.querySelectorAll('[data-us-name]')
        , allContainers = [];
      for (let state of states) {
        let stateContainer = state.parentNode;
        if (allContainers.indexOf(stateContainer) == -1) {
          allContainers.push(stateContainer);
        }
      }
      return allContainers;
    },
    closest(el) {
      if (el.getAttribute('data-us-name')) {
        return el.parentNode;
      } else {
        if (document.body === el) {
          return null;
        } else {
          return containers.closest(el.parentNode);
        }
      }
    },
    find(name) {
      return document.querySelector('[data-us="'+name+'"]');
    }
  }

  return containers;
})()

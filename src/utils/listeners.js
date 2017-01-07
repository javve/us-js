const common = require('./common'),
      states = require('../states'),
      containers = require('../containers');

module.exports = (() => {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
      e.stopPropagation();
      const el = e.target;

      let slideToStates = common.parseTrigger(el.getAttribute('data-us-slide-to'))
        , showStates = common.parseTrigger(el.getAttribute('data-us-show'))
        , hideStates = common.parseTrigger(el.getAttribute('data-us-hide'))
        , toggleStates = common.parseTrigger(el.getAttribute('data-us-toggle'));

      const getContainer = (containerName) => {
        if (containerName) {
          let container = containers.closestWithName(el, containerName);
          if (container) {
            return container;
          } else {
            return containers.find(containerName);
          }
        } else {
          return containers.closest(el);
        }
      }

      for (let state of slideToStates) {
        let container = getContainer(state.containerName)
          , el = states.get(state.stateName, container);

        us.slideTo(el);
      }
      for (let state of showStates) {
        let container = getContainer(state.containerName)
          , el = states.get(state.stateName, container);

        us.show(el);
      }
      for (let state of hideStates) {
        let container = getContainer(state.containerName)
          , el = states.get(state.stateName, container);

        us.hide(el);
      }
      for (let state of toggleStates) {
        let container = getContainer(state.containerName)
          , el = states.get(state.stateName, container);

        us.toggle(el);
      }
    });
  }, false);
})();

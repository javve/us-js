const common = require('./common'),
      containers = require('../containers');

module.exports = (() => {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
      e.stopPropagation();
      const el = e.target;

      let showStates = common.parseTrigger(el.getAttribute('data-us-show'))
        , hideStates = common.parseTrigger(el.getAttribute('data-us-hide'))
        , container = null;

      const getContainer = (o) => {
        if (o.containerName) {
          return document.querySelector('[data-us="'+o.containerName+'"]');
        } else {
          return containers.closest(el);
        }
      }

      for (let show of showStates) {
        us.show(show.stateName, getContainer(show));
      }
      for (let hide of hideStates) {
        us.hide(hide.stateName, getContainer(hide));
      }
    });
  }, false);
})();

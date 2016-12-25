const states = require('../states')
    , containers = require('../containers');

module.exports = (() => {

  const utils = {
    parseTrigger: (str) => {
      if (!str) {
        return [];
      }
      let triggers = (str || '').replace(/ /g,'').split(',')
        , results = [];

      for (let trigger of triggers) {
        let triggerParts = trigger.split('.');
        if (triggerParts.length == 1) {
          results.push({
            stateName: trigger.trim()
          });
        } else {
          let [containerName, stateName] = triggerParts;
          results.push({
            stateName: stateName.trim(),
            containerName: containerName.trim()
          });
        }
      }
      return results;
    },
    getAttr: (el, container, state, val) => {
      return el.getAttribute('data-us-'+state+'-'+val+'')
        || el.getAttribute('data-us-'+val+'')
        || container.getAttribute('data-us-'+state+'-'+val+'')
        || container.getAttribute('data-us-'+val+'');
    },
    getOptions: (state, el, container) => {
      return {
        style: utils.getAttr(el, container, state, 'style') || 'default',
        duration: utils.getAttr(el, container, state, 'duration') || 400,
        delay: utils.getAttr(el, container, state, 'delay') || 0,
        easing: utils.getAttr(el, container, state, 'easing')
      };
    },
    calculateContainerWait: (currentOptions, nextOptions, containerOptions) => {
      let wait = 0;
      const nextTotal = nextOptions.duration + nextOptions.delay,
            currentTotal = currentOptions.duration + currentOptions.delay,
            containerTotal = containerOptions.duration + containerOptions.delay;
      if (nextTotal > containerTotal) {
        wait = nextTotal - containerTotal;
      }
      if (currentTotal > containerTotal && currentTotal > nextTotal) {
        wait = currentTotal - containerTotal;
      }
      return wait;
    },
    getArguments: (args) => {
      let state, container, options;

      if (args.length == 0) {
        throw new Error('Need at least one argument');
      } else if (args.length == 1) {
        state = args[0];
        container = undefined;
        options = {};
      } else if (args.length == 2 && args[1].nodeName) {
        state = args[0];
        container = args[1];
        options = {};
      } else if (args.length == 2) {
        state = args[0];
        container = undefined;
        options = args[1];
      } else {
        state = args[0];
        container = args[1];
        options = args[2];
      }

      if (typeof state === 'string' || state instanceof String) {
        if (state.split('.').length == 2) {
          // 'containerName.stateName'
          let [containerName,stateName] = state.split('.');
          state = states.get(stateName, containers.find(containerName));
          container = state.parentNode;
        } else if (state.split('.').length == 1 && container) {
          // 'state'
          state = states.get(state, container);
        } else {
          throw new Error('Either specify state with container.state or provide container element')
        }
      } else {
        if (container == undefined) {
          container = state.parentNode;
        }
      }
      return { state, container, options };
    }
  };

  return utils;
})();

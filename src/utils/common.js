const states = require('../states'),
  containers = require('../containers'),
  styles = require('../styles');

module.exports = (() => {
  const utils = {
    parseTrigger: str => {
      if (!str) {
        return [];
      }
      let triggers = (str || '').replace(/ /g, '').split(','),
        results = [];

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
    getAttr: (el, container, action, val) => {
      return (
        el.getAttribute('data-us-' + action + '-' + val + '') ||
        el.getAttribute('data-us-' + val + '') ||
        container.getAttribute('data-us-' + action + '-' + val + '') ||
        container.getAttribute('data-us-' + val + '')
      );
    },
    getOptions: ({ action, el, container }, options = {}) => {
      options[action] = options[action] || {};
      let style =
        options[action].style ||
        options.style ||
        utils.getAttr(el, container, action, 'style') ||
        'default';
      return {
        duration:
          options[action].duration ||
          options.duration ||
          utils.getAttr(el, container, action, 'duration') ||
          300,
        delay:
          options[action].delay ||
          options.delay ||
          utils.getAttr(el, container, action, 'delay') ||
          0,
        easing:
          options[action].easing ||
          options.easing ||
          utils.getAttr(el, container, action, 'easing') ||
          'linear',
        from:
          options[action].from ||
          options.from ||
          (styles[style][action] && styles[style][action].from),
        to:
          options[action].to ||
          options.to ||
          (styles[style][action] && styles[style][action].to),
        after: options[action].after || options.after,
        before: options[action].before || options.before,
        isStatic: options[action].isStatic || options.isStatic
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
    getArguments: args => {
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
          let [containerName, stateName] = state.split('.');
          state = states.get(stateName, containers.find(containerName));
          container = state.parentNode;
        } else if (state.split('.').length == 1 && container) {
          // 'state'
          state = states.get(state, container);
        } else {
          throw new Error(
            'Either specify state with container.state or provide container element'
          );
        }
      } else {
        if (container == undefined) {
          container = state.parentNode;
        }
      }
      options.show = options.show || {};
      options.hide = options.hide || {};
      options.container = options.container || {};

      return { state, container, options };
    }
  };

  return utils;
})();

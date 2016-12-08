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
        style: utils.getAttr(el, container, 'hide', 'style') || 'default',
        duration: utils.getAttr(el, container, 'hide', 'duration') || 400,
        delay: utils.getAttr(el, container, 'hide', 'delay') || 0,
        easing: utils.getAttr(el, container, 'hide', 'easing')
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
    }
  };

  return utils;
})();

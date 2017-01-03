const assign = require('object-assign'),
      states = require('./states'),
      containers = require('./containers'),
      USA = require('./usa'),
      styles = require('./styles'),
      size = require('./utils/size'),
      easing = require('./utils/easing'),
      css = require('./utils/css'),
      common = require('./utils/common'),
      loop = require('./loop'),
      listeners = require('./utils/listeners');


const us = {

  slideTo() {
    let {state, container, options} = common.getArguments(arguments)
      , next = state
      , current = states.current(container);

    if (next == current) return;
    if (next == null) return;

    let currentHeight = 0
      , nextHeight = size.height(next);

    if (current) {
      currentHeight = size.height(current);
      assign(options.hide, {
        action: 'hide',
        el: current,
        container: container,
        after: () => {
          states.hide(current);
        }
      });
    }
    assign(options.show, {
      action: 'show',
      el: next,
      container: container,
      after: () => {
        states.show(next);
      }
    });
    assign(options.container, {
      action: 'container',
      el: container,
      container: container,
      from: { height: currentHeight + 'px' },
      to: { height: nextHeight + 'px' },
      after: () => {
        size.clearHeight(container);
      },
      isStatic: true,
      wait: 0 //common.calculateContainerWait(currentOptions, nextOptions, containerOptions)
    });

    if (current)
      us.a(current, common.getOptions(options.hide));
    us.a(next, common.getOptions(options.show));
    us.a(container, common.getOptions(options.container));
  },

  hide() {
    let {state, container, options} = common.getArguments(arguments)
      , current = states.current(container);

    if (state == null || current == null) return;
    if (current !== state) return;

    let currentHeight = size.height(current)
      , nextHeight = 0;

    assign(options.hide, {
      action: 'hide',
      el: current,
      container: container,
      after: () => {
        states.hide(current);
      },
      hide: true
    });
    assign(options.container, {
      action: 'container',
      el: container,
      container: container,
      from: { height: currentHeight + 'px' },
      to: { height: nextHeight + 'px' },
      after: () => {
        size.clearHeight(container);
      },
      isStatic: true,
      wait: 0 // currentOptions.duration + currentOptions.delay
    });

    us.a(current, common.getOptions(options.hide));
    us.a(container, common.getOptions(options.container));
  },

  toggle(nameOrEl) {
    let state = nameOrEl;
    if (typeof nameOrEl === 'string' || nameOrEl instanceof String) {
      let [containerName,stateName] = nameOrEl.split('.');
      state = states.get(stateName, containers.find(containerName));
    }
    if (states.isHidden(state)) {
      us.show(state);
    } else {
      us.hide(state);
    }
  },
  next(containerNameOrEl) {
    let container = containerNameOrEl;
    if (typeof containerNameOrEl === 'string' || containerNameOrEl instanceof String) {
      container = containers.find(containerNameOrEl)
    }
    us.slideTo(states.next(container));
  },
  back(containerNameOrEl) {
    let container = containerNameOrEl;
    if (typeof containerNameOrEl === 'string' || containerNameOrEl instanceof String) {
      container = containers.find(containerNameOrEl)
    }
    us.slideTo(states.back(container));
  },

  style(name, options) {
    styles[name] = options;
  },

  a(el, options) {
    loop.push(new USA(el, options));
  }
}

module.exports = us;

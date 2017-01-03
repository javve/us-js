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
      listeners = require('./utils/listeners'),
      dom = require('./utils/dom');


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

  show(el, options = {}) {
    if (!states.isHidden(el)) return;

    options.show = options.show || {};
    options.container = options.container || {};
    dom.wrap(el);

    let container = el.parentNode
      , currentHeight = 0
      , nextHeight = size.height(el);

    if (!options.overflow)
      container.style.overflow = 'hidden';

    assign(options.show, {
      action: 'show',
      el,
      container
    });

    assign(options.container, {
      action: 'container',
      el: container,
      container: container,
      from: { height: currentHeight + 'px' },
      to: { height: nextHeight + 'px' },
      after: () => {
        dom.unwrap(el);
      },
      isStatic: true,
      wait: 0 //common.calculateContainerWait(currentOptions, nextOptions, containerOptions)
    });

    us.a(el, common.getOptions(options.show));
    us.a(container, common.getOptions(options.container));
  },

  hide(el, options = {}) {
    if (states.isHidden(el)) return;

    options.hide = options.hide || {};
    options.container = options.container || {};
    dom.wrap(el);

    let container = el.parentNode
      , currentHeight = size.height(el)
      , nextHeight = 0;

    if (!options.overflow)
      container.style.overflow = 'hidden';

    assign(options.hide, {
      action: 'hide',
      el: el,
      container: container,
      after: () => {
        states.hide(el);
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
        dom.unwrap(el);
      },
      isStatic: true,
      wait: 0 // currentOptions.duration + currentOptions.delay
    });

    us.a(el, common.getOptions(options.hide));
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

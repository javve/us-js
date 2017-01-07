const assign = require('object-assign'),
      states = require('./states'),
      containers = require('./containers'),
      USA = require('./usa'),
      styles = require('./styles'),
      size = require('./utils/size'),
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
        after: () => {
          states.hide(current);
        }
      });
    }
    assign(options.show, {
      after: () => {
        states.show(next);
      }
    });
    assign(options.container, {
      from: { height: currentHeight + 'px' },
      to: { height: nextHeight + 'px' },
      after: () => {
        size.clearHeight(container);
      },
      isStatic: true,
      wait: 0 //common.calculateContainerWait(currentOptions, nextOptions, containerOptions)
    });

    if (current) {
      us.a(current, common.getOptions({
        action: 'hide',
        el: current,
        container: container
      }, options));
    }

    us.a(next, common.getOptions({
      action: 'show',
      el: next,
      container: container
    }, options));

    us.a(container, common.getOptions({
      action: 'container',
      el: container,
      container: container
    },options.container));
  },

  show(el, options = {}) {
    if (!states.isHidden(el)) return;

    options.show = options.show || {};
    options.container = options.container || {};
    dom.wrap(el);

    let container = el.parentNode
      , currentHeight = 0
      , nextHeight = size.height(el);

    if (options.overflow !== true)
      container.style.overflow = 'hidden';

    assign(options.container, {
      from: { height: currentHeight + 'px' },
      to: { height: nextHeight + 'px' },
      after: () => {
        dom.unwrap(el);
      },
      isStatic: true,
      wait: 0 //common.calculateContainerWait(currentOptions, nextOptions, containerOptions)
    });

    us.a(el, common.getOptions({
      action: 'show', el, container
    }, options));

    us.a(container, common.getOptions({
      action: 'container',
      el: container,
      container: container
    }, options));
  },

  hide(el, options = {}) {
    if (states.isHidden(el)) return;

    options.hide = options.hide || {};
    options.container = options.container || {};
    dom.wrap(el);

    let container = el.parentNode
      , currentHeight = size.height(el)
      , nextHeight = 0;

    if (options.overflow !== true)
      container.style.overflow = 'hidden';

    assign(options.hide, {
      after: () => {
        states.hide(el);
      },
      hide: true
    });
    assign(options.container, {
      from: { height: currentHeight + 'px' },
      to: { height: nextHeight + 'px' },
      after: () => {
        dom.unwrap(el);
      },
      isStatic: true,
      wait: 0 // currentOptions.duration + currentOptions.delay
    });

    us.a(el, common.getOptions({
      action: 'hide',
      el: el,
      container: container
    }, options));

    us.a(container, common.getOptions({
      action: 'container',
      el: container,
      container: container
    }, options));
  },

  toggle(nameOrEl, options) {
    let state = nameOrEl;
    if (typeof nameOrEl === 'string' || nameOrEl instanceof String) {
      let [containerName,stateName] = nameOrEl.split('.');
      state = states.get(stateName, containers.find(containerName));
    }
    if (states.isHidden(state)) {
      us.show(state, options);
    } else {
      us.hide(state, options);
    }
  },
  style(name, options) {
    styles[name] = options;
  },

  a(el, options) {
    loop.push(new USA(el, options));
  }
}

module.exports = us;

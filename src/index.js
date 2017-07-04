const assign = require('object-assign'),
  states = require('./states'),
  containers = require('./containers'),
  USA = require('./usa'),
  styles = require('./styles'),
  size = require('./utils/size'),
  common = require('./utils/common'),
  loop = require('./loop'),
  dom = require('./utils/dom'),
  css = require('./utils/css');

require('./utils/listeners');

const us = {
  slideTo() {
    let { state, container, options } = common.getArguments(arguments),
      next = state,
      current = states.current(container),
      currentAnimationOptions,
      nextAnimationOptions,
      containerAnimationOptions;

    if (next == current) return;
    if (next == null) return;

    let currentHeight = 0,
      nextHeight = size.height(next);

    if (!css.support3d) {
      if (current) {
        css.set(current, { display: { val: 'none' } });
      }
      css.set(next, { display: { val: 'block' } });
      return;
    }

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
      currentAnimationOptions = common.getOptions({
        action: 'hide',
        el: current,
        container: container,
        options: options
      });
    }
    nextAnimationOptions = common.getOptions({
      action: 'show',
      el: next,
      container: container,
      options: options
    });
    containerAnimationOptions = common.getOptions({
      action: 'container',
      el: container,
      container: container,
      options: options.container
    });

    if (current) {
      us.a(current, currentAnimationOptions);
    }
    us.a(next, nextAnimationOptions);
    us.a(container, containerAnimationOptions);
  },

  show(el, options = {}) {
    if (!states.isHidden(el)) return;

    if (!css.support3d) {
      css.set(el, { display: { val: 'block' } });
      return;
    }

    options.show = options.show || {};
    options.container = options.container || {};
    dom.wrap(el);

    let container = el.parentNode,
      currentHeight = 0,
      nextHeight = size.height(el), // TODO: INCLUDE MARGINS! OK SINCE WRAP
      containerAnimationOptions,
      elAnimationOptions;

    if (options.overflow !== true) container.style.overflow = 'hidden';

    assign(options.container, {
      from: { height: currentHeight + 'px' },
      to: { height: nextHeight + 'px' },
      after: () => {
        dom.unwrap(el);
      },
      isStatic: true,
      wait: 0 //common.calculateContainerWait(currentOptions, nextOptions, containerOptions)
    });

    elAnimationOptions = common.getOptions({
      action: 'show',
      el,
      container,
      options
    });
    containerAnimationOptions = common.getOptions({
      action: 'container',
      el: container,
      container: container,
      options
    });

    us.a(el, elAnimationOptions);
    us.a(container, containerAnimationOptions);
  },

  hide(el, options = {}) {
    if (states.isHidden(el)) return;

    if (!css.support3d) {
      css.set(el, { display: { val: 'none' } });
      return;
    }

    options.hide = options.hide || {};
    options.container = options.container || {};
    dom.wrap(el);

    let container = el.parentNode,
      currentHeight = size.height(el),
      nextHeight = 0,
      elAnimationOptions,
      containerAnimationOptions;

    if (options.overflow !== true) container.style.overflow = 'hidden';

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

    elAnimationOptions = common.getOptions({
      action: 'hide',
      el: el,
      container,
      options
    });
    containerAnimationOptions = common.getOptions({
      action: 'container',
      el: container,
      container,
      options
    });

    us.a(el, elAnimationOptions);
    us.a(container, containerAnimationOptions);
  },

  toggle(nameOrEl, options) {
    let state = nameOrEl;
    if (typeof nameOrEl === 'string' || nameOrEl instanceof String) {
      let [containerName, stateName] = nameOrEl.split('.');
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
};

module.exports = us;

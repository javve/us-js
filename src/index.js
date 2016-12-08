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

  show(nameOrEl, options = {}) {
    let next;
    if (typeof nameOrEl === 'string' || nameOrEl instanceof String) {
      // Handle name
    } else {
      next = nameOrEl;
    }
    let container = next.parentNode
      , current = states.current(container);

    if (next == null || current == null) return;

    if (window.getComputedStyle(current).display !== 'block') {
      current.style.display = 'block';
    }
    if (window.getComputedStyle(next).display !== 'block') {
      next.style.display = 'block';
    }
    if (window.getComputedStyle(container).display !== 'block') {
      container.style.display = 'block';
    }

    let currentHeight = size.height(current)
      , nextHeight = size.height(next)
      , currentOptions = options.hide || common.getOptions('hide', current, container)
      , nextOptions = options.show || common.getOptions('show', next, container)
      , containerOptions = options.container || common.getOptions('', container, container);

    assign(currentOptions, {
      from: styles[currentOptions.style].show,
      to: styles[currentOptions.style].previous,
      after: () => {
        states.hide(current);
      },
      hide: true
    });
    assign(nextOptions, {
      from: styles[nextOptions.style].next,
      to: styles[nextOptions.style].show,
      after: () => {
        states.show(next);
      }
    });
    assign(containerOptions, {
      from: { height: currentHeight + 'px' },
      to: { height: nextHeight + 'px' },
      after: () => {
        size.clearHeight(container);
      },
      static: true,
      wait: common.calculateContainerWait(currentOptions, nextOptions, containerOptions)
    });

    us.a(current, currentOptions);
    us.a(next, nextOptions);
    us.a(container, containerOptions);
  },

  hide(name, container = null) {
    let current = states.current(container)
      , hide = states.get(name, container);

    if (hide == null || current == null) return;
    if (current !== hide) return;

    if (window.getComputedStyle(current).display !== 'block') {
      current.style.display = 'block';
    }
    if (window.getComputedStyle(container).display !== 'block') {
      container.style.display = 'block';
    }

    let currentHeight = size.height(current)
      , nextHeight = 0
      , currentOptions = common.getOptions(current, container)
      , containerOptions = common.getOptions(container, container);

    assign(currentOptions, {
      from: styles[currentOptions.style].show,
      to: styles[currentOptions.style].previous,
      after: () => {
        states.hide(current);
      },
      hide: true
    });
    assign(containerOptions, {
      from: { height: currentHeight + 'px' },
      to: { height: nextHeight + 'px' },
      after: () => {
        size.clearHeight(container);
      },
      static: true,
      wait: currentOptions.duration + currentOptions.delay
    });

    us.a(current, currentOptions);
    us.a(container, containerOptions);
  },

  next(containerNameOrEl) {
    let container;
    if (typeof containerNameOrEl === 'string' || containerNameOrEl instanceof String) {
      container = containers.find(containerNameOrEl)
    } else {
      container = container;
    }
    us.show(states.next(container));
  },
  back(containerNameOrEl) {
    let container;
    if (typeof containerNameOrEl === 'string' || containerNameOrEl instanceof String) {
      container = containers.find(containerNameOrEl)
    } else {
      container = container;
    }
    us.show(states.back(container));
  },

  a(el, options) {
    loop.push(new USA(el, options));
  }
}

module.exports = us;

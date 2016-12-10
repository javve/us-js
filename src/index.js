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
      let [containerName,stateName] = nameOrEl.split('.');
      next = states.get(stateName, containers.find(containerName));
    } else {
      next = nameOrEl;
    }
    let container = next.parentNode
      , current = states.current(container);

    if (next == current) return;
    if (next == null) return;

    if (window.getComputedStyle(next).display !== 'block') {
      next.style.display = 'block';
    }
    if (window.getComputedStyle(container).display !== 'block') {
      container.style.display = 'block';
    }

    let currentHeight = 0;
    if (current) {
      if (window.getComputedStyle(current).display !== 'block') {
        current.style.display = 'block';
      }
      currentHeight = size.height(current);
      let currentOptions = options.hide || common.getOptions('hide', current, container)
      assign(currentOptions, {
        from: styles[currentOptions.style].show,
        to: styles[currentOptions.style].previous,
        after: () => {
          states.hide(current);
        },
        hide: true
      });
      us.a(current, currentOptions);
    }

    let nextHeight = size.height(next)
      , nextOptions = options.show || common.getOptions('show', next, container)
      , containerOptions = options.container || common.getOptions('', container, container);

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
      wait: 0 //common.calculateContainerWait(currentOptions, nextOptions, containerOptions)
    });

    us.a(next, nextOptions);
    us.a(container, containerOptions);
  },

  hide(nameOrEl, options = null) {
    let hide;
    if (typeof nameOrEl === 'string' || nameOrEl instanceof String) {
      let [containerName,stateName] = nameOrEl.split('.');
      hide = states.get(stateName, containers.find(containerName));
    } else {
      hide = nameOrEl;
    }
    let container = hide.parentNode
      , current = states.current(container);

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
      , currentOptions = common.getOptions('hide', current, container)
      , containerOptions = common.getOptions('', container, container);

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

  style(name, options) {
    styles[name] = options;
  },

  a(el, options) {
    loop.push(new USA(el, options));
  }
}

module.exports = us;

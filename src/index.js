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

      // usContainer
      //   _us:
      //
      // _queue: []
      //
      // show() {
      //
      // }

const us = {
  show() {
    let {state, container, options} = common.getArguments(arguments)
      , next = state
      , current = states.current(container);

    if (next == current) return;
    if (next == null) return;

    let currentHeight = 0;
    if (current) {
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

  hide() {
    let {state, container, options} = common.getArguments(arguments)
      , hide = state
      , current = states.current(container);

    if (hide == null || current == null) return;
    if (current !== hide) return;

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
    us.show(states.next(container));
  },
  back(containerNameOrEl) {
    let container = containerNameOrEl;
    if (typeof containerNameOrEl === 'string' || containerNameOrEl instanceof String) {
      container = containers.find(containerNameOrEl)
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

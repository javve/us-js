const assign = require('object-assign'),
      states = require('./states'),
      containers = require('./containers'),
      USA = require('./usa'),
      styles = require('./styles'),
      size = require('./utils/size'),
      easing = require('./utils/easing'),
      css = require('./utils/css'),
      common = require('./utils/common'),
      loop = require('./loop');

const us = {
  show(name, container = null) {
    let current = states.current(container)
      , next = states.get(name, container);

    if (next == null || current == null) return;
    if (current == next) return;

    if (window.getComputedStyle(current).display !== 'block') {
      current.style.display = 'block';
    }
    if (window.getComputedStyle(next).display !== 'block') {
      next.style.display = 'block';
    }
    if (window.getComputedStyle(container).display !== 'block') {
      container.style.display = 'block';
    }

    let currentHeight = this.currentHeight = size.height(current)
      , nextHeight = this.nextHeight = size.height(next)
      , currentOptions = common.getOptions(current, container)
      , nextOptions = common.getOptions(next, container)
      , containerOptions = common.getOptions(container, container);

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
    })

    this.a(current, currentOptions);
    this.a(next, nextOptions);
    this.a(container, containerOptions);
  },
  hide(name) {
    // already hidden?
    let current = this.current = states.current();

    let currentHeight = this.currentHeight = size.height(current)
      , nextHeight = this.nextHeight = 0;

    states.previous(current);
    size.height(this.el, currentHeight);

    this.loop();
  },
  a(el, options) {
    let a = new USA(el, options)
    loop.push(a);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    e.stopPropagation();
    const el = e.target;

    let showStates = common.parseTrigger(el.getAttribute('data-us-show'))
      , hideStates = common.parseTrigger(el.getAttribute('data-us-hide'))
      , container = null;

    const getContainer = (o) => {
      if (o.containerName) {
        return document.querySelector('[data-us="'+o.containerName+'"]');
      } else {
        return containers.closest(el);
      }
    }

    for (let show of showStates) {
      us.show(show.stateName, getContainer(show));
    }
    for (let hide of hideStates) {
      us.hide(hide.stateName, getContainer(hide));
    }
  });
}, false);

module.exports = us;

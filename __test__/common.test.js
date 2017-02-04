const common = require('../src/utils/common.js');

describe('Common', function() {
  beforeEach(function() {
    this.el = document.createElement('div');
    document.body.appendChild(this.el);
  });
  afterEach(function() {
    this.el.remove()
  });

  describe('parseTrigger', function() {
    it('parse simple trigger', function() {
      expect(common.parseTrigger('show')).toEqual([{
        stateName: 'show'
      }]);
    });

    it('parse namespace trigger', function() {
      expect(common.parseTrigger('foo.show')).toEqual([{
        stateName: 'show',
        containerName: 'foo'
      }]);
    });

    it('parse multiple triggers', function() {
      expect(common.parseTrigger('foo.show,bar')).toEqual([{
        stateName: 'show',
        containerName: 'foo'
      }, {
        stateName: 'bar'
      }]);
    });

    it('parse multiple triggers with whitespace', function() {
      expect(common.parseTrigger(' foo.show , bar ')).toEqual([{
        stateName: 'show',
        containerName: 'foo'
      }, {
        stateName: 'bar'
      }]);
    });
  });

  describe('getAttr', function() {
    beforeEach(function() {
      this.container = document.createElement('div');
      document.body.appendChild(this.container);
    });
    afterEach(function() {
      this.container.remove()
    });
    it('from el without state', function() {
      this.el.setAttribute('data-us-style', 'foo');
      expect(common.getAttr(this.el, this.container, 'hide', 'style')).toBe('foo')
    });
    it('from el with state', function() {
      this.el.setAttribute('data-us-hide-style', 'foo');
      expect(common.getAttr(this.el, this.container, 'hide', 'style')).toBe('foo')
    });
    it('from container without state', function() {
      this.container.setAttribute('data-us-style', 'foo');
      expect(common.getAttr(this.el, this.container, 'hide', 'style')).toBe('foo')
    });
    it('from container with state', function() {
      this.container.setAttribute('data-us-hide-style', 'foo');
      expect(common.getAttr(this.el, this.container, 'hide', 'style')).toBe('foo')
    });
    it('from prioritize state before non state', function() {
      this.container.setAttribute('data-us-hide-style', 'foo');
      this.container.setAttribute('data-us-style', 'bar');
      expect(common.getAttr(this.el, this.container, 'hide', 'style')).toBe('foo')
    });
    it('from prioritize el state before container state', function() {
      this.el.setAttribute('data-us-hide-style', 'foo');
      this.container.setAttribute('data-us-hide-style', 'bar');
      expect(common.getAttr(this.el, this.container, 'hide', 'style')).toBe('foo')
    });
  });

  describe('getArguments', function() {
    beforeEach(function() {
      this.container = document.createElement('div');
      this.state = document.createElement('div');
      document.body.appendChild(this.container);
      this.container.appendChild(this.state);
    });
    afterEach(function() {
      this.container.remove()
      this.state.remove()
    });
    it('should handle only a state', function() {
      expect(common.getArguments([this.state])).toEqual({
        state: this.state,
        container: this.state.parentNode,
        options: { show: {}, hide: {}, container: {}}
      });
    });
    it('should handle only state and container', function() {
      expect(common.getArguments([this.state, this.container])).toEqual({
        state: this.state,
        container: this.container,
        options: { show: {}, hide: {}, container: {}}
      });
    });
    it('should handle only state, container and options', function() {
      expect(common.getArguments([this.state, this.container, { show: { style: 'slide' } }])).toEqual({
        state: this.state,
        container: this.container,
        options: { show: { style: 'slide' }, hide: {}, container: {} }
      });
    });
    it('should handle only state and options', function() {
      expect(common.getArguments([this.state, { show: { style: 'slide' } }])).toEqual({
        state: this.state,
        container: this.state.parentNode,
        options: { show: { style: 'slide' }, hide: {}, container: {} }
      });
    });
    it('should handle state as string', function() {
      this.state.setAttribute('data-us-name', 'foo');
      expect(common.getArguments(['foo', this.container])).toEqual({
        state: this.state,
        container: this.state.parentNode,
        options: { show: {}, hide: {}, container: {}}
      });
    });
    it('should handle state and container as string', function() {
      this.state.setAttribute('data-us-name', 'foo');
      this.container.setAttribute('data-us', 'bar');
      expect(common.getArguments(['bar.foo'])).toEqual({
        state: this.state,
        container: this.container,
        options: { show: {}, hide: {}, container: {}}
      });
    });
  });

  describe('getOptions', function() {
    beforeEach(function() {
      this.container = document.createElement('div');
      this.state = document.createElement('div');
      document.body.appendChild(this.container);
      this.container.appendChild(this.state);
    });
    it('should return default options for show', function() {
      expect(common.getOptions({action: 'show', el: this.state, container: this.container})).toEqual({
        duration: 300,
        delay: 0,
        easing: 'linear',
        from: {
          opacity: 0
        },
        to: {
          opacity: 1
        },
        after: undefined,
        before: undefined,
        isStatic: undefined
      });
    });
    it('should return default options for hide', function() {
      expect(common.getOptions({action: 'hide', el: this.state, container: this.container})).toEqual({
        duration: 300,
        delay: 0,
        easing: 'linear',
        from: {
          opacity: 1
        },
        to: {
          opacity: 0
        },
        after: undefined,
        before: undefined,
        isStatic: undefined
      });
    });
    it('should return default options for container', function() {
      expect(common.getOptions({action: 'container', el: this.container, container: this.container})).toEqual({
        duration: 300,
        delay: 0,
        easing: 'linear',
        from: undefined,
        to: undefined,
        after: undefined,
        before: undefined,
        isStatic: undefined
      });
    });

    it('should return prioritize hide option then general then data then default', function() {
      this.state.setAttribute('data-us-duration', 'duration-1');
      this.state.setAttribute('data-us-delay', 'delay-1');
      this.state.setAttribute('data-us-easing', 'easing-1');
      let options = common.getOptions({action: 'hide', el: this.state, container: this.container}, {
        duration: 'duration-2',
        delay: 'delay-2',
        hide: {
          duration: 'duration-3',
        }
      });

      expect(options).toEqual({
        duration: 'duration-3',
        delay: 'delay-2',
        easing: 'easing-1',
        from: {
          opacity: 1
        },
        to: {
          opacity: 0
        },
        after: undefined,
        before: undefined,
        isStatic: undefined
      });
    });

  });
});

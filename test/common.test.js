const expect = require('chai').expect
    , common = require('../src/utils/common.js');

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
      expect(common.parseTrigger('show')).to.deep.equal([{
        stateName: 'show'
      }]);
    });

    it('parse namespace trigger', function() {
      expect(common.parseTrigger('foo.show')).to.deep.equal([{
        stateName: 'show',
        containerName: 'foo'
      }]);
    });

    it('parse multiple triggers', function() {
      expect(common.parseTrigger('foo.show,bar')).to.deep.equal([{
        stateName: 'show',
        containerName: 'foo'
      }, {
        stateName: 'bar'
      }]);
    });

    it('parse multiple triggers with whitespace', function() {
      expect(common.parseTrigger(' foo.show , bar ')).to.deep.equal([{
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
      expect(common.getAttr(this.el, this.container, 'hide', 'style')).to.equal('foo')
    });
    it('from el with state', function() {
      this.el.setAttribute('data-us-hide-style', 'foo');
      expect(common.getAttr(this.el, this.container, 'hide', 'style')).to.equal('foo')
    });
    it('from container without state', function() {
      this.container.setAttribute('data-us-style', 'foo');
      expect(common.getAttr(this.el, this.container, 'hide', 'style')).to.equal('foo')
    });
    it('from container with state', function() {
      this.container.setAttribute('data-us-hide-style', 'foo');
      expect(common.getAttr(this.el, this.container, 'hide', 'style')).to.equal('foo')
    });
    it('from prioritize state before non state', function() {
      this.container.setAttribute('data-us-hide-style', 'foo');
      this.container.setAttribute('data-us-style', 'bar');
      expect(common.getAttr(this.el, this.container, 'hide', 'style')).to.equal('foo')
    });
    it('from prioritize el state before container state', function() {
      this.el.setAttribute('data-us-hide-style', 'foo');
      this.container.setAttribute('data-us-hide-style', 'bar');
      expect(common.getAttr(this.el, this.container, 'hide', 'style')).to.equal('foo')
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
      expect(common.getArguments([this.state])).to.deep.equal({
        state: this.state,
        container: this.state.parentNode,
        options: {}
      });
    });
    it('should handle only state and container', function() {
      expect(common.getArguments([this.state, this.container])).to.deep.equal({
        state: this.state,
        container: this.container,
        options: {}
      });
    });
    it('should handle only state, container and options', function() {
      expect(common.getArguments([this.state, this.container, { from: { style: 'slide' } }])).to.deep.equal({
        state: this.state,
        container: this.container,
        options: { from: { style: 'slide' } }
      });
    });
    it('should handle only state and options', function() {
      expect(common.getArguments([this.state, { from: { style: 'slide' } }])).to.deep.equal({
        state: this.state,
        container: this.state.parentNode,
        options: { from: { style: 'slide' } }
      });
    });
    it('should handle state as string', function() {
      this.state.setAttribute('data-us-name', 'foo');
      expect(common.getArguments(['foo', this.container])).to.deep.equal({
        state: this.state,
        container: this.state.parentNode,
        options: {}
      });
    });
    it('should handle state and container as string', function() {
      this.state.setAttribute('data-us-name', 'foo');
      this.container.setAttribute('data-us', 'bar');
      expect(common.getArguments(['bar.foo'])).to.deep.equal({
        state: this.state,
        container: this.container,
        options: {}
      });
    });
  });
});

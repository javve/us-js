const dom = require('../src/utils/dom.js');

describe('DOM', function() {
  beforeEach(function() {
    this.el = document.createElement('div');
    document.body.appendChild(this.el);
  });
  afterEach(function() {
    this.el.remove()
  });

  it('should wrap element in div', function() {
    expect(this.el.parentNode).toEqual(document.body);
    dom.wrap(this.el);
    expect(this.el.parentNode).not.toEqual(document.body);
  });

  it('should unwrap element from div', function() {
    let parent = document.createElement('div');
    document.body.appendChild(parent);
    parent.appendChild(this.el)
    expect(this.el.parentNode).not.toEqual(document.body);
    dom.unwrap(this.el);
    expect(this.el.parentNode).toEqual(document.body);
  });
});

expect = require('chai').expect;
style = require('./style.scss');

size = require('../src/utils/size.js');

describe('Size', () => {
  beforeEach(() => {
    this.el = document.createElement('div');
    document.body.appendChild(this.el);
  });
  afterEach(() => {
    this.el.remove()
  });

  it('should height via css', () => {
    this.el.classList.add('test-height');
    expect(size.height(this.el)).to.equal(800);
  });

  it('should height via css with padding', () => {
    this.el.classList.add('test-height-padding');
    expect(size.height(this.el)).to.equal(820);
  });

  it('should height via css with padding and border-box', () => {
    this.el.classList.add('test-height-box-sizing');
    expect(size.height(this.el)).to.equal(820);
  });

  it('should height via css with scale', () => {
    this.el.classList.add('test-height-scale');
    expect(size.height(this.el)).to.equal(820);
  });

  it('should height with content', () => {
    content = document.createElement('div');
    content.innerHTML = 'hej';
    this.el.appendChild(content);
    expect(size.height(this.el)).to.equal(18);
  });
});

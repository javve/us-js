const size = require('../src/utils/size.js');

describe('Size', function() {
  beforeEach(function() {
    this.el = document.createElement('div');
    document.body.appendChild(this.el);
  });
  afterEach(function() {
    this.el.remove()
  });

  it('should height via css', function() {
    this.el.style.height = '800px';
    setTimeout(function() {
      expect(size.height(this.el)).toBe(800);
    }, 10);
  });

  it('should height via css with padding', function() {
    this.el.style.height = '800px';
    this.el.style.padding = '10px';
    setTimeout(function() {
      expect(size.height(this.el)).toBe(820);
    }, 10);
  });

  it('should height via css with padding and border-box', function() {
    this.el.style.height = '800px';
    this.el.style.padding = '10px';
    setTimeout(function() {
      expect(size.height(this.el)).toBe(820);
    }, 10);
  });

  it('should height via css with scale', function() {
    this.el.style.height = '800px';
    this.el.style.padding = '10px';
    this.el.style.transform = 'scale(1.1)';
    setTimeout(function() {
      expect(size.height(this.el)).toBe(820);
    }, 10);
  });

  it('should height with content', function() {
    let content = document.createElement('div');
    content.innerHTML = 'hej';
    this.el.appendChild(content);
    setTimeout(function() {
      expect(size.height(this.el)).toBe(18);
    }, 10);
  });
});

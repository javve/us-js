const css = require('../src/utils/css.js');

describe('CSS', function() {
  beforeEach(function() {
    this.el = document.createElement('div');
    document.body.appendChild(this.el);
  });
  afterEach(function() {
    this.el.remove()
  });

  it('should set opacity', function() {
    let res = css.set(this.el, { opacity: { val: '0.3', unit: '' }});
    expect(this.el.style.opacity).toBe('0.3');
  });

  it('should set translateY with browser prefixes', function() {
    css.set(this.el, { translateY: {val: 10, unit: 'px'}});
    expect(this.el.style.transform).toBe('translateY(10px)');
    expect(this.el.style.WebkitTransform).toBe('translateY(10px)');
    expect(this.el.style.MozTransform).toBe('translateY(10px)');
    expect(this.el.style.OTransform).toBe('translateY(10px)');
    expect(this.el.style.msTransform).toBe('translateY(10px)');
  });

  it('should clear transform with browser prefixes', function() {
    css.set(this.el, { translateY: {val: 10, unit: 'px'}});
    expect(this.el.style.transform).toBe('translateY(10px)');
    expect(this.el.style.WebkitTransform).toBe('translateY(10px)');
    expect(this.el.style.MozTransform).toBe('translateY(10px)');
    expect(this.el.style.OTransform).toBe('translateY(10px)');
    expect(this.el.style.msTransform).toBe('translateY(10px)');

    css.clear(this.el);
    expect(this.el.style.transform).toBe(null);
    expect(this.el.style.WebkitTransform).toBe(null); // ?
    expect(this.el.style.MozTransform).toBe(null);
    expect(this.el.style.OTransform).toBe(null);
    expect(this.el.style.msTransform).toBe(null);
  });

  it('should set translateY and rotate', function() {
    css.set(this.el, {translateY: {val: 10, unit:'px'}, rotate: {val:20, unit: 'deg'}});
    expect(this.el.style.transform).toBe('translateY(10px) rotate(20deg)');
  });

  it('should set translateY and scale', function() {
    css.set(this.el, {translateY: { val: 10, unit: 'px'}, scale: {val:1.3, unit:''}});
    expect(this.el.style.transform).toBe('translateY(10px) scale(1.3)');
  });

  it('should set position', function() {
    let res = css.set(this.el, { position: { val: 'absolute', unit: '' }});
    expect(this.el.style.position).toBe('absolute');
  });

  it('should set full style', function() {
    css.set(this.el, {
      translateY: { val:10, unit:'px'},
      scale: { val:1.3, unit: ''},
      opacity: {val:0.3}
    });
    expect(this.el.style.opacity).toBe('0.3');
    expect(this.el.style.transform).toBe('translateY(10px) scale(1.3)');
  });

  it('should parse transform style with multiple values', function() {
    this.el.style.transform = "translateY(10px) scale(1.3) rotateX(-10deg)";
    expect(css.parseTransform(this.el)).toEqual({
      translateY: { val: 10, unit: 'px' },
      scale: { val: 1.3, unit: '' },
      rotateX: { val: -10, unit: 'deg' }
    });
  });

  it('should generate transform string', function() {
    let transformString = css.generateTransformString({
      translateY: { val: '10', unit: 'px' },
      opacity: { val: 2, unit: '' },
      scale: { val: '1.3', unit: '' },
      rotateX: { val: '-10', unit: 'deg' }
    });
    expect(transformString).toBe("translateY(10px) scale(1.3) rotateX(-10deg)");
  });

  it('should parse transform style', function() {
    this.el.style.transform = "translateY(10px)";
    expect(css.parseTransform(this.el)).toEqual({
      translateY: { val: 10, unit: 'px' }
    });
  });

  it('should parse transform style when is not set', function() {
    expect(css.parseTransform(this.el)).toBe(null);
  });

  it('should parse px value', function() {
    expect(css.parseVal('10px')).toEqual({
      val: 10,
      unit: 'px'
    });
  });

  it('should parse negative px value', function() {
    expect(css.parseVal('-20px')).toEqual({
      val: -20,
      unit: 'px'
    });
  });

  it('should parse degrees value', function() {
    expect(css.parseVal('150deg')).toEqual({
      val: 150,
      unit: 'deg'
    });
  });

  it('should parse negative degrees value', function() {
    expect(css.parseVal('-54deg')).toEqual({
      val: -54,
      unit: 'deg'
    });
  });

  it('should opacity value', function() {
    expect(css.parseVal('1')).toEqual({
      val: 1,
      unit: ''
    });
  });

  it('should opacity value with decimals', function() {
    expect(css.parseVal('0.3')).toEqual({
      val: 0.3,
      unit: ''
    });
  });

});

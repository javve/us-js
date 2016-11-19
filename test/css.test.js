expect = require('chai').expect;
css = require('../src/utils/css.js')();

describe('CSS', () => {
  beforeEach(() => {
    this.el = document.createElement('div');
    document.body.appendChild(this.el);
  });
  afterEach(() => {
    this.el.remove()
  });

  it('should set opacity', () => {
    let res = css.set(this.el, { opacity: { val: '0.3', unit: '' }});
    expect(this.el.style.opacity).to.equal('0.3');
  });

  it('should set translateY', () => {
    css.set(this.el, { translateY: {val: 10, unit: 'px'}});
    expect(this.el.style.transform).to.equal('translateY(10px)');
  });

  it('should set translateY and rotate', () => {
    css.set(this.el, {translateY: {val: 10, unit:'px'}, rotate: {val:20, unit: 'deg'}});
    expect(this.el.style.transform).to.equal('translateY(10px) rotate(20deg)');
  });

  it('should set translateY and scale', () => {
    css.set(this.el, {translateY: { val: 10, unit: 'px'}, scale: {val:1.3, unit:''}});
    expect(this.el.style.transform).to.equal('translateY(10px) scale(1.3)');
  });

  it('should set full style', () => {
    css.set(this.el, {
      translateY: { val:10, unit:'px'},
      scale: { val:1.3, unit: ''},
      opacity: {val:0.3}
    });
    expect(this.el.style.opacity).to.equal('0.3');
    expect(this.el.style.transform).to.equal('translateY(10px) scale(1.3)');
  });

  it('should parse transform style with multiple values', () => {
    this.el.style.transform = "translateY(10px) scale(1.3) rotateX(-10deg)";
    expect(css.parseTransform(this.el)).to.deep.equal({
      translateY: { val: 10, unit: 'px' },
      scale: { val: 1.3, unit: '' },
      rotateX: { val: -10, unit: 'deg' }
    });
  });

  it('should generate transform string', () => {
    let transformString = css.generateTransformString({
      translateY: { val: '10', unit: 'px' },
      opacity: { val: 2, unit: '' },
      scale: { val: '1.3', unit: '' },
      rotateX: { val: '-10', unit: 'deg' }
    });
    expect(transformString).to.equal("translateY(10px) scale(1.3) rotateX(-10deg)");
  });

  it('should parse transform style', () => {
    this.el.style.transform = "translateY(10px)";
    expect(css.parseTransform(this.el)).to.deep.equal({
      translateY: { val: 10, unit: 'px' }
    });
  });

  it('should parse transform style when is not set', () => {
    expect(css.parseTransform(this.el)).to.equal(null);
  });

  it('should parse px value', () => {
    expect(css.parseVal('10px')).to.deep.equal({
      val: 10,
      unit: 'px'
    });
  });

  it('should parse negative px value', () => {
    expect(css.parseVal('-20px')).to.deep.equal({
      val: -20,
      unit: 'px'
    });
  });

  it('should parse degrees value', () => {
    expect(css.parseVal('150deg')).to.deep.equal({
      val: 150,
      unit: 'deg'
    });
  });

  it('should parse negative degrees value', () => {
    expect(css.parseVal('-54deg')).to.deep.equal({
      val: -54,
      unit: 'deg'
    });
  });

  it('should opacity value', () => {
    expect(css.parseVal('1')).to.deep.equal({
      val: 1,
      unit: ''
    });
  });

  it('should opacity value with decimals', () => {
    expect(css.parseVal('0.3')).to.deep.equal({
      val: 0.3,
      unit: ''
    });
  });

});

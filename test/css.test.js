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
    let res = css.set(this.el, 'opacity', 0.3);
    expect(this.el.style.opacity).to.equal('0.3');
    expect(res).to.deep.equal({
      key: 'opacity',
      val: '0.3',
      unit: ''
    });
  });

  it('should set translateY', () => {
    css.set(this.el, 'transform', {translateY: '10px'});
    expect(this.el.style.transform).to.equal('translateY(10px)');
  });

  it('should set translateY and rotate', () => {
    css.set(this.el, 'transform', {translateY: '10px', rotate: '20deg'});
    expect(this.el.style.transform).to.equal('translateY(10px) rotate(20deg)');
  });

  it('should set translateY and scale', () => {
    css.set(this.el, 'transform', {translateY: '10px', scale: 1.3});
    expect(this.el.style.transform).to.equal('translateY(10px) scale(1.3)');
  });

  it('should set full style', () => {
    css.setStyle(this.el, {
      transform: { translateY: '10px', scale: 1.3 },
      opacity: 0.3
    });
    expect(this.el.style.opacity).to.equal('0.3');
    expect(this.el.style.transform).to.equal('translateY(10px) scale(1.3)');
  });

  it('should parse px value', () => {
    expect(css.parseVal('10px')).to.deep.equal({
      val: '10',
      unit: 'px'
    });
  });

  it('should parse negative px value', () => {
    expect(css.parseVal('-20px')).to.deep.equal({
      val: '-20',
      unit: 'px'
    });
  });

  it('should parse degrees value', () => {
    expect(css.parseVal('150deg')).to.deep.equal({
      val: '150',
      unit: 'deg'
    });
  });

  it('should parse negative degrees value', () => {
    expect(css.parseVal('-54deg')).to.deep.equal({
      val: '-54',
      unit: 'deg'
    });
  });

  it('should opacity value', () => {
    expect(css.parseVal('1')).to.deep.equal({
      val: '1',
      unit: ''
    });
  });

  it('should opacity value with decimals', () => {
    expect(css.parseVal('0.3')).to.deep.equal({
      val: '0.3',
      unit: ''
    });
  });

});

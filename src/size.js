module.exports = {
  height(el, height) {
    if (height) {
      el.style.height = height+'px';
    } else {
      return el.offsetHeight;
    }
  },
  width(el, width) {
    if (width) {
      el.style.width = width+'px';
    } else {
      return el.offsetWidth;
    }
  },
  clearHeight(el) {
    el.style.removeProperty('height');
  },
  clearWidth(el) {
    el.style.removeProperty('width');
  },
  clear(el) {
    this.clearHeight(el);
    this.clearWidth(el);
  },
  get(el) {
    return {
      width: this.width(el),
      height: this.height(el)
    };
  },
  set(el, size) {
    this.width(el, size.width);
    this.height(el, size.height);
  }
}

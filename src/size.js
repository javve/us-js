module.exports = {
  height(el, height) {
    if (height) {
      el.style.height = height+'px';
    } else {
      return el.offsetHeight;
    }
  },
  width(el, width) {
    return el.offsetWidth;
  },
  clearHeight(el) {
    el.style.removeProperty('height');
  }
}

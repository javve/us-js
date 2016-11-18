module.exports = () => {
  const css = {
    setStyle: (el, style) => {
      for (const key in style) {
        css.set(el, key, style[key]);
      }
    },
    set: (el, key, val) => {
      if (key == 'transform') {
        let transforms = '';
        for (const transform in val) {
          transforms += ' ' + transform + '('+ val[transform] + ')';
        }
        el.style.transform = transforms
      } else {
        el.style[key] = val;
        let res = css.parseVal(val);
        return {
          key,
          val: res.val,
          unit: res.unit
        };
      }
    },
    // http://rubular.com/r/oBukmdKfFC
    parseVal: (str) => {
      const reg = /(-?\d+\.?\d*)(px|%|deg)?/i
      let result = reg.exec(str)
        , val = result[1]
        , unit = result[2] || '';
      return { val, unit };
    }
  };
  return css;
};

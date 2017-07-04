module.exports = (() => {
  const TRANSFORMS = [
      'matrix',
      'matrix3d',
      'translate',
      'translate3d',
      'translateX',
      'translateY',
      'translateZ',
      'scale',
      'scale3d',
      'scaleX',
      'scaleY',
      'scaleZ',
      'rotate',
      'rotate3d',
      'rotateX',
      'rotateY',
      'rotateZ',
      'skew',
      'skewX',
      'skewY'
    ],
    PREFIXES = ['Moz', 'Webkit', 'ms', 'O'];

  const css = {
    set: (el, style, log = false) => {
      // Handle existing transform!
      let transformString = css.generateTransformString(style);
      el.style.transform = transformString;
      PREFIXES.forEach(p => {
        el.style[p + 'Transform'] = transformString;
      });

      for (const key in style) {
        if (TRANSFORMS.indexOf(key) > -1) continue;
        if (log) console.log(style[key], css.round(style[key]));
        el.style[key] = css.round(style[key]) + (style[key].unit || '');
      }
    },

    clear: (el, style) => {
      el.style.transform = null;
      PREFIXES.forEach(p => {
        el.style[p + 'Transform'] = null;
      });

      for (const key in style) {
        if (TRANSFORMS.indexOf(key) > -1) continue;
        el.style[key] = null;
      }
    },

    generateTransformString: style => {
      let transformString = '';
      for (const key in style) {
        if (TRANSFORMS.indexOf(key) == -1) continue;
        transformString +=
          ' ' + key + '(' + css.round(style[key]) + style[key].unit + ')';
      }
      return transformString.trim();
    },

    parseTransform: el => {
      const nameValue = /([a-z]+)\((.*)\)/i;
      let transformString = (el.style.transform || '').trim();
      if (transformString.length == 0) return null;
      let results = {};
      let transforms = transformString.replace(/\)/g, '))').split(/\) /gi);
      for (let transform of transforms) {
        let transformParts = nameValue.exec(transform),
          transformName = transformParts[1],
          transformValue = transformParts[2],
          transformValueParts = css.parseVal(transformValue);
        results[transformName] = {
          val: transformValueParts.val,
          unit: transformValueParts.unit
        };
      }
      return results;
    },

    // http://rubular.com/r/oBukmdKfFC
    parseVal: str => {
      const number = /(-?\d+\.?\d*)(px|%|deg)?/i;
      let result = number.exec(str);
      let val, unit;
      if (result) {
        val = parseFloat(result[1]);
        unit = result[2] || '';
      } else {
        val = str;
        unit = '';
      }
      return { val, unit };
    },
    parseStyle: style => {
      let result = {};
      for (const key in style) {
        result[key] = css.parseVal(style[key]);
      }
      return result;
    },
    round: ({ val, unit }) => {
      if (unit == 'px') {
        return Math.round(val);
      } else if (isNaN(val)) {
        return val;
      } else {
        return Math.round(val * 100) / 100;
      }
    }
  };
  return css;
})();

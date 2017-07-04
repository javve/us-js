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
    PREFIXES = {
      WebkitTransform: '-webkit-transform',
      OTransform: '-o-transform',
      msTransform: '-ms-transform',
      MozTransform: '-moz-transform',
      transform: 'transform'
    };

  const css = {
    set: (el, style, log = false) => {
      // Handle existing transform!
      let transformString = css.generateTransformString(style);
      for (var t in PREFIXES) {
        if (PREFIXES.hasOwnProperty(t)) {
          el.style[t] = transformString;
        }
      }

      for (const key in style) {
        if (TRANSFORMS.indexOf(key) > -1) continue;
        if (log) console.log(style[key], css.round(style[key]));
        el.style[key] = css.round(style[key]) + (style[key].unit || '');
      }
    },

    clear: (el, style) => {
      for (var t in PREFIXES) {
        if (PREFIXES.hasOwnProperty(t)) {
          el.style[t] = null;
        }
      }

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
      for (let i = 0; i < transforms.lenght; i++) {
        let transform = transforms[i];
        //for (let transform of transforms) {
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
    },
    support3d: (function() {
      let el = document.createElement('p'),
        has3d;

      document.body.insertBefore(el, null);
      for (var t in PREFIXES) {
        if (PREFIXES.hasOwnProperty(t)) {
          if (el.style[t] !== undefined) {
            el.style[t] = 'translate3d(1px,1px,1px)';
            has3d = window.getComputedStyle(el).getPropertyValue(PREFIXES[t]);
          }
        }
      }
      document.body.removeChild(el);
      return has3d !== undefined && has3d.length > 0 && has3d !== 'none';
    })()
  };

  return css;
})();

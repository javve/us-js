const css = require('../utils/css');


module.exports = (() => {
  const STYLES = {
    default: require('./default'),
    zoom: require('./zoom'),
    zoom2: require('./zoom2'),
    slide: require('./slide'),
    flip: require('./flip'),
    common: require('./common'),
    get: (name) => {
      let result = {};
      for (const style in STYLES[name]) {
        result[style] = css.parseStyle(STYLES[name][style]);
      }
      return result;
    }
  };
  return STYLES;
})();

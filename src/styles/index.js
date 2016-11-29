module.exports = {
  default: require('./default'),
  zoom: require('./zoom'),
  zoom2: require('./zoom2'),
  slide: require('./slide'),
  flip: require('./flip'),
  get: (name) => {
    // parse first!
    return JSON.parse(JSON.stringify(this[name]));
  }
};

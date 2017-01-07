var us =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var assign = __webpack_require__(1),
	    states = __webpack_require__(2),
	    containers = __webpack_require__(4),
	    USA = __webpack_require__(5),
	    styles = __webpack_require__(8),
	    size = __webpack_require__(7),
	    common = __webpack_require__(14),
	    loop = __webpack_require__(15),
	    dom = __webpack_require__(16);

	__webpack_require__(17);

	var us = {
	  slideTo: function slideTo() {
	    var _common$getArguments = common.getArguments(arguments),
	        state = _common$getArguments.state,
	        container = _common$getArguments.container,
	        options = _common$getArguments.options,
	        next = state,
	        current = states.current(container);

	    if (next == current) return;
	    if (next == null) return;

	    var currentHeight = 0,
	        nextHeight = size.height(next);

	    if (current) {
	      currentHeight = size.height(current);
	      assign(options.hide, {
	        after: function after() {
	          states.hide(current);
	        }
	      });
	    }
	    assign(options.show, {
	      after: function after() {
	        states.show(next);
	      }
	    });
	    assign(options.container, {
	      from: { height: currentHeight + 'px' },
	      to: { height: nextHeight + 'px' },
	      after: function after() {
	        size.clearHeight(container);
	      },
	      isStatic: true,
	      wait: 0 //common.calculateContainerWait(currentOptions, nextOptions, containerOptions)
	    });

	    if (current) {
	      us.a(current, common.getOptions({
	        action: 'hide',
	        el: current,
	        container: container
	      }, options));
	    }

	    us.a(next, common.getOptions({
	      action: 'show',
	      el: next,
	      container: container
	    }, options));

	    us.a(container, common.getOptions({
	      action: 'container',
	      el: container,
	      container: container
	    }, options.container));
	  },
	  show: function show(el) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    if (!states.isHidden(el)) return;

	    options.show = options.show || {};
	    options.container = options.container || {};
	    dom.wrap(el);

	    var container = el.parentNode,
	        currentHeight = 0,
	        nextHeight = size.height(el); // TODO: INCLUDE MARGINS! OK SINCE WRAP

	    if (options.overflow !== true) container.style.overflow = 'hidden';

	    assign(options.container, {
	      from: { height: currentHeight + 'px' },
	      to: { height: nextHeight + 'px' },
	      after: function after() {
	        dom.unwrap(el);
	      },
	      isStatic: true,
	      wait: 0 //common.calculateContainerWait(currentOptions, nextOptions, containerOptions)
	    });

	    us.a(el, common.getOptions({
	      action: 'show', el: el, container: container
	    }, options));

	    us.a(container, common.getOptions({
	      action: 'container',
	      el: container,
	      container: container
	    }, options));
	  },
	  hide: function hide(el) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    if (states.isHidden(el)) return;

	    options.hide = options.hide || {};
	    options.container = options.container || {};
	    dom.wrap(el);

	    var container = el.parentNode,
	        currentHeight = size.height(el),
	        nextHeight = 0;

	    if (options.overflow !== true) container.style.overflow = 'hidden';

	    assign(options.hide, {
	      after: function after() {
	        states.hide(el);
	      },
	      hide: true
	    });
	    assign(options.container, {
	      from: { height: currentHeight + 'px' },
	      to: { height: nextHeight + 'px' },
	      after: function after() {
	        dom.unwrap(el);
	      },
	      isStatic: true,
	      wait: 0 // currentOptions.duration + currentOptions.delay
	    });

	    us.a(el, common.getOptions({
	      action: 'hide',
	      el: el,
	      container: container
	    }, options));

	    us.a(container, common.getOptions({
	      action: 'container',
	      el: container,
	      container: container
	    }, options));
	  },
	  toggle: function toggle(nameOrEl, options) {
	    var state = nameOrEl;
	    if (typeof nameOrEl === 'string' || nameOrEl instanceof String) {
	      var _nameOrEl$split = nameOrEl.split('.'),
	          _nameOrEl$split2 = _slicedToArray(_nameOrEl$split, 2),
	          containerName = _nameOrEl$split2[0],
	          stateName = _nameOrEl$split2[1];

	      state = states.get(stateName, containers.find(containerName));
	    }
	    if (states.isHidden(state)) {
	      us.show(state, options);
	    } else {
	      us.hide(state, options);
	    }
	  },
	  style: function style(name, options) {
	    styles[name] = options;
	  },
	  a: function a(el, options) {
	    loop.push(new USA(el, options));
	  }
	};

	module.exports = us;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var css = __webpack_require__(3);

	module.exports = function () {
	  var styles = {
	    hide: {
	      display: { val: 'none', unit: '' }
	    }
	  };

	  var states = {
	    current: function current(container) {
	      var all = states.all(container);
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = all[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var state = _step.value;

	          if (state.classList.contains('state-show')) {
	            return state;
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      if (all.length && !states.isHidden(all[0])) {
	        return all[0];
	      } else {
	        return null;
	      }
	    },
	    get: function get(name, container) {
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = states.all(container)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var state = _step2.value;

	          if (state.getAttribute('data-us-name') == name) {
	            return state;
	          }
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }

	      return null;
	    },
	    name: function name(state) {
	      return state.getAttribute('data-us-name');
	    },
	    show: function show(state) {
	      //css.clear(state, styles.hide);
	      state.classList.add('state-show');
	    },
	    hide: function hide(state) {
	      state.classList.remove('state-show');
	      //css.clear(state, s.styles.previous);
	      //css.clear(state, s.styles.show);
	      css.set(state, styles.hide);
	    },
	    isHidden: function isHidden(state) {
	      return window.getComputedStyle(state).display == 'none';
	    },
	    all: function all(container) {
	      var nodes = container.childNodes,
	          states = [];
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = nodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var node = _step3.value;

	          if (node.data === undefined) {
	            states.push(node);
	          }
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }

	      return states;
	    }
	  };

	  return states;
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
	  var transformNames = ['matrix', 'matrix3d', 'translate', 'translate3d', 'translateX', 'translateY', 'translateZ', 'scale', 'scale3d', 'scaleX', 'scaleY', 'scaleZ', 'rotate', 'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'skew', 'skewX', 'skewY'];

	  var css = {
	    set: function set(el, style) {
	      var log = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	      // Handle existing transform!
	      var transformString = css.generateTransformString(style);
	      el.style.transform = transformString;

	      for (var key in style) {
	        if (transformNames.indexOf(key) > -1) continue;
	        if (log) console.log(style[key], css.round(style[key]));
	        el.style[key] = css.round(style[key]) + (style[key].unit || '');
	      }
	    },

	    clear: function clear(el, style) {
	      el.style.transform = null;
	      for (var key in style) {
	        if (transformNames.indexOf(key) > -1) continue;
	        el.style[key] = null;
	      }
	    },

	    generateTransformString: function generateTransformString(style) {
	      var transformString = '';
	      for (var key in style) {
	        if (transformNames.indexOf(key) == -1) continue;
	        transformString += ' ' + key + '(' + css.round(style[key]) + style[key].unit + ')';
	      }
	      return transformString.trim();
	    },

	    parseTransform: function parseTransform(el) {
	      var nameValue = /([a-z]+)\((.*)\)/i;
	      var transformString = (el.style.transform || '').trim();
	      if (transformString.length == 0) return null;
	      var results = {};
	      var transforms = transformString.replace(/\)/g, '))').split(/\) /gi);
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = transforms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var transform = _step.value;

	          var transformParts = nameValue.exec(transform),
	              transformName = transformParts[1],
	              transformValue = transformParts[2],
	              transformValueParts = css.parseVal(transformValue);
	          results[transformName] = {
	            val: transformValueParts.val,
	            unit: transformValueParts.unit
	          };
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return results;
	    },

	    // http://rubular.com/r/oBukmdKfFC
	    parseVal: function parseVal(str) {
	      var number = /(-?\d+\.?\d*)(px|%|deg)?/i;
	      var result = number.exec(str);
	      var val = void 0,
	          unit = void 0;
	      if (result) {
	        val = parseFloat(result[1]);
	        unit = result[2] || '';
	      } else {
	        val = str;
	        unit = '';
	      }
	      return { val: val, unit: unit };
	    },
	    parseStyle: function parseStyle(style) {
	      var result = {};
	      for (var key in style) {
	        result[key] = css.parseVal(style[key]);
	      }
	      return result;
	    },
	    round: function round(_ref) {
	      var val = _ref.val,
	          unit = _ref.unit;

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
	}();

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
	  var containers = {
	    all: function all() {
	      var states = document.querySelectorAll('[data-us-name]'),
	          allContainers = [];
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = states[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var state = _step.value;

	          var stateContainer = state.parentNode;
	          if (allContainers.indexOf(stateContainer) == -1) {
	            allContainers.push(stateContainer);
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return allContainers;
	    },
	    closest: function closest(el) {
	      if (el.getAttribute('data-us-name')) {
	        return el.parentNode;
	      } else {
	        if (document.body === el) {
	          return null;
	        } else {
	          return containers.closest(el.parentNode);
	        }
	      }
	    },
	    closestWithName: function closestWithName(el, name) {
	      if (el.getAttribute('data-us') == name) {
	        return el.parentNode;
	      } else {
	        if (document.body === el) {
	          return null;
	        } else {
	          return containers.closestWithName(el.parentNode, name);
	        }
	      }
	    },
	    find: function find(name) {
	      return document.querySelector('[data-us="' + name + '"]');
	    }
	  };

	  return containers;
	}();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var easing = __webpack_require__(6),
	    css = __webpack_require__(3),
	    size = __webpack_require__(7),
	    STYLES = {
	  absolute: {
	    position: { val: 'absolute', unit: '' },
	    left: { val: 0, unit: '' },
	    top: { val: 0, unit: '' }
	  }
	};

	var USA = function () {
	  function USA(el, options) {
	    _classCallCheck(this, USA);

	    this.el = el;
	    this.from = css.parseStyle(options.from);
	    this.to = css.parseStyle(options.to);
	    this.duration = parseInt(options.duration || 400);
	    this.delay = parseInt(options.delay || 0);
	    this.before = options.before;
	    this.after = options.after;
	    this.easing = options.easing || 'inOutQuad';
	    this.isStatic = options.isStatic || false;
	    this.name = options.name; // For debugging

	    this.ended = false;
	    this.current = {};

	    this.start();
	  }

	  _createClass(USA, [{
	    key: 'start',
	    value: function start() {
	      this.start = Date.now();
	      if (!this.isStatic) {
	        size.width(this.el, size.width(this.el.parentNode));
	        css.set(this.el, STYLES.absolute);
	      } else {
	        if (window.getComputedStyle(this.el).position == 'static') {
	          this.el.style.position = 'relative';
	        }
	      }
	      css.set(this.el, this.from);

	      if (this.before) {
	        this.before();
	      }
	    }
	  }, {
	    key: 'complete',
	    value: function complete() {
	      // Clear the set state
	      css.set(this.el, this.to);
	      css.clear(this.el, STYLES.absolute);
	      if (!this.isStatic) {
	        size.clearWidth(this.el);
	      }
	      if (this.after) {
	        this.after();
	      }
	    }
	  }, {
	    key: 'tick',
	    value: function tick() {
	      var now = Date.now();

	      if (now - this.start < this.delay) return true;

	      var p = (now - this.delay - this.start) / this.duration,
	          val = easing[this.easing](p);

	      if (now - this.start >= this.duration + this.delay) {
	        this.complete();
	        return false;
	      }

	      for (var key in this.to) {
	        var start = this.from[key].val;
	        var goal = this.to[key].val;
	        this.current[key] = this.current[key] || {};
	        this.current[key].val = start + (goal - start) * val;
	        this.current[key].unit = this.from[key].unit;
	      }
	      css.set(this.el, this.current);
	      return true;
	    }
	  }]);

	  return USA;
	}();

	module.exports = USA;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	// https://github.com/component/ease
	// easing functions from "Tween.js"
	/*
	Copyright (c) 2010-2012 Tween.js authors.
	Easing equations Copyright (c) 2001 Robert Penner http://robertpenner.com/easing/
	*/

	module.exports = {
	  linear: function linear(n) {
	    return n;
	  },
	  inQuad: function inQuad(n) {
	    return n * n;
	  },
	  outQuad: function outQuad(n) {
	    return n * (2 - n);
	  },
	  inOutQuad: function inOutQuad(n) {
	    n *= 2;
	    if (n < 1) return 0.5 * n * n;
	    return -0.5 * (--n * (n - 2) - 1);
	  },
	  inCube: function inCube(n) {
	    return n * n * n;
	  },
	  outCube: function outCube(n) {
	    return --n * n * n + 1;
	  },
	  inOutCube: function inOutCube(n) {
	    n *= 2;
	    if (n < 1) return 0.5 * n * n * n;
	    return 0.5 * ((n -= 2) * n * n + 2);
	  },
	  inQuart: function inQuart(n) {
	    return n * n * n * n;
	  },
	  outQuart: function outQuart(n) {
	    return 1 - --n * n * n * n;
	  },
	  inOutQuart: function inOutQuart(n) {
	    n *= 2;
	    if (n < 1) return 0.5 * n * n * n * n;
	    return -0.5 * ((n -= 2) * n * n * n - 2);
	  },
	  inQuint: function inQuint(n) {
	    return n * n * n * n * n;
	  },
	  outQuint: function outQuint(n) {
	    return --n * n * n * n * n + 1;
	  },
	  inOutQuint: function inOutQuint(n) {
	    n *= 2;
	    if (n < 1) return 0.5 * n * n * n * n * n;
	    return 0.5 * ((n -= 2) * n * n * n * n + 2);
	  },
	  inSine: function inSine(n) {
	    return 1 - Math.cos(n * Math.PI / 2);
	  },
	  outSine: function outSine(n) {
	    return Math.sin(n * Math.PI / 2);
	  },
	  inOutSine: function inOutSine(n) {
	    return .5 * (1 - Math.cos(Math.PI * n));
	  },
	  inExpo: function inExpo(n) {
	    return 0 == n ? 0 : Math.pow(1024, n - 1);
	  },
	  outExpo: function outExpo(n) {
	    return 1 == n ? n : 1 - Math.pow(2, -10 * n);
	  },
	  inOutExpo: function inOutExpo(n) {
	    if (0 == n) return 0;
	    if (1 == n) return 1;
	    if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1);
	    return .5 * (-Math.pow(2, -10 * (n - 1)) + 2);
	  },
	  inCirc: function inCirc(n) {
	    return 1 - Math.sqrt(1 - n * n);
	  },
	  outCirc: function outCirc(n) {
	    return Math.sqrt(1 - --n * n);
	  },
	  inOutCirc: function inOutCirc(n) {
	    n *= 2;
	    if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1);
	    return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
	  },
	  inBack: function inBack(n) {
	    var s = 1.70158;
	    return n * n * ((s + 1) * n - s);
	  },
	  outBack: function outBack(n) {
	    var s = 1.70158;
	    return --n * n * ((s + 1) * n + s) + 1;
	  },
	  inOutBack: function inOutBack(n) {
	    var s = 1.70158 * 1.525;
	    if ((n *= 2) < 1) return 0.5 * (n * n * ((s + 1) * n - s));
	    return 0.5 * ((n -= 2) * n * ((s + 1) * n + s) + 2);
	  },

	  inElastic: function inElastic(n) {
	    var s,
	        a = 0.1,
	        p = 0.4;
	    if (n === 0) return 0;
	    if (n === 1) return 1;
	    if (!a || a < 1) {
	      a = 1;s = p / 4;
	    } else s = p * Math.asin(1 / a) / (2 * Math.PI);
	    return -(a * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p));
	  },
	  outElastic: function outElastic(n) {
	    var s,
	        a = 0.1,
	        p = 0.4;
	    if (n === 0) return 0;
	    if (n === 1) return 1;
	    if (!a || a < 1) {
	      a = 1;s = p / 4;
	    } else s = p * Math.asin(1 / a) / (2 * Math.PI);
	    return a * Math.pow(2, -10 * n) * Math.sin((n - s) * (2 * Math.PI) / p) + 1;
	  },
	  inOutElastic: function inOutElastic(n) {
	    var s,
	        a = 0.1,
	        p = 0.4;
	    if (n === 0) return 0;
	    if (n === 1) return 1;
	    if (!a || a < 1) {
	      a = 1;s = p / 4;
	    } else s = p * Math.asin(1 / a) / (2 * Math.PI);
	    if ((n *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p));
	    return a * Math.pow(2, -10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p) * 0.5 + 1;
	  }
	};
	// exports.inBounce = function(n){
	//   return 1 - exports.outBounce(1 - n);
	// };
	//
	// exports.outBounce = function(n){
	//   if ( n < ( 1 / 2.75 ) ) {
	//     return 7.5625 * n * n;
	//   } else if ( n < ( 2 / 2.75 ) ) {
	//     return 7.5625 * ( n -= ( 1.5 / 2.75 ) ) * n + 0.75;
	//   } else if ( n < ( 2.5 / 2.75 ) ) {
	//     return 7.5625 * ( n -= ( 2.25 / 2.75 ) ) * n + 0.9375;
	//   } else {
	//     return 7.5625 * ( n -= ( 2.625 / 2.75 ) ) * n + 0.984375;
	//   }
	// };
	//
	// exports.inOutBounce = function(n){
	//   if (n < .5) return exports.inBounce(n * 2) * .5;
	//   return exports.outBounce(n * 2 - 1) * .5 + .5;
	// };

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  height: function height(el, _height) {
	    if (window.getComputedStyle(el).display !== 'block') {
	      el.style.display = 'block';
	    }
	    if (_height) {
	      el.style.height = _height + 'px';
	    } else {
	      return el.offsetHeight;
	    }
	  },
	  width: function width(el, _width) {
	    if (_width) {
	      el.style.width = _width + 'px';
	    } else {
	      return el.offsetWidth;
	    }
	  },
	  clearHeight: function clearHeight(el) {
	    el.style.removeProperty('height');
	  },
	  clearWidth: function clearWidth(el) {
	    el.style.removeProperty('width');
	  },
	  clear: function clear(el) {
	    this.clearHeight(el);
	    this.clearWidth(el);
	  },
	  get: function get(el) {
	    return {
	      width: this.width(el),
	      height: this.height(el)
	    };
	  },
	  set: function set(el, size) {
	    this.width(el, size.width);
	    this.height(el, size.height);
	  }
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var css = __webpack_require__(3);

	module.exports = function () {
	  var STYLES = {
	    default: __webpack_require__(9),
	    zoom: __webpack_require__(10),
	    slide: __webpack_require__(11),
	    flip: __webpack_require__(12),
	    common: __webpack_require__(13),
	    get: function get(name) {
	      var result = {};
	      for (var style in STYLES[name]) {
	        result[style] = css.parseStyle(STYLES[name][style]);
	      }
	      return result;
	    }
	  };
	  return STYLES;
	}();

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  show: {
	    from: {
	      opacity: 0
	    },
	    to: {
	      opacity: 1
	    }
	  },
	  hide: {
	    from: {
	      opacity: 1
	    },
	    to: {
	      opacity: 0
	    }
	  }
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  show: {
	    from: {
	      scale: 0.8,
	      opacity: 0
	    },
	    to: {
	      scale: 1,
	      opacity: 1
	    }
	  },
	  hide: {
	    from: {
	      scale: 1,
	      opacity: 1
	    },
	    to: {
	      scale: 1.1,
	      opacity: 0
	    }
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  show: {
	    from: {
	      translateX: '-100%',
	      opacity: 0
	    },
	    to: {
	      translateX: '0%',
	      opacity: 1
	    }
	  },
	  hide: {
	    from: {
	      translateX: '0%',
	      opacity: 1
	    },
	    to: {
	      translateX: '100%',
	      opacity: 0
	    }
	  }
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  show: {
	    from: {
	      rotateX: '-180deg',
	      opacity: 0
	    },
	    to: {
	      rotateX: '0deg',
	      opacity: 1
	    }
	  },
	  hide: {
	    from: {
	      rotateX: '0deg',
	      opacity: 1
	    },
	    to: {
	      rotateX: '180deg',
	      opacity: 0
	    }
	  }
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  hide: {
	    position: 'absolute',
	    top: 0,
	    left: '-3000px'
	  },
	  absolute: {
	    position: 'absolute',
	    top: 0,
	    left: 0
	  }
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var states = __webpack_require__(2),
	    containers = __webpack_require__(4),
	    styles = __webpack_require__(8);

	module.exports = function () {

	  var utils = {
	    parseTrigger: function parseTrigger(str) {
	      if (!str) {
	        return [];
	      }
	      var triggers = (str || '').replace(/ /g, '').split(','),
	          results = [];

	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = triggers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var trigger = _step.value;

	          var triggerParts = trigger.split('.');
	          if (triggerParts.length == 1) {
	            results.push({
	              stateName: trigger.trim()
	            });
	          } else {
	            var _triggerParts = _slicedToArray(triggerParts, 2),
	                containerName = _triggerParts[0],
	                stateName = _triggerParts[1];

	            results.push({
	              stateName: stateName.trim(),
	              containerName: containerName.trim()
	            });
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return results;
	    },
	    getAttr: function getAttr(el, container, action, val) {
	      return el.getAttribute('data-us-' + action + '-' + val + '') || el.getAttribute('data-us-' + val + '') || container.getAttribute('data-us-' + action + '-' + val + '') || container.getAttribute('data-us-' + val + '');
	    },
	    getOptions: function getOptions(_ref) {
	      var action = _ref.action,
	          el = _ref.el,
	          container = _ref.container;
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      options[action] = options[action] || {};
	      var style = options[action].style || options.style || utils.getAttr(el, container, action, 'style') || 'default';
	      return {
	        duration: options[action].duration || options.duration || utils.getAttr(el, container, action, 'duration') || 300,
	        delay: options[action].delay || options.delay || utils.getAttr(el, container, action, 'delay') || 0,
	        easing: options[action].easing || options.easing || utils.getAttr(el, container, action, 'easing') || 'linear',
	        from: options[action].from || options.from || styles[style][action] && styles[style][action].from,
	        to: options[action].to || options.to || styles[style][action] && styles[style][action].to,
	        after: options[action].after || options.after,
	        before: options[action].before || options.before,
	        isStatic: options[action].isStatic || options.isStatic
	      };
	    },
	    calculateContainerWait: function calculateContainerWait(currentOptions, nextOptions, containerOptions) {
	      var wait = 0;
	      var nextTotal = nextOptions.duration + nextOptions.delay,
	          currentTotal = currentOptions.duration + currentOptions.delay,
	          containerTotal = containerOptions.duration + containerOptions.delay;
	      if (nextTotal > containerTotal) {
	        wait = nextTotal - containerTotal;
	      }
	      if (currentTotal > containerTotal && currentTotal > nextTotal) {
	        wait = currentTotal - containerTotal;
	      }
	      return wait;
	    },
	    getArguments: function getArguments(args) {
	      var state = void 0,
	          container = void 0,
	          options = void 0;

	      if (args.length == 0) {
	        throw new Error('Need at least one argument');
	      } else if (args.length == 1) {
	        state = args[0];
	        container = undefined;
	        options = {};
	      } else if (args.length == 2 && args[1].nodeName) {
	        state = args[0];
	        container = args[1];
	        options = {};
	      } else if (args.length == 2) {
	        state = args[0];
	        container = undefined;
	        options = args[1];
	      } else {
	        state = args[0];
	        container = args[1];
	        options = args[2];
	      }

	      if (typeof state === 'string' || state instanceof String) {
	        if (state.split('.').length == 2) {
	          // 'containerName.stateName'
	          var _state$split = state.split('.'),
	              _state$split2 = _slicedToArray(_state$split, 2),
	              containerName = _state$split2[0],
	              stateName = _state$split2[1];

	          state = states.get(stateName, containers.find(containerName));
	          container = state.parentNode;
	        } else if (state.split('.').length == 1 && container) {
	          // 'state'
	          state = states.get(state, container);
	        } else {
	          throw new Error('Either specify state with container.state or provide container element');
	        }
	      } else {
	        if (container == undefined) {
	          container = state.parentNode;
	        }
	      }
	      options.show = options.show || {};
	      options.hide = options.hide || {};
	      options.container = options.container || {};

	      return { state: state, container: container, options: options };
	    }
	  };

	  return utils;
	}();

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function () {
	  var loop = {
	    _animations: [],
	    _completedAnimations: [],
	    push: function push(a) {
	      loop._animations.push(a);
	      if (!loop._animating) {
	        loop._animate();
	        loop._animating = true;
	      }
	    },
	    _animate: function _animate() {
	      if (loop._animations.length) {
	        requestAnimationFrame(function () {
	          return loop._animate();
	        });
	      } else {
	        loop._animating = false;
	      }
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = loop._animations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var animation = _step.value;

	          var running = animation.tick();
	          if (!running) {
	            loop._completedAnimations.push(animation);
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      while (loop._completedAnimations.length) {
	        var a = loop._completedAnimations.pop();
	        loop._animations.splice(loop._animations.indexOf(a), 1);
	      }
	    }
	  };

	  return loop;
	}();

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  wrap: function wrap(el) {
	    var div = document.createElement('div');
	    el.parentNode.insertBefore(div, el);
	    div.appendChild(el);
	    return el;
	  },
	  unwrap: function unwrap(el) {
	    var container = el.parentNode,
	        parentsParent = container.parentNode;
	    parentsParent.insertBefore(el, container);
	    parentsParent.removeChild(container);
	    return el;
	  }
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var common = __webpack_require__(14),
	    states = __webpack_require__(2),
	    containers = __webpack_require__(4);

	module.exports = function () {
	  document.addEventListener('DOMContentLoaded', function () {
	    document.body.addEventListener('click', function (e) {
	      e.stopPropagation();
	      var el = e.target;

	      var slideToStates = common.parseTrigger(el.getAttribute('data-us-slide-to')),
	          showStates = common.parseTrigger(el.getAttribute('data-us-show')),
	          hideStates = common.parseTrigger(el.getAttribute('data-us-hide')),
	          toggleStates = common.parseTrigger(el.getAttribute('data-us-toggle'));

	      var getContainer = function getContainer(containerName) {
	        if (containerName) {
	          var container = containers.closestWithName(el, containerName);
	          if (container) {
	            return container;
	          } else {
	            return containers.find(containerName);
	          }
	        } else {
	          return containers.closest(el);
	        }
	      };

	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = slideToStates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var state = _step.value;

	          var container = getContainer(state.containerName),
	              _el = states.get(state.stateName, container);

	          us.slideTo(_el);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = showStates[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var _state = _step2.value;

	          var _container = getContainer(_state.containerName),
	              _el2 = states.get(_state.stateName, _container);

	          us.show(_el2);
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }

	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = hideStates[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var _state2 = _step3.value;

	          var _container2 = getContainer(_state2.containerName),
	              _el3 = states.get(_state2.stateName, _container2);

	          us.hide(_el3);
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }

	      var _iteratorNormalCompletion4 = true;
	      var _didIteratorError4 = false;
	      var _iteratorError4 = undefined;

	      try {
	        for (var _iterator4 = toggleStates[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	          var _state3 = _step4.value;

	          var _container3 = getContainer(_state3.containerName),
	              _el4 = states.get(_state3.stateName, _container3);

	          us.toggle(_el4);
	        }
	      } catch (err) {
	        _didIteratorError4 = true;
	        _iteratorError4 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion4 && _iterator4.return) {
	            _iterator4.return();
	          }
	        } finally {
	          if (_didIteratorError4) {
	            throw _iteratorError4;
	          }
	        }
	      }
	    });
	  }, false);
	}();

/***/ }
/******/ ]);
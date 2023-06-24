(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
module.exports = function (val) {
	if (val === null || val === undefined) {
		return [];
	}

	return Array.isArray(val) ? val : [val];
};

},{}],2:[function(require,module,exports){
/**
 * @module fps-indicator
 */
'use strict'


var raf = require('raf')
var now = require('right-now')
var css = require('to-css')

module.exports = fps



function fps (opts) {
	if (!(this instanceof fps)) return new fps(opts)

	if (typeof opts === 'string') {
		if (positions[opts]) opts = {position: opts}
		else opts = {container: opts}
	}
	opts = opts || {}

	if (opts.container) {
		if (typeof opts.container === 'string') {
			this.container = document.querySelector(opts.container)
		}
		else {
			this.container = opts.container
		}
	}
	else {
		this.container = document.body || document.documentElement
	}

	//init fps
	this.element = document.createElement('div')
	this.element.className = 'fps'
	this.element.innerHTML = [
		'<div class="fps-bg"></div>',
		'<canvas class="fps-canvas"></canvas>',
		'<span class="fps-text">fps <span class="fps-value">60.0</span></span>'
	].join('')
	this.container.appendChild(this.element)

	this.canvas = this.element.querySelector('.fps-canvas')
	this.textEl = this.element.querySelector('.fps-text')
	this.valueEl = this.element.querySelector('.fps-value')
	this.bgEl = this.element.querySelector('.fps-bg')

	var style = opts.css || opts.style || ''
	if (typeof style === 'object') style = css(style)

	var posCss = ''
	posCss = positions[opts.position] || positions['top-left']

	this.element.style.cssText = [
		'line-height: 1;',
		'position: fixed;',
		'font-family: Roboto, sans-serif;',
		'z-index: 1;',
		'font-weight: 300;',
		'font-size: small;',
		'padding: 1rem;',
		posCss,
		opts.color ? ('color:' + opts.color) : '',
		style
	].join('')

	this.canvas.style.cssText = [
		'position: relative;',
		'width: 2em;',
		'height: 1em;',
		'display: block;',
		'float: left;',
		'margin-right: .333em;'
	].join('')

	this.bgEl.style.cssText = [
		'position: absolute;',
		'height: 1em;',
		'width: 2em;',
		'background: currentcolor;',
		'opacity: .1;'
	].join('')

	this.canvas.width = parseInt(getComputedStyle(this.canvas).width) || 1
	this.canvas.height = parseInt(getComputedStyle(this.canvas).height) || 1

	this.context = this.canvas.getContext('2d')

	var ctx = this.context
	var w = this.canvas.width
	var h = this.canvas.height
	var count = 0
	var lastTime = 0
	var values = opts.values || Array(this.canvas.width)
	var period = opts.period || 1000
	var max = opts.max || 100

	//enable update routine
	var that = this
	raf(function measure () {
		count++
		var t = now()

		if (t - lastTime > period) {
			lastTime = t
			values.push(count / (max * period * 0.001))
			values = values.slice(-w)
			count = 0

			ctx.clearRect(0, 0, w, h)
			ctx.fillStyle = getComputedStyle(that.canvas).color
			for (var i = w; i--;) {
				var value = values[i]
				if (value == null) break
				ctx.fillRect(i, h - h * value, 1, h * value)
			}

			that.valueEl.innerHTML = (values[values.length - 1]*max).toFixed(1)
		}

		raf(measure)
	})
}


var positions = {
	'top-left': 'left: 0; top: 0;',
	'top-right': 'right: 0; top: 0;',
	'bottom-right': 'right: 0; bottom: 0;',
	'bottom-left': 'left: 0; bottom: 0;'
}

},{"raf":6,"right-now":8,"to-css":9}],3:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
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
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
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
	} catch (err) {
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

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],4:[function(require,module,exports){
(function (process){(function (){
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);



}).call(this)}).call(this,require('_process'))
},{"_process":5}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
(function (global){(function (){
var now = require('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"performance-now":4}],7:[function(require,module,exports){
/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/**
 * Results cache
 */

var res = '';
var cache;

/**
 * Expose `repeat`
 */

module.exports = repeat;

/**
 * Repeat the given `string` the specified `number`
 * of times.
 *
 * **Example:**
 *
 * ```js
 * var repeat = require('repeat-string');
 * repeat('A', 5);
 * //=> AAAAA
 * ```
 *
 * @param {String} `string` The string to repeat
 * @param {Number} `number` The number of times to repeat the string
 * @return {String} Repeated string
 * @api public
 */

function repeat(str, num) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  // cover common, quick use cases
  if (num === 1) return str;
  if (num === 2) return str + str;

  var max = str.length * num;
  if (cache !== str || typeof cache === 'undefined') {
    cache = str;
    res = '';
  } else if (res.length >= max) {
    return res.substr(0, max);
  }

  while (max > res.length && num > 1) {
    if (num & 1) {
      res += str;
    }

    num >>= 1;
    str += str;
  }

  res += str;
  res = res.substr(0, max);
  return res;
}

},{}],8:[function(require,module,exports){
(function (global){(function (){
module.exports =
  global.performance &&
  global.performance.now ? function now() {
    return performance.now()
  } : Date.now || function now() {
    return +new Date
  }

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
'use strict';
var repeatString = require('repeat-string');
var objectAssign = require('object-assign');
var arrify = require('arrify');

module.exports = function toCss(object, opts) {
	opts = objectAssign({
		indent: '',
		property: identity,
		value: identity,
		selector: identity
	}, opts);

	if (typeof opts.indent === 'number') {
		opts.indent = repeatString(' ', opts.indent);
	}

	function props(prop, val) {
		return arrify(prop).reduce(function (props, p) {
			return props.concat(opts.property(p, val));
		}, []);
	}

	function values(val, prop) {
		return arrify(val).reduce(function (vals, v) {
			return vals.concat(opts.value(v, prop));
		}, []);
	}

	function selectors(sel, value) {
		return arrify(sel).reduce(function (sels, s) {
			return sels.concat(opts.selector(s, value));
		}, []);
	}

	function _toCss(obj, level) {
		var str = '';
		Object.keys(obj).forEach(function (sel) {
			var value = obj[sel];
			if (isLastLevel(value)) {
				str += rule(props(sel, value), values(value, sel), opts.indent, level - 1);
				return;
			} else if (Array.isArray(value)) {
				value.forEach(function (val) {
					str += _toCss(nest(sel, val), level);
				});
				return;
			}
			selectors(sel, value).forEach(function (selector) {
				str += start(selector, opts.indent, level);
				Object.keys(value).forEach(function (prop) {
					var value = obj[sel][prop];
					if (oneMoreLevelExists(value)) {
						str += _toCss(nest(prop, value), level + 1);
					} else {
						str += rule(props(prop, value), values(value, prop), opts.indent, level);
					}
				});
				str += end(opts.indent, level);
			});
		});
		return str;
	}

	return arrify(object)
		.map(function (o) {
			return _toCss(o, 0);
		})
		.join(lineEnd(opts.indent));
};

function nest(prop, val) {
	var tmp = {};
	tmp[prop] = val;
	return tmp;
}

function isLastLevel(val) {
	return typeof val === 'string' || Array.isArray(val) && val.length && typeof val[0] !== 'object';
}

function oneMoreLevelExists(val) {
	return typeof val === 'object' && !Array.isArray(val);
}

function identity(v) {
	return v;
}

function lineStart(indent, level) {
	return indent ? repeatString(indent, level) : '';
}

function space(indent) {
	return indent ? ' ' : '';
}

function lineEnd(indent) {
	return indent ? '\n' : '';
}

function start(sel, indent, level) {
	return lineStart(indent, level) + sel + space(indent) + '{' + lineEnd(indent);
}

function end(indent, level) {
	return lineStart(indent, level) + '}' + lineEnd(indent);
}

function rule(props, values, indent, level) {
	var linestart = lineStart(indent, level + 1);
	var lineend = lineEnd(indent);
	var s = space(indent);

	var str = '';

	for (var i = 0, propLength = props.length; i < propLength; i++) {
		for (var j = 0, valueLength = values.length; j < valueLength; j++) {
			str += linestart + props[i] + (isAtRule(props[i]) ? ' ' : ':') + s + values[j] + ';' + lineend;
		}
	}

	return str;
}

function isAtRule(prop) {
	return prop.indexOf('@') === 0;
}

},{"arrify":1,"object-assign":3,"repeat-string":7}],10:[function(require,module,exports){
const createFps = require("fps-indicator");
const { getNthPrime } = require("./prime.js");

let startTime = 0;
let inProgress = false;

// Create worker
const worker = new Worker((window.URL || window.webkitURL).createObjectURL(new Blob(['(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module \'"+i+"\'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){\nfunction isPrime(num) {\n  if (num <= 1) {\n    return false;\n  }\n\n  for (let i = 2; i <= Math.sqrt(num); i++) {\n    if (num % i === 0) {\n      return false;\n    }\n  }\n\n  return true;\n}\n\nexports.getNthPrime = function (n) {\n  let count = 0;\n  let number = 2;\n\n  while (count < n) {\n    if (isPrime(number)) {\n      count++;\n      if (count === n) {\n        return number;\n      }\n    }\n    number++;\n  }\n};\n\n},{}],2:[function(require,module,exports){\nconst { getNthPrime } = require("./prime.js");\n\nself.onmessage = function (event) {\n  const messageFromMain = event.data;\n\n  // Perform some calculations or processing\n  const result = getNthPrime(messageFromMain);\n\n  // Send the result back to the main thread\n  self.postMessage({input: event.data, output: result});\n};\n\n},{"./prime.js":1}]},{},[2]);\n'],{type:"text/javascript"})));
// Define worker response reaction
worker.onmessage = function (event) {
  // Capture the start time
  startTime = performance.now();
  const messageFromWorker = event.data;
  const duration = performance.now() - startTime;

  document.getElementById(
    "calculation-output"
  ).innerText = `${messageFromWorker.input}th prime number is ${messageFromWorker.output}.`;

  document.getElementById(
    "calculation-time"
  ).innerText = `Main thread was blocked for ${duration / 1000} seconds.`;

  finishLoading();
};

document
  .getElementById("submit-main-thread")
  .addEventListener("click", calculatePrimeMainThread);
document
  .getElementById("submit-web-worker")
  .addEventListener("click", calculatePrimeWebWorker);

let fps = createFps({ color: "hsl(230, 100%, 95%" });

// Get number from form
function getInputNumber() {
  const inputElement = document.getElementById("numberInput");
  const number = parseInt(inputElement.value, 10);
  if (!isNaN(number)) {
    return number;
  } else {
    document.getElementById("calculation-output").innerText = `Invalid input!`;
    document.getElementById("calculation-output").style.display = "block";
    document.getElementById("calculation-time").style.display = "none";
    document.getElementById("loader-ellipsis").style.display = "none";
  }
}

// Start calculation prime number in web worker
function calculatePrimeWebWorker() {
  const number = getInputNumber();
  if (number && !inProgress) {
    startLoading();
    // Send a message to the worker
    worker.postMessage(number);
  }
}

// Start calculation prime number in main thread
function calculatePrimeMainThread() {
  const number = getInputNumber();
  if (number && !inProgress) {
    startLoading();
    // Capture the start time
    const startTime = performance.now();

    // Perform the blocking operation
    document.getElementById(
      "calculation-output"
    ).innerText = `${number}th prime number is ${getNthPrime(number)}.`;

    // Calculate the duration in milliseconds
    const duration = performance.now() - startTime;
    document.getElementById(
      "calculation-time"
    ).innerText = `Main thread was blocked for ${duration / 1000} seconds.`;
    finishLoading();
  }
}

function startLoading() {
  inProgress = true;
  document.getElementById("calculation-output").style.display = "none";
  document.getElementById("calculation-time").style.display = "none";
  document.getElementById("loader-ellipsis").style.display = "block";
}

function finishLoading() {
  inProgress = false;
  document.getElementById("calculation-output").style.display = "block";
  document.getElementById("calculation-time").style.display = "block";
  document.getElementById("loader-ellipsis").style.display = "none";
}

},{"./prime.js":11,"fps-indicator":2}],11:[function(require,module,exports){
function isPrime(num) {
  if (num <= 1) {
    return false;
  }

  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }

  return true;
}

exports.getNthPrime = function (n) {
  let count = 0;
  let number = 2;

  while (count < n) {
    if (isPrime(number)) {
      count++;
      if (count === n) {
        return number;
      }
    }
    number++;
  }
};

},{}]},{},[10]);

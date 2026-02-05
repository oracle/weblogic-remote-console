/* @oracle/oraclejet-preact: undefined */
'use strict';

var _curry1 = require('./_curry1-e8f0d7ea.js');

/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;

      case 1:
        return _curry1._isPlaceholder(a) ? f2 : _curry1._curry1(function (_b) {
          return fn(a, _b);
        });

      default:
        return _curry1._isPlaceholder(a) && _curry1._isPlaceholder(b) ? f2 : _curry1._isPlaceholder(a) ? _curry1._curry1(function (_a) {
          return fn(_a, b);
        }) : _curry1._isPlaceholder(b) ? _curry1._curry1(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

exports._curry2 = _curry2;
//# sourceMappingURL=_curry2-c15d89cd.js.map

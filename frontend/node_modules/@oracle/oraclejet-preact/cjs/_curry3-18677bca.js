/* @oracle/oraclejet-preact: undefined */
'use strict';

var _curry1 = require('./_curry1-e8f0d7ea.js');
var _curry2 = require('./_curry2-c15d89cd.js');

/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;

      case 1:
        return _curry1._isPlaceholder(a) ? f3 : _curry2._curry2(function (_b, _c) {
          return fn(a, _b, _c);
        });

      case 2:
        return _curry1._isPlaceholder(a) && _curry1._isPlaceholder(b) ? f3 : _curry1._isPlaceholder(a) ? _curry2._curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _curry1._isPlaceholder(b) ? _curry2._curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1._curry1(function (_c) {
          return fn(a, b, _c);
        });

      default:
        return _curry1._isPlaceholder(a) && _curry1._isPlaceholder(b) && _curry1._isPlaceholder(c) ? f3 : _curry1._isPlaceholder(a) && _curry1._isPlaceholder(b) ? _curry2._curry2(function (_a, _b) {
          return fn(_a, _b, c);
        }) : _curry1._isPlaceholder(a) && _curry1._isPlaceholder(c) ? _curry2._curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _curry1._isPlaceholder(b) && _curry1._isPlaceholder(c) ? _curry2._curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1._isPlaceholder(a) ? _curry1._curry1(function (_a) {
          return fn(_a, b, c);
        }) : _curry1._isPlaceholder(b) ? _curry1._curry1(function (_b) {
          return fn(a, _b, c);
        }) : _curry1._isPlaceholder(c) ? _curry1._curry1(function (_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  };
}

exports._curry3 = _curry3;
//# sourceMappingURL=_curry3-18677bca.js.map

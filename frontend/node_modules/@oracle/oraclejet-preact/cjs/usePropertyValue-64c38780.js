/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');
var _curry1 = require('./_curry1-e8f0d7ea.js');
var curryN = require('./curryN-91f5779e.js');

/**
 * Returns a curried equivalent of the provided function. The curried function
 * has two unusual capabilities. First, its arguments needn't be provided one
 * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * Please note that default parameters don't count towards a [function arity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length)
 * and therefore `curry` won't work well with those.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (* -> a) -> (* -> a)
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curryN, R.partial
 * @example
 *
 *      const addFourNumbers = (a, b, c, d) => a + b + c + d;
 *      const curriedAddFourNumbers = R.curry(addFourNumbers);
 *      const f = curriedAddFourNumbers(1, 2);
 *      const g = f(3);
 *      g(4); //=> 10
 *
 *      // R.curry not working well with default parameters
 *      const h = R.curry((a, b, c = 2) => a + b + c);
 *      h(1)(2)(7); //=> Error! (`3` is not a function!)
 */

var curry =
/*#__PURE__*/
_curry1._curry1(function curry(fn) {
  return curryN.curryN(fn.length, fn);
});

var curry$1 = curry;

/**
 * Curried function that returns a string containing the value of a specified CSS property.
 * @param el The Element for which to get the computed style.
 * @param prop A string representing the property name (in hyphen case) to be checked.
 * @returns A string containing the value of the property. If not set, returns the empty string.
 */
const getCssPropValue = curry$1((el, prop) => getComputedStyle(el).getPropertyValue(prop));
/**
 * Hook for reading CSS property values.
 * @returns A tuple with a reference that can be attached to a DOM element and a function that
 * returns a string containing a specified CSS property.
 */
const usePropertyValue = () => {
    const initValue = (_) => '';
    const [getPropertyValue, setPropertyValue] = hooks.useState(() => (_) => '');
    const setRef = hooks.useCallback((node) => {
        setPropertyValue(node !== null ? () => getCssPropValue(node) : () => initValue);
    }, []);
    return [setRef, getPropertyValue];
};

exports.curry = curry$1;
exports.usePropertyValue = usePropertyValue;
//# sourceMappingURL=usePropertyValue-64c38780.js.map

/* @oracle/oraclejet-preact: undefined */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');
var _curry3 = require('../../../_curry3-18677bca.js');
var curryN = require('../../../curryN-91f5779e.js');
var equals = require('../../../equals-098f7781.js');
var _curry2 = require('../../../_curry2-c15d89cd.js');
var _arrayReduce = require('../../../_arrayReduce-406d020c.js');
var _isArray = require('../../../_isArray-73160ad5.js');
var _isObject = require('../../../_isObject-28636267.js');
require('../../../_curry1-e8f0d7ea.js');
require('../../../_arity-c228159c.js');

function _isTransformer(obj) {
  return obj != null && typeof obj['@@transducer/step'] === 'function';
}

/**
 * Returns a function that dispatches with different strategies based on the
 * object in list position (last argument). If it is an array, executes [fn].
 * Otherwise, if it has a function with one of the given method names, it will
 * execute that function (functor case). Otherwise, if it is a transformer,
 * uses transducer created by [transducerCreator] to return a new transformer
 * (transducer case).
 * Otherwise, it will default to executing [fn].
 *
 * @private
 * @param {Array} methodNames properties to check for a custom implementation
 * @param {Function} transducerCreator transducer factory if object is transformer
 * @param {Function} fn default ramda implementation
 * @return {Function} A function that dispatches on object in list position
 */

function _dispatchable(methodNames, transducerCreator, fn) {
  return function () {
    if (arguments.length === 0) {
      return fn();
    }

    var obj = arguments[arguments.length - 1];

    if (!_isArray._isArray(obj)) {
      var idx = 0;

      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === 'function') {
          return obj[methodNames[idx]].apply(obj, Array.prototype.slice.call(arguments, 0, -1));
        }

        idx += 1;
      }

      if (_isTransformer(obj)) {
        var transducer = transducerCreator.apply(null, Array.prototype.slice.call(arguments, 0, -1));
        return transducer(obj);
      }
    }

    return fn.apply(this, arguments);
  };
}

var _xfBase = {
  init: function () {
    return this.xf['@@transducer/init']();
  },
  result: function (result) {
    return this.xf['@@transducer/result'](result);
  }
};

function _indexOf(list, a, idx) {
  var inf, item; // Array.prototype.indexOf doesn't exist below IE9

  if (typeof list.indexOf === 'function') {
    switch (typeof a) {
      case 'number':
        if (a === 0) {
          // manually crawl the list to distinguish between +0 and -0
          inf = 1 / a;

          while (idx < list.length) {
            item = list[idx];

            if (item === 0 && 1 / item === inf) {
              return idx;
            }

            idx += 1;
          }

          return -1;
        } else if (a !== a) {
          // NaN
          while (idx < list.length) {
            item = list[idx];

            if (typeof item === 'number' && item !== item) {
              return idx;
            }

            idx += 1;
          }

          return -1;
        } // non-zero numbers can utilise Set


        return list.indexOf(a, idx);
      // all these types can utilise Set

      case 'string':
      case 'boolean':
      case 'function':
      case 'undefined':
        return list.indexOf(a, idx);

      case 'object':
        if (a === null) {
          // null can utilise Set
          return list.indexOf(a, idx);
        }

    }
  } // anything else not covered above, defer to R.equals


  while (idx < list.length) {
    if (equals.equals(list[idx], a)) {
      return idx;
    }

    idx += 1;
  }

  return -1;
}

function _includes(a, list) {
  return _indexOf(list, a, 0) >= 0;
}

function _complement(f) {
  return function () {
    return !f.apply(this, arguments);
  };
}

function _filter(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];

  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }

    idx += 1;
  }

  return result;
}

var XFilter =
/*#__PURE__*/
function () {
  function XFilter(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XFilter.prototype['@@transducer/init'] = _xfBase.init;
  XFilter.prototype['@@transducer/result'] = _xfBase.result;

  XFilter.prototype['@@transducer/step'] = function (result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
  };

  return XFilter;
}();

function _xfilter(f) {
  return function (xf) {
    return new XFilter(f, xf);
  };
}

/**
 * Takes a predicate and a `Filterable`, and returns a new filterable of the
 * same type containing the members of the given filterable which satisfy the
 * given predicate. Filterable objects include plain objects or any object
 * that has a filter method such as `Array`.
 *
 * Dispatches to the `filter` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @category Object
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array} Filterable
 * @see R.reject, R.transduce, R.addIndex
 * @example
 *
 *      const isEven = n => n % 2 === 0;
 *
 *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */

var filter =
/*#__PURE__*/
_curry2._curry2(
/*#__PURE__*/
_dispatchable(['fantasy-land/filter', 'filter'], _xfilter, function (pred, filterable) {
  return _isObject._isObject(filterable) ? _arrayReduce._arrayReduce(function (acc, key) {
    if (pred(filterable[key])) {
      acc[key] = filterable[key];
    }

    return acc;
  }, {}, equals.keys(filterable)) : // else
  _filter(pred, filterable);
}));

/**
 * The complement of [`filter`](#filter).
 *
 * Acts as a transducer if a transformer is given in list position. Filterable
 * objects include plain objects or any object that has a filter method such
 * as `Array`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array}
 * @see R.filter, R.transduce, R.addIndex
 * @example
 *
 *      const isOdd = (n) => n % 2 !== 0;
 *
 *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */

var reject =
/*#__PURE__*/
_curry2._curry2(function reject(pred, filterable) {
  return filter(_complement(pred), filterable);
});

var reject$1 = reject;

/**
 * Creates a function that will process either the `onTrue` or the `onFalse`
 * function depending upon the result of the `condition` predicate.
 *
 * Note that `ifElse` takes its arity from the longest of the three functions passed to it.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Logic
 * @sig (*... -> Boolean) -> (*... -> *) -> (*... -> *) -> (*... -> *)
 * @param {Function} condition A predicate function
 * @param {Function} onTrue A function to invoke when the `condition` evaluates to a truthy value.
 * @param {Function} onFalse A function to invoke when the `condition` evaluates to a falsy value.
 * @return {Function} A new function that will process either the `onTrue` or the `onFalse`
 *                    function depending upon the result of the `condition` predicate.
 * @see R.unless, R.when, R.cond
 * @example
 *
 *      const incCount = R.ifElse(
 *        R.has('count'),
 *        R.over(R.lensProp('count'), R.inc),
 *        R.assoc('count', 1)
 *      );
 *      incCount({ count: 1 }); //=> { count: 2 }
 *      incCount({});           //=> { count: 1 }
 */

var ifElse =
/*#__PURE__*/
_curry3._curry3(function ifElse(condition, onTrue, onFalse) {
  return curryN.curryN(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
    return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
  });
});

var ifElse$1 = ifElse;

/**
 * Returns `true` if the specified value is equal, in [`R.equals`](#equals)
 * terms, to at least one element of the given list; `false` otherwise.
 * Also works with strings.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category List
 * @sig a -> [a] -> Boolean
 * @param {Object} a The item to compare against.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if an equivalent item is in the list, `false` otherwise.
 * @see R.any
 * @example
 *
 *      R.includes(3, [1, 2, 3]); //=> true
 *      R.includes(4, [1, 2, 3]); //=> false
 *      R.includes({ name: 'Fred' }, [{ name: 'Fred' }]); //=> true
 *      R.includes([42], [[42]]); //=> true
 *      R.includes('ba', 'banana'); //=>true
 */

var includes =
/*#__PURE__*/
_curry2._curry2(_includes);

var includes$1 = includes;

const reducer = (state, action) => {
    switch (action.type) {
        case 'clearMessage': {
            return { ...state, messages: [] };
        }
        case 'copyToClipboard': {
            const { copyText } = action;
            const messages = toToastMessage(copyText, getCopyMessage(action.copyText));
            return { ...state, messages };
        }
        case 'copyToClipboardError': {
            const { copyText, errorMessage } = action;
            const messages = toToastMessage(copyText, errorMessage);
            return { ...state, messages };
        }
        case 'selectEncoding': {
            return { ...state, colorEncoding: action.encoding };
        }
        case 'setColorThemeIndex': {
            return { ...state, colorThemeIndex: action.index };
        }
        case 'setSchemeIndex': {
            return { ...state, schemeIndex: action.index };
        }
        case 'toggleSection': {
            return {
                ...state,
                collapsedSections: ifElse$1(includes$1(action.section), reject$1(equals.equals(action.section)), (arr) => [...arr, action.section])(state.collapsedSections)
            };
        }
        default: {
            return state;
        }
    }
};
const useColorTableState = ({ defaultColorEncoding = 'RGB', defaultColorTheme = 0 }) => {
    const [state, dispatch] = hooks.useReducer(reducer, {
        colorEncoding: defaultColorEncoding,
        colorThemeIndex: defaultColorTheme,
        messages: [],
        schemeIndex: 0,
        collapsedSections: []
    });
    return {
        state,
        actions: {
            copyToClipboard: (copyText) => {
                // do side-effect in callback
                if (isSecureContext)
                    return dispatch({
                        type: 'copyToClipboardError',
                        copyText,
                        errorMessage: `Error! Clipboard API is only available in secure contexts (HTTPS).`
                    });
                navigator.clipboard.writeText(copyText).then(() => {
                    dispatch({ type: 'copyToClipboard', copyText });
                }, (err) => {
                    console.warn(err);
                    dispatch({
                        type: 'copyToClipboardError',
                        copyText,
                        errorMessage: `Error! Unable to write "${copyText}" to browser clipboard.`
                    });
                });
            },
            clearMessage: () => dispatch({ type: 'clearMessage' }),
            selectEncoding: (encoding) => dispatch({ type: 'selectEncoding', encoding }),
            setColorThemeIndex: (index) => dispatch({ type: 'setColorThemeIndex', index }),
            setSchemeIndex: (index) => dispatch({ type: 'setSchemeIndex', index }),
            toggleSection: (section) => dispatch({ type: 'toggleSection', section })
        }
    };
};
const getCopyMessage = (str) => `Copied ${str} to clipboard`;
const toToastMessage = (key, summary) => [
    {
        key,
        data: {
            summary,
            closeAffordance: 'on',
            autoTimeout: 'on'
        }
    }
];

exports.useColorTableState = useColorTableState;
//# sourceMappingURL=useColorTableState.js.map

/* @oracle/oraclejet-preact: undefined */
'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

var shouldApplyCompound = (compoundCheck, selections, defaultVariants) => {
  for (var key of Object.keys(compoundCheck)) {
    var _selections$key;

    if (compoundCheck[key] !== ((_selections$key = selections[key]) !== null && _selections$key !== void 0 ? _selections$key : defaultVariants[key])) {
      return false;
    }
  }

  return true;
};

var createRuntimeFn = config => options => {
  var className = config.defaultClassName;

  var selections = _objectSpread2(_objectSpread2({}, config.defaultVariants), options);

  for (var variantName in selections) {
    var _selections$variantNa;

    var variantSelection = (_selections$variantNa = selections[variantName]) !== null && _selections$variantNa !== void 0 ? _selections$variantNa : config.defaultVariants[variantName];

    if (variantSelection != null) {
      var selection = variantSelection;

      if (typeof selection === 'boolean') {
        // @ts-expect-error
        selection = selection === true ? 'true' : 'false';
      }

      var selectionClassName = // @ts-expect-error
      config.variantClassNames[variantName][selection];

      if (selectionClassName) {
        className += ' ' + selectionClassName;
      }
    }
  }

  for (var [compoundCheck, compoundClassName] of config.compoundVariants) {
    if (shouldApplyCompound(compoundCheck, selections, config.defaultVariants)) {
      className += ' ' + compoundClassName;
    }
  }

  return className;
};

exports.createRuntimeFn = createRuntimeFn;
//# sourceMappingURL=vanilla-extract-recipes-createRuntimeFn.esm-d1301b2d.js.map

/* @oracle/oraclejet-preact: undefined */
'use strict';

var classNames = require('./classNames-c14c6ef3.js');
var mergeDeepWithKey = require('./mergeDeepWithKey-210b024d.js');

const combineClassNames = (key, l, r) => key === 'class' ? classNames.classNames([l, r]) : r;
const mergeInterpolations = (interpolations) => (props) => interpolations.reduce((acc, fn) => mergeDeepWithKey.mergeDeepWithKey(combineClassNames, acc, fn(props)), {});

exports.mergeInterpolations = mergeInterpolations;
//# sourceMappingURL=mergeInterpolations-6727b536.js.map

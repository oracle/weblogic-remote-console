/* @oracle/oraclejet-preact: undefined */
'use strict';

// If the value is an array, just return it, otherwise make a single entry array out of it and return it.
const coerceArray = (value) => (Array.isArray(value) ? value : [value]);
// Loops over each function in the array and calls them with the same arguments.
const callEach = (fns) => (args) => fns.forEach((fn) => fn(args));

exports.callEach = callEach;
exports.coerceArray = coerceArray;
//# sourceMappingURL=arrayUtils-7d8dcfc3.js.map

/* @oracle/oraclejet-preact: undefined */
// If the value is an array, just return it, otherwise make a single entry array out of it and return it.
const coerceArray = (value) => (Array.isArray(value) ? value : [value]);
// Loops over each function in the array and calls them with the same arguments.
const callEach = (fns) => (args) => fns.forEach((fn) => fn(args));

export { callEach as a, coerceArray as c };
//# sourceMappingURL=arrayUtils-35a58161.js.map

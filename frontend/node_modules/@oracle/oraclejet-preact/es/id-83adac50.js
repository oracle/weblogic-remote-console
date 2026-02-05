/* @oracle/oraclejet-preact: undefined */
/**
 * This is a id generator for utilities which cannot use hooks.
 *
 * Generates random string that can be used as ID. Serves as replacement for
 * getUniqueId() function from "ojs/ojvcomponent-preact"
 * 1. Pick a random number in the range between 0 (inclusive) and 1 (exclusive)
 * 2. Convert the number to a base-36 string (using characters 0-9 and a-z)
 * 3. Slice off the leading '0.' prefix
 * 4. ids should always start with a letter, so prefix it with 'id'
 */
const generateId = () => `_${Math.random().toString(36).slice(2)}`; //@RandomNumberOK

export { generateId as g };
//# sourceMappingURL=id-83adac50.js.map

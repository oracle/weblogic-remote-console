/* @oracle/oraclejet-preact: undefined */
function _arrayReduce(reducer, acc, list) {
  var index = 0;
  var length = list.length;

  while (index < length) {
    acc = reducer(acc, list[index]);
    index += 1;
  }

  return acc;
}

export { _arrayReduce as _ };
//# sourceMappingURL=_arrayReduce-7d856ca7.js.map

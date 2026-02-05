/* @oracle/oraclejet-preact: undefined */
'use strict';

function _arrayReduce(reducer, acc, list) {
  var index = 0;
  var length = list.length;

  while (index < length) {
    acc = reducer(acc, list[index]);
    index += 1;
  }

  return acc;
}

exports._arrayReduce = _arrayReduce;
//# sourceMappingURL=_arrayReduce-406d020c.js.map

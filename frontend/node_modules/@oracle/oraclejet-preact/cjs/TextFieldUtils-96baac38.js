/* @oracle/oraclejet-preact: undefined */
'use strict';

const getInputId = (id) => (id ?? '') + '|input';
const isInputPlaceholderShown = (hasInsideLabel, hasValue, isFocused) => {
    return !(hasInsideLabel && !hasValue && !isFocused);
};

exports.getInputId = getInputId;
exports.isInputPlaceholderShown = isInputPlaceholderShown;
//# sourceMappingURL=TextFieldUtils-96baac38.js.map

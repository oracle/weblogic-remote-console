/* @oracle/oraclejet-preact: undefined */
const getInputId = (id) => (id ?? '') + '|input';
const isInputPlaceholderShown = (hasInsideLabel, hasValue, isFocused) => {
    return !(hasInsideLabel && !hasValue && !isFocused);
};

export { getInputId as g, isInputPlaceholderShown as i };
//# sourceMappingURL=TextFieldUtils-8232bca7.js.map

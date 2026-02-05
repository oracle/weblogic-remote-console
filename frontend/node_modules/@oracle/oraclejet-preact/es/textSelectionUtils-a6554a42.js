/* @oracle/oraclejet-preact: undefined */
/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const getIsSelectionPending = () => {
    const selection = document.getSelection();
    if (selection) {
        return !(selection.type === 'None' ||
            (selection.anchorNode === selection.focusNode &&
                selection.anchorOffset === selection.focusOffset));
    }
    return false;
};

export { getIsSelectionPending as g };
//# sourceMappingURL=textSelectionUtils-a6554a42.js.map

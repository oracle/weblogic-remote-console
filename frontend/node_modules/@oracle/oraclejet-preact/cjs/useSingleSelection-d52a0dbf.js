/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
function useSingleSelection(keyExtractor, selected, onChange) {
    const onClick = hooks.useCallback((event) => {
        handleSelect(event, keyExtractor, selected, onChange);
    }, [keyExtractor, selected, onChange]);
    const onKeyUp = hooks.useCallback((event) => {
        if (event.key === 'Enter') {
            handleSelect(event, keyExtractor, selected, onChange);
        }
    }, [keyExtractor, selected, onChange]);
    const selectionProps = onChange ? { onClick, onKeyDown, onKeyUp } : {};
    return { selectionProps };
}
// prevent default (propagation) for keyDown to prevent arrow keys from scrolling the container
const onKeyDown = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
};
const handleSelect = (event, keyExtractor, selected, onChange) => {
    const itemKey = keyExtractor(event.target);
    if (onChange && itemKey && selected !== itemKey) {
        onChange({ value: itemKey });
        if (event.type === 'click') {
            event.stopPropagation();
        }
    }
};

exports.useSingleSelection = useSingleSelection;
//# sourceMappingURL=useSingleSelection-d52a0dbf.js.map

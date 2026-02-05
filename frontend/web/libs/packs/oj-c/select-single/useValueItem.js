/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "@oracle/oraclejet-preact/hooks/UNSAFE_useUncontrolledState", "preact/hooks"], function (require, exports, UNSAFE_useUncontrolledState_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useValueItem = useValueItem;
    function useValueItem(propValueItem, onValueItemsChanged) {
        // maintain uncontrolled state for valueItem, like useEditableValue hook does for value
        const [valueItem, setValueItem] = (0, UNSAFE_useUncontrolledState_1.useUncontrolledState)(propValueItem, onValueItemsChanged);
        // when the incoming propValueItems changes, update the valueItem state
        (0, hooks_1.useEffect)(() => {
            if (valueItem !== propValueItem) {
                setValueItem(propValueItem);
            }
        }, [propValueItem]);
        return {
            valueItem,
            setValueItem
        };
    }
});

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
    exports.useValueItems = useValueItems;
    function useValueItems(propValueItems, onValueItemsChanged) {
        // maintain uncontrolled state for valueItems, like useEditableValue hook does for value
        const [valueItems, setValueItems] = (0, UNSAFE_useUncontrolledState_1.useUncontrolledState)(propValueItems, onValueItemsChanged);
        const [prevPropValueItems, setPrevPropValueItems] = (0, hooks_1.useState)(propValueItems);
        // when the incoming propValueItems changes, update the valueItems state
        if (prevPropValueItems !== propValueItems && valueItems !== propValueItems) {
            setValueItems(propValueItems);
        }
        // convert the valueItems from the type supported by the custom element to the type supported
        // by the preact component
        // (use state instead of a memo because the memo seems to recalculate every time with a
        // dependency array containing only valueItems, resulting in many unnecessary renders)
        const [prevValueItems, setPrevValueItems] = (0, hooks_1.useState)(valueItems);
        const [preactValueItems, setPreactValueItems] = (0, hooks_1.useState)(valueItems ? Array.from(valueItems.values()) : undefined);
        if (prevValueItems !== valueItems) {
            setPreactValueItems(valueItems ? Array.from(valueItems.values()) : undefined);
        }
        if (prevPropValueItems !== propValueItems) {
            setPrevPropValueItems(propValueItems);
        }
        if (prevValueItems !== valueItems) {
            setPrevValueItems(valueItems);
        }
        return {
            valueItems,
            setValueItems,
            preactValueItems
        };
    }
});

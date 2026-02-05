/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "@oracle/oraclejet-preact/utils/UNSAFE_logger", "preact/hooks", "../PRIVATE_useSelectData/index", "../utils/utils"], function (require, exports, UNSAFE_logger_1, hooks_1, index_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useDataProviderListeners = useDataProviderListeners;
    /**
     * Clones the value that is passed
     *
     * @param value The value to be cloned
     * @returns The cloned value
     */
    function cloneValue(value) {
        return value instanceof Set ? new Set(value.values()) : value;
    }
    /**
     * Clones the valueItem that is passed
     *
     * @param valueItem The valueItem to be cloned
     * @returns The cloned valueItem
     */
    function cloneValueItem(valueItem) {
        return valueItem instanceof Map ? new Map(valueItem.entries()) : Object.assign({}, valueItem);
    }
    /**
     * Checks if the value provided duck-types ItemContext
     * @param value The value to be checked
     * @returns True if the value duck-types ItemContext
     */
    function isItemContext(value) {
        if (value == null)
            return false;
        return typeof value === 'object' && ['key', 'data'].every((prop) => prop in value);
    }
    /**
     * Compare two sets' size or two values if neither of them are a set
     *
     * @param value The first value to compare
     * @param valueToCompare The second value to compare
     * @returns The result of the comparison
     */
    function compareValues(value, valueToCompare) {
        if ((value instanceof Set && valueToCompare instanceof Set) ||
            (value instanceof Map && valueToCompare instanceof Map)) {
            // per the requirement, in this case, it is sufficient to compare the size
            // to determine the equality. No need to check the actual values in the Set.
            return value.size === valueToCompare.size;
        }
        // if value & valueToCompare are objects that extend ItemContext, then compare their key prop
        if (isItemContext(value) && isItemContext(valueToCompare)) {
            return value.key === valueToCompare.key;
        }
        // as default, do normal `===` check
        return value === valueToCompare;
    }
    /**
     * Checks if the value contains the query, if it is a set or if the value
     * is the query otherwise
     *
     * @param value The value to be query
     * @param query The query item
     * @returns Result of the check
     */
    function containsValue(value, query) {
        return value instanceof Set ? value.has(query) : value != null && value === query;
    }
    /**
     * Deletes a value from a set of values or set the current value to null
     * if it the value to be deleted.
     *
     * @param value The current value
     * @param toDelete The value to be deleted
     * @returns The updated value
     */
    function deleteFromValue(value, toDelete) {
        if (value instanceof Set || value instanceof Map) {
            value.delete(toDelete);
            return value;
        }
        if (typeof value === 'number' || typeof value === 'string') {
            // in this case, we are comparing the `value` prop as only it can be a primitive, so use DEFAULT_VALUE
            if (value === toDelete) {
                return utils_1.DEFAULT_VALUE;
            }
            return value;
        }
        if (typeof value === 'object' && value.key === toDelete) {
            // in this case, we are comparing the `valueItem` prop as only it can be an object, so use DEFAULT_VALUE_ITEMS
            return utils_1.DEFAULT_VALUE_ITEMS;
        }
        return value;
    }
    function useDataProviderListeners({ dataProvider, setValue, setValueToSync, setValueItemsToSync, value, valueItems }) {
        // TODO: come up with a better way to do this (part of JET-54088)
        const isSelectMultiple = value instanceof Set;
        const handleRefresh = (0, hooks_1.useCallback)((event) => {
            // Check if we need to handle the event. In some cases where the event is initiated by the
            // Select component we can safely ignore the event. The cases include injecting the filterCriterion
            // or setting override data. If we determine it is one of those case, return without doing anything.
            if (!shouldHandleRefreshEvent(event))
                return;
            if (!(0, utils_1.isEmpty)(value)) {
                // need to fetch refreshed data for the existing selected keys again, so clear the
                // valueItemsToSync and clone the value so that it's a new instance that triggers a rerender
                setValueToSync(cloneValue(value));
                setValueItemsToSync(utils_1.DEFAULT_VALUE_ITEMS);
            }
        }, [setValueItemsToSync, setValueToSync, value]);
        const handleMutation = (0, hooks_1.useCallback)((event) => {
            if ((0, utils_1.isEmpty)(value)) {
                return;
            }
            let newVal = cloneValue(value);
            if (event.detail.remove != null) {
                const keys = event.detail.remove.keys;
                keys.forEach((key) => {
                    if (containsValue(newVal, key)) {
                        newVal = deleteFromValue(newVal, key);
                        (0, UNSAFE_logger_1.warn)(`
              ${isSelectMultiple ? 'SelectMultiple' : 'SelectSingle'}: selected value removed from data provider: ${key}`);
                    }
                });
                // set the new value if keys that were previously selected have been removed
                if (!compareValues(newVal, value)) {
                    setValue(!(0, utils_1.isEmpty)(newVal) ? newVal : utils_1.DEFAULT_VALUE);
                    // also set the valueToSync so that it's available in the next render instead of
                    // having to wait for the useEffect in the next render to update it for the
                    // subsequent render, because we may set it below to handle updates and then that
                    // subsequent render would overwrite it
                    setValueToSync(!(0, utils_1.isEmpty)(newVal) ? newVal : utils_1.DEFAULT_VALUE);
                }
            }
            // if all the selected keys have been removed, we don't need to process updates
            if ((0, utils_1.isEmpty)(newVal)) {
                return;
            }
            if (event.detail.update != null) {
                const keys = event.detail.update.keys;
                let newValueItems = (0, utils_1.isEmpty)(valueItems)
                    ? valueItems
                    : cloneValueItem(valueItems);
                keys.forEach((key) => {
                    if (containsValue(newVal, key)) {
                        newValueItems = deleteFromValue(newValueItems, key);
                    }
                });
                // sync the new valueItems if data for the selected keys has been updated
                if (!compareValues(newValueItems, valueItems)) {
                    setValueToSync(newVal);
                    setValueItemsToSync(!(0, utils_1.isEmpty)(newValueItems) ? newValueItems : utils_1.DEFAULT_VALUE_ITEMS);
                }
            }
        }, [isSelectMultiple, setValue, setValueItemsToSync, setValueToSync, value, valueItems]);
        (0, hooks_1.useEffect)(() => {
            dataProvider?.addEventListener('refresh', handleRefresh);
            dataProvider?.addEventListener('mutate', handleMutation);
            return () => {
                dataProvider?.removeEventListener('refresh', handleRefresh);
                dataProvider?.removeEventListener('mutate', handleMutation);
            };
        }, [dataProvider, handleMutation, handleRefresh]);
    }
    const shouldHandleRefreshEvent = (event) => {
        // get the select internals if it exists
        if (index_1.SELECT_INTERNALS in event) {
            const { cause = '' } = event[index_1.SELECT_INTERNALS];
            // if it is caused by filterCriterion/dataOverride change, then we can ignore the event
            return !['filterCriterionChanged', 'dataOverrideChanged'].includes(cause);
        }
        // if there is no select internals present in the event, then we need to handle it
        return true;
    };
});

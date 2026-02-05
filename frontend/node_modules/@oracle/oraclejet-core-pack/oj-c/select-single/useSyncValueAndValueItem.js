/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "@oracle/oraclejet-preact/utils/UNSAFE_logger", "oj-c/editable-value/UNSAFE_useStaleIdentity/useStaleIdentity", "oj-c/select-common/utils/utils", "preact/hooks"], function (require, exports, UNSAFE_logger_1, useStaleIdentity_1, utils_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSyncValueAndValueItem = useSyncValueAndValueItem;
    function useSyncValueAndValueItem({ addBusyState, dataProvider, setDisplayValue, setIsLoading, setValue, setValueItem, value, valueItem, validateValueOnExternalChange }) {
        const prevValueRef = (0, hooks_1.useRef)(value);
        const prevValueItemsRef = (0, hooks_1.useRef)(valueItem);
        // to determine whether we're processing the latest fetch
        const { setStaleIdentity } = (0, useStaleIdentity_1.useStaleIdentity)();
        const hasValue = value != null;
        const hasValueItem = valueItem != null;
        const syncValueItemToValue = (0, hooks_1.useCallback)(async () => {
            // if the value was cleared, clear the valueItem
            if (!hasValue) {
                // only change the valueItem if the current valueItem does not represent a cleared state
                if (hasValueItem) {
                    setValueItem(utils_1.DEFAULT_VALUE_ITEM);
                }
                return;
            }
            // if we already have the data for the value, we do not need to fetch
            // the data. Instead, we just create a new valueItem from the existing
            // valueItem.
            if (value != null && valueItem != null && valueItem.key === value.value) {
                setValueItem(Object.assign({}, valueItem));
                return;
            }
            // noop when there is no dataprovider
            if (!dataProvider) {
                return;
            }
            // need to fetch data for keys not already in valueItem
            setIsLoading(true);
            const resolveBusyState = addBusyState('useSyncValueItem: calling fetchByKeys');
            const { isStale } = setStaleIdentity('useSyncValueItem:fetchByKeys');
            try {
                const fetchResults = await dataProvider.fetchByKeys({ keys: new Set([value.value]) });
                // only process the latest fetch
                if (!isStale()) {
                    const newValueItems = handleFetchByKeysResults(value.value, valueItem, fetchResults.results);
                    setValueItem(newValueItems);
                }
            }
            catch (reason) {
                // only log an error if we're processing the latest fetch
                if (!isStale()) {
                    (0, UNSAFE_logger_1.error)(`SelectMultiple: fetchByKeys promise rejected: ${reason}`);
                }
            }
            // only toggle loading if we're processing the latest fetch
            if (!isStale()) {
                setIsLoading(false);
            }
            resolveBusyState();
        }, [
            addBusyState,
            dataProvider,
            hasValue,
            hasValueItem,
            setIsLoading,
            setStaleIdentity,
            setValueItem,
            value,
            valueItem
        ]);
        const syncValueToValueItem = (0, hooks_1.useCallback)(() => {
            // JET-67789 - SelectSingle > clearing required select input doesn't make input invalid when set programmatically by valueItem
            // We reach here if the valueItem property is programmatically updated by the app and we need
            // to sync value to the valueItem. Even though the app updated the valueItem, we still need
            // to treat it as if it updated the value property. This will not be done by the useEV hook as it
            // has no knowledge of the app programmatically updating the valueItem property. So, we explicitly
            // perform the validation and other tasks which useEV would have done normally for value change.
            const updateValue = (nextValue) => {
                const validationSucceeded = validateValueOnExternalChange(nextValue);
                // Here the validateValueOnExternalChange always returns true. This is because we always want to
                // set the value provided by the app even if it is invalid. We still do a check here for consistency.
                if (validationSucceeded) {
                    setValue(nextValue);
                    // We don't consume the displayValue for select components, but we need to keep them updated
                    // with the value for the useEV hook to perform tasks correctly.
                    setDisplayValue(nextValue);
                }
            };
            // if the valueItem were cleared, clear the value
            if (!hasValueItem) {
                // only change the value if the current value does not represent a cleared state
                if (hasValue) {
                    updateValue(utils_1.DEFAULT_VALUE);
                }
                return;
            }
            // if the values of the valueItem and value are different, sync the value
            if (valueItem.key !== value?.value) {
                updateValue(valueItem.key);
                return;
            }
        }, [
            hasValue,
            hasValueItem,
            setDisplayValue,
            setValue,
            validateValueOnExternalChange,
            value,
            valueItem
        ]);
        // on mount, need to update the valueItem if value is specified (because value takes
        // precedence), or update the value if valueItem is specified and value is not
        (0, hooks_1.useEffect)(() => {
            if (hasValue) {
                syncValueItemToValue();
            }
            else if (hasValueItem) {
                syncValueToValueItem();
            }
            // we only want to run this effect on mount.
            // FIXME: Once we enable the eslint react-hooks rule, there will be a false positive linter error here.
            // We just need to ignore the linter error as we want an empty dep array to make the hook run only on mount.
            // We cannot disable the rule until it is enabled. Once the rule is enabled, remove the FIXME from below.
            // FIXME: eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        // detect whether value or valueItem was changed;
        // value takes precedence over valueItem
        (0, hooks_1.useEffect)(() => {
            if (value !== prevValueRef.current && valueItem !== prevValueItemsRef.current) {
                prevValueRef.current = value;
                prevValueItemsRef.current = valueItem;
                if (value) {
                    syncValueItemToValue();
                }
                else {
                    syncValueToValueItem();
                }
            }
            else if (value !== prevValueRef.current) {
                prevValueRef.current = value;
                syncValueItemToValue();
            }
            else if (valueItem !== prevValueItemsRef.current) {
                prevValueItemsRef.current = valueItem;
                syncValueToValueItem();
            }
        }, [syncValueItemToValue, syncValueToValueItem, value, valueItem]);
    }
    function handleFetchByKeysResults(value, valueItem, fetchByKeysResults) {
        // if the key is already in valueItem, use that data
        if (valueItem && valueItem.key === value) {
            return valueItem;
        }
        // if the key is a new addition, get the data from the fetched results
        // if the key is a new addition, get the data from the fetched results
        const item = fetchByKeysResults.get(value);
        // if there is no item for a key, throw an error
        if (!item) {
            throw new Error(`oj-c-select-single: could not fetch data for key ${value}`);
        }
        return {
            key: value,
            data: item.data,
            metadata: item.metadata ? item.metadata : { key: value }
        };
    }
});

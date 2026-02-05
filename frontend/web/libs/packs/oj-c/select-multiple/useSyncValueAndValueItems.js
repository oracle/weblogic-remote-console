/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "@oracle/oraclejet-preact/utils/UNSAFE_logger", "oj-c/select-common/utils/utils", "preact/hooks"], function (require, exports, UNSAFE_logger_1, utils_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSyncValueAndValueItems = useSyncValueAndValueItems;
    function useSyncValueAndValueItems({ addBusyState, dataProvider, setDisplayValue, setIsLoading, setValue, setValueItems, value, valueItems, validateValueOnExternalChange }) {
        const prevValueRef = (0, hooks_1.useRef)(value);
        const prevValueItemsRef = (0, hooks_1.useRef)(valueItems);
        const hasValue = value && value instanceof Set && value.size > 0;
        const hasValueItems = valueItems && valueItems.size > 0;
        // ref to determine whether we're processing the latest fetch
        const latestFetchRef = (0, hooks_1.useRef)(null);
        // TODO: change this to useEffectEvent because we don't want to add this function to the
        // dependency arrays of the useEffects where we call it
        const syncValueItemsToValue = (0, hooks_1.useCallback)(() => {
            // if the value was cleared, clear the valueItems
            if (!hasValue) {
                // only change the valueItems if the current valueItems does not represent a cleared state
                if (hasValueItems) {
                    setValueItems(utils_1.DEFAULT_VALUE_ITEMS);
                }
                return;
            }
            // determine if we need to fetch data for any values
            const arValues = Array.from(value.keys());
            const valuesToFetch = arValues.reduce((accum, currKey) => {
                if (!hasValueItems || !valueItems.has(currKey)) {
                    accum.push(currKey);
                }
                return accum;
            }, []);
            // if we don't need to fetch data, create new valueItems from existing valueItems
            if (valuesToFetch.length === 0) {
                const newValItems = new Map();
                value.forEach((currKey) => {
                    newValItems.set(currKey, valueItems.get(currKey));
                });
                // only set new valueItems if the length or order is different from the existing valueItems
                const newValItemsKeys = Array.from(newValItems.keys());
                const isOrderEqual = arValues.every((key, index) => key === newValItemsKeys[index]);
                if (valueItems?.size !== newValItems.size || !isOrderEqual) {
                    setValueItems(newValItems);
                }
                return;
            }
            // need to fetch data for keys not already in valueItems
            setIsLoading(true);
            const resolveBusyState = addBusyState('useSyncValueItems: calling fetchByKeys');
            // object to determine whether we're processing the latest fetch
            const latestFetch = {};
            latestFetchRef.current = latestFetch;
            // execute this function in both then and catch blocks of the fetch promise instead of
            // in a finally block, which executes asynchronously and results in additional render cycles
            const afterFetch = () => {
                // only toggle loading if we're processing the latest fetch
                if (latestFetch === latestFetchRef.current) {
                    setIsLoading(false);
                }
                resolveBusyState();
            };
            dataProvider
                .fetchByKeys({ keys: new Set(valuesToFetch) })
                .then((fbkResults) => {
                // only process the latest fetch
                if (latestFetch === latestFetchRef.current) {
                    const newValueItems = handleFetchByKeysResults(value, valueItems, fbkResults.results);
                    setValueItems(newValueItems);
                }
                // JET-73836 - REDWOOD AUTOMATION FLOW GETS STUCK UP AS BUSY STATE IS NOT RESOLVED
                // always run afterFetch to at least resolve busy states, even if this isn't the
                // latest fetch
                afterFetch();
            }, (reason) => {
                // only log an error if we're processing the latest fetch
                if (latestFetch === latestFetchRef.current) {
                    (0, UNSAFE_logger_1.error)(`SelectMultiple: fetchByKeys promise rejected: ${reason}`);
                }
                afterFetch();
            });
        }, [
            addBusyState,
            dataProvider,
            hasValue,
            hasValueItems,
            setIsLoading,
            setValueItems,
            value,
            valueItems
        ]);
        // TODO: change this to useEffectEvent because we don't want to add this function to the
        // dependency arrays of the useEffects where we call it
        const syncValueToValueItems = (0, hooks_1.useCallback)(() => {
            // JET-67789 - SelectSingle > clearing required select input doesn't make input invalid when set programmatically by valueItem
            // We reach here if the valueItems property is programmatically updated by the app and we need
            // to sync value to the valueItems. Even though the app updated the valueItems, we still need
            // to treat it as if it updated the value property. This will not be done by the useEV hook as it
            // has no knowledge of the app programmatically updating the valueItem property. So, we explicitly
            // perform the validation and other tasks which useEV would have done normally for value change.
            const updateValue = (nextValue) => {
                const validationSucceeded = validateValueOnExternalChange(nextValue);
                // Here the validateValueOnExternalChange always return VALID. This is because we always want to
                // set the value provided by the app even if it is invalid. We still do a check here for consistency.
                if (validationSucceeded) {
                    setValue(nextValue);
                    // We don't consume the displayValue for select components, but we need to keep them updated
                    // with the value for the useEV hook to perform tasks correctly.
                    setDisplayValue(nextValue);
                }
            };
            // if the valueItems were cleared, clear the value
            if (!hasValueItems) {
                // only change the value if the current value does not represent a cleared state
                if (hasValue) {
                    updateValue(utils_1.DEFAULT_VALUE);
                }
                return;
            }
            // if the sizes of the valueItems and value are different, sync the value
            const arValueItemsKeys = Array.from(valueItems.keys());
            const valueItemsKeys = new Set(arValueItemsKeys);
            if (!value || !(value instanceof Set) || value.size !== valueItemsKeys.size) {
                updateValue(valueItemsKeys);
                return;
            }
            // if the keys or order of the keys are different, sync the value
            const arValueKeys = Array.from(value.keys());
            const isDifferent = arValueItemsKeys.some((key, index) => key !== arValueKeys[index]);
            if (isDifferent) {
                updateValue(valueItemsKeys);
            }
        }, [
            hasValue,
            hasValueItems,
            setDisplayValue,
            setValue,
            validateValueOnExternalChange,
            value,
            valueItems
        ]);
        // on mount, need to update the valueItems if value is specified (because value takes
        // precedence), or update the value if valueItems is specified and value is not
        (0, hooks_1.useEffect)(() => {
            if (hasValue) {
                syncValueItemsToValue();
            }
            else if (hasValueItems) {
                syncValueToValueItems();
            }
            // we only want to run this effect on mount.
            // FIXME: Once we enable the eslint react-hooks rule, there will be a false positive linter error here.
            // We just need to ignore the linter error as we want an empty dep array to make the hook run only on mount.
            // We cannot disable the rule until it is enabled. Once the rule is enabled, remove the FIXME from below.
            // FIXME: eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        // detect whether value or valueItems was changed;
        // value takes precedence over valueItems
        (0, hooks_1.useEffect)(() => {
            if (value !== prevValueRef.current && valueItems !== prevValueItemsRef.current) {
                prevValueRef.current = value;
                prevValueItemsRef.current = valueItems;
                if (value) {
                    syncValueItemsToValue();
                }
                else {
                    syncValueToValueItems();
                }
            }
            else if (value !== prevValueRef.current) {
                prevValueRef.current = value;
                syncValueItemsToValue();
            }
            else if (valueItems !== prevValueItemsRef.current) {
                prevValueItemsRef.current = valueItems;
                syncValueToValueItems();
            }
        }, [syncValueItemsToValue, syncValueToValueItems, value, valueItems]);
    }
    function handleFetchByKeysResults(value, valueItems, fetchByKeysResults) {
        const arKeys = Array.from(value.keys());
        return arKeys.reduce((accumMap, currKey) => {
            // if the key is already in valueItems, use that data
            if (valueItems && valueItems.has(currKey)) {
                accumMap.set(currKey, valueItems.get(currKey));
                return accumMap;
            }
            // if the key is a new addition, get the data from the fetched results
            const item = fetchByKeysResults.get(currKey);
            // if there is no item for a key, throw an error
            if (!item) {
                throw new Error(`oj-c-select-multiple: could not fetch data for key ${currKey}`);
            }
            accumMap.set(currKey, {
                key: currKey,
                data: item.data,
                metadata: item.metadata ? item.metadata : { key: currKey }
            });
            return accumMap;
        }, new Map());
    }
});

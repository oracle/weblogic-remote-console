/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "oj-c/hooks/UNSAFE_useEditableValue/index", "oj-c/hooks/UNSAFE_useComponentMessages/useComponentMessages", "oj-c/editable-value/UNSAFE_useDeferredValidators/useDeferredValidators", "oj-c/select-common/PRIVATE_useCache/index", "oj-c/select-common/PRIVATE_useSelectData/index", "oj-c/select-common/UNSAFE_useDataProviderListeners/useDataProviderListeners", "oj-c/select-common/utils/utils", "ojs/ojkeyset", "preact/hooks", "./useSyncValueAndValueItem", "./useValueItem"], function (require, exports, UNSAFE_useTranslationBundle_1, index_1, useComponentMessages_1, useDeferredValidators_1, index_2, index_3, useDataProviderListeners_1, utils_1, ojkeyset_1, hooks_1, useSyncValueAndValueItem_1, useValueItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSelectSinglePreact = useSelectSinglePreact;
    /**
     * This hook manages state and other related props for the Select Single component.
     */
    function useSelectSinglePreact({ 
    // addToList,
    advancedSearch, collectionTemplate, data, disabled, displayOptions, itemTemplate, itemText, labelEdge, labelHint, labelStartWidth, matchBy: propMatchBy, messagesCustom, placeholder, readonly, readonlyUserAssistanceShown, requiredMessageDetail: propRequiredMessageDetail, required, textAlign, userAssistanceDensity, value: propValue, valueItem: propValueItem, virtualKeyboard, onMessagesCustomChanged, 
    // onOjAddToListAction,
    onOjAdvancedSearchAction, onOjValueAction, onValidChanged, onValueChanged, onValueItemChanged, ...otherProps }, addBusyState) {
        const [filterCriterion, setFilterCriterion] = (0, hooks_1.useState)(undefined);
        // JET-54256 - inside label animates up on initial display with selected value
        // Initialize isLoading based on whether we will need to fetch data instead of waiting for
        // useSyncValueAndValueItems to set the flag in a useEffect, because the delay caused by the
        // useEffect will result in the label animating.
        const [isLoading, setIsLoading] = (0, hooks_1.useState)(data != null && propValue != null && propValueItem == null);
        // JET-66079 - Add option to specify the matchBy behavior of the text filter to Core Pack Selects
        const matchBy = (0, hooks_1.useMemo)(() => {
            // Make a copy of the array to use internally so that the application can't mutate it;
            // they have to set a new array if they want to change it.
            return propMatchBy && propMatchBy.length > 0 ? [...propMatchBy] : undefined;
        }, [propMatchBy]);
        const { valueItem, setValueItem } = (0, useValueItem_1.useValueItem)(propValueItem, onValueItemChanged);
        const [preactValueItem, setPreactValueItem] = (0, hooks_1.useState)(valueItem);
        (0, hooks_1.useEffect)(() => {
            setPreactValueItem(valueItem);
        }, [valueItem]);
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const requiredMessageDetail = propRequiredMessageDetail || translations.select_requiredMessageDetail();
        const deferredValidators = (0, useDeferredValidators_1.useDeferredValidators)({
            labelHint,
            required,
            requiredMessageDetail
        });
        // SelectSingle doesn't directly use the display value from useEV. However, when display
        // value is updated during the component's lifecycle (such as by calling reset) then
        // we need to sync the preactValueItem to the valueItem.
        const onDisplayValueChanged = (0, hooks_1.useCallback)(() => {
            setPreactValueItem(valueItem);
        }, [valueItem]);
        const { methods, onCommitValue, setDisplayValue, setValue, textFieldProps: evTextFieldProps, value, validateValueOnExternalChange } = (0, index_1.useEditableValue)({
            addBusyState,
            ariaDescribedBy: otherProps['aria-describedby'],
            defaultDisplayValue: null,
            deferredValidators,
            disabled,
            displayOptions,
            messagesCustom,
            onDisplayValueChanged,
            onMessagesCustomChanged,
            onValidChanged,
            onValueChanged,
            readonly,
            value: propValue
        });
        const { messages: evMessages, ...textFieldProps } = evTextFieldProps;
        const messages = (0, useComponentMessages_1.useComponentMessages)({
            evMessages,
            messagesCustom,
            readonly,
            readonlyUserAssistanceShown
        });
        const { 'aria-describedby': ariaDescribedBy } = textFieldProps;
        const hasNoValue = value === null;
        const { dataProvider, dataState, onLoadRange } = (0, index_3.useSelectData)({
            data,
            filterCriterion,
            hasCollectionTemplate: collectionTemplate !== undefined
        });
        // maintain a separate valueToSync that we can pass to useSyncValueAndValueItems so that
        // we can change that state to force a sync without writing a different instance back to the
        // component value property
        // JET-72139 - Data list not getting updated on change of data on DP
        // Use an object type for valueToSync, so that we can force sync the value for the same key.
        const [valueToSync, _setValueToSync] = (0, hooks_1.useState)(value != null ? { value } : value);
        // We create a wrapper setValueToSync that does the wrapping. This way, we can keep this logic
        // separate to select-single.
        const setValueToSync = (0, hooks_1.useCallback)((value) => {
            if (typeof value === 'function') {
                _setValueToSync((prevValue) => {
                    const newValue = value(prevValue?.value);
                    return newValue != null ? { value: newValue } : newValue;
                });
                return;
            }
            _setValueToSync(value != null ? { value } : value);
        }, []);
        const [valueItemToSync, setValueItemToSync] = (0, hooks_1.useState)(valueItem);
        (0, hooks_1.useEffect)(() => {
            setValueToSync(value);
        }, [value]);
        (0, hooks_1.useEffect)(() => {
            setValueItemToSync(valueItem);
        }, [valueItem]);
        (0, useDataProviderListeners_1.useDataProviderListeners)({
            dataProvider,
            setValue,
            setValueToSync,
            setValueItemsToSync: setValueItemToSync,
            value,
            valueItems: valueItem
        });
        (0, useSyncValueAndValueItem_1.useSyncValueAndValueItem)({
            addBusyState,
            dataProvider: dataProvider,
            setDisplayValue,
            setIsLoading,
            setValue,
            setValueItem,
            value: valueToSync,
            valueItem: valueItemToSync,
            validateValueOnExternalChange
        });
        const onCommit = (0, hooks_1.useCallback)(async ({ previousValue, value }) => {
            const valueToCommit = value != null ? value : utils_1.DEFAULT_VALUE;
            // JET-66618: In order for the validate method to run properly, which parses
            // and then validates the displayValue, we need to call setDisplayValue here.
            // This is normally done by useEditableValue's onCommit, which we are overriding.
            // Since this component has no converter, we can just set displayValue to value.
            // Note that we set it even if validation fails, i.e. if the value is cleared
            // in Preact but the component is required. This ensures if validation is re-run
            // it correctly uses the cleared displayValue and not the value, which is not
            // updated when validation fails.
            setDisplayValue(valueToCommit);
            const commitSucceeded = await onCommitValue(valueToCommit);
            if (!commitSucceeded) {
                setPreactValueItem(undefined);
            }
            // If the validation is a success and we have dataState available
            // which it should, then trigger the valueAction.
            else if (commitSucceeded && dataState.status === 'success') {
                if (value == null) {
                    // no need to fetch itemContext when the value is cleared out
                    onOjValueAction?.({
                        itemContext: utils_1.DEFAULT_ITEM_CONTEXT,
                        previousValue: previousValue ?? utils_1.DEFAULT_VALUE,
                        value: utils_1.DEFAULT_VALUE
                    });
                }
                else if (value === valueItem?.key) {
                    // if the value is similar to the current valueItem, no need fetch again
                    onOjValueAction?.({
                        itemContext: valueItem,
                        previousValue: previousValue ?? utils_1.DEFAULT_VALUE,
                        value
                    });
                    // JET-66957 - Select Single > Re-selected value is not displayed
                    // Since the valueItem itself isn't changing when the component is required and the
                    // user tried to clear the previous value, we may need to push the same valueItem
                    // back down to the preact component.
                    if (preactValueItem !== valueItem) {
                        setPreactValueItem(valueItem);
                    }
                }
                else {
                    // check if the value is available in the current dataState
                    const data = dataState.data.data;
                    let item = data.find((item) => item.metadata.key === value);
                    if (item === undefined) {
                        // TODO: JET-54156 - Handle case where uses scrolls down and press Enter to select the value that is not in the DataState
                        // Need a better way to handle this
                        // TODO: handle the failure case (no dp or dp does not have the key), though we should not run into such a case
                        const fetchResults = await dataProvider.fetchByKeys({ keys: new Set([value]) });
                        item = fetchResults.results.get(value);
                    }
                    const itemContext = {
                        data: item.data,
                        key: item.metadata.key,
                        metadata: item.metadata
                    };
                    onOjValueAction?.({
                        itemContext: itemContext,
                        previousValue: previousValue ?? utils_1.DEFAULT_VALUE,
                        value: value ?? utils_1.DEFAULT_VALUE
                    });
                }
            }
        }, [
            dataProvider,
            dataState,
            preactValueItem,
            valueItem,
            onCommitValue,
            onOjValueAction,
            setDisplayValue
        ]);
        const onFilter = (0, hooks_1.useCallback)(({ searchText }) => {
            const fc = (0, utils_1.getFilterCriterion)(dataProvider, searchText, matchBy);
            setFilterCriterion(fc);
        }, [dataProvider, matchBy]);
        const itemRenderer = (0, hooks_1.useMemo)(() => {
            if (!itemTemplate)
                return undefined;
            return ({ data, metadata, searchText }) => {
                return itemTemplate({
                    item: {
                        data: data,
                        metadata: metadata
                    },
                    searchText
                });
            };
        }, [itemTemplate]);
        const stableCollectionTemplateContextRef = (0, hooks_1.useRef)();
        const cache = (0, index_2.useCache)();
        const collectionRenderer = (0, hooks_1.useMemo)(() => {
            if (!collectionTemplate)
                return undefined;
            return ({ currentRowKeyOverride, searchText, selected, onPersistCurrentRowKey, onRowAction }) => {
                // Create the next collectionTemplate context
                // Note, the `cache` method takes 3 params:
                // 1. A string(key) to uniquely identify a property. This is used to store and compare previous
                //    value with the new value to determine changes.
                // 2. The computed value. This will be the new value to be used if not using the cached value.
                // 3. The dependency array. If any of the items in the dependency array is changed, then the
                //    new value provided as the second argument will be returned instead of the cached value.
                //    The cache is then updated with this value.
                const newCollectionTemplateContext = {
                    currentRowOverride: cache('currentRowOverride', currentRowKeyOverride ? { rowKey: currentRowKeyOverride } : undefined, 
                    // Here we want to include searchText as a dependency even if it is not directly
                    // used. This is needed for handling cases where the currentRowKeyOverride is the same
                    // for two filters. For example, we filter the dropdown, the first row is set as current row,
                    // then we navigate into the dropdown and navigate to a different row, thereby scrolling to a
                    // different position. Since currentRowKeyOverride is an uncontrolled prop, it will still
                    // point to the first row. Now, in this state, if we click back on the field, filter again, and we
                    // end up with the same row for the first entry, the collection component might not react to it
                    // if we send in the same object. We need to send a new object even for the same currentRowKeyOverride.
                    // So, we add searchText as a dependency here.
                    [currentRowKeyOverride, searchText]),
                    data: dataProvider,
                    onCurrentRowChanged: cache('onCurrentRowChanged', ({ rowKey }) => {
                        // Since we will not react to the onPersistCurrentRowKey call and only store
                        // the information for future use, we do not have to check if is called with the key
                        // same as the currentRowKeyOverride.
                        onPersistCurrentRowKey({ value: rowKey });
                    }, [onPersistCurrentRowKey]),
                    onRowAction: cache('onRowAction', ({ item }) => {
                        onRowAction({
                            context: { data: item.data, key: item.metadata.key, metadata: item.metadata }
                        });
                    }, [onRowAction]),
                    searchText,
                    selected: cache('selected', new ojkeyset_1.KeySetImpl([...(selected?.values() ?? [])]), [selected])
                };
                // We need to maintain the context object's reference and only mutate it. This is not ideal in
                // preact, but this is essential in the knockout environment. In ko, the template is not recalculated.
                // So, if a new context object is passed, the nested template will not receive the updates as they will
                // be consuming the old context object. So, we mutate the old context whenever we want to make changes on
                // it. This way the nested templates will get the updates correctly.
                // Check if we have a stored output context instance, if not, store the current output and use for
                // future calls.
                if (!stableCollectionTemplateContextRef.current) {
                    stableCollectionTemplateContextRef.current = newCollectionTemplateContext;
                }
                else {
                    // If we already have a context object, then mutate its values using Object.assign
                    Object.assign(stableCollectionTemplateContextRef.current, newCollectionTemplateContext);
                }
                return collectionTemplate(stableCollectionTemplateContextRef.current);
            };
        }, [cache, collectionTemplate, dataProvider]);
        // JET-62033 - select single: webdriver core pack test adapter parity
        const _selectItemByValue = (0, hooks_1.useCallback)(async (value) => {
            return onCommit({
                value: value ?? undefined,
                previousValue: propValue ?? undefined
            });
        }, [onCommit, propValue]);
        // preact component callback to fire the core pack component custom event
        // const onAddToListAction = useCallback(
        //   (detail: Parameters<NonNullable<PreactSelectSingleProps['onAddToListAction']>>[0]) => {
        //     onOjAddToListAction?.(detail);
        //   },
        //   [onOjAddToListAction]
        // );
        // preact component callback to fire the core pack component custom event
        const onAdvancedSearchAction = (0, hooks_1.useCallback)((detail) => {
            onOjAdvancedSearchAction?.(detail);
        }, [onOjAdvancedSearchAction]);
        // method to expose on the root HTML element for use by the webelement test adapter
        // const _doAddToListAction = useCallback(
        //   (searchText: string) => {
        //     onAddToListAction({ searchText });
        //   },
        //   [onAddToListAction]
        // );
        // method to expose on the root HTML element for use by the webelement test adapter
        const _doAdvancedSearchAction = (0, hooks_1.useCallback)((searchText) => {
            onAdvancedSearchAction({ searchText });
        }, [onAdvancedSearchAction]);
        return {
            methods,
            // Certain props will have null as default values, but we need them to be
            // undefined in the preact component.
            selectSingleProps: {
                // addToList,
                advancedSearch,
                'aria-describedby': ariaDescribedBy,
                collectionRenderer,
                data: dataState.status !== 'error' ? dataState.data : null,
                isDisabled: disabled,
                isLoading,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || hasNoValue),
                itemRenderer,
                itemText,
                label: labelHint,
                labelEdge,
                labelStartWidth,
                messages,
                // onAddToListAction,
                onAdvancedSearchAction,
                onCommit,
                onFilter,
                onLoadRange,
                placeholder,
                textAlign,
                userAssistanceDensity,
                valueItem: (0, index_1.treatNull)(preactValueItem, undefined),
                virtualKeyboard
            },
            // _doAddToListAction,
            _doAdvancedSearchAction,
            _selectItemByValue
        };
    }
});

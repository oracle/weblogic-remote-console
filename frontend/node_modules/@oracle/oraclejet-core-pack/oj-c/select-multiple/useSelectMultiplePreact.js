/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "oj-c/hooks/UNSAFE_useComponentMessages/useComponentMessages", "oj-c/hooks/UNSAFE_useEditableValue/index", "oj-c/editable-value/UNSAFE_useDeferredValidators/useDeferredValidators", "oj-c/select-common/PRIVATE_useCache/index", "oj-c/select-common/PRIVATE_useSelectData/index", "oj-c/select-common/UNSAFE_useDataProviderListeners/useDataProviderListeners", "oj-c/select-common/utils/utils", "oj-c/utils/PRIVATE_keyUtils/keySetUtils", "ojs/ojkeyset", "preact/hooks", "./useSyncValueAndValueItems", "./useValueItems"], function (require, exports, UNSAFE_useTranslationBundle_1, useComponentMessages_1, index_1, useDeferredValidators_1, index_2, index_3, useDataProviderListeners_1, utils_1, keySetUtils_1, ojkeyset_1, hooks_1, useSyncValueAndValueItems_1, useValueItems_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSelectMultiplePreact = useSelectMultiplePreact;
    /**
     * This hook manages state and other related props for the Select Multiple component.
     */
    function useSelectMultiplePreact({ 
    // addToList,
    collectionTemplate, data, disabled, displayOptions, itemTemplate, itemText, labelEdge, labelHint, labelStartWidth, matchBy: propMatchBy, messagesCustom, placeholder, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail: propRequiredMessageDetail, textAlign, userAssistanceDensity, value: propValue, valueItems: propValueItems, virtualKeyboard, onMessagesCustomChanged, 
    // onOjAddToListAction,
    onValidChanged, onValueChanged, onValueItemsChanged, ...otherProps }, addBusyState) {
        const [filterCriterion, setFilterCriterion] = (0, hooks_1.useState)(undefined);
        // JET-54256 - inside label animates up on initial display with selected value
        // Initialize isLoading based on whether we will need to fetch data instead of waiting for
        // useSyncValueAndValueItems to set the flag in a useEffect, because the delay caused by the
        // useEffect will result in the label animating.
        const [isLoading, setIsLoading] = (0, hooks_1.useState)(data != null &&
            propValue != null &&
            propValue.size > 0 &&
            (propValueItems == null || propValueItems.size === 0));
        // JET-66079 - Add option to specify the matchBy behavior of the text filter to Core Pack Selects
        const matchBy = (0, hooks_1.useMemo)(() => {
            // Make a copy of the array to use internally so that the application can't mutate it;
            // they have to set a new array if they want to change it.
            return propMatchBy && propMatchBy.length > 0 ? [...propMatchBy] : undefined;
        }, [propMatchBy]);
        const { valueItems, setValueItems, preactValueItems: arItemContexts } = (0, useValueItems_1.useValueItems)(propValueItems, onValueItemsChanged);
        const [prevArItemContexts, setPrevArItemContexts] = (0, hooks_1.useState)(arItemContexts);
        const [preactValueItems, setPreactValueItems] = (0, hooks_1.useState)(arItemContexts);
        if (prevArItemContexts !== arItemContexts && preactValueItems !== arItemContexts) {
            setPreactValueItems(arItemContexts);
        }
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const requiredMessageDetail = propRequiredMessageDetail || translations.select_requiredMessageDetail();
        const deferredValidators = (0, useDeferredValidators_1.useDeferredValidators)({
            labelHint,
            required,
            requiredMessageDetail
        });
        // SelectMultiple doesn't directly use the display value from useEV. However, when display
        // value is updated during the component's lifecycle (such as by calling reset) then
        // we need to sync the preactValueItems to the arItemContexts.
        const onDisplayValueChanged = (0, hooks_1.useCallback)(() => {
            setPreactValueItems(arItemContexts);
        }, [arItemContexts]);
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
        const hasNoValue = value === null || (value instanceof Set && value.size === 0);
        const [dataStateOverride, setDataStateOverride] = (0, hooks_1.useState)();
        const { dataProvider, dataState, onLoadRange } = (0, index_3.useSelectData)({
            data,
            dataStateOverride,
            filterCriterion,
            hasCollectionTemplate: collectionTemplate !== undefined
        });
        // maintain a separate valueToSync that we can pass to useSyncValueAndValueItems so that
        // we can change that state to force a sync without writing a different instance back to the
        // component value property
        const [valueToSync, setValueToSync] = (0, hooks_1.useState)(value);
        const [valueItemsToSync, setValueItemsToSync] = (0, hooks_1.useState)(valueItems);
        const [prevValue, setPrevValue] = (0, hooks_1.useState)(value);
        const [prevValueItems, setPrevValueItems] = (0, hooks_1.useState)(valueItems);
        if (prevValue !== value) {
            setValueToSync(value);
        }
        if (prevValueItems !== valueItems) {
            setValueItemsToSync(valueItems);
        }
        (0, useDataProviderListeners_1.useDataProviderListeners)({
            dataProvider,
            setValue: setValue,
            setValueToSync: setValueToSync,
            setValueItemsToSync,
            value: value,
            valueItems
        });
        (0, useSyncValueAndValueItems_1.useSyncValueAndValueItems)({
            addBusyState,
            dataProvider: dataProvider,
            // We don't consume the displayValue for select components, but we need to keep them updated
            // with the value for the useEV hook to perform tasks correctly. Since the setDisplayValue
            // expects a string and we do not have that, we simply cast it to any and pass our value to it.
            setDisplayValue: setDisplayValue,
            setIsLoading,
            setValue: setValue,
            setValueItems,
            value: valueToSync,
            valueItems: valueItemsToSync,
            validateValueOnExternalChange
        });
        const onCommit = (0, hooks_1.useCallback)(async ({ value }) => {
            const valueToCommit = (value && value.size > 0 ? value : utils_1.DEFAULT_VALUE);
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
                setPreactValueItems(undefined);
            }
            else if (commitSucceeded) {
                if (value && value.size > 0 && arItemContexts?.length === value.size) {
                    const arKeys = Array.from(value);
                    const allValuesInItemContexts = arKeys.every((key, index) => {
                        return key === arItemContexts?.[index].key;
                    });
                    // JET-66957 - Select Single > Re-selected value is not displayed
                    // Since the valueItems itself isn't changing when the component is required and the
                    // user tried to clear the previous values, we may need to push the same valueItems
                    // back down to the preact component.
                    if (allValuesInItemContexts && preactValueItems !== arItemContexts) {
                        setPreactValueItems(arItemContexts);
                    }
                }
            }
        }, [arItemContexts, preactValueItems, onCommitValue, setDisplayValue]);
        const onFilter = (0, hooks_1.useCallback)(({ searchText }) => {
            const fc = (0, utils_1.getFilterCriterion)(dataProvider, searchText, matchBy);
            setFilterCriterion(fc);
        }, [dataProvider, matchBy]);
        const prevSelectedKeysRef = (0, hooks_1.useRef)((0, keySetUtils_1.keysToKeySet)({ all: false, keys: new Set() }));
        const itemRenderer = (0, hooks_1.useMemo)(() => {
            if (!itemTemplate)
                return undefined;
            return ({ data, metadata, searchText, selectedKeys: preactSelectedKeys, onSelectionChange: preactOnSelectionChange }) => {
                // Need to create selectedKeys only if the contents are different, otherwise use the
                // previous selectedKeys. Otherwise, the component will go in an infinite loop.
                const newPreactSelectedKeys = preactSelectedKeys ?? new Set();
                const prevPreactSelectedKeys = prevSelectedKeysRef.current.keys.keys ?? new Set();
                const selectedKeys = (0, utils_1.isSetEqual)(prevPreactSelectedKeys, newPreactSelectedKeys)
                    ? prevSelectedKeysRef.current
                    : (0, keySetUtils_1.keysToKeySet)({ all: false, keys: newPreactSelectedKeys });
                prevSelectedKeysRef.current = selectedKeys;
                const onSelectedKeysChanged = ((arg) => {
                    const immutableKeySet = (arg instanceof CustomEvent ? arg.detail.value : arg);
                    const immutableSet = immutableKeySet.keys.keys;
                    // If the selected keys are the same, do not call preactOnSelectionChange.
                    if (prevSelectedKeysRef.current === immutableKeySet)
                        return;
                    preactOnSelectionChange({
                        target: arg instanceof CustomEvent ? arg.target : null,
                        value: new Set(immutableSet?.values())
                    });
                });
                return itemTemplate({
                    selectedKeys,
                    onSelectedKeysChanged,
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
            return ({ currentRowKeyOverride, onPersistCurrentRowKey, onSelectedChange, searchText, selected, selectedOnlyData }) => {
                // if the selectedOnlyData is changed, update the data override state
                if (dataStateOverride !== selectedOnlyData) {
                    setDataStateOverride(selectedOnlyData);
                }
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
                    onSelectedChanged: cache('onSelectedChanged', (detail) => {
                        // Select component does not support select-all functionality
                        // So we only react to individual selection changes
                        if (detail.value?.keys.all === false) {
                            const immutableSet = detail.value.keys.keys;
                            // trigger onChange only if the sets are different
                            const current = selected ?? new Set();
                            const next = new Set(immutableSet.values());
                            if (!(0, utils_1.isSetEqual)(current, next))
                                onSelectedChange({ value: next });
                        }
                    }, [selected, onSelectedChange]),
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
                // Finally, call the collectionTemplate with the same context object.
                return collectionTemplate(stableCollectionTemplateContextRef.current);
            };
        }, [cache, collectionTemplate, dataProvider, dataStateOverride]);
        // JET-60647 - select multiple: webdriver core pack test adapter parity
        const _selectItemsByValue = (0, hooks_1.useCallback)(async (value) => {
            return onCommit({
                value: value ?? undefined,
                previousValue: propValue ?? undefined
            });
        }, [onCommit, propValue]);
        // preact component callback to fire the core pack component custom event
        // const onAddToListAction = useCallback(
        //   (detail: Parameters<NonNullable<PreactSelectMultipleProps['onAddToListAction']>>[0]) => {
        //     onOjAddToListAction?.(detail);
        //   },
        //   [onOjAddToListAction]
        // );
        // method to expose on the root HTML element for use by the webelement test adapter
        // const _doAddToListAction = useCallback(
        //   (searchText: string) => {
        //     onAddToListAction({ searchText });
        //   },
        //   [onAddToListAction]
        // );
        if (prevArItemContexts !== arItemContexts) {
            setPrevArItemContexts(arItemContexts);
        }
        if (prevValue !== value) {
            setPrevValue(value);
        }
        if (prevValueItems !== valueItems) {
            setPrevValueItems(valueItems);
        }
        return {
            // value,
            // setValue,
            methods,
            // Certain props will have null as default values, but we need them to be
            // undefined in the preact component.
            selectMultipleProps: {
                // addToList,
                'aria-describedby': ariaDescribedBy,
                collectionRenderer,
                data: dataState.status !== 'error' ? dataState.data : null,
                isDisabled: disabled,
                isLoading,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || hasNoValue),
                itemRenderer: itemTemplate ? itemRenderer : undefined,
                itemText,
                label: labelHint,
                labelEdge,
                labelStartWidth,
                messages,
                // onAddToListAction,
                onCommit,
                onFilter,
                onLoadRange,
                placeholder,
                textAlign,
                userAssistanceDensity,
                valueItems: preactValueItems,
                virtualKeyboard
            },
            // _doAddToListAction,
            _selectItemsByValue
        };
    }
});

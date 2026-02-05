define(["require", "exports", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useUncontrolledState", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "oj-c/hooks/UNSAFE_useEditableValue/index", "oj-c/select-common/PRIVATE_useSelectData/index", "oj-c/select-common/UNSAFE_useDataProviderListeners/index", "oj-c/select-common/utils/utils", "oj-c/select-single/useSyncValueAndValueItem", "oj-c/select-single/useValueItem"], function (require, exports, hooks_1, UNSAFE_useUncontrolledState_1, useAssistiveText_1, index_1, index_2, index_3, utils_1, useSyncValueAndValueItem_1, useValueItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useInlineSelectSingle = useInlineSelectSingle;
    const noOp = () => { };
    const addBusyStateNoOp = () => noOp;
    const alwaysPassingValidate = () => true;
    /**
     * A custom hook for determining prop values for the preact InlineSelectSingle
     * component from its own props.
     * @param props core-pack InlineSelectSingle props
     * @param ref core-pack ref handle
     */
    function useInlineSelectSingle(props, ref) {
        const preactRef = (0, hooks_1.useRef)(null);
        const [filterCriterion, setFilterCriterion] = (0, hooks_1.useState)();
        // JET-54256 - inside label animates up on initial display with selected value
        // Initialize isLoading based on whether we will need to fetch data instead of waiting for
        // useSyncValueAndValueItems to set the flag in a useEffect, because the delay caused by the
        // useEffect will result in the label animating.
        const [isLoading, setIsLoading] = (0, hooks_1.useState)(props.data != null && props.value != null && props.valueItem == null);
        // we use `null` for representing absence of value in core-pack instead of `undefined`.
        const [value, setValue] = (0, UNSAFE_useUncontrolledState_1.useUncontrolledState)(props.value ?? null, props.onValueChanged);
        // we use `null` for representing absence of value in core-pack instead of `undefined`.
        const { valueItem, setValueItem } = (0, useValueItem_1.useValueItem)(props.valueItem ?? null, props.onValueItemChanged);
        // JET-66079 - Add option to specify the matchBy behavior of the text filter to Core Pack Selects
        const matchBy = (0, hooks_1.useMemo)(() => {
            // Make a copy of the array to use internally so that the application can't mutate it;
            // they have to set a new array if they want to change it.
            return props.matchBy && props.matchBy.length > 0 ? [...props.matchBy] : undefined;
        }, [props.matchBy]);
        const [preactValueItem, setPreactValueItem] = (0, hooks_1.useState)(valueItem);
        const prevPreactValueItemRef = (0, hooks_1.useRef)(preactValueItem);
        if (prevPreactValueItemRef.current !== valueItem) {
            prevPreactValueItemRef.current = valueItem;
            setPreactValueItem(valueItem);
        }
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            focus: () => preactRef.current?.focus(),
            blur: () => preactRef.current?.blur()
        }), []);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            helpHints: props.helpHints
        });
        // maintain a separate valueToSync that we can pass to useSyncValueAndValueItems so that
        // we can change that state to force a sync without writing a different instance back to the
        // component value property
        // JET-72139 - Data list not getting updated on change of data on DP
        // Use an object type for valueToSync, so that we can force sync the value for the same key.
        // we use `null` for representing absence of value in core-pack instead of `undefined`.
        const [valueToSync, _setValueToSync] = (0, hooks_1.useState)(value != null ? { value } : null);
        // We create a wrapper setValueToSync that does the wrapping. This way, we can keep this logic
        // separate to select-single.
        const setValueToSync = (0, hooks_1.useCallback)((value) => {
            if (typeof value === 'function') {
                _setValueToSync((prevValue) => {
                    // we use `null` for representing absence of value in core-pack instead of `undefined`.
                    const newValue = value(prevValue?.value ?? null);
                    return newValue != null ? { value: newValue } : null;
                });
                return;
            }
            // we use `null` for representing absence of value in core-pack instead of `undefined`.
            _setValueToSync(value != null ? { value } : null);
        }, []);
        const { dataProvider, dataState, onLoadRange } = (0, index_2.useSelectData)({
            data: props.data,
            filterCriterion,
            hasCollectionTemplate: false
        });
        const [valueItemToSync, setValueItemToSync] = (0, hooks_1.useState)(valueItem);
        (0, hooks_1.useEffect)(() => {
            // setValueToSync never changes
            setValueToSync(value);
        }, [setValueToSync, value]);
        (0, hooks_1.useEffect)(() => {
            setValueItemToSync(valueItem);
        }, [valueItem]);
        (0, index_3.useDataProviderListeners)({
            dataProvider,
            setValue: (0, hooks_1.useCallback)((value) => {
                // we use `null` for representing absence of value in core-pack instead of `undefined`.
                setValue(value ?? null);
            }, [setValue]),
            setValueToSync,
            setValueItemsToSync: setValueItemToSync,
            value,
            valueItems: valueItem
        });
        (0, useSyncValueAndValueItem_1.useSyncValueAndValueItem)({
            // we do not have busy state in pure preact component
            addBusyState: addBusyStateNoOp,
            dataProvider,
            // we do not need display value as we are not relying on useEV hook
            setDisplayValue: noOp,
            setIsLoading,
            setValue: (0, hooks_1.useCallback)((value) => {
                // we use `null` for representing absence of value in core-pack instead of `undefined`.
                setValue(value ?? null);
            }, [setValue]),
            setValueItem: (0, hooks_1.useCallback)((valueItem) => {
                // we use `null` for representing absence of value in core-pack instead of `undefined`.
                setValueItem(valueItem ?? null);
            }, [setValueItem]),
            value: valueToSync,
            valueItem: valueItemToSync,
            // we do not have validation, so the user selections always passes
            validateValueOnExternalChange: alwaysPassingValidate
        });
        const { onValueAction } = props;
        const onCommit = (0, hooks_1.useCallback)(async ({ previousValue, value, reason }) => {
            // we use `null` for representing absence of value in core-pack instead of `undefined`.
            setValue(value ?? null);
            // If we have dataState available which it should, then trigger the valueAction.
            if (dataState.status === 'success') {
                if (value == null) {
                    // no need to fetch itemContext when the value is cleared out
                    onValueAction?.({
                        itemContext: utils_1.DEFAULT_ITEM_CONTEXT,
                        previousValue: previousValue ?? utils_1.DEFAULT_VALUE,
                        value: utils_1.DEFAULT_VALUE,
                        reason
                    });
                }
                else if (value === valueItem?.key) {
                    // if the value is similar to the current valueItem, no need fetch again
                    onValueAction?.({
                        itemContext: valueItem,
                        previousValue: previousValue ?? utils_1.DEFAULT_VALUE,
                        value,
                        reason
                    });
                    // JET-66957 - Select Single > Re-selected value is not displayed
                    // Since the valueItem itself isn't changing when the component is required and the
                    // user tried to clear the previous value, we may need to push the same valueItem
                    // back down to the preact component.
                    setPreactValueItem(valueItem);
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
                    onValueAction?.({
                        itemContext,
                        previousValue: previousValue ?? utils_1.DEFAULT_VALUE,
                        value: value ?? utils_1.DEFAULT_VALUE,
                        reason
                    });
                }
            }
        }, [dataProvider, dataState, valueItem, onValueAction, setValue]);
        const onFilter = (0, hooks_1.useCallback)(({ searchText }) => {
            const fc = (0, utils_1.getFilterCriterion)(dataProvider, searchText, matchBy);
            setFilterCriterion(fc);
        }, [dataProvider, matchBy]);
        const { itemRenderer } = props;
        const preactItemRenderer = (0, hooks_1.useMemo)(() => {
            if (!itemRenderer)
                return undefined;
            return ({ data, metadata, searchText }) => {
                return itemRenderer?.({
                    item: { data, metadata },
                    searchText
                });
            };
        }, [itemRenderer]);
        return {
            preactInlineSelectSingleProps: {
                'aria-describedby': props['aria-describedby'],
                assistiveText: assistiveTextProps.assistiveText,
                data: dataState.status !== 'error' ? dataState.data : null,
                hasBackIcon: props.backIcon,
                hasClearIcon: props.clearIcon === 'conditional' ? 'conditionally' : props.clearIcon,
                helpSourceLink: assistiveTextProps.helpSourceLink,
                helpSourceText: assistiveTextProps.helpSourceText,
                isLoading,
                itemRenderer: preactItemRenderer,
                itemText: props.itemText,
                label: props.labelHint,
                onBackIconAction: props.onBackIconAction,
                onCommit,
                onFilter,
                onLoadRange,
                placeholder: props.placeholder,
                ref: preactRef,
                testId: undefined,
                textAlign: props.textAlign,
                userAssistancePosition: props.userAssistancePosition,
                valueItem: (0, index_1.treatNull)(preactValueItem),
                virtualKeyboard: props.virtualKeyboard
            }
        };
    }
});

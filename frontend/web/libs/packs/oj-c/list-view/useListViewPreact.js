/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "preact/hooks", "../utils/PRIVATE_keyUtils/keySetUtils", "../hooks/UNSAFE_useListData/useListData", "./useHandleRemoveCurrentKey", "./useCurrentItemOverride", "ojs/ojlogger", "../utils/PRIVATE_collectionUtils/collectionUtils"], function (require, exports, hooks_1, keySetUtils_1, useListData_1, useHandleRemoveCurrentKey_1, useCurrentItemOverride_1, Logger, collectionUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useListViewPreact = void 0;
    // we don't want to spread all props, so we need to explicitly include the props we plan to pass-through
    const useListViewPreact = ({ 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, data: propData, gridlines, currentItemOverride, onCurrentItemChanged, selectionMode, selected, scrollPolicyOptions, onSelectedChanged, onOjItemAction, onOjFirstSelectedItem, reorderable, onOjReorder, item, skeletonTemplate }, addBusyState, isClickthroughDisabled) => {
        const currentPromiseRef = (0, hooks_1.useRef)();
        const resolveBusyState = (0, hooks_1.useRef)();
        const [listDataState, onLoadRange] = (0, useListData_1.useListData)(propData, {
            fetchSize: scrollPolicyOptions?.fetchSize
        });
        const listData = listDataState.status !== 'error' ? listDataState.data : null;
        const { preactCurrentItemOverride, updateCurrentItemOverride } = (0, useCurrentItemOverride_1.useCurrentItemOverride)(currentItemOverride);
        const firstSelectedItemRef = (0, hooks_1.useRef)();
        const selectedKeys = (0, collectionUtils_1.getSelectedKeys)(selected, listData, selectionMode, onSelectedChanged);
        // set and resolve busy state based on listDataState
        (0, hooks_1.useEffect)(() => {
            if (listDataState.status === 'loading') {
                resolveBusyState.current = addBusyState('list data is in fetch state');
            }
            else {
                if (resolveBusyState.current) {
                    resolveBusyState.current();
                    resolveBusyState.current = undefined;
                }
            }
        }, [listDataState.status, addBusyState]);
        // when the component is unmount, we should clear busy state also
        (0, hooks_1.useEffect)(() => {
            return () => {
                if (resolveBusyState.current) {
                    resolveBusyState.current();
                    resolveBusyState.current = undefined;
                }
            };
        }, []);
        const handleOnOjFirstSelectedItem = (0, hooks_1.useCallback)((data) => {
            if (selected && onOjFirstSelectedItem && propData) {
                const selectedKeys = (0, keySetUtils_1.keySetToKeys)(selected);
                if (!(0, keySetUtils_1.isEmpty)(selectedKeys)) {
                    const firstSelectedKey = (0, keySetUtils_1.getFirstKey)(selectedKeys, data);
                    const firstSelectedItem = data.find((listItem) => firstSelectedKey === listItem.metadata.key);
                    if (firstSelectedItem) {
                        const data = firstSelectedItem.data;
                        if (firstSelectedItemRef.current === undefined ||
                            data !== firstSelectedItemRef.current.data) {
                            const detail = { key: firstSelectedKey, data };
                            firstSelectedItemRef.current = { ...detail };
                            onOjFirstSelectedItem(detail);
                        }
                    }
                    else {
                        const initialPromise = propData.fetchByKeys({
                            keys: new Set([firstSelectedKey])
                        });
                        currentPromiseRef.current = initialPromise;
                        initialPromise.then((value) => {
                            if (initialPromise === currentPromiseRef.current) {
                                const item = value.results.get(firstSelectedKey);
                                if (item === undefined) {
                                    Logger.warn(`Item with '${firstSelectedKey}' key couldn't be found `);
                                }
                                else {
                                    const detail = { key: firstSelectedKey, data: item.data };
                                    firstSelectedItemRef.current = { ...detail };
                                    onOjFirstSelectedItem(detail);
                                }
                            }
                        });
                    }
                }
            }
        }, [selected, onOjFirstSelectedItem, propData, listData]);
        (0, hooks_1.useEffect)(() => {
            if (selectionMode === 'singleRequired' && listData && listData.data.length > 0) {
                handleOnOjFirstSelectedItem(listData.data);
            }
        }, [selectionMode, listData, handleOnOjFirstSelectedItem]);
        const handleOnSelectionChange = (detail) => {
            (0, collectionUtils_1.handleOnSelectionChanged)(selectionMode, detail, onSelectedChanged, isClickthroughDisabled);
        };
        (0, hooks_1.useEffect)(() => {
            const _listener = (event) => {
                if (onOjFirstSelectedItem && event.detail.update && firstSelectedItemRef.current) {
                    const detail = event.detail.update;
                    const index = Array.from(detail.keys).indexOf(firstSelectedItemRef.current.key);
                    if (index > -1 && detail.data && index < detail.data.length) {
                        const newData = detail.data[index];
                        if (firstSelectedItemRef.current.data !== newData) {
                            firstSelectedItemRef.current.data = newData;
                            const detail = { ...firstSelectedItemRef.current };
                            onOjFirstSelectedItem(detail);
                        }
                    }
                }
            };
            if (propData) {
                propData.addEventListener('mutate', _listener);
            }
            return () => {
                if (propData) {
                    propData.removeEventListener('mutate', _listener);
                }
            };
        }, [propData, onOjFirstSelectedItem]);
        // find out whether the current key was there before in prev render
        // and adjust current key as needed. This should be run before other
        // useEffect(s) that could also alter current key.
        const dataState = listDataState.status === 'error' ? null : listDataState.data;
        const { notifyCurrentKeyChanged } = (0, useHandleRemoveCurrentKey_1.useHandleRemoveCurrentKey)(dataState, updateCurrentItemOverride);
        const preactOnPersistCurrentItem = (detail) => {
            onCurrentItemChanged?.(detail.value);
            notifyCurrentKeyChanged(detail);
        };
        const viewportConfig = scrollPolicyOptions?.scroller
            ? {
                scroller: () => {
                    if (scrollPolicyOptions.scroller) {
                        return document.querySelector(scrollPolicyOptions.scroller);
                    }
                    return null;
                }
            }
            : undefined;
        const suggestions = (0, hooks_1.useMemo)(() => getSuggestionsInfo(listDataState), [listDataState]);
        const getRowKey = (data) => {
            return data.metadata.key;
        };
        const onLoadMore = (0, hooks_1.useCallback)(() => {
            if (listData) {
                const fetchSize = scrollPolicyOptions && scrollPolicyOptions.fetchSize ? scrollPolicyOptions.fetchSize : 25;
                onLoadRange({ offset: 0, count: listData.data.length + fetchSize });
            }
        }, [scrollPolicyOptions, onLoadRange, listData]);
        return {
            status: listDataState.status,
            listViewProps: {
                'aria-label': ariaLabel,
                'aria-labelledby': ariaLabelledBy,
                'aria-describedby': ariaDescribedBy,
                data: listData ? listData.data : null,
                currentItemOverride: preactCurrentItemOverride,
                getRowKey,
                gridlines,
                onPersistCurrentItem: preactOnPersistCurrentItem,
                hasMore: listData ? listData.sizePrecision === 'atLeast' : false,
                onLoadMore,
                onSelectionChange: handleOnSelectionChange,
                selectedKeys,
                selectionMode: selectionMode === 'singleRequired' ? 'single' : selectionMode,
                promotedSection: suggestions,
                // in preact layer, the data is a type of Item in ItemActionDetail
                onItemAction: (detail) => {
                    const item = detail.context.data;
                    const itemActionDetail = { context: { item, data: item.data } };
                    onOjItemAction &&
                        !isClickthroughDisabled(detail.target) &&
                        onOjItemAction(itemActionDetail);
                },
                onReorder: reorderable?.items === 'enabled'
                    ? (detail) => {
                        onOjReorder && onOjReorder(detail);
                    }
                    : null,
                viewportConfig,
                itemPadding: item?.padding,
                itemEnterKeyFocusBehavior: item?.enterKeyFocusBehavior,
                skeletonRenderer: skeletonTemplate
            }
        };
    };
    exports.useListViewPreact = useListViewPreact;
    function getSuggestionsInfo(listDataState) {
        if (listDataState.status !== 'success') {
            return { count: 0 };
        }
        const data = listDataState.data.data;
        let count = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].metadata.suggestion == null) {
                break;
            }
            count += 1;
        }
        return { count };
    }
});

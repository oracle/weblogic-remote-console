/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "preact/hooks", "../hooks/UNSAFE_useListData/useListData", "../utils/PRIVATE_collectionUtils/collectionUtils"], function (require, exports, hooks_1, useListData_1, collectionUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useCardViewPreact = void 0;
    const useCardViewPreact = ({ 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, data: propData, gutterSize, focusBehavior, selected, onSelectedChanged, scrollPolicyOptions, selectionMode, initialAnimation, columns: corePackColumns, reorderable, onOjReorder, onCurrentItemChanged, skeletonTemplate }, isClickthroughDisabled, busyStateContext) => {
        const [listDataState, onLoadRange] = (0, useListData_1.useListData)(propData, {
            fetchSize: scrollPolicyOptions?.fetchSize
        });
        const resolveBusyState = (0, hooks_1.useRef)();
        const listData = listDataState.status !== 'error' ? listDataState.data : null;
        // set and resolve busy state based on listDataState
        (0, hooks_1.useEffect)(() => {
            if (listDataState.status === 'loading') {
                resolveBusyState.current = busyStateContext.addBusyState('list data is in fetch state');
            }
            else {
                if (resolveBusyState.current) {
                    resolveBusyState.current();
                    resolveBusyState.current = undefined;
                }
            }
        }, [listDataState.status, busyStateContext]);
        // when the component is unmount, we should clear busy state also
        (0, hooks_1.useEffect)(() => {
            return () => {
                if (resolveBusyState.current) {
                    resolveBusyState.current();
                    resolveBusyState.current = undefined;
                }
            };
        }, []);
        // in core pack side, columns could be a number or 'auto' or undefined
        // in preact side, columns could only be number or undefined
        const numberCorepackColumns = Number(corePackColumns);
        const preactColumns = Number.isInteger(numberCorepackColumns) ? numberCorepackColumns : undefined;
        const selectedKeys = (0, collectionUtils_1.getSelectedKeys)(selected, listData, selectionMode, onSelectedChanged);
        const handleOnSelectionChange = (detail) => {
            (0, collectionUtils_1.handleOnSelectionChanged)(selectionMode, detail, onSelectedChanged, isClickthroughDisabled);
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
        const getRowKey = (data) => {
            return data.metadata.key;
        };
        const onLoadMore = (0, hooks_1.useCallback)(() => {
            if (listData) {
                const fetchSize = scrollPolicyOptions && scrollPolicyOptions.fetchSize ? scrollPolicyOptions.fetchSize : 25;
                onLoadRange({ offset: 0, count: listData.data.length + fetchSize });
            }
        }, [listDataState, scrollPolicyOptions, onLoadRange]);
        const handleOnCurrentItemChanged = (detail) => {
            onCurrentItemChanged?.(detail.value);
        };
        return {
            status: listDataState.status,
            cardViewProps: {
                'aria-label': ariaLabel,
                'aria-labelledby': ariaLabelledBy,
                'aria-describedby': ariaDescribedBy,
                data: listData ? listData.data : null,
                getRowKey,
                gutterSize,
                hasMore: listData ? listData.sizePrecision === 'atLeast' : false,
                onLoadMore,
                focusBehavior,
                onSelectionChange: handleOnSelectionChange,
                selectedKeys,
                selectionMode: selectionMode === 'singleRequired' ? 'single' : selectionMode,
                initialAnimation,
                columns: preactColumns,
                // in preact layer, the data is a type of Item in ItemActionDetail
                viewportConfig,
                onReorder: reorderable?.items === 'enabled'
                    ? (detail) => {
                        onOjReorder && onOjReorder(detail);
                    }
                    : null,
                onPersistCurrentItem: handleOnCurrentItemChanged,
                skeletonRenderer: skeletonTemplate
            }
        };
    };
    exports.useCardViewPreact = useCardViewPreact;
});

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "../PRIVATE_keyUtils/keySetUtils"], function (require, exports, keySetUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.handleOnSelectionChanged = exports.getSelectedKeys = void 0;
    /**
     * A helper function to get the selectedKeys to use when selection mode is singleRequired
     */
    const getSelectedKeys = (selected, listData, selectionMode, onSelectedChanged) => {
        const numOfSelectedItems = !selected?.keys?.all
            ? selected?.keys.keys?.size
            : listData?.data.length;
        let selectedKeys;
        if (listData &&
            listData.data.length > 0 &&
            selectionMode === 'singleRequired' &&
            numOfSelectedItems === 0) {
            selectedKeys = { all: false, keys: new Set([listData.data[0].metadata.key]) };
            onSelectedChanged && onSelectedChanged((0, keySetUtils_1.keysToKeySet)(selectedKeys));
        }
        else {
            selectedKeys = (0, keySetUtils_1.keySetToKeys)(selected);
        }
        return selectedKeys;
    };
    exports.getSelectedKeys = getSelectedKeys;
    const handleOnSelectionChanged = (selectionMode, detail, onSelectedChanged, isClickthroughDisabled) => {
        if (selectionMode !== 'singleRequired' || detail.value.keys?.size !== 0) {
            onSelectedChanged &&
                !isClickthroughDisabled(detail.target) &&
                onSelectedChanged((0, keySetUtils_1.keysToKeySet)(detail.value));
        }
    };
    exports.handleOnSelectionChanged = handleOnSelectionChanged;
});

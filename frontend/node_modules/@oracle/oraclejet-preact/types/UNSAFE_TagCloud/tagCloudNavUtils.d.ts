/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ItemActionDetail, ItemFocusDetail, ItemHoverDetail, ItemInfo, TagCloudItemData } from './tagCloud.type';
export declare function getItemPadding(height: number | undefined): number;
/**
 * Returns utils functions for navigation in a tag cloud.
 * @param items
 * @returns
 */
export declare function getTagCloudNavUtils<K, D extends TagCloudItemData<K>>(items: D[]): {
    getItem: (itemInfo: ItemInfo) => D;
    getDetailFromInfo: (itemInfo?: ItemInfo) => ItemFocusDetail<K, D> | ItemHoverDetail<K, D> | ItemActionDetail<K, D>;
    getPrevItemInfo: (itemInfo: ItemInfo) => {
        idx: number;
        id: K;
    };
    getNextItemInfo: (itemInfo: ItemInfo) => {
        idx: number;
        id: K;
    };
};

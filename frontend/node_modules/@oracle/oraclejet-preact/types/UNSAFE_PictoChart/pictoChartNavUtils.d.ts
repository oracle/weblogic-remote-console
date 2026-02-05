/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { ItemHoverDetail, ItemFocusDetail, ItemInfo, PictoChartItemData } from './pictoChart.type';
/**
 * Returns utils functions for navigation in a picto chart.
 * @param items
 * @returns
 */
export declare function getPictoChartNavUtils<K, D extends PictoChartItemData<K>>(items: D[]): {
    getItem: (itemInfo: ItemInfo) => D;
    getDetailFromInfo: (itemInfo?: ItemInfo) => ItemHoverDetail<K, D> | ItemFocusDetail<K, D>;
    getPrevItemInfo: (itemInfo: ItemInfo) => {
        idx: number;
    };
    getNextItemInfo: (itemInfo: ItemInfo) => {
        idx: number;
    };
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { TagCloudItemData, TagCloudProps } from './tagCloud.type';
type TagCloudWithDimensionsProps<K, D> = Omit<TagCloudProps<K, D>, 'width' | 'height'> & {
    width: number;
    height: number;
};
export declare function TagCloudWithDimensions<K extends string | number, D extends TagCloudItemData<K>>({ selectionMode, layout, width, height, items, onItemAction, onItemHover, onItemFocus, testId, contextMenuConfig, ...props }: TagCloudWithDimensionsProps<K, D>): import("preact").JSX.Element;
export {};

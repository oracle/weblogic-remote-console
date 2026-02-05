/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { TagCloudItemData, TagCloudProps } from './tagCloud.type';
/**
 * Tag clouds are used to display text data with the importance of each tag shown with font size and/or color.
 */
export declare function TagCloud<K extends string | number, D extends TagCloudItemData<K>>({ height, width, ...props }: TagCloudProps<K, D>): import("preact").JSX.Element;

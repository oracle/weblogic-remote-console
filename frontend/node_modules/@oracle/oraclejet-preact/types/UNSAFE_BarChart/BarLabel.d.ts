/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Dimension } from "../utils/UNSAFE_visTypes/common";
import { Font } from "../hooks/PRIVATE_useTextDimensions";
import { BarItemData } from './barChart.types';
import { VNode } from 'preact';
type Props<K> = {
    item: BarItemData<K>;
    seriesColor?: string;
    isStacked: boolean;
    defaultFontSize: string;
    isHoriz: boolean;
    barDim: Dimension;
    getTextDimensions?: (text: string, style: Font) => Dimension;
    isRtl: boolean;
};
export declare function BarLabel<K>({ item, seriesColor, isStacked, defaultFontSize, barDim, isRtl, isHoriz, getTextDimensions }: Props<K>): VNode<{}> | null;
export {};

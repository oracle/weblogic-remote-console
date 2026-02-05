/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Property } from 'csstype';
type Props = {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    isInner: boolean;
    textAlign: 'left' | 'center' | 'right';
    labelStyle?: {
        color?: Property.Color;
        fontFamily?: Property.FontFamily;
        fontSize?: Property.FontSize;
        fontStyle?: Property.FontStyle;
        fontWeight?: Property.FontWeight;
        textDecoration?: Property.TextDecoration;
    };
};
export declare function GanttTaskLabel({ x, y, width, height, label, isInner, textAlign, labelStyle }: Props): import("preact").JSX.Element;
export {};

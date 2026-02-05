/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
type LayoutWidths = 'equal' | 'auto';
type WidthStyling = {
    style?: Styling;
};
type Styling = {
    width?: string;
    maxWidth?: string;
};
export declare function widthStyle(layoutWidth?: LayoutWidths, width?: Size, maxWidth?: Size): WidthStyling;
export {};

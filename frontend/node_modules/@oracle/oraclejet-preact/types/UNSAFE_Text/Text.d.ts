/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
type StylePropsWithOutTruncate = {
    /**
     * Specifies text color. If set as "inherit", takes text color from its parent element.
     */
    variant?: 'primary' | 'secondary' | 'disabled' | 'danger' | 'warning' | 'success' | 'inherit';
    /**
     * Specifies font size and line height. If set as "inherit", takes font size and line height from its parent element.
     */
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'inherit';
    /**
     * Specifies the font weight. If set as "inherit", takes font weight from its parent element.
     */
    weight?: 'normal' | 'semiBold' | 'bold' | 'inherit';
    /**
     * Specifies the overflow-wrap.
     */
    overflowWrap?: 'normal' | 'breakWord' | 'anywhere';
    /**
     * Specifies if hyphens should be included when handling long words with no spaces.
     */
    hyphens?: 'auto' | 'none';
};
type TruncateProps = {
    /**
     * Truncates text at a specific number of lines and then displays an ellipsis (…) at the end of the last line. Parent of the element needs to have a specific width so text starts overflowing and produce a truncation.
     */
    lineClamp?: number;
    /**
     * Determines text behavior when text is truncated. Be aware of setting either lineClamp or truncation. Setting both props would produce a type error. In most cases, lineClamp=1 tries to put the ellipsis at the end of a "word". On the other hand, using truncation="ellipsis" will show as much as possible text, then put the ellipsis at the end.
     */
    truncation?: never;
} | {
    lineClamp?: never;
    truncation?: 'none' | 'clip' | 'ellipsis';
};
type AdditionalProps = {
    /**
     * Specifies the text id
     */
    id?: string;
    /**
     * Specifies the children.
     */
    children?: ComponentChildren;
};
type Props = StylePropsWithOutTruncate & TruncateProps & AdditionalProps;
/**
 * Text shows written or printed work.
 */
export declare function Text({ children, hyphens, size, truncation, variant, weight, overflowWrap, ...props }: Props): import("preact").JSX.Element;
export {};

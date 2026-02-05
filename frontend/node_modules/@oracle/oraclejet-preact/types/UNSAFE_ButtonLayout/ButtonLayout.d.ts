/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
type ButtonLayoutProps = {
    /**
     * Specifies the children.
     */
    children: ComponentChildren;
    /**
     * Specifies the spacing bewteen content.
     * 'sm' spacing is recommended for button variants that don't have a background or border, for example borderless buttons.
     * 'lg' spacing is recommended for button variants that have a background or border, for example outlined or solid buttons.
     */
    spacing?: 'sm' | 'lg';
};
/**
 * Button layout lays out a set of controls, such as buttons and menu buttons.
 */
export declare const ButtonLayout: ({ children, spacing }: ButtonLayoutProps) => import("preact").JSX.Element;
export {};

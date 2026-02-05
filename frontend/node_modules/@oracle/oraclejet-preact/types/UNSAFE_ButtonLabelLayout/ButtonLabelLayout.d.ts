/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren, ComponentProps } from 'preact';
import { BaseButton } from '../UNSAFE_BaseButton';
export type ButtonDisplay = 'icons' | 'label' | 'all';
export type LayoutSizes = ComponentProps<typeof BaseButton>['size'] | 'embeddedxs' | 'embeddedsm' | 'embeddedmd' | 'embeddedlg';
export type Props = {
    /**
     *The default slot is the button's text label. The oj-c-button element accepts plain text or DOM nodes as children for the default slot."
     */
    children?: ComponentChildren;
    /**
     *The suffix is appended to the text label, used for menu buttons.
     */
    suffix?: string;
    /**
     * The startIcon is the button's start icon.
     */
    startIcon?: ComponentChildren;
    /**
     * The endIcon is the button's end icon.
     */
    endIcon?: ComponentChildren;
    /**
     * Styling can be used for customizing icon layout by limiting padding ("embedded")
     * The label can fill available width ("fill").
     */
    styling?: 'default' | 'embedded' | 'fill';
    /**
     * The size indicates how large the button is rendered.
     */
    size?: ComponentProps<typeof BaseButton>['size'];
    /**
     * Display indicates whether the label, the icons, or all elements should be rendered by the button.
     */
    display?: ButtonDisplay;
};
export declare function ButtonLabelLayout({ size, display, styling, ...props }: Props): import("preact").JSX.Element;
export declare namespace ButtonLabelLayout {
    var displayName: string;
}

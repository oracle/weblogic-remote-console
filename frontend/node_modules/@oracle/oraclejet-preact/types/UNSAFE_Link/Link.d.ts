/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import { TestIdProps } from '../hooks/UNSAFE_useTestId';
type Props = {
    /**
     * Sets the URL that the hyperlink points to.
     */
    href: string;
    /**
     * Sets the variant. The default value of this property is theme driven.
     */
    variant?: 'standard' | 'primary' | 'secondary';
    /**
     * Sets the placement.
     */
    placement?: 'standalone' | 'embedded';
    /**
     * Sets the target.
     */
    target?: string;
    /**
     * Specifies id for element (or elements) that describes the object.
     */
    'aria-describedby'?: string;
    /**
     * A label to be used for accessibility purposes.
     */
    'aria-label'?: string;
    /**
     * One or more ids (separated by spaces) of elements that label the Link.
     */
    'aria-labelledby'?: string;
    /**
     * Triggered when a link is clicked, whether by keyboard, mouse, or touch events.
     */
    onClick?: (event: Event) => void;
    /**
     * Specifies the children
     */
    children?: ComponentChildren;
    /**
     * Specifies that the link element should be disabled.
     */
    isDisabled?: boolean;
} & TestIdProps;
/**
 * Link component creates a hyperlink.
 */
export declare function Link({ href, variant, placement, target, testId, 'aria-describedby': ariaDescribedBy, 'aria-label': accessibleLabel, 'aria-labelledby': ariaLabelledBy, children, onClick, isDisabled }: Props): import("preact").JSX.Element;
export {};

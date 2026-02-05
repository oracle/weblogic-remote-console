/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
type AvatarProps = {
    /**
     * Specifies the source for the image of the avatar.  Will only be displayed if no icon component is specified as a child.  Image will be rendered as a
     * background image.
     */
    src?: string;
    /**
     * Specifies the initials of the avatar.  Will only be displayed if both the src attribute and the child icon component are not specified.
     */
    initials?: string;
    /**
     * Specifies the background of the avatar. The default value of this property is theme driven.
     */
    background?: 'neutral' | 'orange' | 'green' | 'teal' | 'blue' | 'slate' | 'pink' | 'purple' | 'lilac' | 'gray';
    /**
     * Specifies the size of the avatar. The default value of this property is theme driven.
     */
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    /**
     * Specifies the shape of the avatar. Can be square or circle.  The default value of this
     * property varies by theme.
     */
    shape?: 'square' | 'circle';
    /**
     * Aria-label does not need to be set if associated information is available to assistive technologies elsewhere on the page,
     * for example if a person's name is shown next to the avatar.
     * Otherwise aria-label must be set to make the page accessible.
     *
     *  If aria-label is set, role will internally be set to 'img'.
     */
    'aria-label'?: string;
    /**
     * Specifies the Avatar content.
     */
    children?: ComponentChildren;
};
/**
 * An avatar represents a person or entity as initials or an image.
 */
export declare function Avatar({ children, src, ...otherProps }: AvatarProps): import("preact").JSX.Element;
export {};

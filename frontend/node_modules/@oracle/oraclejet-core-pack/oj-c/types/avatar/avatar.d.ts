/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Avatar as PreactAvatar } from '@oracle/oraclejet-preact/UNSAFE_Avatar';
import { ComponentProps } from 'preact';
import { ObservedGlobalProps } from 'ojs/ojvcomponent';
import 'css!oj-c/avatar/avatar-styles.css';
type PreactAvatarProps = ComponentProps<typeof PreactAvatar>;
/**
 * This export corresponds to the Avatar Preact component. For the oj-c-avatar custom element, import CAvatarElement instead.
 */
export declare const Avatar: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<ObservedGlobalProps<"aria-label"> & {
    /**
     * @ojmetadata description "Specifies the background of the avatar."
     * @ojmetadata displayName "Background"
     * @ojmetadata help "#background"
     * @ojmetadata propertyEditorValues {
     *     "neutral": {
     *       "description": "Neutral background (default, if unspecified)",
     *       "displayName": "Neutral"
     *     },
     *     "orange": {
     *       "description": "Orange background",
     *       "displayName": "Orange"
     *     },
     *     "green": {
     *       "description": "Green background",
     *       "displayName": "Green"
     *     },
     *     "teal": {
     *       "description": "Teal background",
     *       "displayName": "Teal"
     *     },
     *    "blue": {
     *       "description": "Blue background",
     *       "displayName": "Blue"
     *     },
     *    "slate": {
     *       "description": "Slate background",
     *       "displayName": "Slate"
     *     },
     *     "pink": {
     *       "description": "Pink background",
     *       "displayName": "Pink"
     *     },
     *     "purple": {
     *       "description": "Purple background",
     *       "displayName": "Purple"
     *     },
     *    "lilac": {
     *       "description": "Lilac background",
     *       "displayName": "Lilac"
     *     },
     *    "gray": {
     *       "description": "Gray background",
     *       "displayName": "Gray"
     *     }
     *   }
     */
    background?: PreactAvatarProps["background"];
    /**
     * @description
     *  Specifies the initials of the avatar.  Initials will not be displayed if src or iconClass attributes are specified.
     *  <a href="oj.IntlConverterUtils.html#.getInitials">IntlConverterUtils.getInitials</a> can be used
     *  to generate initials from first and last names in a locale-specific manner.
     *
     * @ojmetadata description "Specifies the initials of the avatar."
     * @ojmetadata displayName "Initials"
     * @ojmetadata help "#initials"
     * @ojmetadata translatable
     */
    initials?: string | null;
    /**
     * @ojmetadata description "Specifies the size of the avatar."
     * @ojmetadata displayName "Size"
     * @ojmetadata help "#size"
     * @ojmetadata propertyEditorValues {
     *     "2xs": {
     *       "description": "extra, extra small avatar",
     *       "displayName": "Extra Extra Small"
     *     },
     *     "xs": {
     *       "description": "extra small avatar",
     *       "displayName": "Extra Small"
     *     },
     *     "sm": {
     *       "description": "small avatar",
     *       "displayName": "Small"
     *     },
     *     "md": {
     *       "description": "medium avatar (default, if unspecified)",
     *       "displayName": "Medium"
     *     },
     *     "lg": {
     *       "description": "large avatar",
     *       "displayName": "Large"
     *     },
     *     "xl": {
     *       "description": "extra large avatar",
     *       "displayName": "Extra Large"
     *     },
     *    "2xl": {
     *       "description": "extra, extra large avatar",
     *       "displayName": "Extra Extra Large"
     *     }
     *   }
     */
    size?: PreactAvatarProps["size"];
    /**
     * @description
     * Specifies the src for the image of the avatar.  Image will be rendered as a background image.  Src will have
     * precedence over initials, but not icon.
     *
     * @ojmetadata description "Specifies the source for the image of the avatar."
     * @ojmetadata displayName "Src"
     * @ojmetadata help "#src"
     */
    src?: string | null;
    /**
     * @description
     * Specifies the icon class to be displayed.  IconClass will have precedence over src and initials.
     *
     * @ojmetadata description "The icon class to be displayed."
     * @ojmetadata displayName "Icon Class"
     * @ojmetadata help "#iconClass"
     */
    iconClass?: string;
    /**
     * @description
     * Specifies the shape of the avatar. Can be square or circle.The default value of this property varies by theme.
     *
     * @ojmetadata description "Specifies the shape of the avatar."
     * @ojmetadata displayName "Shape"
     * @ojmetadata help "#shape"
     * @ojmetadata propertyEditorValues {
     *     "square": {
     *       "description": "square avatar (default, if unspecified)",
     *       "displayName": "Square Avatar"
     *     },
     *     "circle": {
     *       "description": "circular avatar",
     *       "displayName": "Circular Avatar"
     *     }
     *   }
     */
    shape?: PreactAvatarProps["shape"];
}>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-avatar custom element. For the Avatar Preact component, import Avatar instead.
 */
export interface CAvatarElement extends JetElement<CAvatarElementSettableProperties>, CAvatarElementSettableProperties {
    addEventListener<T extends keyof CAvatarElementEventMap>(type: T, listener: (this: HTMLElement, ev: CAvatarElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CAvatarElementSettableProperties>(property: T): CAvatarElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CAvatarElementSettableProperties>(property: T, value: CAvatarElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CAvatarElementSettableProperties>): void;
    setProperties(properties: CAvatarElementSettablePropertiesLenient): void;
}
export namespace CAvatarElement {
    type backgroundChanged = JetElementCustomEventStrict<CAvatarElement['background']>;
    type iconClassChanged = JetElementCustomEventStrict<CAvatarElement['iconClass']>;
    type initialsChanged = JetElementCustomEventStrict<CAvatarElement['initials']>;
    type shapeChanged = JetElementCustomEventStrict<CAvatarElement['shape']>;
    type sizeChanged = JetElementCustomEventStrict<CAvatarElement['size']>;
    type srcChanged = JetElementCustomEventStrict<CAvatarElement['src']>;
}
export interface CAvatarElementEventMap extends HTMLElementEventMap {
    'backgroundChanged': JetElementCustomEventStrict<CAvatarElement['background']>;
    'iconClassChanged': JetElementCustomEventStrict<CAvatarElement['iconClass']>;
    'initialsChanged': JetElementCustomEventStrict<CAvatarElement['initials']>;
    'shapeChanged': JetElementCustomEventStrict<CAvatarElement['shape']>;
    'sizeChanged': JetElementCustomEventStrict<CAvatarElement['size']>;
    'srcChanged': JetElementCustomEventStrict<CAvatarElement['src']>;
}
export interface CAvatarElementSettableProperties extends JetSettableProperties {
    background?: ComponentProps<typeof Avatar>['background'];
    /**
     * Specifies the icon class to be displayed.  IconClass will have precedence over src and initials.
     */
    iconClass?: ComponentProps<typeof Avatar>['iconClass'];
    /**
     *  Specifies the initials of the avatar.  Initials will not be displayed if src or iconClass attributes are specified.
     *  <a href="oj.IntlConverterUtils.html#.getInitials">IntlConverterUtils.getInitials</a> can be used
     *  to generate initials from first and last names in a locale-specific manner.
     */
    initials?: ComponentProps<typeof Avatar>['initials'];
    /**
     * Specifies the shape of the avatar. Can be square or circle.The default value of this property varies by theme.
     */
    shape?: ComponentProps<typeof Avatar>['shape'];
    size?: ComponentProps<typeof Avatar>['size'];
    /**
     * Specifies the src for the image of the avatar.  Image will be rendered as a background image.  Src will have
     * precedence over initials, but not icon.
     */
    src?: ComponentProps<typeof Avatar>['src'];
}
export interface CAvatarElementSettablePropertiesLenient extends Partial<CAvatarElementSettableProperties> {
    [key: string]: any;
}
export interface AvatarIntrinsicProps extends Partial<Readonly<CAvatarElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onbackgroundChanged?: (value: CAvatarElementEventMap['backgroundChanged']) => void;
    oniconClassChanged?: (value: CAvatarElementEventMap['iconClassChanged']) => void;
    oninitialsChanged?: (value: CAvatarElementEventMap['initialsChanged']) => void;
    onshapeChanged?: (value: CAvatarElementEventMap['shapeChanged']) => void;
    onsizeChanged?: (value: CAvatarElementEventMap['sizeChanged']) => void;
    onsrcChanged?: (value: CAvatarElementEventMap['srcChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-avatar': AvatarIntrinsicProps;
        }
    }
}

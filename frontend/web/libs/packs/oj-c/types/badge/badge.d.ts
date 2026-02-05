import { ComponentProps } from 'preact';
import 'css!oj-c/badge/badge-styles.css';
import { Badge as PreactBadge } from '@oracle/oraclejet-preact/UNSAFE_Badge';
type PreactBadgeProps = ComponentProps<typeof PreactBadge>;
/**
 * This export corresponds to the Badge Preact component. For the oj-c-badge custom element, import CBadgeElement instead.
 */
export declare const Badge: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<Readonly<{
    /**
     * @ojmetadata description "Sets the variant for the badge. Badge can be subtle or solid with different colors. The default value of this property is theme driven."
     * @ojmetadata displayName "Variant"
     * @ojmetadata help "#variant"
     */
    variant?: PreactBadgeProps["variant"];
    /**
     * @ojmetadata description "Specifies the size of the badge. Consists of two options: medium and small. The default value of this property is theme driven."
     * @ojmetadata displayName "Size"
     * @ojmetadata help "#size"
     */
    size?: "sm" | "md";
    /**
     * @ojmetadata description "Specifies the edge of the badge. Badges can be attached to the end edge of another component. They lose their default corner rounding on right side for ltr direction or left side for rtl direction."
     * @ojmetadata displayName "Edge"
     * @ojmetadata help "#edge"
     */
    edge?: PreactBadgeProps["edge"];
    /**
     * @ojmetadata description "Specifies the text to be displayed in the badge.
     * @ojmetadata displayName "Label"
     * @ojmetadata help "#label"
     */
    label: string;
}>>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-badge custom element. For the Badge Preact component, import Badge instead.
 */
export interface CBadgeElement extends JetElement<CBadgeElementSettableProperties>, CBadgeElementSettableProperties {
    addEventListener<T extends keyof CBadgeElementEventMap>(type: T, listener: (this: HTMLElement, ev: CBadgeElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CBadgeElementSettableProperties>(property: T): CBadgeElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CBadgeElementSettableProperties>(property: T, value: CBadgeElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CBadgeElementSettableProperties>): void;
    setProperties(properties: CBadgeElementSettablePropertiesLenient): void;
}
export namespace CBadgeElement {
    type edgeChanged = JetElementCustomEventStrict<CBadgeElement['edge']>;
    type labelChanged = JetElementCustomEventStrict<CBadgeElement['label']>;
    type sizeChanged = JetElementCustomEventStrict<CBadgeElement['size']>;
    type variantChanged = JetElementCustomEventStrict<CBadgeElement['variant']>;
}
export interface CBadgeElementEventMap extends HTMLElementEventMap {
    'edgeChanged': JetElementCustomEventStrict<CBadgeElement['edge']>;
    'labelChanged': JetElementCustomEventStrict<CBadgeElement['label']>;
    'sizeChanged': JetElementCustomEventStrict<CBadgeElement['size']>;
    'variantChanged': JetElementCustomEventStrict<CBadgeElement['variant']>;
}
export interface CBadgeElementSettableProperties extends JetSettableProperties {
    edge?: ComponentProps<typeof Badge>['edge'];
    label: ComponentProps<typeof Badge>['label'];
    size?: ComponentProps<typeof Badge>['size'];
    variant?: ComponentProps<typeof Badge>['variant'];
}
export interface CBadgeElementSettablePropertiesLenient extends Partial<CBadgeElementSettableProperties> {
    [key: string]: any;
}
export interface BadgeIntrinsicProps extends Partial<Readonly<CBadgeElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onedgeChanged?: (value: CBadgeElementEventMap['edgeChanged']) => void;
    onlabelChanged?: (value: CBadgeElementEventMap['labelChanged']) => void;
    onsizeChanged?: (value: CBadgeElementEventMap['sizeChanged']) => void;
    onvariantChanged?: (value: CBadgeElementEventMap['variantChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-badge': BadgeIntrinsicProps;
        }
    }
}

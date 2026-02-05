import { ComponentProps } from 'preact';
import 'css!oj-c/badge/badge-styles.css';
import { TruncatingBadge as PreactTruncatingBadge } from '@oracle/oraclejet-preact/UNSAFE_TruncatingBadge';
type PreactBadgeProps = ComponentProps<typeof PreactTruncatingBadge>;
/**
 * This export corresponds to the TruncatingBadge Preact component. For the oj-c-truncating-badge custom element, import CTruncatingBadgeElement instead.
 */
export declare const TruncatingBadge: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<Readonly<{
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
 * This export corresponds to the oj-c-truncating-badge custom element. For the TruncatingBadge Preact component, import TruncatingBadge instead.
 */
export interface CTruncatingBadgeElement extends JetElement<CTruncatingBadgeElementSettableProperties>, CTruncatingBadgeElementSettableProperties {
    addEventListener<T extends keyof CTruncatingBadgeElementEventMap>(type: T, listener: (this: HTMLElement, ev: CTruncatingBadgeElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CTruncatingBadgeElementSettableProperties>(property: T): CTruncatingBadgeElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CTruncatingBadgeElementSettableProperties>(property: T, value: CTruncatingBadgeElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CTruncatingBadgeElementSettableProperties>): void;
    setProperties(properties: CTruncatingBadgeElementSettablePropertiesLenient): void;
}
export namespace CTruncatingBadgeElement {
    type edgeChanged = JetElementCustomEventStrict<CTruncatingBadgeElement['edge']>;
    type labelChanged = JetElementCustomEventStrict<CTruncatingBadgeElement['label']>;
    type sizeChanged = JetElementCustomEventStrict<CTruncatingBadgeElement['size']>;
    type variantChanged = JetElementCustomEventStrict<CTruncatingBadgeElement['variant']>;
}
export interface CTruncatingBadgeElementEventMap extends HTMLElementEventMap {
    'edgeChanged': JetElementCustomEventStrict<CTruncatingBadgeElement['edge']>;
    'labelChanged': JetElementCustomEventStrict<CTruncatingBadgeElement['label']>;
    'sizeChanged': JetElementCustomEventStrict<CTruncatingBadgeElement['size']>;
    'variantChanged': JetElementCustomEventStrict<CTruncatingBadgeElement['variant']>;
}
export interface CTruncatingBadgeElementSettableProperties extends JetSettableProperties {
    edge?: ComponentProps<typeof TruncatingBadge>['edge'];
    label: ComponentProps<typeof TruncatingBadge>['label'];
    size?: ComponentProps<typeof TruncatingBadge>['size'];
    variant?: ComponentProps<typeof TruncatingBadge>['variant'];
}
export interface CTruncatingBadgeElementSettablePropertiesLenient extends Partial<CTruncatingBadgeElementSettableProperties> {
    [key: string]: any;
}
export interface TruncatingBadgeIntrinsicProps extends Partial<Readonly<CTruncatingBadgeElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onedgeChanged?: (value: CTruncatingBadgeElementEventMap['edgeChanged']) => void;
    onlabelChanged?: (value: CTruncatingBadgeElementEventMap['labelChanged']) => void;
    onsizeChanged?: (value: CTruncatingBadgeElementEventMap['sizeChanged']) => void;
    onvariantChanged?: (value: CTruncatingBadgeElementEventMap['variantChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-truncating-badge': TruncatingBadgeIntrinsicProps;
        }
    }
}

import { ComponentChildren } from 'preact';
import 'css!oj-c/selection-card/selection-card-styles.css';
type Props = {
    /**
     * @ojmetadata description "The default slot is the content of the card."
     * @ojmetadata displayName "Default"
     * @ojmetadata help "#default"
     * @ignore
     */
    children?: ComponentChildren;
    /**
     * @ojmetadata description "Boolean that marks this card as selected."
     * @ojmetadata displayName "Selected"
     * @ojmetadata help "#selected"
     * @ignore
     */
    selected?: boolean;
};
/**
 * This export corresponds to the SelectionCard Preact component. For the oj-c-selection-card custom element, import CSelectionCardElement instead.
 */
export declare const SelectionCard: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<Props>>;
export {};
import { ComponentProps } from 'preact';
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-selection-card custom element. For the SelectionCard Preact component, import SelectionCard instead.
 */
export interface CSelectionCardElement extends JetElement<CSelectionCardElementSettableProperties>, CSelectionCardElementSettableProperties {
    addEventListener<T extends keyof CSelectionCardElementEventMap>(type: T, listener: (this: HTMLElement, ev: CSelectionCardElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CSelectionCardElementSettableProperties>(property: T): CSelectionCardElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CSelectionCardElementSettableProperties>(property: T, value: CSelectionCardElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CSelectionCardElementSettableProperties>): void;
    setProperties(properties: CSelectionCardElementSettablePropertiesLenient): void;
}
export namespace CSelectionCardElement {
    type selectedChanged = JetElementCustomEventStrict<CSelectionCardElement['selected']>;
}
export interface CSelectionCardElementEventMap extends HTMLElementEventMap {
    'selectedChanged': JetElementCustomEventStrict<CSelectionCardElement['selected']>;
}
export interface CSelectionCardElementSettableProperties extends JetSettableProperties {
    selected?: ComponentProps<typeof SelectionCard>['selected'];
}
export interface CSelectionCardElementSettablePropertiesLenient extends Partial<CSelectionCardElementSettableProperties> {
    [key: string]: any;
}
export interface SelectionCardIntrinsicProps extends Partial<Readonly<CSelectionCardElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onselectedChanged?: (value: CSelectionCardElementEventMap['selectedChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-selection-card': SelectionCardIntrinsicProps;
        }
    }
}

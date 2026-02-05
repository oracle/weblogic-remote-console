import { ComponentProps } from 'preact';
import 'css!oj-c/truncating-text/truncating-text-styles.css';
import { TruncatingText as PreactTruncatingText } from '@oracle/oraclejet-preact/UNSAFE_TruncatingText';
type PreactTruncatingTextProps = ComponentProps<typeof PreactTruncatingText>;
type Props = {
    /**
     * @ojmetadata description "Specifies text color. If set as 'inherit', takes text color from its parent element."
     * @ojmetadata displayName "Variant"
     * @ojmetadata help "#variant"
     */
    variant?: PreactTruncatingTextProps['variant'];
    /**
     * @ojmetadata description "Specifies font size and line height. If set as 'inherit', takes font size and line height from its parent element."
     * @ojmetadata displayName "Size"
     * @ojmetadata help "#size"
     */
    size?: PreactTruncatingTextProps['size'];
    /**
     * @ojmetadata description "Specifies the font weight. If set as 'inherit', takes font weight from its parent element."
     * @ojmetadata displayName "Weight"
     * @ojmetadata help "#weight"
     */
    weight?: PreactTruncatingTextProps['weight'];
    /**
     * @ojmetadata description "Specifies the overflow-wrap."
     * @ojmetadata displayName "OverflowWrap"
     * @ojmetadata help "#overflowWrap"
     */
    overflowWrap?: PreactTruncatingTextProps['overflowWrap'];
    /**
     * @ojmetadata description "Specifies if hyphens should be included when handling long words with no spaces."
     * @ojmetadata displayName "Hyphens"
     * @ojmetadata help "#hyphens"
     */
    hyphens?: PreactTruncatingTextProps['hyphens'];
    /**
     * @ojmetadata description "Determines text behavior when text is truncated. Be aware of setting either lineClamp or truncation. Setting both props would produce a type error. In most cases, lineClamp=1 tries to put the ellipsis at the end of a "word". On the other hand, using truncation="ellipsis" will show as much as possible text, then put the ellipsis at the end."
     * @ojmetadata displayName "Truncation"
     * @ojmetadata help "#truncation"
     */
    truncation?: PreactTruncatingTextProps['truncation'];
    /**
     * @ojmetadata description "Truncates text at a specific number of lines and then displays an ellipsis (…) at the end of the last line. Parent of the element needs to have a specific width so text starts overflowing and produce a truncation."
     * @ojmetadata displayName "LineClamp"
     * @ojmetadata help "#lineClamp"
     */
    lineClamp?: PreactTruncatingTextProps['lineClamp'];
    /**
     * @ojmetadata description "Specifies the text to be displayed.
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     */
    value: string;
};
/**
 * This export corresponds to the TruncatingText Preact component. For the oj-c-truncating-text custom element, import CTruncatingTextElement instead.
 */
export declare const TruncatingText: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<Props>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-truncating-text custom element. For the TruncatingText Preact component, import TruncatingText instead.
 */
export interface CTruncatingTextElement extends JetElement<CTruncatingTextElementSettableProperties>, CTruncatingTextElementSettableProperties {
    addEventListener<T extends keyof CTruncatingTextElementEventMap>(type: T, listener: (this: HTMLElement, ev: CTruncatingTextElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CTruncatingTextElementSettableProperties>(property: T): CTruncatingTextElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CTruncatingTextElementSettableProperties>(property: T, value: CTruncatingTextElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CTruncatingTextElementSettableProperties>): void;
    setProperties(properties: CTruncatingTextElementSettablePropertiesLenient): void;
}
export namespace CTruncatingTextElement {
    type hyphensChanged = JetElementCustomEventStrict<CTruncatingTextElement['hyphens']>;
    type lineClampChanged = JetElementCustomEventStrict<CTruncatingTextElement['lineClamp']>;
    type overflowWrapChanged = JetElementCustomEventStrict<CTruncatingTextElement['overflowWrap']>;
    type sizeChanged = JetElementCustomEventStrict<CTruncatingTextElement['size']>;
    type truncationChanged = JetElementCustomEventStrict<CTruncatingTextElement['truncation']>;
    type valueChanged = JetElementCustomEventStrict<CTruncatingTextElement['value']>;
    type variantChanged = JetElementCustomEventStrict<CTruncatingTextElement['variant']>;
    type weightChanged = JetElementCustomEventStrict<CTruncatingTextElement['weight']>;
}
export interface CTruncatingTextElementEventMap extends HTMLElementEventMap {
    'hyphensChanged': JetElementCustomEventStrict<CTruncatingTextElement['hyphens']>;
    'lineClampChanged': JetElementCustomEventStrict<CTruncatingTextElement['lineClamp']>;
    'overflowWrapChanged': JetElementCustomEventStrict<CTruncatingTextElement['overflowWrap']>;
    'sizeChanged': JetElementCustomEventStrict<CTruncatingTextElement['size']>;
    'truncationChanged': JetElementCustomEventStrict<CTruncatingTextElement['truncation']>;
    'valueChanged': JetElementCustomEventStrict<CTruncatingTextElement['value']>;
    'variantChanged': JetElementCustomEventStrict<CTruncatingTextElement['variant']>;
    'weightChanged': JetElementCustomEventStrict<CTruncatingTextElement['weight']>;
}
export interface CTruncatingTextElementSettableProperties extends JetSettableProperties {
    hyphens?: ComponentProps<typeof TruncatingText>['hyphens'];
    lineClamp?: ComponentProps<typeof TruncatingText>['lineClamp'];
    overflowWrap?: ComponentProps<typeof TruncatingText>['overflowWrap'];
    size?: ComponentProps<typeof TruncatingText>['size'];
    truncation?: ComponentProps<typeof TruncatingText>['truncation'];
    value: ComponentProps<typeof TruncatingText>['value'];
    variant?: ComponentProps<typeof TruncatingText>['variant'];
    weight?: ComponentProps<typeof TruncatingText>['weight'];
}
export interface CTruncatingTextElementSettablePropertiesLenient extends Partial<CTruncatingTextElementSettableProperties> {
    [key: string]: any;
}
export interface TruncatingTextIntrinsicProps extends Partial<Readonly<CTruncatingTextElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onhyphensChanged?: (value: CTruncatingTextElementEventMap['hyphensChanged']) => void;
    onlineClampChanged?: (value: CTruncatingTextElementEventMap['lineClampChanged']) => void;
    onoverflowWrapChanged?: (value: CTruncatingTextElementEventMap['overflowWrapChanged']) => void;
    onsizeChanged?: (value: CTruncatingTextElementEventMap['sizeChanged']) => void;
    ontruncationChanged?: (value: CTruncatingTextElementEventMap['truncationChanged']) => void;
    onvalueChanged?: (value: CTruncatingTextElementEventMap['valueChanged']) => void;
    onvariantChanged?: (value: CTruncatingTextElementEventMap['variantChanged']) => void;
    onweightChanged?: (value: CTruncatingTextElementEventMap['weightChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-truncating-text': TruncatingTextIntrinsicProps;
        }
    }
}

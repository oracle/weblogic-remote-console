export declare const TagCloudItemDefaults: Partial<TagCloudItemProps>;
export type TagCloudItemProps = {
    /**
     * @description
     * An array of category strings corresponding to the tag cloud items. This allows highlighting and filtering of items.
     * @ojmetadata description "An array of category strings corresponding to the tag cloud items."
     * @ojmetadata displayName "Categories"
     * @ojmetadata help "#categories"
     */
    categories?: string[];
    /**
     * @description
     * The color of the text. Will be overridden by any color defined in the style option. The default value comes from the CSS and varies based on theme.
     * @ojmetadata description "The color of the text. Will be overridden by any color defined in the style option. The default value comes from the CSS and varies based on theme."
     * @ojmetadata displayName "Color"
     * @ojmetadata help "#color"
     */
    color?: string;
    /**
     * @description
     * The text of the item.
     * @ojmetadata description "The text of the item."
     * @ojmetadata displayName "Label"
     * @ojmetadata help "#label"
     */
    label: string;
    /**
     * @description
     * The value of this item is used to scale its font size within the tag cloud.
     * @ojmetadata description "The value of this item is used to scale its font size within the tag cloud."
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     */
    value: number | null;
    /**
     * @description
     * The url this item references.
     * @ojmetadata description "The url this item references."
     * @ojmetadata displayName "Url"
     * @ojmetadata help "#url"
     */
    url?: string;
    /**
     * @description
     * The description of the item. This is used for customizing the tooltip text.
     * @ojmetadata description "The description of the item. This is used for customizing the tooltip text."
     * @ojmetadata displayName "ShortDesc"
     * @ojmetadata help "#shortDesc"
     */
    shortDesc?: string;
};
/**
 * This export corresponds to the TagCloudItem Preact component. For the oj-c-tag-cloud-item custom element, import CTagCloudItemElement instead.
 */
export declare const TagCloudItem: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<TagCloudItemProps>>;
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-tag-cloud-item custom element. For the TagCloudItem Preact component, import TagCloudItem instead.
 */
export interface CTagCloudItemElement extends JetElement<CTagCloudItemElementSettableProperties>, CTagCloudItemElementSettableProperties {
    addEventListener<T extends keyof CTagCloudItemElementEventMap>(type: T, listener: (this: HTMLElement, ev: CTagCloudItemElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CTagCloudItemElementSettableProperties>(property: T): CTagCloudItemElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CTagCloudItemElementSettableProperties>(property: T, value: CTagCloudItemElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CTagCloudItemElementSettableProperties>): void;
    setProperties(properties: CTagCloudItemElementSettablePropertiesLenient): void;
}
export namespace CTagCloudItemElement {
    type categoriesChanged = JetElementCustomEventStrict<CTagCloudItemElement['categories']>;
    type colorChanged = JetElementCustomEventStrict<CTagCloudItemElement['color']>;
    type labelChanged = JetElementCustomEventStrict<CTagCloudItemElement['label']>;
    type shortDescChanged = JetElementCustomEventStrict<CTagCloudItemElement['shortDesc']>;
    type urlChanged = JetElementCustomEventStrict<CTagCloudItemElement['url']>;
    type valueChanged = JetElementCustomEventStrict<CTagCloudItemElement['value']>;
}
export interface CTagCloudItemElementEventMap extends HTMLElementEventMap {
    'categoriesChanged': JetElementCustomEventStrict<CTagCloudItemElement['categories']>;
    'colorChanged': JetElementCustomEventStrict<CTagCloudItemElement['color']>;
    'labelChanged': JetElementCustomEventStrict<CTagCloudItemElement['label']>;
    'shortDescChanged': JetElementCustomEventStrict<CTagCloudItemElement['shortDesc']>;
    'urlChanged': JetElementCustomEventStrict<CTagCloudItemElement['url']>;
    'valueChanged': JetElementCustomEventStrict<CTagCloudItemElement['value']>;
}
export interface CTagCloudItemElementSettableProperties extends JetSettableProperties {
    /**
     * An array of category strings corresponding to the tag cloud items. This allows highlighting and filtering of items.
     */
    categories?: TagCloudItemProps['categories'];
    /**
     * The color of the text. Will be overridden by any color defined in the style option. The default value comes from the CSS and varies based on theme.
     */
    color?: TagCloudItemProps['color'];
    /**
     * The text of the item.
     */
    label: TagCloudItemProps['label'];
    /**
     * The description of the item. This is used for customizing the tooltip text.
     */
    shortDesc?: TagCloudItemProps['shortDesc'];
    /**
     * The url this item references.
     */
    url?: TagCloudItemProps['url'];
    /**
     * The value of this item is used to scale its font size within the tag cloud.
     */
    value: TagCloudItemProps['value'];
}
export interface CTagCloudItemElementSettablePropertiesLenient extends Partial<CTagCloudItemElementSettableProperties> {
    [key: string]: any;
}
export interface TagCloudItemIntrinsicProps extends Partial<Readonly<CTagCloudItemElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncategoriesChanged?: (value: CTagCloudItemElementEventMap['categoriesChanged']) => void;
    oncolorChanged?: (value: CTagCloudItemElementEventMap['colorChanged']) => void;
    onlabelChanged?: (value: CTagCloudItemElementEventMap['labelChanged']) => void;
    onshortDescChanged?: (value: CTagCloudItemElementEventMap['shortDescChanged']) => void;
    onurlChanged?: (value: CTagCloudItemElementEventMap['urlChanged']) => void;
    onvalueChanged?: (value: CTagCloudItemElementEventMap['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-tag-cloud-item': TagCloudItemIntrinsicProps;
        }
    }
}

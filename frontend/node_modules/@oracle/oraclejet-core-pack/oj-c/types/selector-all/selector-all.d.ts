/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { SelectorAll as PreactSelectorAll } from '@oracle/oraclejet-preact/UNSAFE_SelectorAll';
import { ComponentProps, ComponentChildren } from 'preact';
import { ObservedGlobalProps, ExtendGlobalProps, PropertyChanged } from 'ojs/ojvcomponent';
import { ImmutableKeySet } from 'ojs/ojkeyset';
type PreactSelectorAllProps = ComponentProps<typeof PreactSelectorAll>;
type Props<K extends string | number> = ObservedGlobalProps<'aria-label' | 'aria-labelledby' | 'aria-describedby'> & {
    /**
     * @description
     * Specifies the selectedKeys, should be hooked into the collection component.
     *
     * @ojmetadata description "Specifies the selectedKeys, should be hooked into the collection component."
     * @ojmetadata displayName "Selected Keys"
     * @ojmetadata help "#selectedKeys"
     * @ojmetadata required
     */
    selectedKeys: ImmutableKeySet<K>;
    /**
     * @ojmetadata description "Writeback support for the selectedKeys property"
     * @ojmetadata displayName "Selected Keys Changed"
     * @ojmetadata help "#selectedKeys"
     */
    onSelectedKeysChanged?: PropertyChanged<ImmutableKeySet<K>>;
    /**
     * @ojmetadata description "Specifies whether tooltip should be shown on the SelectorAll checkbox"
     * @ojmetadata displayName "Show Tooltip"
     * @ojmetadata help "#showTooltip"
     */
    showTooltip?: PreactSelectorAllProps['showTooltip'];
};
/**
 * @classdesc
 * <h3 id="selectorAllOverview-section">
 *   JET SelectorAll
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selectorAllOverview-section"></a>
 * </h3>
 * <p>Description: A checkbox to support select all functionality in Collection Components</p>
 * <p>The oj-c-selector-all is a component that may be placed above Table, ListView. It presents as a checkbox
 * when the Collection Component is configured for select all.</p>
 * <p>Note that if the application wants to explicitly update the visual state of the component (e.g. to have
 * it checked when every item in the associated ListView is selected), it will need to update the selectedKeys
 * attribute with an AllKeySetImpl (with empty deletedKeys) to have it checked, or a KeySetImpl (with empty keys)
 * to have it unchecked. Partial state will be shown if either an AllKeySetImpl with non-empty deletedKeys or a
 * KeySetImpl with non-empty keys is specified.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div class="oj-flex oj-sm-align-items-center">
 *   &lt;oj-c-selector-all
 *     id="selectAll"
 *     selected-keys="{{selectedItems}}">
 *   &lt;/oj-c-selector-all>
 *   &lt;span>Select All</span>
 * &lt;/div>
 * &lt;oj-c-list-view
 *   id="listview"
 *   data="[[dataProvider]]"
 *   selected="{{selectedItems}}"
 *   selection-mode="multiple">
 *  &lt;template slot="itemTemplate" data-oj-as="item">
 *    &lt;oj-c-list-item-layout>
 *      &lt;oj-c-selector
 *        selected-keys="{{selectedItems}}"
 *        selection-mode="multiple"
 *        row-key="[[item.data.id]]"
 *        slot="selector">
 *      &lt;/oj-c-selector>
 *      &lt;span>
 *        &lt;oj-bind-text value="[[item.data.name]]">&lt;/oj-bind-text>
 *      &lt;/span>
 *     &lt;/oj-c-list-item-layout>
 *   &lt;/template>
 * &lt;/oj-c-list-view>
 * </code></pre>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>Application must specify a value for the aria-label attribute with a meaningful description of the purpose of this selector in order for this to be accessible.</p>
 *
 * @typeparam K Type of key
 * @ojmetadata description "The selector all component renders a checkbox in collections to support selection."
 * @ojmetadata displayName "SelectorAll"
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Collections"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/selectorAll"
 *   }
 * }
 * @ojmetadata help "oj-c.SelectorAll.html"
 * @ojmetadata since "15.0.0"
 * @ojmetadata status [
 *   {
 *     "type": "supersedes",
 *     "since": "16.0.0",
 *     "value": ["oj-selector"]
 *   }
 * ]
 */
declare const SelectorAllImpl: <K extends string | number>({ selectedKeys, onSelectedKeysChanged, showTooltip, ...otherProps }: Props<K>) => import("preact").JSX.Element;
/**
 * This export corresponds to the SelectorAll Preact component. For the oj-c-selector-all custom element, import CSelectorAllElement instead.
 */
export declare const SelectorAll: <K extends string | number = string | number>(props: ExtendGlobalProps<ComponentProps<typeof SelectorAllImpl<K>>>) => ComponentChildren;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-selector-all custom element. For the SelectorAll Preact component, import SelectorAll instead.
 */
export interface CSelectorAllElement<K extends string | number> extends JetElement<CSelectorAllElementSettableProperties<K>>, CSelectorAllElementSettableProperties<K> {
    addEventListener<T extends keyof CSelectorAllElementEventMap<K>>(type: T, listener: (this: HTMLElement, ev: CSelectorAllElementEventMap<K>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CSelectorAllElementSettableProperties<K>>(property: T): CSelectorAllElement<K>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CSelectorAllElementSettableProperties<K>>(property: T, value: CSelectorAllElementSettableProperties<K>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CSelectorAllElementSettableProperties<K>>): void;
    setProperties(properties: CSelectorAllElementSettablePropertiesLenient<K>): void;
}
export namespace CSelectorAllElement {
    type selectedKeysChanged<K extends string | number> = JetElementCustomEventStrict<CSelectorAllElement<K>['selectedKeys']>;
    type showTooltipChanged<K extends string | number> = JetElementCustomEventStrict<CSelectorAllElement<K>['showTooltip']>;
}
export interface CSelectorAllElementEventMap<K extends string | number> extends HTMLElementEventMap {
    'selectedKeysChanged': JetElementCustomEventStrict<CSelectorAllElement<K>['selectedKeys']>;
    'showTooltipChanged': JetElementCustomEventStrict<CSelectorAllElement<K>['showTooltip']>;
}
export interface CSelectorAllElementSettableProperties<K extends string | number> extends JetSettableProperties {
    /**
     * Specifies the selectedKeys, should be hooked into the collection component.
     */
    selectedKeys: Props<K>['selectedKeys'];
    showTooltip?: Props<K>['showTooltip'];
}
export interface CSelectorAllElementSettablePropertiesLenient<K extends string | number> extends Partial<CSelectorAllElementSettableProperties<K>> {
    [key: string]: any;
}
export interface SelectorAllIntrinsicProps extends Partial<Readonly<CSelectorAllElementSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onselectedKeysChanged?: (value: CSelectorAllElementEventMap<any>['selectedKeysChanged']) => void;
    onshowTooltipChanged?: (value: CSelectorAllElementEventMap<any>['showTooltipChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-selector-all': SelectorAllIntrinsicProps;
        }
    }
}

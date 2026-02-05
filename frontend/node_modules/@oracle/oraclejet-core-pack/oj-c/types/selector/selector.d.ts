/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Selector as PreactSelector } from '@oracle/oraclejet-preact/UNSAFE_Selector';
import { ComponentProps, ComponentChildren } from 'preact';
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged } from 'ojs/ojvcomponent';
import { ImmutableKeySet } from 'ojs/ojkeyset';
type PreactSelectorProps = ComponentProps<typeof PreactSelector>;
type Props<K extends string | number> = ObservedGlobalProps<'aria-label' | 'aria-labelledby' | 'aria-describedby'> & {
    /**
     * @description
     * Specifies the row key of each selector.
     * Note that if the selector is used inside one of these components:
     * <ul>
     * <li>oj-c-card-view</li>
     * <li>oj-c-list-view</li>
     * </ul>
     * Then the selector will retrieve this directly from the above component and
     * therefore this attribute should not be set.
     *
     * @ojmetadata description "Specifies the row key of each selector."
     * @ojmetadata displayName "Row Key"
     * @ojmetadata help "#rowKey"
     */
    rowKey?: K;
    /**
     * @description
     * Specifies the selectedKeys.
     * Note that if the selector is used inside one of these components:
     * <ul>
     * <li>oj-c-card-view</li>
     * <li>oj-c-list-view</li>
     * </ul>
     * Then the selector will retrieve this directly from the above component and
     * therefore this attribute should not be set.
     *
     * @ojmetadata description "Specifies the selectedKeys."
     * @ojmetadata displayName "Selected Keys"
     * @ojmetadata help "#selectedKeys"
     */
    selectedKeys?: ImmutableKeySet<K>;
    /**
     * @description
     * Note that if the selector is used inside one of these components:
     * <ul>
     * <li>oj-c-card-view</li>
     * <li>oj-c-list-view</li>
     * </ul>
     * The selector will retrieve this directly from the above component and
     * therefore this attribute should not be set.
     *
     * @ojmetadata description "Writeback support for the selectedKeys property"
     * @ojmetadata displayName "Selected Keys Changed"
     * @ojmetadata help "#selectedKeys"
     */
    onSelectedKeysChanged?: PropertyChanged<ImmutableKeySet<K>>;
    /**
     * @description
     * Specifies if the selector should show the visual partial state.
     * The original checked state of the selector will still be maintained.
     * User selection of checkboxes will remove the indeterminate state and reveal the checkbox state.
     * Otherwise, programmatically changing the checkbox state will not change the indeterminate state.
     *
     * @ojmetadata description "Visual only state to indicate partial selection"
     * @ojmetadata displayName "indeterminate"
     * @ojmetadata help "#indeterminate"
     */
    indeterminate?: PreactSelectorProps['isPartial'];
    /**
     * @description
     * Specifies the selection mode ('single', 'multiple'). For selection mode 'all', please refer to oj-c-selector-all component.
     * Note that if the selector is used inside one of these components:
     * <ul>
     * <li>oj-c-card-view</li>
     * <li>oj-c-list-view</li>
     * </ul>
     * Then the selector will retrieve this directly from the above component and
     * therefore this attribute should not be set.
     *
     * @ojmetadata description "Specifies the selection mode."
     * @ojmetadata displayName "Selection Mode"
     * @ojmetadata help "#selectionMode"
     * @ojmetadata propertyEditorValues {
     *     "multiple": {
     *       "description": "Multiple items can be selected at the same time.",
     *       "displayName": "Multiple"
     *     },
     *     "single": {
     *       "description": "Only a single item can be selected at a time.",
     *       "displayName": "Single"
     *     }
     *   }
     */
    selectionMode?: PreactSelectorProps['selectionMode'];
};
/**
 * @classdesc
 * <h3 id="selectorOverview-section">
 *   JET Selector
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selectorOverview-section"></a>
 * </h3>
 * <p>Description: A checkbox to support selection in Collection Components</p>
 * <p>The oj-c-selector is a component that may be placed within a template for Table, ListView.
 * It presents as a checkbox when the Collection Component is configured for multi-selection.
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-c-list-view
 *    id="listview"
 *    data="[[dataProvider]]"
 *    selected="{{selectedItems}}"
 *    selection-mode="[[selectedSelectionMode]]">
 *  &lt;template slot="itemTemplate" data-oj-as="item">
 *    &lt;oj-c-list-item-layout>
 *      &lt;oj-c-selector
 *        slot="selector">
 *      &lt;/oj-c-selector>
 *      &lt;span>
 *        &lt;oj-bind-text value="[[item.data.name]]">&lt;/oj-bind-text>
 *      &lt;/span>
 *    &lt;/oj-c-list-item-layout>
 *  &lt;/template>
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
 * @ojmetadata description "The selector component renders checkboxes in collections to support selection."
 * @ojmetadata displayName "Selector"
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Collections"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/selector"
 *   }
 * }
 * @ojmetadata help "oj-c.Selector.html"
 * @ojmetadata since "15.0.0"
 * @ojmetadata status [
 *   {
 *     "type": "supersedes",
 *     "since": "16.0.0",
 *     "value": ["oj-selector"]
 *   }
 * ]
 */
declare const SelectorImpl: <K extends string | number>({ rowKey, selectedKeys, indeterminate, selectionMode, onSelectedKeysChanged, ...otherProps }: Props<K>) => import("preact").JSX.Element;
/**
 * This export corresponds to the Selector Preact component. For the oj-c-selector custom element, import CSelectorElement instead.
 */
export declare const Selector: <K extends string | number = string | number>(props: ExtendGlobalProps<ComponentProps<typeof SelectorImpl<K>>>) => ComponentChildren;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-selector custom element. For the Selector Preact component, import Selector instead.
 */
export interface CSelectorElement<K extends string | number> extends JetElement<CSelectorElementSettableProperties<K>>, CSelectorElementSettableProperties<K> {
    addEventListener<T extends keyof CSelectorElementEventMap<K>>(type: T, listener: (this: HTMLElement, ev: CSelectorElementEventMap<K>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CSelectorElementSettableProperties<K>>(property: T): CSelectorElement<K>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CSelectorElementSettableProperties<K>>(property: T, value: CSelectorElementSettableProperties<K>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CSelectorElementSettableProperties<K>>): void;
    setProperties(properties: CSelectorElementSettablePropertiesLenient<K>): void;
}
export namespace CSelectorElement {
    type indeterminateChanged<K extends string | number> = JetElementCustomEventStrict<CSelectorElement<K>['indeterminate']>;
    type rowKeyChanged<K extends string | number> = JetElementCustomEventStrict<CSelectorElement<K>['rowKey']>;
    type selectedKeysChanged<K extends string | number> = JetElementCustomEventStrict<CSelectorElement<K>['selectedKeys']>;
    type selectionModeChanged<K extends string | number> = JetElementCustomEventStrict<CSelectorElement<K>['selectionMode']>;
}
export interface CSelectorElementEventMap<K extends string | number> extends HTMLElementEventMap {
    'indeterminateChanged': JetElementCustomEventStrict<CSelectorElement<K>['indeterminate']>;
    'rowKeyChanged': JetElementCustomEventStrict<CSelectorElement<K>['rowKey']>;
    'selectedKeysChanged': JetElementCustomEventStrict<CSelectorElement<K>['selectedKeys']>;
    'selectionModeChanged': JetElementCustomEventStrict<CSelectorElement<K>['selectionMode']>;
}
export interface CSelectorElementSettableProperties<K extends string | number> extends JetSettableProperties {
    /**
     * Specifies if the selector should show the visual partial state.
     * The original checked state of the selector will still be maintained.
     * User selection of checkboxes will remove the indeterminate state and reveal the checkbox state.
     * Otherwise, programmatically changing the checkbox state will not change the indeterminate state.
     */
    indeterminate?: Props<K>['indeterminate'];
    /**
     * Specifies the row key of each selector.
     * Note that if the selector is used inside one of these components:
     * <ul>
     * <li>oj-c-card-view</li>
     * <li>oj-c-list-view</li>
     * </ul>
     * Then the selector will retrieve this directly from the above component and
     * therefore this attribute should not be set.
     */
    rowKey?: Props<K>['rowKey'];
    /**
     * Specifies the selectedKeys.
     * Note that if the selector is used inside one of these components:
     * <ul>
     * <li>oj-c-card-view</li>
     * <li>oj-c-list-view</li>
     * </ul>
     * Then the selector will retrieve this directly from the above component and
     * therefore this attribute should not be set.
     */
    selectedKeys?: Props<K>['selectedKeys'];
    /**
     * Specifies the selection mode ('single', 'multiple'). For selection mode 'all', please refer to oj-c-selector-all component.
     * Note that if the selector is used inside one of these components:
     * <ul>
     * <li>oj-c-card-view</li>
     * <li>oj-c-list-view</li>
     * </ul>
     * Then the selector will retrieve this directly from the above component and
     * therefore this attribute should not be set.
     */
    selectionMode?: Props<K>['selectionMode'];
}
export interface CSelectorElementSettablePropertiesLenient<K extends string | number> extends Partial<CSelectorElementSettableProperties<K>> {
    [key: string]: any;
}
export interface SelectorIntrinsicProps extends Partial<Readonly<CSelectorElementSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onindeterminateChanged?: (value: CSelectorElementEventMap<any>['indeterminateChanged']) => void;
    onrowKeyChanged?: (value: CSelectorElementEventMap<any>['rowKeyChanged']) => void;
    onselectedKeysChanged?: (value: CSelectorElementEventMap<any>['selectedKeysChanged']) => void;
    onselectionModeChanged?: (value: CSelectorElementEventMap<any>['selectionModeChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-selector': SelectorIntrinsicProps;
        }
    }
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentProps, Ref, ComponentChildren } from 'preact';
import { RefObject } from 'preact/compat';
import { Legend as PreactLegend } from '@oracle/oraclejet-preact/UNSAFE_Legend';
import 'css!oj-c/legend/legend-styles.css';
import { DataProvider } from 'ojs/ojdataprovider';
import { Action, Bubbles, ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, TemplateSlot } from 'ojs/ojvcomponent';
import { LegendItemImplProps } from '../legend-item/legend-item';
import { LegendItemTemplateContext, LegendSectionTemplateContext } from './useSectionData';
import { type ContextMenuConfig, type ContextMenuSelectionDetail, type ContextMenuActionDetail } from 'oj-c/hooks/PRIVATE_useVisContextMenu/useVisContextMenu';
type PreactLegendProps = ComponentProps<typeof PreactLegend>;
export type SizeHandle = {
    /**
     * @memberof oj-c.Legend
     *"Returns the preferred size of the legend for given width and height."
     * @instance
     * @ignore
     */
    _getPreferredSize: (_width: number, _height: number) => {
        width: number;
        height: number;
    };
};
export type LegendContextMenuConfig<K, D> = ContextMenuConfig<LegendContextMenuContext<K, D>>;
export type LegendContextMenuSelectionDetail<K, D> = ContextMenuSelectionDetail<LegendContextMenuContext<K, D>>;
export type LegendContextMenuActionDetail<K, D> = ContextMenuActionDetail<LegendContextMenuContext<K, D>>;
export type LegendContextMenuContext<K, D> = {
    /**
     * The shaped data of the item.
     */
    data?: Item<K>;
    /**
     * The data of the item from the data provider.
     */
    itemData?: D;
    /**
     * Array of index from root to leaf for sectional legend and for flat legend the index of the item.
     */
    itemIndexPath: number[];
    type: 'item';
} | {
    type: 'background';
};
/**
 * Object type that defines a legend data item.
 */
export type Item<K> = {
    /**
     * The id of the legend item.
     */
    id: K;
} & LegendItemImplProps;
/**
 * Object type that defines a section data item.
 */
export type Section<K> = {
    /**
     * @description
     *The id of the legend section. For the DataProvider case, the key for the node will be used as the id.
     */
    id: K;
    /**
     * @description
     *The id of the legend section. For the DataProvider case, the key for the node will be used as the id.
     */
    items: Item<K>[];
    /**
     * @description
     * The title of the legend section.
     */
    title: string;
};
type DrillDetail<K> = {
    /**
     * The id of the drilled item
     * @ojmetadata description "The id of the drilled item."
     */
    id: K;
};
type LegendProps<K, D extends Item<K> | Section<K> | any> = ObservedGlobalProps<'aria-label' | 'aria-describedby' | 'aria-labelledby'> & {
    /**
     * @description
     * The DataProvider for the sections and items of the legend. It should provide a data tree where each node in the data tree corresponds to a section or item in the legend.
     * Nodes that are leaves will be treated as items. The row key will be used as the id for legend sections and items.
     * The DataProvider can either have data shape specified by <a target="_blank" href="oj-c.LegendItem.html">oj-c-legend-item</a> (or <a target="_blank" href="oj-c.LegendSection.html">oj-c-legend-section</a>) as its data shape,
     * in which case no template is required or it can have an arbitrary data shape, in which case an <a target="_blank" href="oj-c.LegendItem.html">oj-c-legend-item</a> element
     * (and <a target="_blank" href="oj-c.LegendSection.html">oj-c-legend-section</a> element for hierarchical data) must be specified in the itemTemplate (and sectionTemplate) slot
     * @ojmetadata description "Specifies the DataProvider for the sections and items of the legend."
     * @ojmetadata displayName "Data"
     * @ojmetadata help "#data"
     * @ojmetadata extension {
     *   "webelement": {
     *     "exceptionStatus": [
     *       {
     *         "type": "deprecated",
     *         "since": "17.1.0",
     *         "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
     *       }
     *     ]
     *   }
     * }
     */
    data?: DataProvider<K, D> | null;
    /**
     * @description
     * Whether drilling is enabled on all legend items.
     * Drillable objects will show a background opacity, a pointer cursor on hover, and fire ojDrill event on click.
     * @ojmetadata description "Specifies whether drilling is enabled."
     * @ojmetadata displayName "Drilling"
     * @ojmetadata help "#drilling"
     * @ojmetadata propertyEditorValues {
     *     "on": {
     *       "description": "Legend items will be drillable",
     *       "displayName": "On"
     *     },
     *     "off": {
     *       "description": "Legend items will not be drillable",
     *       "displayName": "Off"
     *     }
     *   }
     */
    drilling?: 'on' | 'off';
    /**
     * @description
     * Defines the horizontal alignment of the legend contents.
     * @ojmetadata description "Defines the horizontal alignment of the legend contents."
     * @ojmetadata displayName "Halign"
     * @ojmetadata help "#halign"
     * @ojmetadata propertyEditorValues {
     *     "center": {
     *       "description": "Legend contents will be center aligned",
     *       "displayName": "Center"
     *     },
     *     "end": {
     *       "description": "Legend contents will be end aligned",
     *       "displayName": "End"
     *     },
     *     "start": {
     *       "description": "Legend contents will be start aligned",
     *       "displayName": "Start"
     *     }
     *   }
     */
    halign?: 'center' | 'end' | 'start';
    /**
     * @description
     * An array of categories that will be hidden.
     * @ojmetadata description "An array of categories that will be hidden."
     * @ojmetadata displayName "Hidden Categories"
     * @ojmetadata help "#hiddenCategories"
     */
    hiddenCategories?: string[];
    /**
     * @ojmetadata description Writeback support for the hiddenCategories property
     * @ojmetadata displayName "Hidden Categories"
     * @ojmetadata help "#hiddenCategories"
     */
    onHiddenCategoriesChanged?: PropertyChanged<string[]>;
    /**
     * @description
     * Defines whether the legend can be used to initiate hide and show behavior on referenced data items.
     * @ojmetadata description "Defines whether the legend can be used to initiate hide and show behavior on referenced data items."
     * @ojmetadata displayName "Hide And Show Behavior"
     * @ojmetadata help "#hideAndShowBehavior"
     * @ojmetadata propertyEditorValues {
     *     "on": {
     *       "description": "Legend can be used to initiate hide and show behavior on referenced data items.",
     *       "displayName": "On"
     *     },
     *     "off": {
     *       "description": "legend cannot be used to initiate hide and show behavior on referenced data items.",
     *       "displayName": "Off"
     *     }
     *   }
     */
    hideAndShowBehavior?: 'on' | 'off';
    /**
     * @description
     * An array of categories that will be highlighted.
     * @ojmetadata description "An array of categories that will be highlighted."
     * @ojmetadata displayName "Highlighted Categories"
     * @ojmetadata help "#highlightedCategories"
     */
    highlightedCategories?: string[];
    /**
     * @ojmetadata description Writeback support for the highlightedCategories property
     * @ojmetadata displayName "Highlighted Categories"
     * @ojmetadata help "#highlightedCategories"
     */
    onHighlightedCategoriesChanged?: PropertyChanged<string[]>;
    /**
     * @description
     * Defines the behavior applied when hovering over a legend item.
     * @ojmetadata description "Defines the behavior applied when hovering over a legend item."
     * @ojmetadata displayName "Hover Behavior"
     * @ojmetadata help "#hoverBehavior"
     * @ojmetadata propertyEditorValues {
     *     "dim": {
     *       "description": "Dimming hover behavior is applied.",
     *       "displayName": "Dim"
     *     },
     *     "none": {
     *       "description": "No hover behavior will be applied.",
     *       "displayName": "None"
     *     }
     *   }
     */
    hoverBehavior?: 'dim' | 'none';
    /**
     * @description
     * Defines the orientation of the legend, which determines the direction in which the legend items are laid out.
     * @ojmetadata description "Defines the orientation of the legend, which determines the direction in which the legend items are laid out."
     * @ojmetadata displayName "Orientation"
     * @ojmetadata help "#orientation"
     * @ojmetadata propertyEditorValues {
     *     "horizontal": {
     *       "description": "Legend items will be horizontally placed in available space.",
     *       "displayName": "Horizontal"
     *     },
     *     "vertical": {
     *       "description": "Legend items will be vertically stacked.",
     *       "displayName": "Vertical"
     *     }
     *   }
     */
    orientation?: PreactLegendProps['orientation'];
    /**
     * @description
     * The height of the legend symbol in pixels. If the value is 0, it will take the same value as symbolWidth. If both symbolWidth and symbolHeight are 0, then it will use a default value that may vary based on theme.
     * @ojmetadata description "The height of the legend symbol in pixels."
     * @ojmetadata displayName "Symbol Height"
     * @ojmetadata help "#symbolHeight"
     */
    symbolHeight?: PreactLegendProps['symbolHeight'];
    /**
     * @description
     * The width of the legend symbol in pixels. If the value is 0, it will take the same value as symbolHeight. If both symbolWidth and symbolHeight are 0, then it will use a default value that may vary based on theme
     * @ojmetadata description "The width of the legend symbol in pixels."
     * @ojmetadata displayName "Symbol Width"
     * @ojmetadata help "#symbolWidth"
     */
    symbolWidth?: PreactLegendProps['symbolWidth'];
    /**
     * @description
     * The CSS style object defining the style of the legend item text.
     * @ojmetadata description "The CSS style object defining the style of the legend item text."
     * @ojmetadata displayName "Text Style"
     * @ojmetadata help "#textStyle"
     */
    textStyle?: Partial<Pick<CSSStyleDeclaration, 'color' | 'fontFamily' | 'fontSize' | 'fontWeight' | 'fontStyle' | 'textDecoration'>>;
    /**
     * @description
     * Defines the vertical alignment of the legend contents.
     * @ojmetadata description "Defines the vertical alignment of the legend contents."
     * @ojmetadata displayName "valign"
     * @ojmetadata help "#valign"
     * @ojmetadata propertyEditorValues {
     *     "middle": {
     *       "description": "The legend items will be middle aligned.",
     *       "displayName": "Middle"
     *     },
     *     "bottom": {
     *       "description": "The legend items will be bottom aligned.",
     *       "displayName": "Bottom"
     *     },
     *     "top": {
     *       "description": "The legend items will be top aligned.",
     *       "displayName": "Top"
     *     }
     *   }
     */
    valign?: 'middle' | 'bottom' | 'top';
    /**
     * @description
     * The CSS style object defining the style of the section titles' text.
     * The following style properties are supported: color, fontFamily, fontSize, fontStyle, fontWeight, textDecoration
     * @ojmetadata description "The CSS style object defining the style of the section titles' text."
     * @ojmetadata displayName "Section Title Style"
     * @ojmetadata help "#sectionTitleStyle"
     */
    sectionTitleStyle?: Partial<Pick<CSSStyleDeclaration, 'color' | 'fontFamily' | 'fontSize' | 'fontWeight' | 'fontStyle' | 'textDecoration'>>;
    /**
     * @description
     * The horizontal alignment of the section titles.
     * @ojmetadata description "The horizontal alignment of the section titles."
     * @ojmetadata displayName "Section Title Halign"
     * @ojmetadata help "#sectionTitleHalign"
     * @ojmetadata propertyEditorValues {
     *     "center": {
     *       "description": "The section title will be center aligned.",
     *       "displayName": "Center"
     *     },
     *     "end": {
     *       "description": "The section title will be end aligned.",
     *       "displayName": "End"
     *     },
     *     "start": {
     *       "description": "The section title will be start aligned.",
     *       "displayName": "Start"
     *     }
     *   }
     */
    sectionTitleHalign?: 'center' | 'end' | 'start';
    /**
     * @description
     * <p>
     *  The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for
     *  creating items of the legend. The slot content must be wrapped in a &lt;template>
     *  element. The content of the template should be a single &lt;oj-c-legend-item> element.
     *  See the <a target="_blank" href="oj-c.LegendItem.html">oj-c-legend-item</a> doc for more details.
     * </p>
     * <p>
     *  When the template is executed for each area, it will have access to the components's
     *  binding context containing the following properties:
     * </p>
     * <ul>
     *   <li>
     *      $current - an object that contains information for the current node.
     *      (See the table below for a list of properties available on $current)
     *   </li>
     *   <li>
     *      alias - if data-oj-as attribute was specified, the value will be used to provide an
     *      application-named alias for $current.
     *   </li>
     * </ul>
     *
     * @ojmetadata description "The itemTemplate slot is used to map each data item in the component. See the Help documentation for more information."
     * @ojmetadata displayName "itemTemplate"
     * @ojmetadata help "#itemTemplate"
     * @ojmetadata maxItems 1
     * @ojmetadata preferredContent ["CLegendItemElement"]
     */
    itemTemplate?: TemplateSlot<LegendItemTemplateContext<K, D>>;
    /**
     * @description
     *  <p>
     *  The <code class="prettyprint">sectionTemplate</code> slot is used to specify the template for
     *  creating sections of the legend. The slot content must be wrapped in a &lt;template>
     *  element. The content of the template should be a single &lt;oj-c-legend-section> element.
     *  See the <a target="_blank" href="oj-c.LegendSection.html">oj-c-legend-section</a> doc for more details.
     * </p>
     * <p>
     *  When the template is executed for each area, it will have access to the components's
     *  binding context containing the following properties:
     * </p>
     * <ul>
     *   <li>
     *      $current - an object that contains information for the current node.
     *      (See the table below for a list of properties available on $current)
     *   </li>
     *   <li>
     *      alias - if data-oj-as attribute was specified, the value will be used to provide an
     *      application-named alias for $current.
     *   </li>
     * </ul>
     *
     * @ojmetadata description "The sectionTemplate slot is used to map each data item in the component. See the Help documentation for more information."
     * @ojmetadata displayName "sectionTemplate"
     * @ojmetadata help "#sectionTemplate"
     * @ojmetadata maxItems 1
     * @ojmetadata preferredContent ["CLegendSectionElement"]
     */
    sectionTemplate?: TemplateSlot<LegendSectionTemplateContext<K, D>>;
    /**
     * @ojmetadata description "Triggered during a drill gesture (single click on the legend item)."
     * @ojmetadata help "#event:drill"
     */
    onOjDrill?: Action<DrillDetail<K>>;
    /**
     * @description
     * Specifies a context menu configuration.
     * It takes the keys `accessibleLabel` and `items`,
     * where `accessibleLabel` is optional and items required .`items` function returns an array
     * of menu item object representations that indicates what menu items are going to be part of
     * menu based on some specific context menu context.
     * <table>
     * <tr><th align='left'>Context Menu Item Type</th><th align='left'>Def</th></tr>
     * <tr><td>ContextMenuSeparator</td><td>{ type: 'separator'}</td></tr>
     * <tr><td>MenuItem</td><td>{
     * type?: 'item';
     * label: string;
     * key: string;
     * disabled?: boolean;
     * onAction?: () => void;
     * startIcon?: MenuIcon;
     * endIcon?: MenuIcon;
     * variant?: 'standard' | 'destructive';
     * };</td></tr>
     * <tr><td>ContextMenuSubMenu</td><td>{
     * type: 'submenu';
     * label?: string;
     * disabled?: boolean;
     * startIcon?: string;
     * items?: Array&lt;ContextMenuItems&gt;;
     * };</td></tr>
     * <tr><td>ContextMenuSelectSingle</td><td>{
     * type: 'selectsingle';
     * key?: string;
     * items?: Array&lt;MenuSelectItem&gt;;
     * selection?: string;
     * onSelection?: (detail: { value: string }) => void;
     * };</td></tr>
     * <tr><td>ContextMenuSelectMultiple</td><td>{
     * type: 'selectmultiple';
     * key?: string;
     * items?: Array&lt;MenuSelectItem&gt;;
     * selection?: Array&lt;string&gt;;
     * onSelection?: (detail: { value: Array&lt;string&gt; }) => void;
     * };</td></tr>
     * <tr><td>MenuIcon</td><td>{
     * type?: 'class';
     *     class: string;
     *   }
     * | {
     *     type: 'img';
     *    src: string;
     *   };</td></tr>
     * <tr><td>MenuSelectItem</td><td>{
     * label: string;
     * disabled?: boolean;
     * endIcon?: MenuIcon;
     * value: string;
     * }</td></tr>
     * </table>
     * @ojmetadata description "Specifies a context menu configuration."
     * @ojmetadata displayName "Context Menu Config"
     * @ojmetadata help "#contextMenuConfig"
     */
    contextMenuConfig?: LegendContextMenuConfig<K, D>;
    /**
     * @ojmetadata description "Triggered when a menu item is clicked, whether by keyboard, mouse,
     *    or touch events."
     * @ojmetadata eventGroup "common"
     * @ojmetadata displayName "onOjContextMenuAction"
     * @ojmetadata help "#event:ojContextMenuAction"
     */
    onOjContextMenuAction?: Action<LegendContextMenuActionDetail<K, D>> & Bubbles;
    /**
     * @ojmetadata description "Triggered when a select menu item is clicked, whether by keyboard, mouse,
     *    or touch events."
     * @ojmetadata eventGroup "common"
     * @ojmetadata displayName "onOjContextMenuSelection"
     * @ojmetadata help "#event:ojContextMenuSelection"
     */
    onOjContextMenuSelection?: Action<LegendContextMenuSelectionDetail<K, D>> & Bubbles;
};
/**
 * This export corresponds to the Legend Preact component. For the oj-c-legend custom element, import CLegendElement instead.
 */
export declare const Legend: <K extends string | number = string | number, D extends Item<K> | Section<K> | any = Item<K> | Section<K> | any>(props: ExtendGlobalProps<LegendProps<K, D>> & {
    ref?: Ref<SizeHandle>;
}) => ComponentChildren;
type LinearLegendProps<K extends string | number, D> = Omit<LegendProps<K, D>, 'sectionTitleStyle'> & {
    addBusyState: (description: string) => () => void;
    linearLegendRef?: RefObject<SizeHandle>;
};
/**
 * The wrapper for the liner legend.
 */
export declare const LinearLegend: <K extends string | number, D extends Item<K> | Section<K> | any>({ hoverBehavior, hideAndShowBehavior, hiddenCategories, highlightedCategories, onHiddenCategoriesChanged, onHighlightedCategoriesChanged, drilling, itemTemplate, sectionTemplate, textStyle, orientation, symbolHeight, symbolWidth, valign, halign, contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection, ...props }: LinearLegendProps<K, D>) => import("preact").JSX.Element | null;
type SectionalLegendProps<K extends string | number, D> = LegendProps<K, D> & {
    addBusyState: (description: string) => () => void;
    sectionalLegendRef?: RefObject<SizeHandle>;
};
/**
 * The wrapper for sectional legend.
 */
export declare const SectionalLegend: <K extends string | number, D extends Item<K> | Section<K> | any>({ hoverBehavior, hideAndShowBehavior, hiddenCategories, highlightedCategories, onHiddenCategoriesChanged, onHighlightedCategoriesChanged, drilling, itemTemplate, sectionTemplate, textStyle, sectionTitleStyle, orientation, symbolHeight, symbolWidth, valign, halign, contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection, ...props }: SectionalLegendProps<K, D>) => import("preact").JSX.Element | null;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-legend custom element. For the Legend Preact component, import Legend instead.
 */
export interface CLegendElement<K extends string | number, D extends Item<K> | Section<K> | any> extends JetElement<CLegendElementSettableProperties<K, D>>, CLegendElementSettableProperties<K, D> {
    addEventListener<T extends keyof CLegendElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: CLegendElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CLegendElementSettableProperties<K, D>>(property: T): CLegendElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CLegendElementSettableProperties<K, D>>(property: T, value: CLegendElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CLegendElementSettableProperties<K, D>>): void;
    setProperties(properties: CLegendElementSettablePropertiesLenient<K, D>): void;
    _getPreferredSize: (_width: number, _height: number) => {
        width: number;
        height: number;
    };
}
export namespace CLegendElement {
    interface ojDrill<K extends string | number> extends CustomEvent<DrillDetail<K> & {}> {
    }
    interface ojContextMenuAction<K extends string | number, D extends Item<K> | Section<K> | any> extends CustomEvent<LegendContextMenuActionDetail<K, D> & {}> {
    }
    interface ojContextMenuSelection<K extends string | number, D extends Item<K> | Section<K> | any> extends CustomEvent<LegendContextMenuSelectionDetail<K, D> & {}> {
    }
    type contextMenuConfigChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['contextMenuConfig']>;
    type dataChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['data']>;
    type drillingChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['drilling']>;
    type halignChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['halign']>;
    type hiddenCategoriesChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['hiddenCategories']>;
    type hideAndShowBehaviorChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['hideAndShowBehavior']>;
    type highlightedCategoriesChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['highlightedCategories']>;
    type hoverBehaviorChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['hoverBehavior']>;
    type orientationChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['orientation']>;
    type sectionTitleHalignChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['sectionTitleHalign']>;
    type sectionTitleStyleChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['sectionTitleStyle']>;
    type symbolHeightChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['symbolHeight']>;
    type symbolWidthChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['symbolWidth']>;
    type textStyleChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['textStyle']>;
    type valignChanged<K extends string | number, D extends Item<K> | Section<K> | any> = JetElementCustomEventStrict<CLegendElement<K, D>['valign']>;
    type ItemTemplateContext<K extends string | number, D extends Item<K> | Section<K> | any> = LegendItemTemplateContext<K, D>;
    type RenderItemTemplate<K extends string | number, D extends Item<K> | Section<K> | any> = import('ojs/ojvcomponent').TemplateSlot<LegendItemTemplateContext<K, D>>;
    type SectionTemplateContext<K extends string | number, D extends Item<K> | Section<K> | any> = LegendSectionTemplateContext<K, D>;
    type RenderSectionTemplate<K extends string | number, D extends Item<K> | Section<K> | any> = import('ojs/ojvcomponent').TemplateSlot<LegendSectionTemplateContext<K, D>>;
}
export interface CLegendElementEventMap<K extends string | number, D extends Item<K> | Section<K> | any> extends HTMLElementEventMap {
    'ojDrill': CLegendElement.ojDrill<K>;
    'ojContextMenuAction': CLegendElement.ojContextMenuAction<K, D>;
    'ojContextMenuSelection': CLegendElement.ojContextMenuSelection<K, D>;
    'contextMenuConfigChanged': JetElementCustomEventStrict<CLegendElement<K, D>['contextMenuConfig']>;
    'dataChanged': JetElementCustomEventStrict<CLegendElement<K, D>['data']>;
    'drillingChanged': JetElementCustomEventStrict<CLegendElement<K, D>['drilling']>;
    'halignChanged': JetElementCustomEventStrict<CLegendElement<K, D>['halign']>;
    'hiddenCategoriesChanged': JetElementCustomEventStrict<CLegendElement<K, D>['hiddenCategories']>;
    'hideAndShowBehaviorChanged': JetElementCustomEventStrict<CLegendElement<K, D>['hideAndShowBehavior']>;
    'highlightedCategoriesChanged': JetElementCustomEventStrict<CLegendElement<K, D>['highlightedCategories']>;
    'hoverBehaviorChanged': JetElementCustomEventStrict<CLegendElement<K, D>['hoverBehavior']>;
    'orientationChanged': JetElementCustomEventStrict<CLegendElement<K, D>['orientation']>;
    'sectionTitleHalignChanged': JetElementCustomEventStrict<CLegendElement<K, D>['sectionTitleHalign']>;
    'sectionTitleStyleChanged': JetElementCustomEventStrict<CLegendElement<K, D>['sectionTitleStyle']>;
    'symbolHeightChanged': JetElementCustomEventStrict<CLegendElement<K, D>['symbolHeight']>;
    'symbolWidthChanged': JetElementCustomEventStrict<CLegendElement<K, D>['symbolWidth']>;
    'textStyleChanged': JetElementCustomEventStrict<CLegendElement<K, D>['textStyle']>;
    'valignChanged': JetElementCustomEventStrict<CLegendElement<K, D>['valign']>;
}
export interface CLegendElementSettableProperties<K, D extends Item<K> | Section<K> | any> extends JetSettableProperties {
    /**
     * Specifies a context menu configuration.
     * It takes the keys `accessibleLabel` and `items`,
     * where `accessibleLabel` is optional and items required .`items` function returns an array
     * of menu item object representations that indicates what menu items are going to be part of
     * menu based on some specific context menu context.
     * <table>
     * <tr><th align='left'>Context Menu Item Type</th><th align='left'>Def</th></tr>
     * <tr><td>ContextMenuSeparator</td><td>{ type: 'separator'}</td></tr>
     * <tr><td>MenuItem</td><td>{
     * type?: 'item';
     * label: string;
     * key: string;
     * disabled?: boolean;
     * onAction?: () => void;
     * startIcon?: MenuIcon;
     * endIcon?: MenuIcon;
     * variant?: 'standard' | 'destructive';
     * };</td></tr>
     * <tr><td>ContextMenuSubMenu</td><td>{
     * type: 'submenu';
     * label?: string;
     * disabled?: boolean;
     * startIcon?: string;
     * items?: Array&lt;ContextMenuItems&gt;;
     * };</td></tr>
     * <tr><td>ContextMenuSelectSingle</td><td>{
     * type: 'selectsingle';
     * key?: string;
     * items?: Array&lt;MenuSelectItem&gt;;
     * selection?: string;
     * onSelection?: (detail: { value: string }) => void;
     * };</td></tr>
     * <tr><td>ContextMenuSelectMultiple</td><td>{
     * type: 'selectmultiple';
     * key?: string;
     * items?: Array&lt;MenuSelectItem&gt;;
     * selection?: Array&lt;string&gt;;
     * onSelection?: (detail: { value: Array&lt;string&gt; }) => void;
     * };</td></tr>
     * <tr><td>MenuIcon</td><td>{
     * type?: 'class';
     *     class: string;
     *   }
     * | {
     *     type: 'img';
     *    src: string;
     *   };</td></tr>
     * <tr><td>MenuSelectItem</td><td>{
     * label: string;
     * disabled?: boolean;
     * endIcon?: MenuIcon;
     * value: string;
     * }</td></tr>
     * </table>
     */
    contextMenuConfig?: LegendProps<K, D>['contextMenuConfig'];
    /**
     * The DataProvider for the sections and items of the legend. It should provide a data tree where each node in the data tree corresponds to a section or item in the legend.
     * Nodes that are leaves will be treated as items. The row key will be used as the id for legend sections and items.
     * The DataProvider can either have data shape specified by <a target="_blank" href="oj-c.LegendItem.html">oj-c-legend-item</a> (or <a target="_blank" href="oj-c.LegendSection.html">oj-c-legend-section</a>) as its data shape,
     * in which case no template is required or it can have an arbitrary data shape, in which case an <a target="_blank" href="oj-c.LegendItem.html">oj-c-legend-item</a> element
     * (and <a target="_blank" href="oj-c.LegendSection.html">oj-c-legend-section</a> element for hierarchical data) must be specified in the itemTemplate (and sectionTemplate) slot
     */
    data?: LegendProps<K, D>['data'];
    /**
     * Whether drilling is enabled on all legend items.
     * Drillable objects will show a background opacity, a pointer cursor on hover, and fire ojDrill event on click.
     */
    drilling?: LegendProps<K, D>['drilling'];
    /**
     * Defines the horizontal alignment of the legend contents.
     */
    halign?: LegendProps<K, D>['halign'];
    /**
     * An array of categories that will be hidden.
     */
    hiddenCategories?: LegendProps<K, D>['hiddenCategories'];
    /**
     * Defines whether the legend can be used to initiate hide and show behavior on referenced data items.
     */
    hideAndShowBehavior?: LegendProps<K, D>['hideAndShowBehavior'];
    /**
     * An array of categories that will be highlighted.
     */
    highlightedCategories?: LegendProps<K, D>['highlightedCategories'];
    /**
     * Defines the behavior applied when hovering over a legend item.
     */
    hoverBehavior?: LegendProps<K, D>['hoverBehavior'];
    /**
     * Defines the orientation of the legend, which determines the direction in which the legend items are laid out.
     */
    orientation?: LegendProps<K, D>['orientation'];
    /**
     * The horizontal alignment of the section titles.
     */
    sectionTitleHalign?: LegendProps<K, D>['sectionTitleHalign'];
    /**
     * The CSS style object defining the style of the section titles' text.
     * The following style properties are supported: color, fontFamily, fontSize, fontStyle, fontWeight, textDecoration
     */
    sectionTitleStyle?: LegendProps<K, D>['sectionTitleStyle'];
    /**
     * The height of the legend symbol in pixels. If the value is 0, it will take the same value as symbolWidth. If both symbolWidth and symbolHeight are 0, then it will use a default value that may vary based on theme.
     */
    symbolHeight?: LegendProps<K, D>['symbolHeight'];
    /**
     * The width of the legend symbol in pixels. If the value is 0, it will take the same value as symbolHeight. If both symbolWidth and symbolHeight are 0, then it will use a default value that may vary based on theme
     */
    symbolWidth?: LegendProps<K, D>['symbolWidth'];
    /**
     * The CSS style object defining the style of the legend item text.
     */
    textStyle?: LegendProps<K, D>['textStyle'];
    /**
     * Defines the vertical alignment of the legend contents.
     */
    valign?: LegendProps<K, D>['valign'];
}
export interface CLegendElementSettablePropertiesLenient<K, D extends Item<K> | Section<K> | any> extends Partial<CLegendElementSettableProperties<K, D>> {
    [key: string]: any;
}
export interface LegendIntrinsicProps extends Partial<Readonly<CLegendElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onojContextMenuAction?: (value: CLegendElementEventMap<any, any>['ojContextMenuAction']) => void;
    onojContextMenuSelection?: (value: CLegendElementEventMap<any, any>['ojContextMenuSelection']) => void;
    onojDrill?: (value: CLegendElementEventMap<any, any>['ojDrill']) => void;
    oncontextMenuConfigChanged?: (value: CLegendElementEventMap<any, any>['contextMenuConfigChanged']) => void;
    ondataChanged?: (value: CLegendElementEventMap<any, any>['dataChanged']) => void;
    ondrillingChanged?: (value: CLegendElementEventMap<any, any>['drillingChanged']) => void;
    onhalignChanged?: (value: CLegendElementEventMap<any, any>['halignChanged']) => void;
    onhiddenCategoriesChanged?: (value: CLegendElementEventMap<any, any>['hiddenCategoriesChanged']) => void;
    onhideAndShowBehaviorChanged?: (value: CLegendElementEventMap<any, any>['hideAndShowBehaviorChanged']) => void;
    onhighlightedCategoriesChanged?: (value: CLegendElementEventMap<any, any>['highlightedCategoriesChanged']) => void;
    onhoverBehaviorChanged?: (value: CLegendElementEventMap<any, any>['hoverBehaviorChanged']) => void;
    onorientationChanged?: (value: CLegendElementEventMap<any, any>['orientationChanged']) => void;
    onsectionTitleHalignChanged?: (value: CLegendElementEventMap<any, any>['sectionTitleHalignChanged']) => void;
    onsectionTitleStyleChanged?: (value: CLegendElementEventMap<any, any>['sectionTitleStyleChanged']) => void;
    onsymbolHeightChanged?: (value: CLegendElementEventMap<any, any>['symbolHeightChanged']) => void;
    onsymbolWidthChanged?: (value: CLegendElementEventMap<any, any>['symbolWidthChanged']) => void;
    ontextStyleChanged?: (value: CLegendElementEventMap<any, any>['textStyleChanged']) => void;
    onvalignChanged?: (value: CLegendElementEventMap<any, any>['valignChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-legend': LegendIntrinsicProps;
        }
    }
}

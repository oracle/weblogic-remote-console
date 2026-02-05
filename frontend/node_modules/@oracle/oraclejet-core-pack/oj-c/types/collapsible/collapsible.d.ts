import { ComponentChildren, ComponentType } from 'preact';
import { Action, CancelableAction, ExtendGlobalProps, PropertyChanged, Slot, ObservedGlobalProps } from 'ojs/ojvcomponent';
import 'css!oj-c/collapsible/collapsible-styles.css';
type CollapsibleToggleDetail = {
    target: EventTarget | null;
};
/** @deprecated since 19.0.0 - use 'CCollapsibleElement.&lt;event-name&gt;[&apos;detail&apos;]' instead */
export type CollapsibleToggleDetailDeprecated = CollapsibleToggleDetail;
export type Props = ObservedGlobalProps<'aria-label' | 'aria-labelledby' | 'id'> & {
    /**
     * @ojmetadata description "The default slot is the content of the collapsible. The oj-c-collapsible element accepts plain text or DOM nodes as children for the default slot."
     * @ojmetadata help "#Default"
     */
    children: ComponentChildren;
    /**
     * @description
     * Disables the collapsible if set to <code class="prettyprint">true</code>.
     *
     * @ojmetadata description "Disables the collapsible if set to true."
     * @ojmetadata help "#disabled"
     */
    disabled?: boolean;
    /**
     * @ojmetadata description "Specifies if the content is expanded."
     * @ojmetadata help "#expanded"
     * @ojmetadata extension { webelement: { exceptionStatus: [ { type: "getterOnly"} ] } }
     */
    expanded?: boolean;
    /**
     * @ojmetadata description "Controls placement of the icon in the header."
     * @ojmetadata help "#iconPosition"
     * @ojmetadata propertyEditorValues {
     *     "start": {
     *       "description": "icon position is start (default, if unspecified)",
     *       "displayName": "Start"
     *     },
     *     "end": {
     *       "description": "icon position is end",
     *       "displayName": "End"
     *     }
     *   }
     */
    iconPosition?: 'start' | 'end';
    /**
     * @ojmetadata description "Controls display of the optional divider below the header."
     * @ojmetadata help "#variant"
     * @ojmetadata propertyEditorValues {
     *     "basic": {
     *       "description": "basic, no divider (default, if unspecified)",
     *       "displayName": "Basic"
     *     },
     *     "horizontal-rule": {
     *       "description": "displays a horizontal divider between the header and content",
     *       "displayName": "Horizontal Rule"
     *     }
     *   }
     */
    variant?: 'basic' | 'horizontal-rule';
    /**
     * @ojmetadata description "The header slot is the collapsible's header. If not specified, the header contains only an open/close icon. Note that the header text is required for JET collapsible for accessibility purposes."
     * @ojmetadata help "#header"
     */
    header?: Slot;
    /**
     * @ojmetadata description "Triggered when the 'expanded' property value changes."
     * @ojmetadata help "#event:beforeCollapse"
     */
    onExpandedChanged?: PropertyChanged<boolean>;
    /**
     * @ojmetadata description "Triggered immediately before the collapsible is collapsed."
     * @ojmetadata help "#event:beforeCollapse"
     */
    onOjBeforeCollapse?: CancelableAction<CollapsibleToggleDetail>;
    /**
     * @ojmetadata description "Triggered immediately before the collapsible is expanded."
     * @ojmetadata help "#event:beforeExpand"
     */
    onOjBeforeExpand?: CancelableAction<CollapsibleToggleDetail>;
    /**
     * @ojmetadata description "Triggered after the collapsible has been collapsed."
     * @ojmetadata help "#event:collapse"
     */
    onOjCollapse?: Action<CollapsibleToggleDetail>;
    /**
     * @ojmetadata description "Triggered after the collapsible has been expanded (after animation completes)."
     * @ojmetadata help "#event:expand"
     */
    onOjExpand?: Action<CollapsibleToggleDetail>;
};
/**
 * This export corresponds to the Collapsible Preact component. For the oj-c-collapsible custom element, import CCollapsibleElement instead.
 */
export declare const Collapsible: ComponentType<ExtendGlobalProps<Props>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-collapsible custom element. For the Collapsible Preact component, import Collapsible instead.
 */
export interface CCollapsibleElement extends JetElement<CCollapsibleElementSettableProperties>, CCollapsibleElementSettableProperties {
    addEventListener<T extends keyof CCollapsibleElementEventMap>(type: T, listener: (this: HTMLElement, ev: CCollapsibleElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CCollapsibleElementSettableProperties>(property: T): CCollapsibleElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CCollapsibleElementSettableProperties>(property: T, value: CCollapsibleElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CCollapsibleElementSettableProperties>): void;
    setProperties(properties: CCollapsibleElementSettablePropertiesLenient): void;
}
export namespace CCollapsibleElement {
    interface ojBeforeCollapse extends CustomEvent<CollapsibleToggleDetail & {
        accept: (param: Promise<void>) => void;
    }> {
    }
    interface ojBeforeExpand extends CustomEvent<CollapsibleToggleDetail & {
        accept: (param: Promise<void>) => void;
    }> {
    }
    interface ojCollapse extends CustomEvent<CollapsibleToggleDetail & {}> {
    }
    interface ojExpand extends CustomEvent<CollapsibleToggleDetail & {}> {
    }
    type disabledChanged = JetElementCustomEventStrict<CCollapsibleElement['disabled']>;
    type expandedChanged = JetElementCustomEventStrict<CCollapsibleElement['expanded']>;
    type iconPositionChanged = JetElementCustomEventStrict<CCollapsibleElement['iconPosition']>;
    type variantChanged = JetElementCustomEventStrict<CCollapsibleElement['variant']>;
}
export interface CCollapsibleElementEventMap extends HTMLElementEventMap {
    'ojBeforeCollapse': CCollapsibleElement.ojBeforeCollapse;
    'ojBeforeExpand': CCollapsibleElement.ojBeforeExpand;
    'ojCollapse': CCollapsibleElement.ojCollapse;
    'ojExpand': CCollapsibleElement.ojExpand;
    'disabledChanged': JetElementCustomEventStrict<CCollapsibleElement['disabled']>;
    'expandedChanged': JetElementCustomEventStrict<CCollapsibleElement['expanded']>;
    'iconPositionChanged': JetElementCustomEventStrict<CCollapsibleElement['iconPosition']>;
    'variantChanged': JetElementCustomEventStrict<CCollapsibleElement['variant']>;
}
export interface CCollapsibleElementSettableProperties extends JetSettableProperties {
    /**
     * Disables the collapsible if set to <code class="prettyprint">true</code>.
     */
    disabled?: Props['disabled'];
    expanded?: Props['expanded'];
    iconPosition?: Props['iconPosition'];
    variant?: Props['variant'];
}
export interface CCollapsibleElementSettablePropertiesLenient extends Partial<CCollapsibleElementSettableProperties> {
    [key: string]: any;
}
export interface CollapsibleIntrinsicProps extends Partial<Readonly<CCollapsibleElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onojBeforeCollapse?: (value: CCollapsibleElementEventMap['ojBeforeCollapse']) => void;
    onojBeforeExpand?: (value: CCollapsibleElementEventMap['ojBeforeExpand']) => void;
    onojCollapse?: (value: CCollapsibleElementEventMap['ojCollapse']) => void;
    onojExpand?: (value: CCollapsibleElementEventMap['ojExpand']) => void;
    ondisabledChanged?: (value: CCollapsibleElementEventMap['disabledChanged']) => void;
    onexpandedChanged?: (value: CCollapsibleElementEventMap['expandedChanged']) => void;
    oniconPositionChanged?: (value: CCollapsibleElementEventMap['iconPositionChanged']) => void;
    onvariantChanged?: (value: CCollapsibleElementEventMap['variantChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-collapsible': CollapsibleIntrinsicProps;
        }
    }
}

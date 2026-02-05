export declare const LineChartGroupDefaults: Partial<LineChartGroupProps>;
export type LineChartGroupProps = {
    /**
     * @description
     * Whether drilling is enabled on the group label. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click. To enable drilling for all group labels at once, use the drilling attribute in the top level.
     * @ojmetadata description "Whether drilling is enabled on the group label."
     * @ojmetadata displayName "Drilling"
     * @ojmetadata help "#drilling"
     */
    drilling?: 'on' | 'off' | 'inherit';
    /**
     * @description
     * The name of the group.
     * @ojmetadata description "The name of the group."
     * @ojmetadata displayName "Name"
     * @ojmetadata help "#name"
     */
    name?: string;
    /**
     * @description
     * The description of the group. This is used for customizing the tooltip text and only applies to a categorical axis.
     * @ojmetadata description "The description of the group."
     * @ojmetadata displayName "ShortDesc"
     * @ojmetadata help "#shortDesc"
     */
    shortDesc?: string;
};
/**
 * This export corresponds to the LineChartGroup Preact component. For the oj-c-line-chart-group custom element, import CLineChartGroupElement instead.
 */
export declare const LineChartGroup: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<LineChartGroupProps>>;
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-line-chart-group custom element. For the LineChartGroup Preact component, import LineChartGroup instead.
 */
export interface CLineChartGroupElement extends JetElement<CLineChartGroupElementSettableProperties>, CLineChartGroupElementSettableProperties {
    addEventListener<T extends keyof CLineChartGroupElementEventMap>(type: T, listener: (this: HTMLElement, ev: CLineChartGroupElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CLineChartGroupElementSettableProperties>(property: T): CLineChartGroupElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CLineChartGroupElementSettableProperties>(property: T, value: CLineChartGroupElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CLineChartGroupElementSettableProperties>): void;
    setProperties(properties: CLineChartGroupElementSettablePropertiesLenient): void;
}
export namespace CLineChartGroupElement {
    type drillingChanged = JetElementCustomEventStrict<CLineChartGroupElement['drilling']>;
    type nameChanged = JetElementCustomEventStrict<CLineChartGroupElement['name']>;
    type shortDescChanged = JetElementCustomEventStrict<CLineChartGroupElement['shortDesc']>;
}
export interface CLineChartGroupElementEventMap extends HTMLElementEventMap {
    'drillingChanged': JetElementCustomEventStrict<CLineChartGroupElement['drilling']>;
    'nameChanged': JetElementCustomEventStrict<CLineChartGroupElement['name']>;
    'shortDescChanged': JetElementCustomEventStrict<CLineChartGroupElement['shortDesc']>;
}
export interface CLineChartGroupElementSettableProperties extends JetSettableProperties {
    /**
     * Whether drilling is enabled on the group label. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click. To enable drilling for all group labels at once, use the drilling attribute in the top level.
     */
    drilling?: LineChartGroupProps['drilling'];
    /**
     * The name of the group.
     */
    name?: LineChartGroupProps['name'];
    /**
     * The description of the group. This is used for customizing the tooltip text and only applies to a categorical axis.
     */
    shortDesc?: LineChartGroupProps['shortDesc'];
}
export interface CLineChartGroupElementSettablePropertiesLenient extends Partial<CLineChartGroupElementSettableProperties> {
    [key: string]: any;
}
export interface LineChartGroupIntrinsicProps extends Partial<Readonly<CLineChartGroupElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    ondrillingChanged?: (value: CLineChartGroupElementEventMap['drillingChanged']) => void;
    onnameChanged?: (value: CLineChartGroupElementEventMap['nameChanged']) => void;
    onshortDescChanged?: (value: CLineChartGroupElementEventMap['shortDescChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-line-chart-group': LineChartGroupIntrinsicProps;
        }
    }
}

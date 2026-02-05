export declare const AreaChartGroupDefaults: Partial<AreaChartGroupProps>;
export type AreaChartGroupProps = {
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
 * This export corresponds to the AreaChartGroup Preact component. For the oj-c-area-chart-group custom element, import CAreaChartGroupElement instead.
 */
export declare const AreaChartGroup: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<AreaChartGroupProps>>;
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-area-chart-group custom element. For the AreaChartGroup Preact component, import AreaChartGroup instead.
 */
export interface CAreaChartGroupElement extends JetElement<CAreaChartGroupElementSettableProperties>, CAreaChartGroupElementSettableProperties {
    addEventListener<T extends keyof CAreaChartGroupElementEventMap>(type: T, listener: (this: HTMLElement, ev: CAreaChartGroupElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CAreaChartGroupElementSettableProperties>(property: T): CAreaChartGroupElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CAreaChartGroupElementSettableProperties>(property: T, value: CAreaChartGroupElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CAreaChartGroupElementSettableProperties>): void;
    setProperties(properties: CAreaChartGroupElementSettablePropertiesLenient): void;
}
export namespace CAreaChartGroupElement {
    type drillingChanged = JetElementCustomEventStrict<CAreaChartGroupElement['drilling']>;
    type nameChanged = JetElementCustomEventStrict<CAreaChartGroupElement['name']>;
    type shortDescChanged = JetElementCustomEventStrict<CAreaChartGroupElement['shortDesc']>;
}
export interface CAreaChartGroupElementEventMap extends HTMLElementEventMap {
    'drillingChanged': JetElementCustomEventStrict<CAreaChartGroupElement['drilling']>;
    'nameChanged': JetElementCustomEventStrict<CAreaChartGroupElement['name']>;
    'shortDescChanged': JetElementCustomEventStrict<CAreaChartGroupElement['shortDesc']>;
}
export interface CAreaChartGroupElementSettableProperties extends JetSettableProperties {
    /**
     * Whether drilling is enabled on the group label. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click. To enable drilling for all group labels at once, use the drilling attribute in the top level.
     */
    drilling?: AreaChartGroupProps['drilling'];
    /**
     * The name of the group.
     */
    name?: AreaChartGroupProps['name'];
    /**
     * The description of the group. This is used for customizing the tooltip text and only applies to a categorical axis.
     */
    shortDesc?: AreaChartGroupProps['shortDesc'];
}
export interface CAreaChartGroupElementSettablePropertiesLenient extends Partial<CAreaChartGroupElementSettableProperties> {
    [key: string]: any;
}
export interface AreaChartGroupIntrinsicProps extends Partial<Readonly<CAreaChartGroupElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    ondrillingChanged?: (value: CAreaChartGroupElementEventMap['drillingChanged']) => void;
    onnameChanged?: (value: CAreaChartGroupElementEventMap['nameChanged']) => void;
    onshortDescChanged?: (value: CAreaChartGroupElementEventMap['shortDescChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-area-chart-group': AreaChartGroupIntrinsicProps;
        }
    }
}

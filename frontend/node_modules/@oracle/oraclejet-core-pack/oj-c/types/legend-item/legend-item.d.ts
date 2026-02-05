/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { LineStyle, MarkerShapes } from '@oracle/oraclejet-preact/utils/UNSAFE_visTypes/common';
export declare const LegendItemDefaults: Partial<LegendItemImplProps>;
export type LegendItemImplProps = {
    /**
     * @description
     * The legend item text. Also used as item aria label if short-desc is not provided.
     * @ojmetadata description "The legend item text."
     * @ojmetadata displayName "Text"
     * @ojmetadata help "#text"
     * @ojmetadata required
     * @ojmetadata translatable
     */
    text: string;
    /**
     * @description
     * An array of categories for the legend item. Legend items currently only support a single category.
     * @ojmetadata description "An array of categories for the legend item. Legend items currently only support a single category."
     * @ojmetadata displayName "Categories"
     * @ojmetadata help "#categories"
     */
    categories?: string[];
    /**
     * @description
     * The type of legend symbol to display.
     * @ojmetadata description "The type of legend symbol to display."
     * @ojmetadata displayName "Symbol Type"
     * @ojmetadata help "#symbolType"
     * @ojmetadata propertyEditorValues {
     *     "line": {
     *       "description": "The legend symbol will be a line.",
     *       "displayName": "Line"
     *     },
     *     "lineWithMarker": {
     *       "description": "The legend symbol will be a line and a marker.",
     *       "displayName": "LineWithMarker"
     *     },
     *     "image": {
     *       "description": "The legend symbol will be an image.",
     *       "displayName": "Image"
     *     },
     *     "marker": {
     *       "description": "The legend symbol will be a marker.",
     *       "displayName": "Marker"
     *     }
     *   }
     */
    symbolType?: 'line' | 'lineWithMarker' | 'image' | 'marker';
    /**
     * @description
     * The URI of the image of the legend symbol.
     * @ojmetadata description "The URI of the image of the legend symbol."
     * @ojmetadata displayName "Source"
     * @ojmetadata help "#source"
     */
    source?: string;
    /**
     * @description
     * The color of the legend symbol (line or marker). When symbolType is "lineWithMarker", this attribute defines the line color and the markerColor attribute defines the marker color.
     * @ojmetadata description "The color of the legend symbol (line or marker). When symbolType is "lineWithMarker", this attribute defines the line color and the markerColor attribute defines the marker color."
     * @ojmetadata displayName "Color"
     * @ojmetadata help "#color"
     */
    color?: string;
    /**
     * @description
     * The border color of the marker. Only applies if symbolType is "marker" or "lineWithMarker
     * @ojmetadata description "The border color of the marker. Only applies if symbolType is "marker" or "lineWithMarker."
     * @ojmetadata displayName "Border Color"
     * @ojmetadata help "#borderColor"
     */
    borderColor?: string;
    /**
     * @description
     * The line style. Only applies when the symbolType is "line" or "lineWithMarker".
     * @ojmetadata description "The line style. Only applies when the symbolType is "line" or "lineWithMarker"."
     * @ojmetadata displayName "Line Style"
     * @ojmetadata help "#lineStyle"
     * @ojmetadata propertyEditorValues {
     *     "dotted": {
     *       "description": "Line will have dotted strokes.",
     *       "displayName": "Dotted"
     *     },
     *     "dashed": {
     *       "description": "Line will have dashed strokes.",
     *       "displayName": "Dashed"
     *     },
     *     "solid": {
     *       "description": "Line will have a solid stroke.",
     *       "displayName": "Solid"
     *     }
     *   }
     */
    lineStyle?: LineStyle;
    /**
     * @description
     * The line width in pixels. Only applies when the symbolType is "line" or "lineWithMarker.
     * @ojmetadata description "The line width in pixels. Only applies when the symbolType is "line" or "lineWithMarker."
     * @ojmetadata displayName "Line Width"
     * @ojmetadata help "#lineWidth"
     */
    lineWidth?: number;
    /**
     * @description
     * The shape of the marker. Only applies if symbolType is "marker" or "lineWithMarker". Does not apply if a custom image is specified.
     * @ojmetadata description "The shape of the marker. Only applies if symbolType is "marker" or "lineWithMarker". Does not apply if a custom image is specified."
     * @ojmetadata displayName "Marker Shape"
     * @ojmetadata help "#markerShape"
     * @ojmetadata propertyEditorValues {
     *     "circle": {
     *       "description": "The marker will be of circular shape.",
     *       "displayName": "Circle"
     *     },
     *     "diamond": {
     *       "description": "The marker will be of diamond shape.",
     *       "displayName": "Diamond"
     *     },
     *     "ellipse": {
     *       "description": "The marker will be of ellipse shape.",
     *       "displayName": "Ellipse"
     *     },
     *    "human": {
     *       "description": "The marker will be of human shape.",
     *       "displayName": "Human"
     *     },
     *  "plus": {
     *       "description": "The marker will be of plus shape.",
     *       "displayName": "Plus"
     *     },
     *  "rectangle": {
     *       "description": "The marker will be of rectangular shape.",
     *       "displayName": "Rectangle"
     *     },
     *  "square": {
     *       "description": "The marker will be of square shape.",
     *       "displayName": "Square"
     *     },
     *  "star": {
     *       "description": "The marker will be of star shape.",
     *       "displayName": "Star"
     *     },
     *  "triangleDown": {
     *       "description": "The  marker will be of triangular shape facing down.",
     *       "displayName": "Triangle Down"
     *     },
     *  "triangleUp": {
     *       "description": "The  marker will be of triangular shape facing up.",
     *       "displayName": "Triangle Up"
     *     }
     *   }
     */
    markerShape?: MarkerShapes;
    /**
     * @description
     * The color of the marker, if different than the line color. Only applies if the symbolType is "lineWithMarker".
     * @ojmetadata description "The color of the marker, if different than the line color. Only applies if the symbolType is "lineWithMarker"."
     * @ojmetadata displayName "sections"
     * @ojmetadata help "#sections"
     */
    markerColor?: string;
    /**
     * @description
     * The description of this legend item. This is used for accessibility and for customizing the tooltip text.
     * @ojmetadata description "The description of this legend item. This is used for accessibility and for customizing the tooltip text."
     * @ojmetadata displayName "Short Desc"
     * @ojmetadata help "#shortDesc"
     * @ojmetadata translatable
     */
    shortDesc?: string;
    /**
     * @description
     * Whether drilling is enabled on the legend item. Drillable objects will show a pointer cursor on hover and fire ojDrill event on click. To enable drilling for all legend items at once, use the drilling attribute in the top level.
     * @ojmetadata description "Whether drilling is enabled on the legend item."
     * @ojmetadata displayName "Drilling"
     * @ojmetadata help "#drilling"
     * @ojmetadata propertyEditorValues {
     *     "inherit": {
     *       "description": "The drilling behavior is inherited from legend.",
     *       "displayName": "Inherit"
     *     },
     *     "off": {
     *       "description": "The legend item will not be drillable.",
     *       "displayName": "Off"
     *     },
     *     "on": {
     *       "description": "The legend item will be drillable.",
     *       "displayName": "On"
     *     }
     *   }
     */
    drilling?: 'on' | 'off' | 'inherit';
};
/** @deprecated since 19.0.0 - use 'ComponentProps<typeof LegendItem>' instead */
export type LegendItemPropsDeprecated = LegendItemImplProps;
/**
 * This export corresponds to the LegendItem Preact component. For the oj-c-legend-item custom element, import CLegendItemElement instead.
 */
export declare const LegendItem: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<LegendItemImplProps>>;
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-legend-item custom element. For the LegendItem Preact component, import LegendItem instead.
 */
export interface CLegendItemElement extends JetElement<CLegendItemElementSettableProperties>, CLegendItemElementSettableProperties {
    addEventListener<T extends keyof CLegendItemElementEventMap>(type: T, listener: (this: HTMLElement, ev: CLegendItemElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CLegendItemElementSettableProperties>(property: T): CLegendItemElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CLegendItemElementSettableProperties>(property: T, value: CLegendItemElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CLegendItemElementSettableProperties>): void;
    setProperties(properties: CLegendItemElementSettablePropertiesLenient): void;
}
export namespace CLegendItemElement {
    type borderColorChanged = JetElementCustomEventStrict<CLegendItemElement['borderColor']>;
    type categoriesChanged = JetElementCustomEventStrict<CLegendItemElement['categories']>;
    type colorChanged = JetElementCustomEventStrict<CLegendItemElement['color']>;
    type drillingChanged = JetElementCustomEventStrict<CLegendItemElement['drilling']>;
    type lineStyleChanged = JetElementCustomEventStrict<CLegendItemElement['lineStyle']>;
    type lineWidthChanged = JetElementCustomEventStrict<CLegendItemElement['lineWidth']>;
    type markerColorChanged = JetElementCustomEventStrict<CLegendItemElement['markerColor']>;
    type markerShapeChanged = JetElementCustomEventStrict<CLegendItemElement['markerShape']>;
    type shortDescChanged = JetElementCustomEventStrict<CLegendItemElement['shortDesc']>;
    type sourceChanged = JetElementCustomEventStrict<CLegendItemElement['source']>;
    type symbolTypeChanged = JetElementCustomEventStrict<CLegendItemElement['symbolType']>;
    type textChanged = JetElementCustomEventStrict<CLegendItemElement['text']>;
}
export interface CLegendItemElementEventMap extends HTMLElementEventMap {
    'borderColorChanged': JetElementCustomEventStrict<CLegendItemElement['borderColor']>;
    'categoriesChanged': JetElementCustomEventStrict<CLegendItemElement['categories']>;
    'colorChanged': JetElementCustomEventStrict<CLegendItemElement['color']>;
    'drillingChanged': JetElementCustomEventStrict<CLegendItemElement['drilling']>;
    'lineStyleChanged': JetElementCustomEventStrict<CLegendItemElement['lineStyle']>;
    'lineWidthChanged': JetElementCustomEventStrict<CLegendItemElement['lineWidth']>;
    'markerColorChanged': JetElementCustomEventStrict<CLegendItemElement['markerColor']>;
    'markerShapeChanged': JetElementCustomEventStrict<CLegendItemElement['markerShape']>;
    'shortDescChanged': JetElementCustomEventStrict<CLegendItemElement['shortDesc']>;
    'sourceChanged': JetElementCustomEventStrict<CLegendItemElement['source']>;
    'symbolTypeChanged': JetElementCustomEventStrict<CLegendItemElement['symbolType']>;
    'textChanged': JetElementCustomEventStrict<CLegendItemElement['text']>;
}
export interface CLegendItemElementSettableProperties extends JetSettableProperties {
    /**
     * The border color of the marker. Only applies if symbolType is "marker" or "lineWithMarker
     */
    borderColor?: LegendItemImplProps['borderColor'];
    /**
     * An array of categories for the legend item. Legend items currently only support a single category.
     */
    categories?: LegendItemImplProps['categories'];
    /**
     * The color of the legend symbol (line or marker). When symbolType is "lineWithMarker", this attribute defines the line color and the markerColor attribute defines the marker color.
     */
    color?: LegendItemImplProps['color'];
    /**
     * Whether drilling is enabled on the legend item. Drillable objects will show a pointer cursor on hover and fire ojDrill event on click. To enable drilling for all legend items at once, use the drilling attribute in the top level.
     */
    drilling?: LegendItemImplProps['drilling'];
    /**
     * The line style. Only applies when the symbolType is "line" or "lineWithMarker".
     */
    lineStyle?: LegendItemImplProps['lineStyle'];
    /**
     * The line width in pixels. Only applies when the symbolType is "line" or "lineWithMarker.
     */
    lineWidth?: LegendItemImplProps['lineWidth'];
    /**
     * The color of the marker, if different than the line color. Only applies if the symbolType is "lineWithMarker".
     */
    markerColor?: LegendItemImplProps['markerColor'];
    /**
     * The shape of the marker. Only applies if symbolType is "marker" or "lineWithMarker". Does not apply if a custom image is specified.
     */
    markerShape?: LegendItemImplProps['markerShape'];
    /**
     * The description of this legend item. This is used for accessibility and for customizing the tooltip text.
     */
    shortDesc?: LegendItemImplProps['shortDesc'];
    /**
     * The URI of the image of the legend symbol.
     */
    source?: LegendItemImplProps['source'];
    /**
     * The type of legend symbol to display.
     */
    symbolType?: LegendItemImplProps['symbolType'];
    /**
     * The legend item text. Also used as item aria label if short-desc is not provided.
     */
    text: LegendItemImplProps['text'];
}
export interface CLegendItemElementSettablePropertiesLenient extends Partial<CLegendItemElementSettableProperties> {
    [key: string]: any;
}
export interface LegendItemIntrinsicProps extends Partial<Readonly<CLegendItemElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onborderColorChanged?: (value: CLegendItemElementEventMap['borderColorChanged']) => void;
    oncategoriesChanged?: (value: CLegendItemElementEventMap['categoriesChanged']) => void;
    oncolorChanged?: (value: CLegendItemElementEventMap['colorChanged']) => void;
    ondrillingChanged?: (value: CLegendItemElementEventMap['drillingChanged']) => void;
    onlineStyleChanged?: (value: CLegendItemElementEventMap['lineStyleChanged']) => void;
    onlineWidthChanged?: (value: CLegendItemElementEventMap['lineWidthChanged']) => void;
    onmarkerColorChanged?: (value: CLegendItemElementEventMap['markerColorChanged']) => void;
    onmarkerShapeChanged?: (value: CLegendItemElementEventMap['markerShapeChanged']) => void;
    onshortDescChanged?: (value: CLegendItemElementEventMap['shortDescChanged']) => void;
    onsourceChanged?: (value: CLegendItemElementEventMap['sourceChanged']) => void;
    onsymbolTypeChanged?: (value: CLegendItemElementEventMap['symbolTypeChanged']) => void;
    ontextChanged?: (value: CLegendItemElementEventMap['textChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-legend-item': LegendItemIntrinsicProps;
        }
    }
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ColorProps } from '@oracle/oraclejet-preact/utils/UNSAFE_interpolations/colors';
import Converter = require('ojs/ojconverter');
export type ViewPortDetail = {
    /**
     * The start group of the new viewport on a chart with categorical axis.
     * @ojmetadata description "The start group of the new viewport on a chart with categorical axis."
     */
    startGroup: string;
    /**
     * The end group of the new viewport on a chart with categorical axis.
     * @ojmetadata description "The end group of the new viewport on a chart with categorical axis."
     */
    endGroup: string;
    /**
     * The maximum x value of the new viewport.
     * @ojmetadata description "The maximum x value of the new viewport."
     */
    xMax: number;
    /**
     * The minimum x value of the new viewport.
     * @ojmetadata description "The minimum x value of the new viewport."
     */
    xMin: number;
    /**
     * The maximum y value of the new viewport.
     * @ojmetadata description "The maximum y value of the new viewport."
     */
    yMax: number;
    /**
     * The minimum y value of the new viewport.
     * @ojmetadata description "The minimum y value of the new viewport."
     */
    yMin: number;
};
export type PlotArea = {
    /**
     * The color of the plot area background.
     * @ojmetadata description "The background color of the plot area."
     * @ojmetadata format "color"
     * @ojmetadata displayName "Background Color"
     */
    backgroundColor?: ColorProps['color'];
};
export type ChartAxisConverter = {
    /**
     * The converter used to format the tick label of the axis.
     * @ojmetadata description "The converter to format the tick labels."
     * @ojmetadata displayName "Converter"
     */
    format: (value: number) => string;
};
export type YAxisTickLabel = {
    /**
     * The converter used to format the tick label of the axis.
     * @ojmetadata description "The converter to format the axis tick labels."
     * @ojmetadata displayName "Converter"
     */
    converter?: Converter<number>;
    /**
     * Whether the tick labels are rendered or not.
     * @ojmetadata description "Whether the tick labels are rendered or not."
     * @ojmetadata displayName "Rendered"
     * @ojmetadata propertyEditorValues {
     *     "on": {
     *       "description": "Renders the axis tick label.",
     *       "displayName": "On"
     *     },
     *     "off": {
     *       "description": "Axis tick labels won't be rendered.",
     *       "displayName": "Off"
     *     }
     *   }
     */
    rendered?: 'on' | 'off';
    /**
     * The object defining the style of the labels. The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
     * @ojmetadata description "The style of the tick labels."
     * @ojmetadata displayName "Style"
     */
    style?: Partial<CSSStyleDeclaration>;
};
export type XAxisTickLabel = {
    /**
     * The converter used to format the tick label of the axis. When using a time axis, this attribute also takes an array of two converters, which apply respectively to the first and second label levels.
     * @ojmetadata description "The converter to format the axis tick labels."
     * @ojmetadata displayName "Converter"
     */
    converter?: Converter<string> | [Converter<string>, Converter<string>];
    /**
     * Whether the tick labels are rendered or not.
     * @ojmetadata description "Whether the tick labels are rendered or not."
     * @ojmetadata displayName "Rendered"
     * @ojmetadata propertyEditorValues {
     *     "on": {
     *       "description": "Renders the axis tick label.",
     *       "displayName": "On"
     *     },
     *     "off": {
     *       "description": "Axis tick labels won't be rendered.",
     *       "displayName": "Off"
     *     }
     *   }
     */
    rendered?: 'on' | 'off';
    /**
     * Defines whether the chart will automatically rotate the labels by 90 degrees in order to fit more labels on the axis.
     * The rotation will only be applied to categorical labels for a horizontal axis.
     * @ojmetadata description "Whether the ticklabels can be rotated."
     * @ojmetadata displayName "Rotation"
     * @ojmetadata propertyEditorValues {
     *     "none": {
     *       "description": "The axis labels will not be rotated.",
     *       "displayName": "On"
     *     },
     *     "off": {
     *       "description": "The axis labels might be rotated in order to fit more labels.",
     *       "displayName": "auto"
     *     }
     *   }
     */
    rotation?: 'auto' | 'none';
    /**
     * The object defining the style of the labels. The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration, whiteSpace.
     * The CSS white-space property can be defined with value "nowrap" to disable default text wrapping of categorical labels
     * @ojmetadata description "The style of the tick labels."
     * @ojmetadata displayName "Style"
     */
    style?: Partial<CSSStyleDeclaration>;
};
export type MajorTick = {
    /**
     * The color of the line.
     * @ojmetadata description "The color of the line."
     * @ojmetadata displayName "Line Color"
     * @ojmetadata format "color"
     */
    lineColor?: ColorProps['color'];
    /**
     * The style of the line.
     * @ojmetadata description "The style of the line."
     * @ojmetadata displayName "Line Style"
     * @ojmetadata propertyEditorValues {
     *     "dashed": {
     *       "description": "Renders dashed major tick.",
     *       "displayName": "Dashed"
     *     },
     *     "dotted": {
     *       "description": "Renders dotted major tick.",
     *       "displayName": "Dotted"
     *     },
     *    "solid": {
     *       "description": "Renders solid major tick.",
     *       "displayName": "Solid"
     *     }
     *   }
     */
    lineStyle?: 'dashed' | 'dotted' | 'solid';
    /**
     * The width of the line.
     * @ojmetadata description "The width of the line."
     * @ojmetadata displayName "Line Width"
     */
    lineWidth?: number;
    /**
     * Whether the tick is rendered or not.
     * @ojmetadata description "The color of the line."
     * @ojmetadata displayName "Rendered"
     * @ojmetadata propertyEditorValues {
     *     "off": {
     *       "description": "Renders the minor tick.",
     *       "displayName": "Off"
     *     },
     *     "on": {
     *       "description": "Does not render the minor tick.",
     *       "displayName": "On"
     *     },
     *    "auto": {
     *       "description": "Renders the minor tick for log scale.",
     *       "displayName": "Auto"
     *     }
     *   }
     */
    rendered: 'off' | 'on' | 'auto';
};
export type MinorTick = {
    /**
     * The color of the line.
     * @ojmetadata description "The color of the line."
     * @ojmetadata displayName "Line Color"
     * @ojmetadata format "color"
     */
    lineColor?: ColorProps['color'];
    /**
     * The style of the line.
     * @ojmetadata description "The style of the line."
     * @ojmetadata displayName "Line Style"
     * @ojmetadata propertyEditorValues {
     *     "dashed": {
     *       "description": "Renders dashed major tick.",
     *       "displayName": "Dashed"
     *     },
     *     "dotted": {
     *       "description": "Renders dotted major tick.",
     *       "displayName": "Dotted"
     *     },
     *    "solid": {
     *       "description": "Renders solid major tick.",
     *       "displayName": "Solid"
     *     }
     *   }
     */
    lineStyle?: 'dashed' | 'dotted' | 'solid';
    /**
     * The width of the line.
     * @ojmetadata description "The width of the line."
     * @ojmetadata displayName "Line Width"
     */
    lineWidth?: number;
    /**
     * Whether the tick is rendered.
     * @ojmetadata description "Whether the minor tick are rendered."
     * @ojmetadata displayName "Rendered"
     * @ojmetadata propertyEditorValues {
     *     "off": {
     *       "description": "Renders the minor tick.",
     *       "displayName": "Off"
     *     },
     *     "on": {
     *       "description": "Does not render the minor tick.",
     *       "displayName": "On"
     *     },
     *    "auto": {
     *       "description": "Renders the minor tick for log scale.",
     *       "displayName": "Auto"
     *     }
     *   }
     */
    rendered: 'off' | 'on' | 'auto';
};
export type YAxis = {
    /**
     * The maximum data value corresponding to an axis. If specified, the automatic axis extent calculation will use this value.
     * @ojmetadata description "The maximum value of the chart data."
     * @ojmetadata displayName "Data Max"
     */
    dataMax?: number;
    /**
     * The minimum data value corresponding to an axis. If specified, the automatic axis extent calculation will use this value.
     * @ojmetadata description "The minimum value of the chart data."
     * @ojmetadata displayName "Data Min"
     */
    dataMin?: number;
    /**
     * The maximum value of the axis. Defaults to null for automatic calculation based on the data.
     * @ojmetadata description "The maximum value of the y axis."
     * @ojmetadata displayName "Max"
     */
    max?: number;
    /**
     * The minumum value of the axis. Defaults to null for automatic calculation based on the data.
     * @ojmetadata description "The minimum value of the y axis."
     * @ojmetadata displayName "Min"
     */
    min?: number;
    /**
     * The object defining the properties of the major tick of the y axis.
     * @ojmetadata description "The y axis major tick properties."
     * @ojmetadata displayName "Major Tick"
     */
    majorTick?: MajorTick;
    /**
     * The object defining the properties of the minor tick of the y axis.
     * @ojmetadata description "The y axis minor tick properties."
     * @ojmetadata displayName "Minor Tick"
     */
    minorTick?: MinorTick;
    /**
     * The object defining the properties of tick labels of the y axis.
     * @ojmetadata description "The y axis tick label properties."
     * @ojmetadata displayName "Tick Label"
     */
    tickLabel?: YAxisTickLabel;
    /**
     * Specifies the minimum y coordinate of the current viewport for zoom and scroll.
     * If not specified, this value will be the axis min.
     * @ojmetadata description "The current minimum value of y axis viewport."
     * @ojmetadata displayName "Viewport Min"
     */
    viewportMin?: number;
    /**
     * Specifies the maximum y coordinate of the current viewport for zoom and scroll.
     * If not specified, this value will be the axis max.
     * @ojmetadata description "The current maximum value of y axis viewport."
     * @ojmetadata displayName "Viewport Max"
     */
    viewportMax?: number;
    /**
     * The increment between major tick marks in y axis. Defaults to null for automatic calculation based on the data.
     * For log axis, the step is a multiplier, for example, if the step is 2, the major tick marks will be rendered at 1, 2, 4, 8, and so on.
     * @ojmetadata description "The increment between major tick marks in y axis."
     * @ojmetadata displayName "Step"
     */
    step?: number;
    /**
     * Defines the size of the axis in terms of ratio of the width (for vertical charts) or height (for horizontal charts).
     * @ojmetadata description "The size of the axis."
     * @ojmetadata displayName "Size"
     */
    size?: number;
    /**
     * Defines the axis scale. If set to log, major ticks will rendered will be incremented in logarithmic ratio.
     * @ojmetadata description "The scale of the axis."
     * @ojmetadata displayName "Scale"
     * @ojmetadata propertyEditorValues {
     *     "linear": {
     *       "description": "Renders linear y axis.",
     *       "displayName": "Linear"
     *     },
     *     "log": {
     *       "description": "Renders log y axis.",
     *       "displayName": "Log"
     *     }
     *   }
     */
    scale?: 'log' | 'linear';
    /**
     * The title of the axis.
     * @ojmetadata description "The axis title."
     * @ojmetadata displayName "Title"
     */
    title?: string;
    /**
     * The object defining the css properties of the axis title.
     * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
     * @ojmetadata description "The axis title style."
     * @ojmetadata displayName "Title Style"
     */
    titleStyle?: Partial<CSSStyleDeclaration>;
};
export type Y2Axis = {
    /**
     * The maximum data value corresponding to an axis. If specified, the automatic axis extent calculation will use this value.
     * @ojmetadata description "The maximum value of the chart data."
     * @ojmetadata displayName "Data Max"
     */
    dataMax?: number;
    /**
     * The minimum data value corresponding to an axis. If specified, the automatic axis extent calculation will use this value.
     * @ojmetadata description "The minimum value of the chart data."
     * @ojmetadata displayName "Data Min"
     */
    dataMin?: number;
    /**
     * The maximum value of the axis. Defaults to null for automatic calculation based on the data.
     * @ojmetadata description "The maximum value of the y axis."
     * @ojmetadata displayName "Max"
     */
    max?: number;
    /**
     * The minumum value of the axis. Defaults to null for automatic calculation based on the data.
     * @ojmetadata description "The minimum value of the y axis."
     * @ojmetadata displayName "Min"
     */
    min?: number;
    /**
     * The object defining the properties of the major tick of the y axis.
     * @ojmetadata description "The y axis major tick properties."
     * @ojmetadata displayName "Major Tick"
     */
    majorTick?: MajorTick;
    /**
     * The object defining the properties of the minor tick of the y axis.
     * @ojmetadata description "The y axis minor tick properties."
     * @ojmetadata displayName "Minor Tick"
     */
    minorTick?: MinorTick;
    /**
     * The object defining the properties of tick labels of the y axis.
     * @ojmetadata description "The y axis tick label properties."
     * @ojmetadata displayName "Tick Label"
     */
    tickLabel?: YAxisTickLabel;
    /**
     * Specifies the minimum y coordinate of the current viewport for zoom and scroll.
     * If not specified, this value will be the axis min.
     * @ojmetadata description "The current minimum value of y axis viewport."
     * @ojmetadata displayName "Viewport Min"
     */
    viewportMin?: number;
    /**
     * Specifies the maximum y coordinate of the current viewport for zoom and scroll.
     * If not specified, this value will be the axis max.
     * @ojmetadata description "The current maximum value of y axis viewport."
     * @ojmetadata displayName "Viewport Max"
     */
    viewportMax?: number;
    /**
     * The increment between major tick marks in y axis. Defaults to null for automatic calculation based on the data.
     * For log axis, the step is a multiplier, for example, if the step is 2, the major tick marks will be rendered at 1, 2, 4, 8, and so on.
     * @ojmetadata description "The increment between major tick marks in y axis."
     * @ojmetadata displayName "Step"
     */
    step?: number;
    /**
     * Defines the size of the axis in terms of ratio of the width (for vertical charts) or height (for horizontal charts).
     * @ojmetadata description "The size of the axis."
     * @ojmetadata displayName "Size"
     */
    size?: number;
    /**
     * Defines the axis scale. If set to log, major ticks will rendered will be incremented in logarithmic ratio.
     * @ojmetadata description "The scale of the axis."
     * @ojmetadata displayName "Scale"
     * @ojmetadata propertyEditorValues {
     *     "linear": {
     *       "description": "Renders linear y axis.",
     *       "displayName": "Linear"
     *     },
     *     "log": {
     *       "description": "Renders log y axis.",
     *       "displayName": "Log"
     *     }
     *   }
     */
    scale?: 'log' | 'linear';
    /**
     * The title of the axis.
     * @ojmetadata description "The axis title."
     * @ojmetadata displayName "Title"
     */
    title?: string;
    /**
     * The object defining the css properties of the axis title.
     * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
     * @ojmetadata description "The axis title style."
     * @ojmetadata displayName "Title Style"
     */
    titleStyle?: Partial<CSSStyleDeclaration>;
};
export type XAxis = {
    /**
     * The object defining the properties of the major tick of the x axis.
     * @ojmetadata description "The x axis major tick properties."
     * @ojmetadata displayName "Major Tick"
     */
    majorTick?: MajorTick;
    /**
     * The object defining the properties of the minor tick of the x axis.
     * @ojmetadata description "The x axis minor tick properties."
     * @ojmetadata displayName "Minor Tick"
     */
    minorTick?: MinorTick;
    /**
     * The object defining the properties of tick labels of the x axis.
     * @ojmetadata description "The x axis tick label properties."
     * @ojmetadata displayName "Tick Label"
     */
    tickLabel?: XAxisTickLabel;
    /**
     * Specifies the minimum y coordinate of the current viewport for zoom and scroll.
     * If not specified, this value will be the axis min.
     * @ojmetadata description "The current minimum value of x axis viewport."
     * @ojmetadata displayName "Viewport Min"
     */
    viewportMin?: number;
    /**
     * Specifies the maximum y coordinate of the current viewport for zoom and scroll.
     * If not specified, this value will be the axis max.
     * @ojmetadata description "The current maximum value of x axis viewport."
     * @ojmetadata displayName "Viewport Max"
     */
    viewportMax?: number;
    /**
     * The increment between major tick marks in y axis. Defaults to null for automatic calculation based on the data.
     * For log axis, the step is a multiplier, for example, if the step is 2, the major tick marks will be rendered at 1, 2, 4, 8, and so on.
     * @ojmetadata description "The increment between major tick marks in x axis."
     * @ojmetadata displayName "Step"
     */
    step?: number;
    /**
     * Defines the size of the axis in terms of ratio of the width (for vertical charts) or height (for horizontal charts).
     * @ojmetadata description The size of the axis.
     * @ojmetadata displayName "Size"
     */
    size?: number;
    /**
     * Defines the axis scale. If set to log, major ticks will rendered will be incremented in logarithmic ratio.
     * @ojmetadata description The scale of the axis.
     * @ojmetadata displayName "Scale"
     */
    scale?: 'log' | 'linear';
    /**
     * The title of the axis.
     * @ojmetadata description "The axis title."
     * @ojmetadata displayName "Title"
     */
    title?: string;
    /**
     * The object defining the css properties of the axis title.
     * @ojmetadata description "The axis title style."
     * @ojmetadata displayName "Title Style"
     */
    titleStyle?: Partial<CSSStyleDeclaration>;
};
export type TextValueFormat = {
    /**
     * A string representing the label that is displayed before the value in the tooltip.
     * This value can also take an array of strings to be applied to hierarchical group names, from outermost to innermost.
     * @ojmetadata description "A string representing the label that is displayed before the value in the tooltip."
     * @ojmetadata displayName "Tooltip Label"
     */
    tooltipLabel?: string;
    /**
     * Whether the value is displayed in the tooltip.
     * @ojmetadata description "Whether the value is displayed in the tooltip."
     * @ojmetadata displayName "Tooltip Display"
     * @ojmetadata propertyEditorValues {
     *     "off": {
     *       "description": "The property will not be displayed in tooltip.",
     *       "displayName": "Off"
     *     },
     *     "on": {
     *       "description": "The property will be displayed in tooltip.",
     *       "displayName": "On"
     *     },
     * }
     */
    tooltipDisplay?: 'off' | 'auto';
};
export type NumericalValueFormat = {
    /**
     * The converter to format the numerical value for the tooltip.
     * @ojmetadata description "The converter to format the numerical value for the tooltip."
     */
    converter: Converter<number>;
} & TextValueFormat;
export type ValueFormats = {
    /**
     * Object that specifies the value formatting and tooltip behavior for the group.
     * @ojmetadata description "The object defining formatting and tooltip behavior for the group."
     */
    group: TextValueFormat;
    /**
     * Object that specifies the value formatting and tooltip behavior for the series.
     * @ojmetadata description "The object defining formatting and tooltip behavior for the series."
     */
    series: TextValueFormat;
    /**
     * Object that specifies the value formatting and tooltip behavior for the item value.
     * @ojmetadata description "The object defining formatting and tooltip behavior for the value."
     */
    value: NumericalValueFormat;
};

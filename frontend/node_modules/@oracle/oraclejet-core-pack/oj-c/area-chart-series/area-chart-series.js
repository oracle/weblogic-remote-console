define(["require", "exports", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent"], function (require, exports, translationBundle_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AreaChartSeries = exports.AreaChartSeriesDefaults = void 0;
    exports.AreaChartSeriesDefaults = {
        drilling: 'inherit'
    };
    exports.AreaChartSeries = (0, ojvcomponent_1.registerCustomElement)('oj-c-area-chart-series', 
    /**
     *@classdesc
     *<h3 id="areaChartSeriesOverview-section">
     *   JET Area Chart Series
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#areaChartSeriesOverview-section"></a>
     * </h3>
     *
     * <p>The oj-c-area-chart-series element is used to declare series properties. See the Help documentation for more information</p>
     *
     *<pre class="prettyprint">
     * <code>
     * &lt;oj-c-area-chart data="[[dataProvider]]">
     *  &lt;template slot='seriesTemplate'>
     *    &lt;oj-c-area-chart-series
     *      drilling='on'
     *      marker-shape='[[ $current.id == "Series 1" ? "square" : "circle" ]]'>
     *    &lt;/oj-c-area-chart-series>
     *  &lt;/template>
     * &lt;/oj-c-area-chart>
     * </code>
     * </pre>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     * <p>
     *  Read the <a target="_blank" href="oj-c.AreaChart.html#a11y-section">Accessibility Section</a> of the oj-c-area-chart component for details about making this component accessible.
     * </p>
     *
     * @ojmetadata subcomponentType "data"
     * @ojmetadata description "The oj-c-area-chart-series element is used to declare series properties in the seriesTemplate"
     * @ojmetadata displayName "AreaChartSeries"
     * @ojmetadata main "oj-c/area-chart-series"
     * @ojmetadata help "oj-c.AreaChartSeries.html"
     * @ojmetadata status [
     *   {
     *     type: "candidate",
     *     since: "17.0.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Visualizations"
     *   }
     * }
     * @ojmetadata since "16.0.0"
     *
     */
    ({ drilling = exports.AreaChartSeriesDefaults.drilling, 
    /* @ts-ignore */
    ...props }) => {
        return null;
    }, "AreaChartSeries", { "properties": { "assignedToY2": { "type": "string", "enumValues": ["off", "on"] }, "categories": { "type": "Array<string>" }, "color": { "type": "string" }, "drilling": { "type": "string", "enumValues": ["inherit", "off", "on"] }, "lineType": { "type": "string", "enumValues": ["curved", "straight"] }, "markerShape": { "type": "string", "enumValues": ["auto", "square", "circle", "diamond", "human", "plus", "star", "triangleDown", "triangleUp"] }, "markerColor": { "type": "string" }, "markerDisplayed": { "type": "string" }, "markerSize": { "type": "number" }, "name": { "type": "string" }, "shortDesc": { "type": "string" } } }, { "drilling": "inherit" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

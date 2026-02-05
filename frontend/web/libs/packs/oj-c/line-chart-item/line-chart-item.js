define(["require", "exports", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent"], function (require, exports, translationBundle_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LineChartItem = void 0;
    exports.LineChartItem = (0, ojvcomponent_1.registerCustomElement)('oj-c-line-chart-item', 
    /**
     *@classdesc
     *<h3 id="lineChartItemOverview-section">
     *   JET Line Chart Item
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#lineChartItemOverview-section"></a>
     * </h3>
     *
     * <p>The oj-c-line-chart-item element is used to declare item properties. See the Help documentation for more information.</p>
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-line-chart data="[[dataProvider]]">
     *  &lt;template slot='itemTemplate'>
     *    &lt;oj-c-line-chart-item
     *      value="[[$current.data.value]]"
     *      series-id="[[$current.data.productName]]"
     *      group-id="[[ [$current.data.year] ]]">
     *    &lt;/oj-c-line-chart-item>
     *  &lt;/template>
     * &lt;/oj-c-line-chart>
     * </code>
     * </pre>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     * <p>
     *  Read the <a target="_blank" href="oj-c.LineChart.html#a11y-section">Accessibility Section</a> of the oj-c-line-chart component for details about making this component accessible.
     * </p>
     *
     * @ojmetadata subcomponentType "data"
     * @ojmetadata description "The oj-c-line-chart-item element is used to declare item properties"
     * @ojmetadata displayName "LineChartItem"
     * @ojmetadata main "oj-c/line-chart-item"
     * @ojmetadata help "oj-c.LineChartItem.html"
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
     */
    ({}) => {
        return null;
    }, "LineChartItem", { "properties": { "seriesId": { "type": "string" }, "groupId": { "type": "Array<string>" }, "value": { "type": "number" }, "x": { "type": "string" }, "color": { "type": "string" }, "markerDisplayed": { "type": "string", "enumValues": ["auto", "off", "on"] }, "markerShape": { "type": "string", "enumValues": ["auto", "square", "circle", "diamond", "human", "plus", "star", "triangleDown", "triangleUp"] }, "markerSize": { "type": "number" }, "categories": { "type": "Array<string>" }, "drilling": { "type": "string", "enumValues": ["inherit", "off", "on"] }, "shortDesc": { "type": "string" } } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

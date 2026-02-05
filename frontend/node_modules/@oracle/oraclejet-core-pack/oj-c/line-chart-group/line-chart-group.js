define(["require", "exports", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent"], function (require, exports, translationBundle_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LineChartGroup = exports.LineChartGroupDefaults = void 0;
    exports.LineChartGroupDefaults = {
        drilling: 'inherit'
    };
    exports.LineChartGroup = (0, ojvcomponent_1.registerCustomElement)('oj-c-line-chart-group', 
    /**
     *@classdesc
     *<h3 id="lineChartGroupOverview-section">
     *   JET Line Chart Group
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#lineChartGroupOverview-section"></a>
     * </h3>
     *
     * <p>The oj-c-line-chart-group element is used to declare group properties. See the Help documentation for more information.</p>
     *
     *<pre class="prettyprint">
     * <code>
     * &lt;oj-c-line-chart data="[[dataProvider]]">
     *  &lt;template slot='groupTemplate'>
     *    &lt;oj-c-line-chart-group
     *      drilling='on'
     *      label-style='[[$current.depth == 1 ? {"fontWeight":"bold"} : {"fontStyle":"italic"}]]'>
     *    &lt;/oj-c-line-chart-group>
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
     * @ojmetadata description "The oj-c-line-chart-group element is used to declare group properties in the groupTemplate"
     * @ojmetadata displayName "LineChartGroup"
     * @ojmetadata main "oj-c/line-chart-group"
     * @ojmetadata help "oj-c.LineChartGroup.html"
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
    ({ drilling = exports.LineChartGroupDefaults.drilling, 
    /* @ts-ignore */
    ...props }) => {
        return null;
    }, "LineChartGroup", { "properties": { "drilling": { "type": "string", "enumValues": ["inherit", "off", "on"] }, "name": { "type": "string" }, "shortDesc": { "type": "string" } } }, { "drilling": "inherit" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

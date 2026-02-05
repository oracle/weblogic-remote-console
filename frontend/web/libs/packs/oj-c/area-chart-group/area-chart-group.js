define(["require", "exports", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent"], function (require, exports, translationBundle_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AreaChartGroup = exports.AreaChartGroupDefaults = void 0;
    exports.AreaChartGroupDefaults = {
        drilling: 'inherit'
    };
    exports.AreaChartGroup = (0, ojvcomponent_1.registerCustomElement)('oj-c-area-chart-group', 
    /**
     *@classdesc
     *<h3 id="areaChartGroupOverview-section">
     *   JET Area Chart Group
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#areaChartGroupOverview-section"></a>
     * </h3>
     *
     * <p>The oj-c-area-chart-group element is used to declare group properties. See the Help documentation for more information.</p>
     *
     *<pre class="prettyprint">
     * <code>
     * &lt;oj-c-area-chart data="[[dataProvider]]">
     *  &lt;template slot='groupTemplate'>
     *    &lt;oj-c-area-chart-group
     *      drilling='on'
     *      label-style='[[$current.depth == 1 ? {"fontWeight":"bold"} : {"fontStyle":"italic"}]]'>
     *    &lt;/oj-c-area-chart-group>
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
     * @ojmetadata description "The oj-c-area-chart-group element is used to declare group properties in the groupTemplate"
     * @ojmetadata displayName "AreaChartGroup"
     * @ojmetadata main "oj-c/area-chart-group"
     * @ojmetadata help "oj-c.AreaChartGroup.html"
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
    ({ drilling = exports.AreaChartGroupDefaults.drilling, 
    /* @ts-ignore */
    ...props }) => {
        return null;
    }, "AreaChartGroup", { "properties": { "drilling": { "type": "string", "enumValues": ["inherit", "off", "on"] }, "name": { "type": "string" }, "shortDesc": { "type": "string" } } }, { "drilling": "inherit" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

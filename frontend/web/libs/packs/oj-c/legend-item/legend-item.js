define(["require", "exports", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent"], function (require, exports, translationBundle_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LegendItem = exports.LegendItemDefaults = void 0;
    exports.LegendItemDefaults = {
        markerShape: 'square',
        symbolType: 'marker',
        borderColor: '',
        categories: [],
        lineStyle: 'solid',
        drilling: 'inherit'
    };
    exports.LegendItem = (0, ojvcomponent_1.registerCustomElement)('oj-c-legend-item', 
    /**
     *@classdesc
     * <h3 id="overview">
     *   JET Legend Item
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
     * </h3>
     *
     * <p>
     *  The oj-c-legend-item element is used to declare properties for legend items and is only valid as the
     *  child of a template element for the <a target="_blank" href="oj-c.Legend.html#itemTemplate">itemTemplate</a>
     *  slot of oj-c-legend.
     * </p>
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-legend data='[[dataProvider]]'>
     *  &lt;template slot='itemTemplate'>
     *    &lt;oj-c-legend-item  text='[[$current.data.text]]' color='[[$current.data.color]]'>
     *    &lt;/oj-c-legend-item>
     *  &lt;/template>
     * &lt;/oj-c-legend>
     * </code>
     * </pre>
     *
     * <h3 id="a11y-section">
     *  Accessibility
     *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     * <p>
     *  Read the <a target="_blank" href="oj-c.Legend.html#a11y-section">Accessibility Section</a> of the oj-c-legend component for details about making this component accessible.
     * </p>
     * @ojmetadata subcomponentType "data"
     * @ojmetadata description "The oj-c-legend-item element is used to declare properties for legend items."
     * @ojmetadata displayName "LegendItem"
     * @ojmetadata main "oj-c/legend-item"
     * @ojmetadata help "oj-c.LegendItem.html"
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
     * @ojmetadata since "15.0.0"
     */
    ({ markerShape = exports.LegendItemDefaults.markerShape, symbolType = exports.LegendItemDefaults.symbolType, borderColor = exports.LegendItemDefaults.borderColor, categories = exports.LegendItemDefaults.categories, lineStyle = exports.LegendItemDefaults.lineStyle, drilling = exports.LegendItemDefaults.drilling, 
    /* @ts-ignore */
    ...props }) => {
        return null;
    }, "LegendItem", { "properties": { "text": { "type": "string" }, "categories": { "type": "Array<string>" }, "symbolType": { "type": "string", "enumValues": ["marker", "image", "line", "lineWithMarker"] }, "source": { "type": "string" }, "color": { "type": "string" }, "borderColor": { "type": "string" }, "lineStyle": { "type": "string", "enumValues": ["dashed", "solid", "dotted"] }, "lineWidth": { "type": "number" }, "markerShape": { "type": "string", "enumValues": ["square", "circle", "ellipse", "diamond", "human", "plus", "star", "triangleDown", "triangleUp", "rectangle"] }, "markerColor": { "type": "string" }, "shortDesc": { "type": "string" }, "drilling": { "type": "string", "enumValues": ["inherit", "off", "on"] } } }, { "markerShape": "square", "symbolType": "marker", "borderColor": "", "categories": [], "lineStyle": "solid", "drilling": "inherit" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

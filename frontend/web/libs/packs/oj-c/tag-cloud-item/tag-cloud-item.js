define(["require", "exports", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent"], function (require, exports, translationBundle_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TagCloudItem = exports.TagCloudItemDefaults = void 0;
    exports.TagCloudItemDefaults = {
        categories: []
    };
    exports.TagCloudItem = (0, ojvcomponent_1.registerCustomElement)('oj-c-tag-cloud-item', 
    /**
     *@classdesc
     *<h3 id="tagCloudItemOverview-section">
     *   JET Tag Cloud Item
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#tagCloudItemOverview-section"></a>
     * </h3>
     *
     * <p>The oj-c-tag-cloud-item element is used to declare properties for tag cloud items and is only valid as the
     *  child of a template element for the <a target="_blank" href="oj-c.TagCloud.html#itemTemplate">itemTemplate</a> slot of oj-c-tag-cloud.</p>
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-tag-cloud data='[[dataProvider]]'>
     *  &lt;template slot='itemTemplate' data-oj-as='item'>
     *    &lt;oj-c-tag-cloud-item  label='[[item.data.id]]' value='[[item.data.total]]'>&lt;/oj-c-tag-cloud-item>
     *  &lt;/template>
     * &lt;/oj-c-tag-cloud>
     * </code>
     * </pre>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     * <p>
     *  Read the <a target="_blank" href="oj-c.TagCloud.html#a11y-section">Accessibility Section</a> of the oj-c-tagcloud component for details about making this component accessible.
     * </p>
     *
     * @ojmetadata subcomponentType "data"
     * @ojmetadata description "The oj-c-tag-cloud-item element is used to declare properties for tag cloud items"
     * @ojmetadata displayName "TagCloudItem"
     * @ojmetadata main "oj-c/tag-cloud-item"
     * @ojmetadata help "oj-c.TagCloudItem.html"
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
    ({ categories = exports.TagCloudItemDefaults.categories, 
    /* @ts-ignore */
    ...props }) => {
        return null;
    }, "TagCloudItem", { "properties": { "categories": { "type": "Array<string>" }, "color": { "type": "string" }, "label": { "type": "string" }, "value": { "type": "number|null" }, "url": { "type": "string" }, "shortDesc": { "type": "string" } } }, { "categories": [] }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

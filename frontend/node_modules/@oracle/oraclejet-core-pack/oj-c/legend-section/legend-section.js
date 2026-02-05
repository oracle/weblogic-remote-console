define(["require", "exports", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent"], function (require, exports, translationBundle_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LegendSection = exports.LegendSectionDefaults = void 0;
    exports.LegendSectionDefaults = {
        text: ''
    };
    exports.LegendSection = (0, ojvcomponent_1.registerCustomElement)('oj-c-legend-section', 
    /**
     * @classdesc
     * <h3 id="overview">
     *   JET Legend Section
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
     * </h3>
     *
     * <p>
     *  The oj-c-legend-section element is used to declare properties for legend sections and is only valid as the
     *  child of a template element for the <a target="_blank" href="oj-c.Legend.html#sectionTemplate">sectionTemplate</a>
     *  slot of oj-c-legend.
     * </p>
     * @ojmetadata subcomponentType "data"
     * @ojmetadata description "The oj-c-legend-section element is used to declare properties for legend sections."
     * @ojmetadata displayName "LegendSection"
     * @ojmetadata main "oj-c/legend-section"
     * @ojmetadata help "oj-c.LegendSection.html"
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
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *        "text"
     *     ]
     *   }
     * ]
     * @ojmetadata since "15.0.0"
     */
    ({ text = exports.LegendSectionDefaults.text, 
    /* @ts-ignore */
    ...props }) => {
        return null;
    }, "LegendSection", { "properties": { "text": { "type": "string" } } }, { "text": "" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

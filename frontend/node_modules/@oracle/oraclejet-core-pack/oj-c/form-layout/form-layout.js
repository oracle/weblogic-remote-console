define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_FormLayout", "@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout", "ojs/ojvcomponent", "css!oj-c/form-layout/form-layout-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_FormLayout_1, Layout_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormLayout = void 0;
    /**
     * @classdesc
     * <h3 id="formLayoutOverview-section">
     *   JET FormLayout Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#formLayoutOverview-section"></a>
     * </h3>
     *
     * <p>Description: The oj-c-form-layout component provides a responsive layout capability to lay out child
     * elements in the row or column direction where the number of columns displayed depends on the available
     * width of the container.  Child components are responsible for rendering the label with the alignment as
     * specified by the oj-c-form-layout's label-edge property, which the child components consume.</p>
     *
     * <pre class="prettyprint"><code>&lt;oj-c-form-layout columns="2">
     *   &ltoj-c-input-text label-hint="First Name">&lt/oj-c-input-text>
     *   &ltoj-c-input-text label-hint="Last Name">&lt/oj-c-input-text>
     *   &ltoj-c-input-text label-hint="address" column-span="2">&lt/oj-c-input-text>
     * &lt;/oj-c-form-layout></code></pre>
     *
     * @ojmetadata displayName "Form Layout"
     * @ojmetadata description "A form layout manages the layout of labels and fields in a form."
     * @ojmetadata help "oj-c.FormLayout.html"
     * @ojmetadata main "oj-c/form-layout"
     * @ojmetadata status [
     *   {
     *     type: "candidate",
     *     since: "17.0.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Forms"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/form-layout",
     *     "defaultColumns": 6,
     *     "minColumns": 2
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-form-layout",
     *     "uxSpecs": [
     *       "form-layout"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "columns",
     *       "columnSpan",
     *       "direction",
     *       "labelEdge",
     *       "labelStartWidth",
     *       "labelWrapping",
     *       "maxColumns",
     *       "readonly",
     *       "userAssistanceDensity"
     *     ]
     *   }
     * ]
     * @ojmetadata requirements [
     *   {
     *     type: "anyOf",
     *     label: "accessibility",
     *     slots: [""]
     *   }
     * ]
     * @ojmetadata since "16.0.0"
     */
    function FormLayoutImpl({ columns = 0, columnSpan = 1, direction = 'row', fullWidth = false, id, maxColumns = 1, ...otherProps }) {
        let preactColumns = maxColumns;
        let preactColumnBehavior = 'responsive';
        if (columns > 0) {
            preactColumns = columns;
            preactColumnBehavior = 'fixed';
        }
        return (
        // Because we are handling it here, there is no need to pass the columnSpan property down to the
        // Preact component. The layoutSpanColumn style class needs to be applied to the root dom element,
        // otherwise the css grid will ignore it.
        // Make sure to add the id on the Root element as it would have been removed
        // from there since it is from the ObservedGlobalProps.
        (0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: id, class: Layout_1.layoutSpanStyles.layoutSpanColumn[columnSpan], children: (0, jsx_runtime_1.jsx)(UNSAFE_FormLayout_1.FormLayout, { columns: preactColumns, columnBehavior: preactColumnBehavior, direction: direction, isFullWidth: fullWidth, labelEdge: otherProps.labelEdge, labelStartWidth: otherProps.labelStartWidth, labelWrapping: otherProps.labelWrapping, isReadonly: otherProps.readonly, userAssistanceDensity: otherProps.userAssistanceDensity, children: otherProps.children }) }));
    }
    exports.FormLayout = (0, ojvcomponent_1.registerCustomElement)('oj-c-form-layout', FormLayoutImpl, "FormLayout", { "slots": { "": {} }, "properties": { "columns": { "type": "number" }, "columnSpan": { "type": "number" }, "direction": { "type": "string", "enumValues": ["row", "column"] }, "fullWidth": { "type": "boolean" }, "labelEdge": { "type": "string", "enumValues": ["start", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" }, "provide": [{ "name": "containerLabelEdge" }, { "name": "labelEdge" }] } }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" }, "provide": [{ "name": "labelStartWidth" }, { "name": "labelWidth" }] } }, "labelWrapping": { "type": "string", "enumValues": ["truncate", "wrap"], "binding": { "consume": { "name": "labelWrapping" }, "provide": [{ "name": "labelWrapping" }] } }, "maxColumns": { "type": "number" }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" }, "provide": [{ "name": "containerReadonly", "default": false }, { "name": "readonly" }] } }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "reflow", "efficient"], "binding": { "consume": { "name": "containerUserAssistanceDensity" }, "provide": [{ "name": "containerUserAssistanceDensity", "default": "efficient" }, { "name": "userAssistanceDensity", "default": "efficient" }] } } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["id"] } }, { "columns": 0, "columnSpan": 1, "direction": "row", "fullWidth": false, "maxColumns": 1 }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

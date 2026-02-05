define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_ProgressCircle", "ojs/ojvcomponent", "css!oj-c/progress-circle/progress-circle-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_ProgressCircle_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProgressCircle = void 0;
    exports.ProgressCircle = (0, ojvcomponent_1.registerCustomElement)('oj-c-progress-circle', 
    /**
     * @classdesc
     * <h3 id="progressCircleOverview-section">
     *   JET Progress Circle
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#progressCircleOverview-section"></a>
     * </h3>
     * The oj-c-progress-circle element allows a user to display progress of an operation with a circular meter.
     * If a developer does not wish to display the exact value, a value of '-1' can be passed in to display an indeterminate value.
     *
     * <pre class="prettyprint"><code>&lt;oj-c-progress-circle value='{{progressValue}}'>&lt;/oj-c-progress-circle></code></pre>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>
     * To meet accessibility requirements, use one or more of the following ARIA attributes to provide meaningful text describing the purpose or status of the progress bar for assistive technologies:
     * </p>
     * <ul>
     *   <li>aria-label</li>
     *   <li>aria-labelledby</li>
     * </ul>
     *
     * <p>
     * These ARIA attributes help assistive technologies accurately convey loading status and context to users.
     * </p>
     *
     * <p>
     * If the progress circle is used to indicate the loading state of a specific region, the region element must have aria-describedby referencing the progress bar’s id. Include <code>aria-busy="true"</code> for the duration of the loading. Remove or set it to "false" once loading is complete.
     * </p>
     *
     * @ojmetadata description "A progress circle allows the user to visualize the progression of an extended computer operation."
     * @ojmetadata displayName "Progress Circle"
     * @ojmetadata help "oj-c.ProgressCircle.html"
     * @ojmetadata main "oj-c/progress-circle"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "15.0.0",
     *     "value": ["oj-progress-circle"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/progress-circle"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-circular-progress-7",
     *     "uxSpecs": [
     *       "progress-bar"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "max"
     *     ]
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "value"
     *     ]
     *   }
     * ]
     * @ojmetadata since "13.0.0"
     *
     * @ojmetadata requirements [
     *  {
     *    type: "anyOf",
     *    label: "accessibility",
     *    properties: [ "aria-label", "aria-labelledby"]
     *  }
     * ]
     *
     */
    ({ max = 100, value = 0, size = 'md', ...otherProps }) => {
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_ProgressCircle_1.ProgressCircle, { value: value === -1 ? 'indeterminate' : value, max: max, size: size, "aria-valuetext": otherProps['aria-valuetext'], "aria-label": otherProps['aria-label'], "aria-labelledby": otherProps['aria-labelledby'] }) }));
    }, "ProgressCircle", { "properties": { "max": { "type": "number" }, "value": { "type": "number" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-valuetext", "aria-label", "aria-labelledby"] } }, { "max": 100, "value": 0, "size": "md" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

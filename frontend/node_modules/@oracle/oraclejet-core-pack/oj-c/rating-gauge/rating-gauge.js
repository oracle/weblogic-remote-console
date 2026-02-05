define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_RatingGauge", "ojs/ojvcomponent", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "../utils/UNSAFE_meterUtils/meterUtils", "@oracle/oraclejet-preact/utils/UNSAFE_stringUtils", "css!oj-c/rating-gauge/rating-gauge-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_RatingGauge_1, ojvcomponent_1, hooks_1, UNSAFE_useTabbableMode_1, meterUtils_1, UNSAFE_stringUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RatingGauge = void 0;
    exports.RatingGauge = (0, ojvcomponent_1.registerCustomElement)('oj-c-rating-gauge', 
    /**
     * @classdesc
     * <h3 id="ratingGaugeOverview-section">
     *   JET Rating Gauge
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ratingGaugeOverview-section"></a>
     * </h3>
     * Rating gauges are typically used to display or accept user feedback on a product or service.
     * <pre class="prettyprint"><code>&lt;oj-c-rating-gauge value='4'>&lt;/oj-c-rating-gauge></code></pre>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     * <p>
     * The application is required to set one of the following attributes on the element with meaningful descriptors as the rating-gauge element does not provide a default descriptor.
     * </p>
     * <ul>
     *   <li>aria-label</li>
     *   <li>aria-labelledby</li>
     *   <li>aria-describedby</li>
     * </ul>
     *
     * <p>
     * If the application is using readonly, thresholds or reference lines to provide additional context, they need to include such information for screender readers using either of the following methods:
     *  <ul>
     *   <li>aria-describedby</li>
     *   <li>aria-labelledby</li>
     *   <li>aria-label</li>
     *   <li>datatip</li>
     *  </ul>
     * </p>
     *
     * {@include accessibility_doc.ts#a11y-section-disabled-content}
     *
     * <h3 id="keyboardSection">
     *   Keyboard
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboardSection"></a>
     * </h3>
     *
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Key</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td><kbd>Enter</kbd></td>
     *       <td>Submit the current value of the gauge.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Tab</kbd></td>
     *       <td>Move focus to next element and submit the current value of the gauge.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + Tab</kbd></td>
     *       <td>Move focus to previous element.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>End</kbd></td>
     *       <td>Increase the gauge's transient value to max value. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Home</kbd></td>
     *       <td>Decrease the gauge's transient value to zero. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Decrease the gauge's transient value in left-to-right locales. Increase the gauge's transient value in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Increase the gauge's transient value in left-to-right locales. Decrease the gauge's transient value in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="touch-section">
     * Touch End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
     * </h3>
     *
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Gesture</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td><kbd>Drag</kbd></td>
     *       <td>Value change when <code class="prettyprint">readonly</code> or <code class="prettyprint">disabled</code> is <code class="prettyprint">false</code>.</td>
     *     </tr>
     *   </tbody>
     * </table>
     * <br>
     *
     * @ojmetadata description "Rating gauges are typically used to display or accept user feedback on a product or service."
     * @ojmetadata displayName "Rating Gauge"
     * @ojmetadata main "oj-c/rating-gauge"
     * @ojmetadata help "oj-c.RatingGauge.html"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "15.0.0",
     *     "value": ["oj-rating-gauge"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Visualizations"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/rating-gauge"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-gauge-rating",
     *     "uxSpecs": [
     *       "gauge"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "style"
     *     ]
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "value",
     *       "max",
     *       "step"
     *     ]
     *   }
     * ]
     * @ojmetadata since "13.0.0"
     *
     * @ojmetadata requirements [
     *   {
     *     type: "anyOf",
     *     label: "accessibility",
     *     properties: ["aria-label", "aria-labelledby", "aria-describedby", "described-by", "labelled-by"]
     *   }
     * ]
     *
     */
    ({ max = 5, value = 0, size = 'md', color = 'neutral', step = 1, readonly = false, disabled = false, changed = false, ...otherProps }) => {
        const [hoveredVal, setHoveredVal] = (0, hooks_1.useState)();
        const inputHandler = (detail) => {
            setHoveredVal(detail.value);
            otherProps.onTransientValueChanged?.(detail.value);
        };
        const commitHandler = (detail) => {
            otherProps.onValueChanged?.(detail.value);
            if (!changed) {
                otherProps.onChangedChanged?.(true);
            }
        };
        const thresholds = otherProps.thresholds?.map((threshold, index) => {
            return {
                ...threshold,
                color: (0, meterUtils_1.getThresholdColorByIndex)(threshold, index)
            };
        });
        const preactRatingGaugeAriaLabelledBy = (0, UNSAFE_stringUtils_1.merge)([
            otherProps['aria-labelledby'],
            otherProps.labelledBy
        ]);
        const preactRatingGaugeAriaDescribedBy = (0, UNSAFE_stringUtils_1.merge)([
            otherProps['aria-describedby'],
            otherProps.describedBy
        ]);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_RatingGauge_1.RatingGauge, { isReadonly: readonly, isDisabled: disabled, value: (hoveredVal != undefined ? hoveredVal : value), step: step, max: max, size: size, color: color, thresholds: thresholds, tooltip: otherProps.tooltip, datatip: otherProps.datatip?.({
                    value: hoveredVal != undefined ? hoveredVal : value
                }), onCommit: commitHandler, onInput: inputHandler, "aria-label": otherProps['aria-label'], "aria-labelledby": preactRatingGaugeAriaLabelledBy ?? undefined, "aria-describedby": preactRatingGaugeAriaDescribedBy ?? undefined }) }));
    }, "RatingGauge", { "properties": { "max": { "type": "number" }, "readonly": { "type": "boolean" }, "disabled": { "type": "boolean" }, "changed": { "type": "boolean", "writeback": true }, "value": { "type": "number|null", "writeback": true }, "step": { "type": "number" }, "describedBy": { "type": "string|null" }, "labelledBy": { "type": "string|null" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] }, "color": { "type": "string", "enumValues": ["gold", "neutral"] }, "thresholds": { "type": "Array<object>" }, "datatip": { "type": "function" }, "tooltip": { "type": "string" }, "transientValue": { "type": "number", "readOnly": true, "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["changed", "value", "transientValue"], "_READ_ONLY_PROPS": ["transientValue"], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-labelledby", "aria-describedby"] } }, { "max": 5, "value": 0, "size": "md", "color": "neutral", "step": 1, "readonly": false, "disabled": false, "changed": false }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
});

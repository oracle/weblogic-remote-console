define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_MeterBar", "ojs/ojvcomponent", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "../utils/UNSAFE_meterUtils/meterUtils", "@oracle/oraclejet-preact/utils/UNSAFE_stringUtils", "css!oj-c/meter-bar/meter-bar-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_MeterBar_1, ojvcomponent_1, hooks_1, UNSAFE_useTabbableMode_1, meterUtils_1, UNSAFE_stringUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MeterBar = void 0;
    exports.MeterBar = (0, ojvcomponent_1.registerCustomElement)('oj-c-meter-bar', 
    /**
     * @classdesc
     * <h3 id="meterBarOverview-section">
     *   JET meter bar
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#meterBarOverview-section"></a>
     * </h3>
     * A meter bar is typically used to display or accept user feedback on a product or service.
     * <pre class="prettyprint"><code>&lt;oj-c-meter-bar value='4'>&lt;/oj-c-meter-bar></code></pre>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     * <p>
     * The application is required to set one of the following attributes on the element with meaningful descriptors as the oj-c-meter-bar element does not provide a default descriptor.
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
     * <p>
     * If you are using indicatorColor, applications are responsible for making sure that the color meets the
     * <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum">minimum contrast ratio</a>.
     * </p>
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
     *       <td>Submit the current value of the meter bar.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Tab</kbd></td>
     *       <td>Move focus to next element and submit the current value of the meter bar.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + Tab</kbd></td>
     *       <td>Move focus to previous element.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>End</kbd></td>
     *       <td>Increase the meter bar's transient value to max value. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Home</kbd></td>
     *       <td>Decrease the meter bar's transient value to zero. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Increase the meter bar's transient value. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Decrease the meter bar's transient value. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Decrease the meter bar's transient value in left-to-right locales. Increase the meter bar's transient value in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Increase the meter bar's transient value in left-to-right locales. Decrease the meter bar's transient value in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
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
     *       <td>Value change when <code class="prettyprint">readonly</code> is <code class="prettyprint">false</code>.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojmetadata description "A Meter bar displays information graphically in a rectangular bar, highlighting a specific metric value's progress in relation to its min, max, or thresholds."
     * @ojmetadata displayName "Meter Bar"
     * @ojmetadata main "oj-c/meter-bar"
     * @ojmetadata help "oj-c.MeterBar.html"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "15.0.0",
     *     "value": ["oj-status-meter-gauge"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Visualizations"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/meter-bar"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-linear-status",
     *     "uxSpecs": [
     *       "meter-bar"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "orientation",
     *       "thresholdDisplay",
     *       "plotArea.rendered",
     *       "color",
     *       "style"
     *     ]
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "value",
     *       "min",
     *       "max",
     *       "step",
     *       "thresholds",
     *       "referenceLines"
     *     ]
     *   }
     * ]
     * @ojmetadata since "14.0.0"
     *
     * @ojmetadata requirements [
     *  {
     *    type: "anyOf",
     *    label: "accessibility",
     *    properties: ["aria-label", "aria-labelledby", "aria-describedby", "described-by", "labelled-by"]
     *  }
     * ]
     *
     */
    ({ max = 100, value = 0, min = 0, size = 'md', orientation = 'horizontal', step = 1, indicatorSize = 1, readonly = false, thresholdDisplay = 'indicator', baseline, ...props }) => {
        const rootRef = (0, hooks_1.useRef)(null);
        const [hoveredVal, setHoveredVal] = (0, hooks_1.useState)();
        const inputHandler = (detail) => {
            setHoveredVal(detail.value);
            props.onTransientValueChanged?.(detail.value);
        };
        const commitHandler = (detail) => {
            props.onValueChanged?.(detail.value);
        };
        const thresholds = props.thresholds?.map((threshold, index) => {
            return {
                ...threshold,
                color: (0, meterUtils_1.getThresholdColorByIndex)(threshold, index)
            };
        });
        const preactMeterBarAriaLabelledBy = (0, UNSAFE_stringUtils_1.merge)([props['aria-labelledby'], props.labelledBy]);
        const preactMeterBarAriaDescribedBy = (0, UNSAFE_stringUtils_1.merge)([props['aria-describedby'], props.describedBy]);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, class: `oj-c-meter-bar-${orientation}${size === 'fit' ? '-fit' : ''}`, children: (0, jsx_runtime_1.jsx)(UNSAFE_MeterBar_1.MeterBar, { isReadonly: readonly, value: (hoveredVal != undefined ? hoveredVal : value), step: step, max: max, min: min, size: size, orientation: orientation, indicatorSize: indicatorSize, baseline: baseline, datatip: props.datatip
                    ? props.datatip({
                        value: hoveredVal != undefined ? hoveredVal : value
                    })
                    : props.datatip, onCommit: readonly ? undefined : commitHandler, onInput: readonly ? undefined : inputHandler, length: '100%', thresholds: thresholds, referenceLines: props.referenceLines, thresholdDisplay: thresholdDisplay === 'plotArea' ? 'track' : thresholdDisplay, indicatorColor: props.color, trackColor: props.plotArea?.color, isTrackRendered: props.plotArea?.rendered !== 'off', "aria-label": props['aria-label'], "aria-labelledby": preactMeterBarAriaLabelledBy ?? undefined, "aria-describedby": preactMeterBarAriaDescribedBy ?? undefined }) }));
    }, "MeterBar", { "properties": { "max": { "type": "number" }, "min": { "type": "number" }, "readonly": { "type": "boolean" }, "value": { "type": "number|null", "writeback": true }, "baseline": { "type": "number" }, "step": { "type": "number" }, "color": { "type": "string" }, "indicatorSize": { "type": "number" }, "plotArea": { "type": "object", "properties": { "color": { "type": "string" }, "rendered": { "type": "string", "enumValues": ["off", "on"] } } }, "orientation": { "type": "string", "enumValues": ["horizontal", "vertical"] }, "referenceLines": { "type": "Array<object>" }, "thresholdDisplay": { "type": "string", "enumValues": ["all", "plotArea", "indicator"] }, "thresholds": { "type": "Array<object>" }, "describedBy": { "type": "string|null" }, "labelledBy": { "type": "string|null" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg", "fit"] }, "datatip": { "type": "function" }, "transientValue": { "type": "number", "readOnly": true, "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["value", "transientValue"], "_READ_ONLY_PROPS": ["transientValue"], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-labelledby", "aria-describedby"] } }, { "max": 100, "value": 0, "min": 0, "size": "md", "orientation": "horizontal", "step": 1, "indicatorSize": 1, "readonly": false, "thresholdDisplay": "indicator" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
});

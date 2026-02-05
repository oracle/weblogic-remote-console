define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "preact/hooks", "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_DatePicker", "@oracle/oraclejet-preact/UNSAFE_IntlDateTime", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/utils/UNSAFE_calendarDateUtils"], function (require, exports, jsx_runtime_1, translationBundle_1, hooks_1, ojvcomponent_1, UNSAFE_DatePicker_1, UNSAFE_IntlDateTime_1, UNSAFE_useTabbableMode_1, UNSAFE_calendarDateUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DatePicker = void 0;
    exports.DatePicker = (0, ojvcomponent_1.registerCustomElement)('oj-c-date-picker', 
    /**
     * @classdesc
     * <h3 id="datePickerOverview-section">
     *   JET DatePicker Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#datePickerOverview-section"></a>
     * </h3>
     *
     * <p>Description: A DatePicker is a calendar interface that allows users to select a single date.</p>
     *
     * <pre class="prettyprint"><code>&lt;oj-c-date-picker value="2023-03-20">&lt;/oj-c-date-picker></code></pre>
     *
     *
     * <h3 id="touch-section">
     *   Touch End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
     * </h3>
     *
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Target</th>
     *       <th>Gesture</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td>Month/Year picker buttons</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Toggles between Date picker mode and Month/Year picker mode.</td>
     *     </tr>
     *     <tr>
     *       <td>Prev/Next buttons</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Moves to the prev/next month in the date picker or to the prev/next decade in the year picker.</td>
     *     </tr>
     *     <tr>
     *       <td>Today button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Navigates to the Year and Month that contains today's date.</td>
     *     </tr>
     *     <tr>
     *       <td>Day Button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Selects this day as the current date.</td>
     *     </tr>
     *     <tr>
     *       <td>Month Button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>In the month picker, selects this month and returns to the date picker, refreshing the display to show the selected month.</td>
     *     </tr>
     *     <tr>
     *       <td>Year Button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>In the year picker, selects this year and returns to the date picker, refreshing the display to show the selected year.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="keyboard-section">
     *   Keyboard End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
     * </h3>
     *
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Target</th>
     *       <th>Key</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td>Date Picker</td>
     *       <td><kbd>Tab</kbd></td>
     *       <td>
     *         Moves the focus to next element in the date picker sequence. Only one element in the calendar grid is in the Tab sequence
     *         (current day/month/year or selected day/month/year depending on scenario). If focus is on the last tabbable element
     *         inside the date picker, moves focus off the date picker to the next tabbable element on the page.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Date Picker</td>
     *       <td><kbd>Shift + Tab</kbd></td>
     *       <td>
     *         Moves the focus to the previous tabbable element inside the date picker. If focus is on the first tabbable element
     *         inside the date picker, moves focus off the date picker to the previous tabbable element on the page.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Date Picker</td>
     *       <td><kbd>Enter/Space</kbd></td>
     *       <td>
     *         Selects the currently focused day or activates the button currently focused.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Calendar Grid</td>
     *       <td><kbd>PageUp</kbd></td>
     *       <td>Changes the calendar grid to the previous month. Moves focus to the closest day in the previous month.</td>
     *     </tr>
     *     <tr>
     *       <td>Calendar Grid</td>
     *       <td><kbd>PageDown</kbd></td>
     *       <td>Changes the calendar grid to the next month. Moves focus to the closest day in the next month.</td>
     *     </tr>
     *     <tr>
     *       <td>Calendar Grid</td>
     *       <td><kbd>Shift + PageUp</kbd></td>
     *       <td>Changes the calendar grid to the previous year. Moves focus to the closest day of the same month in the previous year.</td>
     *     </tr>
     *     <tr>
     *       <td>Calendar Grid</td>
     *       <td><kbd>Shift + PageDown</kbd></td>
     *       <td>Changes the calendar grid to the next year. Moves focus to the closest day of the same month in the next year.</td>
     *     </tr>
     *     <tr>
     *       <td>Calendar Grid</td>
     *       <td><kbd>Ctrl + Alt + T or Ctrl + Option + T</kbd></td>
     *      <td>Changes the calendar grid to the year and month that contains today's date. Moves focus to Today.</td>
     *     </tr>
     *     <tr>
     *       <td>Calendar Grid</td>
     *       <td><kbd>Home</kbd></td>
     *       <td>Go to the first day of the current month.</td>
     *     </tr>
     *     <tr>
     *       <td>Calendar Grid</td>
     *       <td><kbd>End</kbd></td>
     *       <td>Go to the last day of the current month.</td>
     *     </tr>
     *     <tr>
     *       <td>Calendar Grid</td>
     *       <td><kbd>ArrowLeft</kbd></td>
     *       <td>Moves focus to the previous day. In RTL, this will move focus to the next day.</td>
     *     </tr>
     *     <tr>
     *       <td>Calendar Grid</td>
     *       <td><kbd>ArrowRight</kbd></td>
     *       <td>Moves focus to the next day. In RTL, this will move focus to the previous day.</td>
     *     </tr>
     *     <tr>
     *       <td>Calendar Grid</td>
     *       <td><kbd>ArrowUp</kbd></td>
     *       <td>Moves focus to the same day of the previous week.</td>
     *     </tr>
     *     <tr>
     *       <td>Calendar Grid</td>
     *       <td><kbd>ArrowDown</kbd></td>
     *       <td>Moves focus to the same day of the next week.</td>
     *     </tr>
     *     <tr>
     *       <td>Months Grid</td>
     *       <td><kbd>Enter/Space</kbd></td>
     *       <td>
     *         Selects the currently focused month and returns to the date picker, refreshing the display to show the selected month.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Months Grid</td>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Moves focus to four months back from the current focused month.</td>
     *     </tr>
     *     <tr>
     *       <td>Months Grid</td>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Moves focus to four months ahead from the current focused month.</td>
     *     </tr>
     *     <tr>
     *       <td>Months Grid</td>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Moves focus to the next month. In RTL, this will move focus to the previous month.</td>
     *     </tr>
     *     <tr>
     *       <td>Months Grid</td>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Moves focus to the previous month. In RTL, this will move focus to the next month.</td>
     *     </tr>
     *     <tr>
     *       <td>Years Grid</td>
     *       <td><kbd>Enter/Space</kbd></td>
     *       <td>
     *         Selects the currently focused year and returns to the date picker, refreshing the display to show the selected month.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Years Grid</td>
     *       <td><kbd>PageUp</kbd></td>
     *       <td>Changes the year grid to the previous decade. The focus remains in the same location with respect to the current decade.</td>
     *     </tr>
     *     <tr>
     *       <td>Years Grid</td>
     *       <td><kbd>PageDown</kbd></td>
     *       <td>Changes the year grid to the next decade. The focus remains in the same location with respect to the current decade.</td>
     *     </tr>
     *     <tr>
     *       <td>Years Grid</td>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Moves focus to four years back from the current focused year. If that year is not in the year grid, go back 1 decade.</td>
     *     </tr>
     *     <tr>
     *       <td>Years Grid</td>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Moves focus to four years ahead from the current focused year. If that year is not in the year grid, go ahead 1 decade.</td>
     *     </tr>
     *     <tr>
     *       <td>Years Grid</td>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Moves focus to the next year. In RTL, this will move focus to the previous year.</td>
     *     </tr>
     *     <tr>
     *       <td>Years Grid</td>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Moves focus to the previous year. In RTL, this will move focus to the next year.</td>
     *     </tr>
     *   </tbody>
     * </table>
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>
     * The oj-c-date-picker is not intended to be a labelled component.  Component authors using this component should use the aria-describedby to give
     * a description of the date being entered.
     * </p>
     *
     * @ojmetadata description "A DatePicker is a calendar interface that allows users to select a single date."
     * @ojmetadata displayName "DatePicker"
     * @ojmetadata help "oj-c.DatePicker.html"
     * @ojmetadata main "oj-c/date-picker"
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Forms"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/date-picker"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-date"
     *   }
     * }
     * @ojmetadata since "17.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "17.1.0",
     *     "value": ["oj-date-picker"]
     *   }
     * ]
     */
    ({ dayFormatter, daysOutsideMonth = 'hidden', monthAndYearPicker = 'on', max = null, maxWidth, min = null, readonly = false, todayButton = 'visible', todayTimeZone, value = null, width, weekDisplay = 'none', onValueChanged, ...otherProps }) => {
        if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isDateOnlyIsoString(value)) {
            throw new Error('value must be a date-only ISO string');
        }
        if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isDateOnlyIsoString(min)) {
            throw new Error('min must be a date-only ISO string');
        }
        if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isDateOnlyIsoString(max)) {
            throw new Error('max must be a date-only ISO string');
        }
        // we know these are date only ISO strings, so comparing strings should be fine.
        if (max && min && max < min) {
            throw new Error('max must be greater than or equal to min');
        }
        const maxCalendarDate = max ? (0, UNSAFE_calendarDateUtils_1.getCalendarDateFromIso)(max) : undefined;
        const minCalendarDate = min ? (0, UNSAFE_calendarDateUtils_1.getCalendarDateFromIso)(min) : undefined;
        const valueCalendarDate = value
            ? (0, UNSAFE_calendarDateUtils_1.getCalendarDateFromIso)(value)
            : undefined;
        const onCommitHandler = (0, hooks_1.useCallback)(({ value, previousValue }) => {
            if (onValueChanged && value !== previousValue) {
                value
                    ? onValueChanged((0, UNSAFE_calendarDateUtils_1.getIsoDateStr)(value.year, value.month, value.day))
                    : onValueChanged(null);
            }
        }, [onValueChanged]);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: otherProps.id, children: (0, jsx_runtime_1.jsx)(UNSAFE_DatePicker_1.DatePicker, { dayFormatter: dayFormatter ?? undefined, daysOutsideMonth: daysOutsideMonth, monthAndYearPicker: monthAndYearPicker, max: maxCalendarDate, min: minCalendarDate, isReadonly: readonly, todayButton: todayButton, todayTimeZone: todayTimeZone ?? undefined, value: valueCalendarDate, weekDisplay: weekDisplay, width: width, maxWidth: maxWidth, onCommit: onCommitHandler }) }));
    }, "DatePicker", { "properties": { "dayFormatter": { "type": "function" }, "daysOutsideMonth": { "type": "string", "enumValues": ["hidden", "selectable"] }, "monthAndYearPicker": { "type": "string", "enumValues": ["off", "on"] }, "max": { "type": "string|null" }, "maxWidth": { "type": "number|string" }, "min": { "type": "string|null" }, "readonly": { "type": "boolean" }, "todayButton": { "type": "string", "enumValues": ["hidden", "visible"] }, "todayTimeZone": { "type": "string" }, "value": { "type": "string|null", "writeback": true }, "weekDisplay": { "type": "string", "enumValues": ["number", "none"] }, "width": { "type": "number|string" } }, "extension": { "_WRITEBACK_PROPS": ["value"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id"] } }, { "daysOutsideMonth": "hidden", "monthAndYearPicker": "on", "max": null, "min": null, "readonly": false, "todayButton": "visible", "value": null, "weekDisplay": "none" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
});

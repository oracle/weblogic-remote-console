import { ObservedGlobalProps, PropertyChanged } from 'ojs/ojvcomponent';
import { DateISOStr } from '@oracle/oraclejet-preact/UNSAFE_IntlDateTime';
import { CalendarDateRequired } from '@oracle/oraclejet-preact/utils/UNSAFE_calendarDateUtils';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
/**
 * The properties of the DatePicker component
 */
type Props = ObservedGlobalProps<'aria-describedby' | 'id'> & {
    /**
     * A function that receives a date and returns an object specifying how to format the provided date.
     * This function is called for each date that is rendered and this can be used to control how individual
     * dates are rendered - disabled, restricted, or enabled.
     * @param date The date to format
     * @returns The format options
     */
    dayFormatter?: (date: CalendarDateRequired) => {
        state: 'disabled' | 'enabled' | 'restricted';
    };
    /**
     * The days-outside-month attribute affects the day cells that are outside of the current month.
     *
     * @ojmetadata propertyEditorValues {
     *   "hidden": {
     *     "description": "The days outside of the current month will be hidden.",
     *     "displayName": "Hidden"
     *   },
     *   "selectable": {
     *     "description": "The days outside of the current month will be visible and selectable.",
     *     "displayName": "Selectable"
     *   }
     * }
     */
    daysOutsideMonth?: 'hidden' | 'selectable';
    /**
     * The month-and-year-picker attribute can be used to specify whether or not the DatePicker should show the
     * toggle buttons that toggle the month grid picker and year grid picker. The month picker grid allows
     * the user to select a month to display in the date picker and the year picker grid allows the user to
     * select the year to display in the date picker.
     * @ojmetadata propertyEditorValues {
     *   "on": {
     *     "description": "The month and year toggle buttons will be shown.",
     *     "displayName": "On"
     *   },
     *   "off": {
     *     "description": "The month and year toggle buttons will not be shown and the date picker renders the month and the year as text.",
     *     "displayName": "Off"
     *   }
     * }
     */
    monthAndYearPicker?: 'on' | 'off';
    /**
     * The maximum selectable date, in date only ISO string format.
     * Dates in the date picker that are greater than this date will not be selectable.
     * This must be a date only ISO string with no time, otherwise an error is thrown and the component will not render.
     * When set to null, there is no maximum.
     *
     * @ojmetadata description "The maximum selectable date, in ISO string format"
     * @ojmetadata displayName "Max"
     * @ojmetadata help "#max"
     * @ojmetadata format "date"
     */
    max?: DateISOStr | null;
    /**
     * Specifies the component style maxWidth.
     * <p>If not specified, defaults to the theme specified maxWidth.<br/>
     * This attribute accepts values of type:<br/>
     * 0 | `${number}${CssUnits}` | `${number}x` | `--${string}` | `var($string})` | `${number}%`</p>
     * <p>When this component is used in composition and the component should take up 100% of the parent container's
     * width, set maxWidth to '100%'.<br/>
     * Because there is a theme default value for maxWidth, when setting the width property to achieve a fixed width,
     * set the maxWidth property to the same value.</p>
     *
     * @example <caption>When Date Picker should be full width of parent container</caption>
     * &lt;oj-c-date-picker max-width='100%'/>
     * @example <caption>Date Picker maxWidth set to scalable xUnits</caption>
     *  &lt;oj-c-date-picker max-width='10x'/>
     * @example <caption>When Date Picker should be a fixed width</caption>
     * &lt;oj-c-date-picker width='25rem' max-width='25rem'/>
     *
     * &lt;/oj-c-center-template>
     *
     * @ojmetadata description "Specifies the component style maxWidth."
     * @ojmetadata displayName "Max Width"
     * @ojmetadata help "#maxWidth"
     */
    maxWidth?: Size;
    /**
     * The minimum selectable date, in date only ISO string format.
     * Dates in the date picker that are less than this date will not be selectable.
     * This must be a date only ISO string with no time, otherwise an error is thrown and the component will not render.
     * When set to null, there is no minimum.
     *
     * @ojmetadata description "The maximum selectable date, in ISO string format"
     * @ojmetadata displayName "Min"
     * @ojmetadata help "#min"
     * @ojmetadata format "date"
     */
    min?: DateISOStr | null;
    /**
     * Whether the component is readonly. When the component is readonly, the date picker can still be used to navigate
     * to different calendar dates, but the date picker won't allow the date to be changed via user action.
     */
    readonly?: boolean;
    /**
     * Specifies the visibility of the 'Go to today' button.
     *
     * @ojmetadata propertyEditorValues {
     *   "visible": {
     *     "description": "The 'Go to Today' button will be shown and it can be pressed to navigate to Today.",
     *     "displayName": "Visible"
     *   },
     *   "hidden": {
     *     "description": "The 'Go to Today' button will be hidden.",
     *     "displayName": "Hidden"
     *   }
     * }
     */
    todayButton?: 'visible' | 'hidden';
    /**
     * The today-time-zone attribute is used to compute today's date.
     * This defaults to the user's system timezone.
     * <p>
     * The only reason an application would set the today-time-zone property is if they want the
     * highlighted today cell to be in a different timezone than the user's system's timezone,
     * like if the user has a preferred timezone that is not where they are physically working.
     * </p>
     */
    todayTimeZone?: Intl.DateTimeFormatOptions['timeZone'];
    /**
     * The value of the component.
     * <p>The value must be a local date (no time) ISO string such as '2021-03-14',
     * otherwise the component will throw an error.</p>
     * <p>
     * The oj-c-date-picker initially opens to the selected date if there is one and it is within the min/max range.
     * If there is no value, the DatePicker initially opens to today's month.
     * </p>
     */
    value?: DateISOStr | null;
    /**
     * Whether week of the year will be shown in the DatePicker. The default calculation follows the
     * rule for ISO 8601 as follows: The first week of the year is defined as the week that contains
     * the first Thursday. Therefore, if January 1st falls on a Friday, it is considered part of the last week
     * of the previous year. Conversely, if December 31st falls on a Wednesday, it is part of week 1 of the following year.
     * @ojmetadata propertyEditorValues {
     *   "none": {
     *     "description": "The week of the year column will not be shown.",
     *     "displayName": "None"
     *   },
     *   "number": {
     *     "description": "Will show the week of the year as a number.",
     *     "displayName": "Number"
     *   }
     * }
     */
    weekDisplay?: 'none' | 'number';
    /**
     * Specifies the component style width.
     * <p>If not specified, defaults to '100%'.</p>
     * <p>This attribute accepts values of type:</p>
     * <p>0 | `${number}${CssUnits}` | `${number}x` | `--${string}`  | `var($string})` | `${number}%`</p>
     * <br/>
     * <p>Because there is a theme default value for maxWidth, when setting the width property to achieve a fixed width,
     * set the maxWidth property to the same value.</p>
     *
     * @example <caption>When Date Picker should be a fixed width</caption>
     * &lt;oj-c-date-picker width='20rem' max-width='20rem'/>
     * @example &lt;caption>Date Picker width set to scalable xUnits&lt;/caption>
     *  &lt;oj-c-date-picker width='10x' max-width='10x'/>
     *
     * @ojmetadata description "Specifies the component style width."
     * @ojmetadata displayName "width"
     * @ojmetadata help "#width"
     */
    width?: Size;
    /**
     * @ojmetadata description Writeback support for the value property
     * @ojmetadata displayName “Value”
     * @ojmetadata help “#value”
     */
    onValueChanged?: PropertyChanged<DateISOStr | null>;
};
/**
 * This export corresponds to the DatePicker Preact component. For the oj-c-date-picker custom element, import CDatePickerElement instead.
 */
export declare const DatePicker: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<ObservedGlobalProps<"id" | "aria-describedby"> & {
    /**
     * A function that receives a date and returns an object specifying how to format the provided date.
     * This function is called for each date that is rendered and this can be used to control how individual
     * dates are rendered - disabled, restricted, or enabled.
     * @param date The date to format
     * @returns The format options
     */
    dayFormatter?: (date: CalendarDateRequired) => {
        state: "disabled" | "enabled" | "restricted";
    };
    /**
     * The days-outside-month attribute affects the day cells that are outside of the current month.
     *
     * @ojmetadata propertyEditorValues {
     *   "hidden": {
     *     "description": "The days outside of the current month will be hidden.",
     *     "displayName": "Hidden"
     *   },
     *   "selectable": {
     *     "description": "The days outside of the current month will be visible and selectable.",
     *     "displayName": "Selectable"
     *   }
     * }
     */
    daysOutsideMonth?: "hidden" | "selectable";
    /**
     * The month-and-year-picker attribute can be used to specify whether or not the DatePicker should show the
     * toggle buttons that toggle the month grid picker and year grid picker. The month picker grid allows
     * the user to select a month to display in the date picker and the year picker grid allows the user to
     * select the year to display in the date picker.
     * @ojmetadata propertyEditorValues {
     *   "on": {
     *     "description": "The month and year toggle buttons will be shown.",
     *     "displayName": "On"
     *   },
     *   "off": {
     *     "description": "The month and year toggle buttons will not be shown and the date picker renders the month and the year as text.",
     *     "displayName": "Off"
     *   }
     * }
     */
    monthAndYearPicker?: "on" | "off";
    /**
     * The maximum selectable date, in date only ISO string format.
     * Dates in the date picker that are greater than this date will not be selectable.
     * This must be a date only ISO string with no time, otherwise an error is thrown and the component will not render.
     * When set to null, there is no maximum.
     *
     * @ojmetadata description "The maximum selectable date, in ISO string format"
     * @ojmetadata displayName "Max"
     * @ojmetadata help "#max"
     * @ojmetadata format "date"
     */
    max?: DateISOStr | null;
    /**
     * Specifies the component style maxWidth.
     * <p>If not specified, defaults to the theme specified maxWidth.<br/>
     * This attribute accepts values of type:<br/>
     * 0 | `${number}${CssUnits}` | `${number}x` | `--${string}` | `var($string})` | `${number}%`</p>
     * <p>When this component is used in composition and the component should take up 100% of the parent container's
     * width, set maxWidth to '100%'.<br/>
     * Because there is a theme default value for maxWidth, when setting the width property to achieve a fixed width,
     * set the maxWidth property to the same value.</p>
     *
     * @example <caption>When Date Picker should be full width of parent container</caption>
     * &lt;oj-c-date-picker max-width='100%'/>
     * @example <caption>Date Picker maxWidth set to scalable xUnits</caption>
     *  &lt;oj-c-date-picker max-width='10x'/>
     * @example <caption>When Date Picker should be a fixed width</caption>
     * &lt;oj-c-date-picker width='25rem' max-width='25rem'/>
     *
     * &lt;/oj-c-center-template>
     *
     * @ojmetadata description "Specifies the component style maxWidth."
     * @ojmetadata displayName "Max Width"
     * @ojmetadata help "#maxWidth"
     */
    maxWidth?: Size;
    /**
     * The minimum selectable date, in date only ISO string format.
     * Dates in the date picker that are less than this date will not be selectable.
     * This must be a date only ISO string with no time, otherwise an error is thrown and the component will not render.
     * When set to null, there is no minimum.
     *
     * @ojmetadata description "The maximum selectable date, in ISO string format"
     * @ojmetadata displayName "Min"
     * @ojmetadata help "#min"
     * @ojmetadata format "date"
     */
    min?: DateISOStr | null;
    /**
     * Whether the component is readonly. When the component is readonly, the date picker can still be used to navigate
     * to different calendar dates, but the date picker won't allow the date to be changed via user action.
     */
    readonly?: boolean;
    /**
     * Specifies the visibility of the 'Go to today' button.
     *
     * @ojmetadata propertyEditorValues {
     *   "visible": {
     *     "description": "The 'Go to Today' button will be shown and it can be pressed to navigate to Today.",
     *     "displayName": "Visible"
     *   },
     *   "hidden": {
     *     "description": "The 'Go to Today' button will be hidden.",
     *     "displayName": "Hidden"
     *   }
     * }
     */
    todayButton?: "visible" | "hidden";
    /**
     * The today-time-zone attribute is used to compute today's date.
     * This defaults to the user's system timezone.
     * <p>
     * The only reason an application would set the today-time-zone property is if they want the
     * highlighted today cell to be in a different timezone than the user's system's timezone,
     * like if the user has a preferred timezone that is not where they are physically working.
     * </p>
     */
    todayTimeZone?: Intl.DateTimeFormatOptions["timeZone"];
    /**
     * The value of the component.
     * <p>The value must be a local date (no time) ISO string such as '2021-03-14',
     * otherwise the component will throw an error.</p>
     * <p>
     * The oj-c-date-picker initially opens to the selected date if there is one and it is within the min/max range.
     * If there is no value, the DatePicker initially opens to today's month.
     * </p>
     */
    value?: DateISOStr | null;
    /**
     * Whether week of the year will be shown in the DatePicker. The default calculation follows the
     * rule for ISO 8601 as follows: The first week of the year is defined as the week that contains
     * the first Thursday. Therefore, if January 1st falls on a Friday, it is considered part of the last week
     * of the previous year. Conversely, if December 31st falls on a Wednesday, it is part of week 1 of the following year.
     * @ojmetadata propertyEditorValues {
     *   "none": {
     *     "description": "The week of the year column will not be shown.",
     *     "displayName": "None"
     *   },
     *   "number": {
     *     "description": "Will show the week of the year as a number.",
     *     "displayName": "Number"
     *   }
     * }
     */
    weekDisplay?: "none" | "number";
    /**
     * Specifies the component style width.
     * <p>If not specified, defaults to '100%'.</p>
     * <p>This attribute accepts values of type:</p>
     * <p>0 | `${number}${CssUnits}` | `${number}x` | `--${string}`  | `var($string})` | `${number}%`</p>
     * <br/>
     * <p>Because there is a theme default value for maxWidth, when setting the width property to achieve a fixed width,
     * set the maxWidth property to the same value.</p>
     *
     * @example <caption>When Date Picker should be a fixed width</caption>
     * &lt;oj-c-date-picker width='20rem' max-width='20rem'/>
     * @example &lt;caption>Date Picker width set to scalable xUnits&lt;/caption>
     *  &lt;oj-c-date-picker width='10x' max-width='10x'/>
     *
     * @ojmetadata description "Specifies the component style width."
     * @ojmetadata displayName "width"
     * @ojmetadata help "#width"
     */
    width?: Size;
    /**
     * @ojmetadata description Writeback support for the value property
     * @ojmetadata displayName “Value”
     * @ojmetadata help “#value”
     */
    onValueChanged?: PropertyChanged<DateISOStr | null>;
}>>;
export type DatePickerProps = Props;
export {};
import { ComponentProps } from 'preact';
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-date-picker custom element. For the DatePicker Preact component, import DatePicker instead.
 */
export interface CDatePickerElement extends JetElement<CDatePickerElementSettableProperties>, CDatePickerElementSettableProperties {
    addEventListener<T extends keyof CDatePickerElementEventMap>(type: T, listener: (this: HTMLElement, ev: CDatePickerElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CDatePickerElementSettableProperties>(property: T): CDatePickerElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CDatePickerElementSettableProperties>(property: T, value: CDatePickerElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CDatePickerElementSettableProperties>): void;
    setProperties(properties: CDatePickerElementSettablePropertiesLenient): void;
}
export namespace CDatePickerElement {
    type dayFormatterChanged = JetElementCustomEventStrict<CDatePickerElement['dayFormatter']>;
    type daysOutsideMonthChanged = JetElementCustomEventStrict<CDatePickerElement['daysOutsideMonth']>;
    type maxChanged = JetElementCustomEventStrict<CDatePickerElement['max']>;
    type maxWidthChanged = JetElementCustomEventStrict<CDatePickerElement['maxWidth']>;
    type minChanged = JetElementCustomEventStrict<CDatePickerElement['min']>;
    type monthAndYearPickerChanged = JetElementCustomEventStrict<CDatePickerElement['monthAndYearPicker']>;
    type readonlyChanged = JetElementCustomEventStrict<CDatePickerElement['readonly']>;
    type todayButtonChanged = JetElementCustomEventStrict<CDatePickerElement['todayButton']>;
    type todayTimeZoneChanged = JetElementCustomEventStrict<CDatePickerElement['todayTimeZone']>;
    type valueChanged = JetElementCustomEventStrict<CDatePickerElement['value']>;
    type weekDisplayChanged = JetElementCustomEventStrict<CDatePickerElement['weekDisplay']>;
    type widthChanged = JetElementCustomEventStrict<CDatePickerElement['width']>;
}
export interface CDatePickerElementEventMap extends HTMLElementEventMap {
    'dayFormatterChanged': JetElementCustomEventStrict<CDatePickerElement['dayFormatter']>;
    'daysOutsideMonthChanged': JetElementCustomEventStrict<CDatePickerElement['daysOutsideMonth']>;
    'maxChanged': JetElementCustomEventStrict<CDatePickerElement['max']>;
    'maxWidthChanged': JetElementCustomEventStrict<CDatePickerElement['maxWidth']>;
    'minChanged': JetElementCustomEventStrict<CDatePickerElement['min']>;
    'monthAndYearPickerChanged': JetElementCustomEventStrict<CDatePickerElement['monthAndYearPicker']>;
    'readonlyChanged': JetElementCustomEventStrict<CDatePickerElement['readonly']>;
    'todayButtonChanged': JetElementCustomEventStrict<CDatePickerElement['todayButton']>;
    'todayTimeZoneChanged': JetElementCustomEventStrict<CDatePickerElement['todayTimeZone']>;
    'valueChanged': JetElementCustomEventStrict<CDatePickerElement['value']>;
    'weekDisplayChanged': JetElementCustomEventStrict<CDatePickerElement['weekDisplay']>;
    'widthChanged': JetElementCustomEventStrict<CDatePickerElement['width']>;
}
export interface CDatePickerElementSettableProperties extends JetSettableProperties {
    /**
     * A function that receives a date and returns an object specifying how to format the provided date.
     * This function is called for each date that is rendered and this can be used to control how individual
     * dates are rendered - disabled, restricted, or enabled.
     */
    dayFormatter?: ComponentProps<typeof DatePicker>['dayFormatter'];
    /**
     * The days-outside-month attribute affects the day cells that are outside of the current month.
     */
    daysOutsideMonth?: ComponentProps<typeof DatePicker>['daysOutsideMonth'];
    /**
     * The maximum selectable date, in date only ISO string format.
     * Dates in the date picker that are greater than this date will not be selectable.
     * This must be a date only ISO string with no time, otherwise an error is thrown and the component will not render.
     * When set to null, there is no maximum.
     */
    max?: ComponentProps<typeof DatePicker>['max'];
    /**
     * Specifies the component style maxWidth.
     * <p>If not specified, defaults to the theme specified maxWidth.<br/>
     * This attribute accepts values of type:<br/>
     * 0 | `${number}${CssUnits}` | `${number}x` | `--${string}` | `var($string})` | `${number}%`</p>
     * <p>When this component is used in composition and the component should take up 100% of the parent container's
     * width, set maxWidth to '100%'.<br/>
     * Because there is a theme default value for maxWidth, when setting the width property to achieve a fixed width,
     * set the maxWidth property to the same value.</p>
     */
    maxWidth?: ComponentProps<typeof DatePicker>['maxWidth'];
    /**
     * The minimum selectable date, in date only ISO string format.
     * Dates in the date picker that are less than this date will not be selectable.
     * This must be a date only ISO string with no time, otherwise an error is thrown and the component will not render.
     * When set to null, there is no minimum.
     */
    min?: ComponentProps<typeof DatePicker>['min'];
    /**
     * The month-and-year-picker attribute can be used to specify whether or not the DatePicker should show the
     * toggle buttons that toggle the month grid picker and year grid picker. The month picker grid allows
     * the user to select a month to display in the date picker and the year picker grid allows the user to
     * select the year to display in the date picker.
     */
    monthAndYearPicker?: ComponentProps<typeof DatePicker>['monthAndYearPicker'];
    /**
     * Whether the component is readonly. When the component is readonly, the date picker can still be used to navigate
     * to different calendar dates, but the date picker won't allow the date to be changed via user action.
     */
    readonly?: ComponentProps<typeof DatePicker>['readonly'];
    /**
     * Specifies the visibility of the 'Go to today' button.
     */
    todayButton?: ComponentProps<typeof DatePicker>['todayButton'];
    /**
     * The today-time-zone attribute is used to compute today's date.
     * This defaults to the user's system timezone.
     * <p>
     * The only reason an application would set the today-time-zone property is if they want the
     * highlighted today cell to be in a different timezone than the user's system's timezone,
     * like if the user has a preferred timezone that is not where they are physically working.
     * </p>
     */
    todayTimeZone?: ComponentProps<typeof DatePicker>['todayTimeZone'];
    /**
     * The value of the component.
     * <p>The value must be a local date (no time) ISO string such as '2021-03-14',
     * otherwise the component will throw an error.</p>
     * <p>
     * The oj-c-date-picker initially opens to the selected date if there is one and it is within the min/max range.
     * If there is no value, the DatePicker initially opens to today's month.
     * </p>
     */
    value?: ComponentProps<typeof DatePicker>['value'];
    /**
     * Whether week of the year will be shown in the DatePicker. The default calculation follows the
     * rule for ISO 8601 as follows: The first week of the year is defined as the week that contains
     * the first Thursday. Therefore, if January 1st falls on a Friday, it is considered part of the last week
     * of the previous year. Conversely, if December 31st falls on a Wednesday, it is part of week 1 of the following year.
     */
    weekDisplay?: ComponentProps<typeof DatePicker>['weekDisplay'];
    /**
     * Specifies the component style width.
     * <p>If not specified, defaults to '100%'.</p>
     * <p>This attribute accepts values of type:</p>
     * <p>0 | `${number}${CssUnits}` | `${number}x` | `--${string}`  | `var($string})` | `${number}%`</p>
     * <br/>
     * <p>Because there is a theme default value for maxWidth, when setting the width property to achieve a fixed width,
     * set the maxWidth property to the same value.</p>
     */
    width?: ComponentProps<typeof DatePicker>['width'];
}
export interface CDatePickerElementSettablePropertiesLenient extends Partial<CDatePickerElementSettableProperties> {
    [key: string]: any;
}
export interface DatePickerIntrinsicProps extends Partial<Readonly<CDatePickerElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    ondayFormatterChanged?: (value: CDatePickerElementEventMap['dayFormatterChanged']) => void;
    ondaysOutsideMonthChanged?: (value: CDatePickerElementEventMap['daysOutsideMonthChanged']) => void;
    onmaxChanged?: (value: CDatePickerElementEventMap['maxChanged']) => void;
    onmaxWidthChanged?: (value: CDatePickerElementEventMap['maxWidthChanged']) => void;
    onminChanged?: (value: CDatePickerElementEventMap['minChanged']) => void;
    onmonthAndYearPickerChanged?: (value: CDatePickerElementEventMap['monthAndYearPickerChanged']) => void;
    onreadonlyChanged?: (value: CDatePickerElementEventMap['readonlyChanged']) => void;
    ontodayButtonChanged?: (value: CDatePickerElementEventMap['todayButtonChanged']) => void;
    ontodayTimeZoneChanged?: (value: CDatePickerElementEventMap['todayTimeZoneChanged']) => void;
    onvalueChanged?: (value: CDatePickerElementEventMap['valueChanged']) => void;
    onweekDisplayChanged?: (value: CDatePickerElementEventMap['weekDisplayChanged']) => void;
    onwidthChanged?: (value: CDatePickerElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-date-picker': DatePickerIntrinsicProps;
        }
    }
}

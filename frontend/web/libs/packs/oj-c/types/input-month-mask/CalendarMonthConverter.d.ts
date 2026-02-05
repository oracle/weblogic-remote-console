import { BCP47Locale } from '@oracle/oraclejet-preact/UNSAFE_IntlDateTime';
import { CalendarMonth, CalendarMonthRequired, InputDateMask as PreactInputDateMask } from '@oracle/oraclejet-preact/UNSAFE_InputDateMask';
import { ComponentProps } from 'preact';
import { BundleType } from '@oracle/oraclejet-preact/resources/nls/bundle';
type PreactInputDateMaskProps = ComponentProps<typeof PreactInputDateMask>;
type CalendarMonthConverterOptions = {
    calendarMonthConverter_parseErrorFn?: BundleType['calendarMonthConverter_parseError'];
    customMask?: PreactInputDateMaskProps['masks'];
    locale?: BCP47Locale;
};
export declare class CalendarMonthConverter {
    private locale;
    private calendarMonthConverter_parseErrorFn;
    private customMask;
    constructor(options?: CalendarMonthConverterOptions);
    format(value: CalendarMonthRequired): CalendarMonth;
    parse(input: CalendarMonth): CalendarMonthRequired;
}
export {};

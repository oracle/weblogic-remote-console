import { BCP47Locale } from '@oracle/oraclejet-preact/UNSAFE_IntlDateTime';
import { CalendarDate, InputDateMask as PreactInputDateMask } from '@oracle/oraclejet-preact/UNSAFE_InputDateMask';
import { ComponentProps } from 'preact';
import { BundleType } from '@oracle/oraclejet-preact/resources/nls/bundle';
type PreactInputDateMaskProps = ComponentProps<typeof PreactInputDateMask>;
type CalendarDateConverterOptions = {
    calendarDateConverter_parseErrorFn?: BundleType['calendarDateConverter_parseError'];
    customMask?: PreactInputDateMaskProps['masks'];
    locale?: BCP47Locale;
};
export declare class CalendarDateConverter {
    private locale;
    private calendarDateConverter_parseErrorFn;
    private customMask;
    constructor(options?: CalendarDateConverterOptions);
    format(value: string): CalendarDate;
    parse(input: CalendarDate): string;
}
export {};

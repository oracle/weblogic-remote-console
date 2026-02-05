import type { ComponentMessageItem } from '@oracle/oraclejet-preact/UNSAFE_ComponentMessage';
import type { Converter, TranslateParseErrorFunc } from './types';
type ConversionSuccess<T> = {
    result: 'success';
    value: T;
};
type ConversionFailure = {
    result: 'failure';
    error: ComponentMessageItem;
};
type ConversionResult<T> = ConversionFailure | ConversionSuccess<T>;
/**
 * Parses the raw value from the UI to the internal value of the component
 * using the converter provided.
 * @param displayValue The raw value from the UI that needs to be parsed
 * @param converter The converter to be used for parsing
 * @param translateConverterParseError Function used to replace the converter error with a user-friendly message.
 * @returns The result of the conversion
 */
declare function parse<V, DV>(displayValue: DV, converter: Converter<V, DV>, translateConverterParseError?: TranslateParseErrorFunc): ConversionResult<V>;
/**
 * Formats the component value to a display value that will be shown in the UI
 * @param value The component value to be formatted to show in the UI
 * @param defaultValue The default value that needs to be shown in some cases
 * @param converter The converter to be used for formatting
 * @returns The result of the conversion
 */
declare function format<V, DV>(value: V, defaultValue: DV, converter: Converter<V, DV>): ConversionResult<DV>;
export { format, parse, type ConversionResult };

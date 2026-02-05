import { ComponentProps } from 'preact';
import { InputDateText } from './input-date-text';
type InputDateTextProps = ComponentProps<typeof InputDateText>;
/**
 * Props for the useImplicitDateConverter hook
 */
type UseImplicitDateConverterProps = {
    /**
     * The converter passed into the component
     */
    converter?: InputDateTextProps['converter'];
};
/**
 * A custom hook the creates an implicit date converter if the converter was not passed in to the component.
 *
 * @param param0 The props for the useImplicitDateConverter hook
 * @returns the converter
 */
export declare function useImplicitDateConverter({ converter }: UseImplicitDateConverterProps): import("@oracle/oraclejet-preact/UNSAFE_IntlFormatParse").FormatObj<string> & import("@oracle/oraclejet-preact/UNSAFE_IntlFormatParse").ParseObj<string>;
export {};

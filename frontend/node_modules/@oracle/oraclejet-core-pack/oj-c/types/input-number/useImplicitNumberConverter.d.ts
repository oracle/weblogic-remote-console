import { NumberConverter } from 'ojs/ojconverter-nativenumber';
import { ComponentProps } from 'preact';
import { InputNumber } from './input-number';
type InputNumberProps = ComponentProps<typeof InputNumber>;
/**
 * Props for the useImplicitNumberConverter hook
 */
type UseImplicitNumberConverterProps = {
    /**
     * The converter passed into the component
     */
    converter?: InputNumberProps['converter'];
};
/**
 * A custom hook the creates an implicit number converter if the converter was not passed in to the component.
 *
 * @param param0 The props for the useImplicitNumberConverter hook
 * @returns the converter
 */
export declare function useImplicitNumberConverter({ converter }: UseImplicitNumberConverterProps): import("ojs/ojconverter")<number> | NumberConverter;
export {};

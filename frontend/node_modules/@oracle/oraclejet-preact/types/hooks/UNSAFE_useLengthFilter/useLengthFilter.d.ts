import { ComponentProps } from 'preact';
import { TextFieldInput } from '../../UNSAFE_TextField';
import { CountUnit as _CountUnit } from '../../utils/UNSAFE_lengthFilter';
export type CountUnit = _CountUnit;
type PickedPropsFromTextFieldInput = Pick<ComponentProps<typeof TextFieldInput>, 'onCommit' | 'onInput' | 'value'>;
type UseLengthFilterProps = PickedPropsFromTextFieldInput & {
    maxLength?: number;
    maxLengthUnit?: CountUnit;
};
/**
 * A custom hook that applies the length filter to text field input
 * @param param0 The props for the useLengthFilter hook
 * @returns The filtered event handlers
 */
export declare function useLengthFilter({ maxLength, maxLengthUnit, onCommit, onInput, value }: UseLengthFilterProps): {
    valueLength: number | undefined;
    isMaxLengthReached: boolean | undefined;
    isMaxLengthExceeded: boolean;
    onFilteredInput: (detail: import("../../utils/UNSAFE_valueUpdateDetail").ValueUpdateDetail<string>) => void;
};
export {};

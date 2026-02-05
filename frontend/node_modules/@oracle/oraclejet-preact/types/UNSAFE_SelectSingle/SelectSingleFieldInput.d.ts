import { TextFieldInput } from "../UNSAFE_TextField";
import { ComponentProps, Ref } from 'preact';
type PickedTextFieldInputProps = Pick<ComponentProps<typeof TextFieldInput>, 'aria-controls' | 'aria-describedby' | 'aria-expanded' | 'aria-invalid' | 'aria-label' | 'hasEmptyLabel' | 'hasInsideLabel' | 'id' | 'isRequired' | 'onBlur' | 'onFocus' | 'onInput' | 'onKeyDown' | 'onKeyUp' | 'placeholder' | 'textAlign' | 'variant'> & {
    inputRef?: Ref<HTMLInputElement>;
};
type Props = PickedTextFieldInputProps & {
    displayValue: string;
    isAddToListShown: boolean;
    isAdvancedSearchShown: boolean;
    isUserFiltering: boolean;
    liveRegionText?: string;
    userInput?: string;
    virtualKeyboard?: 'auto' | 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';
};
export declare function SelectSingleFieldInput({ displayValue, isAddToListShown, isAdvancedSearchShown, isUserFiltering, liveRegionText, userInput, virtualKeyboard, ...passThroughTextFieldInputProps }: Props): import("preact").JSX.Element;
export {};

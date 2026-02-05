import { ComponentProps, Ref } from 'preact/compat';
import { TextFieldInput } from './TextFieldInput';
type TextFieldInputProps = ComponentProps<typeof TextFieldInput>;
type PickedPropsFromTextFieldInput = Pick<TextFieldInputProps, 'aria-describedby' | 'aria-invalid' | 'aria-label' | 'aria-labelledby' | 'autoFocus' | 'currentCommitValue' | 'hasEmptyLabel' | 'hasEndContent' | 'hasInsideLabel' | 'hasStartContent' | 'id' | 'isRequired' | 'onBlur' | 'onCommit' | 'onFocus' | 'onInput' | 'placeholder' | 'textAlign' | 'type' | 'value' | 'variant'>;
type Props = PickedPropsFromTextFieldInput & {
    /**
     * The character used for obfuscation
     */
    character?: string;
    /**
     * The ref for the input element
     */
    inputRef?: Ref<HTMLInputElement>;
    /**
     * Flag to indicate if the text is to be revealed
     */
    isRevealed?: boolean;
};
/**
 * Renders an input field (similar to TextFieldInput) that obfuscates the text
 * entered in it.
 */
export declare const ObfuscatedTextFieldInput: ({ character, currentCommitValue, inputRef, isRevealed, onCommit, onInput, type, value, ...passThroughProps }: Props) => import("preact/compat").JSX.Element;
export {};

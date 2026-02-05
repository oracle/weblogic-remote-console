import { ComponentProps, Ref } from 'preact';
import { TextTagList } from './TextTagList';
import { TextFieldInput } from '../UNSAFE_TextField';
type TextFieldInputProps = ComponentProps<typeof TextFieldInput>;
type TextTagListProps = ComponentProps<typeof TextTagList>;
type PassThroughTextFieldInputProps = Pick<TextFieldInputProps, 'aria-controls' | 'aria-describedby' | 'aria-expanded' | 'aria-invalid' | 'aria-label' | 'autoFocus' | 'hasEmptyLabel' | 'hasInsideLabel' | 'id' | 'onBlur' | 'onFocus' | 'onInput' | 'onKeyDown' | 'onKeyUp' | 'isRequired' | 'placeholder' | 'textAlign' | 'variant'> & {
    inputRef?: Ref<HTMLInputElement>;
};
type PassThroughTextTagListProps = Pick<TextTagListProps, 'onExitNavigation' | 'onRemove' | 'removeIcon'>;
type Props = PassThroughTextFieldInputProps & PassThroughTextTagListProps & {
    displayValue?: string;
    isAddToListShown?: boolean;
    isKeyboardNavigable?: boolean;
    isTextTagListShown?: boolean;
    isUserFiltering?: boolean;
    liveRegionText?: string;
    selectedValuesDescriptionId?: string;
    selectedValuesKeyboardNavDescriptionId?: string;
    textTagListData: TextTagListProps['data'];
    textTagListRef?: TextTagListProps['ref'];
    userInput?: string;
    virtualKeyboard?: 'auto' | 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';
};
export declare function SelectMultipleFieldInput({ displayValue, isAddToListShown, isKeyboardNavigable, isTextTagListShown, isUserFiltering, liveRegionText, onExitNavigation, onRemove, removeIcon, selectedValuesDescriptionId, selectedValuesKeyboardNavDescriptionId, textTagListData, textTagListRef, userInput, virtualKeyboard, ...passThroughTextFieldInputProps }: Props): import("preact").JSX.Element;
export {};

import { MutableRef } from 'preact/hooks';
import { ValueUpdateDetail } from '../../utils/UNSAFE_valueUpdateDetail';
type Selection = {
    start: number | null;
    end: number | null;
};
type TextFieldInputProps = {
    currentCommitValue?: string;
    isCommitOnEnter?: boolean;
    value?: string;
    onInput?: (detail: ValueUpdateDetail<string>) => void;
    onCommit?: (detail: ValueUpdateDetail<string>) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    selectionRef?: MutableRef<Selection>;
};
export declare function useTextFieldInputHandlers({ currentCommitValue, isCommitOnEnter, value, onInput, onCommit, onKeyDown, selectionRef }: TextFieldInputProps): {
    onBlur: (event: Event) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    oncompositionstart: () => void;
    oncompositionend: (event: Event) => void;
    onInput: (event: Event) => void;
};
export {};

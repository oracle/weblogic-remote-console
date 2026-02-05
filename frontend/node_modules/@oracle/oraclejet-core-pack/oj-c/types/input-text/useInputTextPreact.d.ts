import { ComponentProps } from 'preact';
import { InputText as PreactInputText } from '@oracle/oraclejet-preact/UNSAFE_InputText';
import type { InputTextProps } from './input-text';
type PreactInputTextProps = ComponentProps<typeof PreactInputText>;
/**
 * This hook manages state and other related props for the Input Text
 * component.
 */
export declare function useInputTextPreact<V>({ autocomplete, autofocus, clearIcon, converter, disabled, displayOptions, end, inputPrefix, inputSuffix, labelEdge, labelHint, labelStartWidth, length, messagesCustom, placeholder, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, start, textAlign, userAssistanceDensity, validators, value: propValue, virtualKeyboard, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }: InputTextProps<V>, addBusyState?: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    inputTextProps: PreactInputTextProps;
};
export {};

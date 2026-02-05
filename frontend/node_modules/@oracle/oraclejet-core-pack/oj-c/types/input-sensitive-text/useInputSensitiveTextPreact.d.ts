import { ComponentProps } from 'preact';
import type { InputSensitiveText as PreactInputSensitiveText } from '@oracle/oraclejet-preact/UNSAFE_InputSensitiveText';
import type { InputSensitiveTextProps } from './input-sensitive-text';
type PreactInputSensitiveTextProps = ComponentProps<typeof PreactInputSensitiveText>;
/**
 * This hook manages state and other related props to send to the Input Sensitive Text
 * component. This hook will transform any properties as needed, like maskIcon to
 * hasRevealToggle.
 *
 * Usage:
 * const { inputSensitiveTextProps } = useInputSensitiveTextPreact(props);
 * <PreactInputSensitiveText {...assistiveTextProps} {...inputSensitiveTextProps} />
 */
export declare function useInputSensitiveTextPreact<V extends string = string>({ autofocus, clearIcon, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, length, maskIcon, maskIconLabel, messagesCustom, placeholder, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, textAlign, userAssistanceDensity, validators, value: propValue, virtualKeyboard, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }: InputSensitiveTextProps<V>, addBusyState?: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    inputSensitiveTextProps: PreactInputSensitiveTextProps;
};
export {};

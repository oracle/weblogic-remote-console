import { ComponentProps } from 'preact';
import type { InputPassword as PreactInputPassword } from '@oracle/oraclejet-preact/UNSAFE_InputPassword';
import type { InputPassword } from 'oj-c/input-password';
type PreactInputPasswordProps = ComponentProps<typeof PreactInputPassword>;
type InputPasswordProps = ComponentProps<typeof InputPassword>;
/**
 * This hook manages state and other related props to send to the Input Password
 * component. This hook will transform any properties as needed, like maskIcon to
 * hasRevealToggle.
 *
 * Usage:
 * const { inputPasswordProps } = useInputPasswordPreact(props);
 * <PreactInputPassword {...assistiveTextProps} {...inputPasswordProps} />
 */
export declare function useInputPasswordPreact({ autocomplete, autofocus, clearIcon, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, maskIcon, messagesCustom, placeholder, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, textAlign, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }: InputPasswordProps, addBusyState?: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    inputPasswordProps: PreactInputPasswordProps;
};
export {};

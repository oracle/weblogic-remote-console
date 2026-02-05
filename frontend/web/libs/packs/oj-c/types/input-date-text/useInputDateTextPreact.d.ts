import { ComponentProps } from 'preact';
import type { InputText as PreactInputText } from '@oracle/oraclejet-preact/UNSAFE_InputText';
import type { InputDateText } from 'oj-c/input-date-text';
type PreactInputTextProps = ComponentProps<typeof PreactInputText>;
type InputDateTextProps = ComponentProps<typeof InputDateText>;
/**
 * This hook manages state and other related props for the Input Date Text component.
 * Note that InputDateText uses PreactInputText.
 */
export declare function useInputDateTextPreact({ autocomplete, autofocus, converter: propConverter, dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, max, messagesCustom, min, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, textAlign, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }: InputDateTextProps, addBusyState?: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    inputTextProps: PreactInputTextProps;
};
export {};

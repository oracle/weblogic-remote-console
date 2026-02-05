import { ComponentProps } from 'preact';
import type { InputDateMask as PreactInputDateMask } from '@oracle/oraclejet-preact/UNSAFE_InputDateMask';
import type { InputMonthMask } from 'oj-c/input-month-mask';
type PreactInputDateMaskProps = ComponentProps<typeof PreactInputDateMask>;
type InputMonthMaskProps = ComponentProps<typeof InputMonthMask>;
/**
 * This hook manages state and other related props that we need InputMonthMask component.
 * In Preact we have an InputDateMask with granularity day|month, and on the corepack side we have oj-c-input-date-mask and oj-c-input-month-mask.
 */
export declare function useInputMonthMaskPreact({ dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, max, messagesCustom, min, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, textAlign, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }: InputMonthMaskProps, addBusyState?: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    inputMonthMaskProps: PreactInputDateMaskProps;
};
export {};

import type { InputTimeMask as PreactInputTimeMask } from '@oracle/oraclejet-preact/UNSAFE_InputTimeMask';
import type { ComponentProps } from 'preact';
import type { InputTimeMask } from './input-time-mask';
type PreactInputTimeMaskProps = Omit<ComponentProps<typeof PreactInputTimeMask>, 'ref'>;
type InputTimeMaskProps = ComponentProps<typeof InputTimeMask>;
/**
 * This hook manages state and other related props for the Input Time Mask component.
 */
export declare function useInputTimeMaskPreact({ disabled, displayOptions, granularity, hourClock, labelEdge, labelHint, labelStartWidth, leadingZeroForHour, max, messagesCustom, min, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, textAlign, timeRangeOverflowMessageDetail, timeRangeUnderflowMessageDetail, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }: InputTimeMaskProps, addBusyState?: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    inputTimeMaskProps: PreactInputTimeMaskProps;
};
export {};

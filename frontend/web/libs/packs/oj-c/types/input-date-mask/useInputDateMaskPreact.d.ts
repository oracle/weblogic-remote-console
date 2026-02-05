import { ComponentProps } from 'preact';
import type { InputDateMask as PreactInputDateMask } from '@oracle/oraclejet-preact/UNSAFE_InputDateMask';
import type { InputDateMask } from 'oj-c/input-date-mask';
type PreactInputDateMaskProps = ComponentProps<typeof PreactInputDateMask>;
type InputDateMaskProps = ComponentProps<typeof InputDateMask>;
/**
 * This hook manages state and other related props for the Input Date Mask component.
 */
export declare function useInputDateMaskPreact({ dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, max, messagesCustom, min, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, textAlign, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }: InputDateMaskProps, addBusyState?: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    inputDateMaskProps: PreactInputDateMaskProps;
};
export declare const getMasksFromDatePatternPreferences: () => import("@oracle/oraclejet-preact/UNSAFE_InputDateMask").DatePlaceholders | undefined;
export {};

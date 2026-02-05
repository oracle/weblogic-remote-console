import { ComponentProps } from 'preact';
import type { NumberInputText as PreactNumberInputText } from '@oracle/oraclejet-preact/UNSAFE_NumberInputText';
import type { InputNumber } from 'oj-c/input-number';
type PreactNumberInputTextProps = ComponentProps<typeof PreactNumberInputText>;
type InputNumberProps = ComponentProps<typeof InputNumber>;
/**
 * This hook manages state and other related props for the Preact NumberInputText
 * component. It is a very primitive component that takes aria-valuenow, aria-valuetext, aria-valuemin, aria-valuemax,
 * and whether or not the up/down buttons are shown and disabled, etc.
 */
export declare function useNumberInputTextPreact({ autocomplete, // TODO: Should we make this off in oj-c comps?
autofocus, converter: propConverter, disabled, displayOptions, inputPrefix, inputSuffix, labelEdge, labelHint, labelStartWidth, max, messagesCustom, min, numberRangeExactMessageDetail, numberRangeOverflowMessageDetail, numberRangeUnderflowMessageDetail, placeholder, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, step, stepperVariant, textAlign, userAssistanceDensity, validators, value: propValue, virtualKeyboard, onMessagesCustomChanged, onRawValueChanged, onTransientValueChanged, onValidChanged, onValueChanged, ...otherProps }: InputNumberProps, addBusyState?: (desc?: string) => () => void): {
    value: import("../hooks/UNSAFE_useEditableValue/types").Optional<number | null>;
    setValue: (value: import("../hooks/UNSAFE_useEditableValue/types").Optional<number | null>) => void;
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    inputNumberProps: PreactNumberInputTextProps;
};
export {};

import { ComponentProps } from 'preact';
import type { TextArea as PreactTextArea } from '@oracle/oraclejet-preact/UNSAFE_TextArea';
import type { TextArea } from 'oj-c/text-area';
type PreactTextAreaProps = ComponentProps<typeof PreactTextArea>;
type TextAreaProps<V> = ComponentProps<typeof TextArea<V>>;
/**
 * This hook manages state and other related props for the Input Text
 * component.
 */
export declare function useTextAreaPreact<V>({ autocomplete, autofocus, converter, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, length, messagesCustom, placeholder, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, resizeBehavior, rows, textAlign, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValueChanged, onValidChanged, ...otherProps }: TextAreaProps<V>, addBusyState?: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    textAreaProps: PreactTextAreaProps;
};
export {};

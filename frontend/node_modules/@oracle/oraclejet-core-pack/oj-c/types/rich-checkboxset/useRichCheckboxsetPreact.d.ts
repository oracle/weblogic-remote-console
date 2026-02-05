import { ComponentProps } from 'preact';
import { RichCheckboxSet as PreactRichCheckboxSet } from '@oracle/oraclejet-preact/UNSAFE_RichCheckboxSet';
import { RichCheckboxsetProps } from './rich-checkboxset';
type PreactRichCheckboxSetProps = ComponentProps<typeof PreactRichCheckboxSet>;
export declare function useRichCheckboxsetPreact<V extends string | number>({ 'aria-describedby': ariaDescribedBy, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, maxSelected, messagesCustom, minSelected, onMessagesCustomChanged, onValidChanged, onValueChanged, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail: propRequiredMessageDetail, selectionExactMessageDetail, selectionOverflowMessageDetail, selectionRangeMessageDetail, selectionUnderflowMessageDetail, userAssistanceDensity, value: propValue }: RichCheckboxsetProps<V>, addBusyState: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    outerProps: {
        onFocusIn?: undefined;
        onFocusOut?: undefined;
    } | {
        onFocusIn: () => void;
        onFocusOut: (event: FocusEvent) => void;
    };
    richCheckboxsetProps: PreactRichCheckboxSetProps;
};
export {};

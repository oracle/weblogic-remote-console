import { RichRadioSet as PreactRichRadioSet } from '@oracle/oraclejet-preact/UNSAFE_RichRadioSet';
import { ComponentProps } from 'preact';
import { RichRadiosetProps } from './rich-radioset';
type PreactRichRadioSetProps = ComponentProps<typeof PreactRichRadioSet>;
export declare function useRichRadiosetPreact<V extends string | number>({ disabled, displayOptions, labelEdge, labelHint, labelStartWidth, layout, messagesCustom, readonly, readonlyUserAssistanceShown, requiredMessageDetail: propRequiredMessageDetail, required, userAssistanceDensity, value: propValue, onMessagesCustomChanged, onValidChanged, onValueChanged, ...otherProps }: RichRadiosetProps<V>, addBusyState: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    richRadiosetProps: PreactRichRadioSetProps;
};
export {};

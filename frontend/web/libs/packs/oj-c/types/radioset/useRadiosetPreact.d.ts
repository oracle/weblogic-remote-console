import { RadioSet as PreactRadioSet } from '@oracle/oraclejet-preact/UNSAFE_RadioSet';
import { ComponentProps } from 'preact';
import { RadiosetDataItem, RadiosetProps } from './radioset';
type PreactRadioSetProps = ComponentProps<typeof PreactRadioSet>;
export declare function useRadiosetPreact<V extends string | number, D extends RadiosetDataItem>({ direction, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, messagesCustom, readonly, readonlyUserAssistanceShown, requiredMessageDetail: propRequiredMessageDetail, required, userAssistanceDensity, value: propValue, onMessagesCustomChanged, onValidChanged, onValueChanged, ...otherProps }: RadiosetProps<V, D>, addBusyState: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    radiosetProps: PreactRadioSetProps;
};
export {};

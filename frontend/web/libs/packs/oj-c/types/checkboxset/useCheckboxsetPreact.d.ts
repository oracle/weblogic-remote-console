import { CheckboxSet as PreactCheckboxSet } from '@oracle/oraclejet-preact/UNSAFE_CheckboxSet';
import { ComponentProps } from 'preact';
import { CheckboxsetDataItem, CheckboxsetProps } from './checkboxset';
type PreactCheckboxSetProps = ComponentProps<typeof PreactCheckboxSet>;
export declare function useCheckboxsetPreact<V extends string | number, D extends CheckboxsetDataItem>({ 'aria-describedby': ariaDescribedBy, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, messagesCustom, readonly, readonlyUserAssistanceShown, requiredMessageDetail: propRequiredMessageDetail, required, userAssistanceDensity, value: propValue, onMessagesCustomChanged, onValidChanged, onValueChanged }: CheckboxsetProps<V, D>, addBusyState: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    checkboxsetProps: PreactCheckboxSetProps;
};
export {};

import { ComponentProps } from 'preact';
import { ValueUpdateDetail } from '@oracle/oraclejet-preact/utils/UNSAFE_valueUpdateDetail';
import { Checkbox } from './checkbox';
type CheckboxProps = ComponentProps<typeof Checkbox>;
export declare function useCheckboxPreact({ ['aria-describedby']: ariaDescribedBy, disabled, displayOptions, messagesCustom, readonly, readonlyUserAssistanceShown, requiredMessageDetail: propRequiredMessageDetail, required, userAssistanceDensity, value: propValue, onMessagesCustomChanged, onValidChanged, onValueChanged }: Omit<CheckboxProps, 'children'>, addBusyState: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    checkboxProps: import("preact/compat").PropsWithoutRef<{
        'aria-describedby'?: import("@oracle/oraclejet-preact/PRIVATE_oraclejet-internal-utilities/attributeUtils").UnpackSignals<import("preact").JSX.AriaAttributes>["aria-describedby"];
        assistiveText?: string | undefined;
        children: import("preact").ComponentChildren;
        columnSpan?: import("@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout").LayoutColumnSpan;
        helpSourceLink?: string | undefined;
        helpSourceText?: string | undefined;
        isRequired?: boolean;
        isReadonly?: boolean;
        isDisabled?: boolean;
        messages?: import("@oracle/oraclejet-preact/UNSAFE_ComponentMessage").ComponentMessageItem[] | undefined;
        onCommit: (detail: ValueUpdateDetail<boolean>) => void;
        userAssistanceDensity?: import("@oracle/oraclejet-preact/UNSAFE_UserAssistance").UserAssistanceDensityType;
        value?: boolean;
    } & import("@oracle/oraclejet-preact/hooks/UNSAFE_useTestId").TestIdProps> & {
        ref?: import("preact").Ref<import("@oracle/oraclejet-preact/hooks/UNSAFE_useFocusableTextField").FocusableHandle> | undefined;
    };
};
export {};

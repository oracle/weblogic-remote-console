type Props = {
    baseId: string;
    hasEndContent?: boolean;
    hasInsideLabel?: boolean;
    hasStartContent?: boolean;
    hasValue?: boolean;
    isDisabled?: boolean;
    isFocused?: boolean;
    labelId?: string;
    prefix?: string;
    suffix?: string;
    value?: string;
};
type PrefixSuffixVariant = 'prefix' | 'suffix';
export declare const usePrefixSuffix: ({ baseId, hasEndContent, hasInsideLabel, hasStartContent, hasValue, isDisabled, isFocused, labelId, prefix, suffix, value }: Props) => {
    shouldRenderPrefix: boolean | undefined;
    shouldRenderSuffix: boolean | undefined;
    prefixProps: {
        id: string;
        hasEndContent: boolean | undefined;
        hasInsideLabel: boolean | undefined;
        hasStartContent: boolean | undefined;
        isDisabled: boolean | undefined;
        isFocused: boolean | undefined;
        text: string;
        variant: PrefixSuffixVariant;
    };
    suffixProps: {
        id: string;
        hasInsideLabel: boolean | undefined;
        isDisabled: boolean | undefined;
        isFocused: boolean | undefined;
        text: string;
        variant: PrefixSuffixVariant;
    };
    valuePrefixSuffix: string | undefined;
    ariaLabelledBy: string | undefined;
};
export {};

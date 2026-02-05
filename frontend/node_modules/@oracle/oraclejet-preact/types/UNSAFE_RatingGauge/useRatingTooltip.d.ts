type Props = {
    isReadonly?: boolean;
    isDisabled?: boolean;
    tooltip?: string;
};
export declare function useRatingTooltip({ isReadonly, isDisabled, tooltip }: Props): {
    tooltipContent: import("preact").ComponentChild;
    tooltipProps: Record<string, any>;
};
export {};

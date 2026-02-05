type UseLabelledLinkAriaProps = {
    'aria-describedby'?: string;
    baseId: string;
    hasEmptyLabel: boolean;
    hasHiddenLabel: boolean;
    labelId?: string;
};
export declare function useLabelledLinkAria({ 'aria-describedby': ariaDescribedBy, baseId, hasEmptyLabel, hasHiddenLabel, labelId: propLabelId }: UseLabelledLinkAriaProps): {
    containerAria: {
        id: string;
    };
    hiddenLabelAria: {
        id: string;
    } | {
        id?: undefined;
    };
    linkAria: {
        'aria-describedby': string | undefined;
        'aria-labelledby': string;
    };
};
export {};

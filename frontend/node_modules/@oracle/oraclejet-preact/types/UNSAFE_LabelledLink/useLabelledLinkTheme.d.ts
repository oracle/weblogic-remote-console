type UseLabelledLinkThemeProps = {
    hasInsideLabel?: boolean;
    isFormLayout?: boolean;
    isFormReadonly?: boolean;
    textAlign?: 'start' | 'end' | 'right';
};
export declare function useLabelledLinkTheme({ hasInsideLabel, isFormLayout, isFormReadonly, textAlign }: UseLabelledLinkThemeProps): {
    classes: string;
};
export {};

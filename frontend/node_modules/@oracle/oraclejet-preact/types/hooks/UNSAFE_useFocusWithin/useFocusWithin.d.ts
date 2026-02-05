type FocusEvents = {
    onBlurWithin?: (e: FocusEvent) => void;
    onFocusWithin?: (e: FocusEvent) => void;
};
type UseFocusWithinProps = FocusEvents & {
    isDisabled?: boolean;
};
export declare function useFocusWithin({ isDisabled, onBlurWithin, onFocusWithin }?: UseFocusWithinProps): {
    isFocused: boolean;
    focusProps: {
        onFocusIn?: undefined;
        onFocusOut?: undefined;
    };
} | {
    isFocused: boolean;
    focusProps: {
        onFocusIn: (event: FocusEvent) => void;
        onFocusOut: (event: FocusEvent) => void;
    };
};
export {};

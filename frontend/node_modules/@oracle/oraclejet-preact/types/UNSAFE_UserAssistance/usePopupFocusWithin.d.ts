export declare function usePopupFocusWithin(): {
    isFocused: boolean;
    popupProps: {
        onTransitionEnd: (isAfterOpen?: boolean) => void;
        ref: import("preact/hooks").MutableRef<HTMLElement | null>;
    };
};

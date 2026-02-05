declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    selection: {
        isSelected: {
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderLeft: string;
            borderBottom: string;
            borderRight: string;
        };
        notSelected: string;
    };
    focusRing: {
        showFocusRing: string;
        noFocusRing: string;
    };
    current: {
        isCurrent: string;
        notCurrent: string;
    };
    edgeBottom: {
        isBottom: string;
        notBottom: string;
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };

declare const splitMenuButtonVars: {
    borderColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderColorDisabled: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    styleVariants: {
        outlined: {
            borderColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderColorDisabled: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        solid: {
            borderColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderColorDisabled: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        callToAction: {
            borderColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderColorDisabled: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
};
export { splitMenuButtonVars };

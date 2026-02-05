declare const buttonLayoutVars: {
    spacing: {
        lg: {
            columnGap: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        sm: {
            columnGap: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
};
export { buttonLayoutVars };

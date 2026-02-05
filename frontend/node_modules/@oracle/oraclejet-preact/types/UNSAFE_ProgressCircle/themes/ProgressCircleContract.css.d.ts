declare const progressCircleVars: {
    size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    trackWidth: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    sizes: {
        sm: {
            size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            trackWidth: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        md: {
            size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            trackWidth: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        lg: {
            size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            trackWidth: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
};
export { progressCircleVars };

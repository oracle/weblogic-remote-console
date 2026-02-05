declare const meterBarVars: {
    size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    sizes: {
        lg: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        md: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        sm: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        fit: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
};
export { meterBarVars };

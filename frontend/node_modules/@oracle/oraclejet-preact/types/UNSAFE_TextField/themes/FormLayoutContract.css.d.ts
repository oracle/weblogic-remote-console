declare const formLayoutVars: {
    startEdgeLabelToValuePadding: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    startEdgeLabelTextAlign: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
};
declare const formLayoutDensityVars: {
    topEdgeLabelToValuePadding: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
};
export { formLayoutVars, formLayoutDensityVars };

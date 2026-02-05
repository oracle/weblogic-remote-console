declare const checkboxVars: {
    outlineWidth: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    iconToTextGap: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
};
declare const checkboxDensityVars: {
    rowHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
};
export { checkboxVars, checkboxDensityVars };

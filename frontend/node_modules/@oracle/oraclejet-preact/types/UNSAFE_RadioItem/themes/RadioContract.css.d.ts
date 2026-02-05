declare const radioVars: {
    outlineWidth: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    iconToTextGap: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
};
declare const radioDensityVars: {
    rowHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
};
export { radioVars, radioDensityVars };

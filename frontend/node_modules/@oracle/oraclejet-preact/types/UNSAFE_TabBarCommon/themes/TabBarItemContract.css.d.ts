declare const baseVars: {
    labelColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    labelColorSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    labelColorHover: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    iconSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderWidthBottom: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderWidthLeftRight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
};
declare const densityVars: {
    mdHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    lgHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    stackedHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
};
declare const tabBarItemVars: {
    mdHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    lgHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    stackedHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    labelColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    labelColorSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    labelColorHover: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    iconSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderWidthBottom: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderWidthLeftRight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
};
export { tabBarItemVars, baseVars, densityVars };

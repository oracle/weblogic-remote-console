declare const menuItemVars: {
    iconSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    startEdgeToStartIconPadding: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    endIconToEndEdgePadding: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    startIconToLabelPadding: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    labelToEndIconPadding: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    textColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    iconColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
};
export { menuItemVars };

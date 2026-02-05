declare const popupVars: {
    backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderRadius: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    boxShadow: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    padding: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
};
export { popupVars };

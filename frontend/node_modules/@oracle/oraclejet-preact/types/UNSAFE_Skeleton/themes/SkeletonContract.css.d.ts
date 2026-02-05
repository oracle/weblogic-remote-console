declare const skeletonVars: {
    bgColor: {
        start: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        end: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
};
export { skeletonVars };

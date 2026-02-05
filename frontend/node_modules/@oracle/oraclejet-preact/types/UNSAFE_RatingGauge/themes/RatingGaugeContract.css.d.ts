declare const ratingGaugeVars: {
    colorSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderColorSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    colorUnselected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderColorUnselected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    colorSelectedDisabled: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderColorSelectedDisabled: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    colorUnselectedDisabled: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderColorUnselectedDisabled: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    colorSelectedReadonly: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderColorSelectedReadonly: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    colorUnselectedReadonly: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderColorUnselectedReadonly: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    margin: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    sizes: {
        sm: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        md: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        lg: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    colors: {
        gold: {
            colorSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            bordorColorSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            colorSelectedReadonly: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderColorUnselected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderColorUnselectedReadonly: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderColorSelectedReadonly: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        success: {
            colorSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            bordorColorSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            colorSelectedReadonly: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        warning: {
            colorSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            bordorColorSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            colorSelectedReadonly: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        danger: {
            colorSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            bordorColorSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            colorSelectedReadonly: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
};
export { ratingGaugeVars };

declare const avatarVars: {
    bgColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    textColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    borderRadius: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    initialsFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    initialsFontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    iconFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    pattern: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    colors: {
        neutral: {
            bgColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            pattern: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            textColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        orange: {
            bgColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            pattern: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            textColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        green: {
            bgColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            pattern: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            textColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        teal: {
            bgColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            pattern: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            textColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        blue: {
            bgColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            pattern: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            textColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        slate: {
            bgColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            pattern: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            textColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        pink: {
            bgColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            pattern: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            textColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        purple: {
            bgColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            pattern: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            textColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        lilac: {
            bgColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            pattern: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            textColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        gray: {
            bgColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            pattern: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            textColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
    sizes: {
        '2xs': {
            size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderRadius: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            iconFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        xs: {
            size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderRadius: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            iconFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        sm: {
            size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderRadius: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            iconFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        md: {
            size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderRadius: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            iconFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        lg: {
            size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderRadius: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            iconFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        xl: {
            size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderRadius: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            iconFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        '2xl': {
            size: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderRadius: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            initialsFontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            iconFontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
    shapes: {
        circle: {
            borderRadius: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
};
export { avatarVars };

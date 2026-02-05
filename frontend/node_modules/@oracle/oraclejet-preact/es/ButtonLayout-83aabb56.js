/* @oracle/oraclejet-preact: undefined */
import { jsx } from 'preact/jsx-runtime';
import { ButtonLayoutRedwoodTheme } from './UNSAFE_ButtonLayout/themes/redwood/ButtonLayoutTheme.js';
import { u as useComponentTheme } from './useComponentTheme-d2f9e47f.js';

/**
 * Button layout lays out a set of controls, such as buttons and menu buttons.
 */
const ButtonLayout = ({ children, spacing = 'lg' }) => {
    const { classes } = useComponentTheme(ButtonLayoutRedwoodTheme, { spacing });
    return jsx("div", { class: classes, children: children });
};

export { ButtonLayout as B };
//# sourceMappingURL=ButtonLayout-83aabb56.js.map

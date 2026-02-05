/* @oracle/oraclejet-preact: undefined */
import { jsx } from 'preact/jsx-runtime';
import { u as useComponentTheme } from './useComponentTheme-d2f9e47f.js';
import { BadgeRedwoodTheme } from './UNSAFE_Badge/themes/redwood/BadgeTheme.js';

function Badge({ variant, size, edge, children }) {
    const { classes } = useComponentTheme(BadgeRedwoodTheme, {
        variant,
        size,
        edge
    });
    return jsx("span", { class: classes, children: children });
}

export { Badge as B };
//# sourceMappingURL=Badge-a458c469.js.map

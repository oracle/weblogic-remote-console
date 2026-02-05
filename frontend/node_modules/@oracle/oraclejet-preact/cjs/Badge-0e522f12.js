/* @oracle/oraclejet-preact: undefined */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var useComponentTheme = require('./useComponentTheme-082fc8e4.js');
var UNSAFE_Badge_themes_redwood_BadgeTheme = require('./UNSAFE_Badge/themes/redwood/BadgeTheme.js');

function Badge({ variant, size, edge, children }) {
    const { classes } = useComponentTheme.useComponentTheme(UNSAFE_Badge_themes_redwood_BadgeTheme.BadgeRedwoodTheme, {
        variant,
        size,
        edge
    });
    return jsxRuntime.jsx("span", { class: classes, children: children });
}

exports.Badge = Badge;
//# sourceMappingURL=Badge-0e522f12.js.map

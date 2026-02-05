/* @oracle/oraclejet-preact: undefined */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var UNSAFE_ButtonLayout_themes_redwood_ButtonLayoutTheme = require('./UNSAFE_ButtonLayout/themes/redwood/ButtonLayoutTheme.js');
var useComponentTheme = require('./useComponentTheme-082fc8e4.js');

/**
 * Button layout lays out a set of controls, such as buttons and menu buttons.
 */
const ButtonLayout = ({ children, spacing = 'lg' }) => {
    const { classes } = useComponentTheme.useComponentTheme(UNSAFE_ButtonLayout_themes_redwood_ButtonLayoutTheme.ButtonLayoutRedwoodTheme, { spacing });
    return jsxRuntime.jsx("div", { class: classes, children: children });
};

exports.ButtonLayout = ButtonLayout;
//# sourceMappingURL=ButtonLayout-821ed00b.js.map

/* @oracle/oraclejet-preact: undefined */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var classNames = require('./classNames-c14c6ef3.js');
var UNSAFE_Separator_themes_SeparatorStyles_css = require('./UNSAFE_Separator/themes/SeparatorStyles.css.js');

// TODO - Support vertical orientation
function Separator({ orientation = 'horizontal' }) {
    const variantClasses = UNSAFE_Separator_themes_SeparatorStyles_css.multiVariantStyles({
        orientation: orientation
    });
    const classes = classNames.classNames([variantClasses, UNSAFE_Separator_themes_SeparatorStyles_css.styles.separatorBase]);
    const separatorVerticalWrapperClass = classNames.classNames([
        orientation === 'vertical' && UNSAFE_Separator_themes_SeparatorStyles_css.styles.separatorVerticalWrapper
    ]);
    // TODO - Check  with archs if this should be a polymorphic component and if the answer is yes, implement it
    return (jsxRuntime.jsx("div", { role: "separator", "aria-orientation": orientation, class: separatorVerticalWrapperClass, children: jsxRuntime.jsx("div", { class: classes }) }));
}

exports.Separator = Separator;
//# sourceMappingURL=Separator-85962472.js.map

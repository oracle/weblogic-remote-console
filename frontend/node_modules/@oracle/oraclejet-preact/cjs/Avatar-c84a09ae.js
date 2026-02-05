/* @oracle/oraclejet-preact: undefined */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var UNSAFE_Avatar_themes_redwood_AvatarTheme = require('./UNSAFE_Avatar/themes/redwood/AvatarTheme.js');
var classNames = require('./classNames-c14c6ef3.js');
var ImageVars_css = require('./ImageVars.css-3fbb1c0b.js');
var useComponentTheme = require('./useComponentTheme-082fc8e4.js');

/**
 * An avatar represents a person or entity as initials or an image.
 */
function Avatar({ children, src, ...otherProps }) {
    if (src && !children) {
        return jsxRuntime.jsx(ImageAvatar, { src: src, ...otherProps });
    }
    else {
        return jsxRuntime.jsx(ContentAvatar, { ...otherProps, children: children });
    }
}
const ImageAvatar = ({ src, ...otherProps }) => {
    const { styles: { base, image } } = useComponentTheme.useComponentTheme(UNSAFE_Avatar_themes_redwood_AvatarTheme.AvatarRedwoodTheme);
    const imageClasses = classNames.classNames([base, image]);
    return (jsxRuntime.jsx(AvatarWrapper, { ...otherProps, children: jsxRuntime.jsx("div", { class: imageClasses, style: { backgroundImage: `url(${src})` } }) }));
};
const ContentAvatar = ({ children, initials, ...otherProps }) => {
    const { styles: { baseStyle, content, initialsStyle, icon } } = useComponentTheme.useComponentTheme(UNSAFE_Avatar_themes_redwood_AvatarTheme.AvatarRedwoodTheme);
    const contentClasses = [baseStyle, content, initials ? initialsStyle : icon];
    const childContent = initials || children;
    return (jsxRuntime.jsx(AvatarWrapper, { ...otherProps, children: jsxRuntime.jsx("div", { "aria-hidden": "true", class: classNames.classNames(contentClasses), children: childContent }) }));
};
const AvatarWrapper = ({ background, size, shape, children, ...props }) => {
    const { classes } = useComponentTheme.useComponentTheme(UNSAFE_Avatar_themes_redwood_AvatarTheme.AvatarRedwoodTheme, {
        shape,
        size,
        background
    });
    const wrapperClasses = classNames.classNames([classes, ImageVars_css.globalImages]);
    if (props['aria-label']) {
        return (jsxRuntime.jsx("div", { "aria-label": props['aria-label'], role: "img", class: wrapperClasses, children: children }));
    }
    else {
        return jsxRuntime.jsx("div", { class: wrapperClasses, children: children });
    }
};

exports.Avatar = Avatar;
//# sourceMappingURL=Avatar-c84a09ae.js.map

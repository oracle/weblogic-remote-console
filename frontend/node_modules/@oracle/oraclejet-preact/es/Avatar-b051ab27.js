/* @oracle/oraclejet-preact: undefined */
import { jsx } from 'preact/jsx-runtime';
import { AvatarRedwoodTheme } from './UNSAFE_Avatar/themes/redwood/AvatarTheme.js';
import { c as classNames } from './classNames-4e12b00d.js';
import { g as globalImages } from './ImageVars.css-7b3180c8.js';
import { u as useComponentTheme } from './useComponentTheme-d2f9e47f.js';

/**
 * An avatar represents a person or entity as initials or an image.
 */
function Avatar({ children, src, ...otherProps }) {
    if (src && !children) {
        return jsx(ImageAvatar, { src: src, ...otherProps });
    }
    else {
        return jsx(ContentAvatar, { ...otherProps, children: children });
    }
}
const ImageAvatar = ({ src, ...otherProps }) => {
    const { styles: { base, image } } = useComponentTheme(AvatarRedwoodTheme);
    const imageClasses = classNames([base, image]);
    return (jsx(AvatarWrapper, { ...otherProps, children: jsx("div", { class: imageClasses, style: { backgroundImage: `url(${src})` } }) }));
};
const ContentAvatar = ({ children, initials, ...otherProps }) => {
    const { styles: { baseStyle, content, initialsStyle, icon } } = useComponentTheme(AvatarRedwoodTheme);
    const contentClasses = [baseStyle, content, initials ? initialsStyle : icon];
    const childContent = initials || children;
    return (jsx(AvatarWrapper, { ...otherProps, children: jsx("div", { "aria-hidden": "true", class: classNames(contentClasses), children: childContent }) }));
};
const AvatarWrapper = ({ background, size, shape, children, ...props }) => {
    const { classes } = useComponentTheme(AvatarRedwoodTheme, {
        shape,
        size,
        background
    });
    const wrapperClasses = classNames([classes, globalImages]);
    if (props['aria-label']) {
        return (jsx("div", { "aria-label": props['aria-label'], role: "img", class: wrapperClasses, children: children }));
    }
    else {
        return jsx("div", { class: wrapperClasses, children: children });
    }
};

export { Avatar as A };
//# sourceMappingURL=Avatar-b051ab27.js.map

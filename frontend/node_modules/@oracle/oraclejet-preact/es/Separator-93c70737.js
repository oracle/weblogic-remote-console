/* @oracle/oraclejet-preact: undefined */
import { jsx } from 'preact/jsx-runtime';
import { c as classNames } from './classNames-4e12b00d.js';
import { multiVariantStyles, styles } from './UNSAFE_Separator/themes/SeparatorStyles.css.js';

// TODO - Support vertical orientation
function Separator({ orientation = 'horizontal' }) {
    const variantClasses = multiVariantStyles({
        orientation: orientation
    });
    const classes = classNames([variantClasses, styles.separatorBase]);
    const separatorVerticalWrapperClass = classNames([
        orientation === 'vertical' && styles.separatorVerticalWrapper
    ]);
    // TODO - Check  with archs if this should be a polymorphic component and if the answer is yes, implement it
    return (jsx("div", { role: "separator", "aria-orientation": orientation, class: separatorVerticalWrapperClass, children: jsx("div", { class: classes }) }));
}

export { Separator as S };
//# sourceMappingURL=Separator-93c70737.js.map

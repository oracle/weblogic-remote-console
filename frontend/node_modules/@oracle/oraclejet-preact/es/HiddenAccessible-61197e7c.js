/* @oracle/oraclejet-preact: undefined */
import { jsx } from 'preact/jsx-runtime';
import './HiddenAccessibleStyles.styles.css';

var hiddenAccessibleStyle = 'HiddenAccessibleStyles_hiddenAccessibleStyle__1lyg6yp0';

/**
 * HiddenAccessible is a helper component that hides its children visually,
 * but keeps them visible to screen readers.
 *
 */
function HiddenAccessible({ children, id, isHidden }) {
    return (jsx("span", { id: id, class: hiddenAccessibleStyle, hidden: isHidden, children: children }));
}

export { HiddenAccessible as H };
//# sourceMappingURL=HiddenAccessible-61197e7c.js.map

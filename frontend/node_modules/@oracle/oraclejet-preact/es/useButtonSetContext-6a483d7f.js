/* @oracle/oraclejet-preact: undefined */
import { useContext } from 'preact/hooks';
import { createContext } from 'preact';

/**
 * Context which the parent component can use to provide various ToggleButton related
 * information
 */
const ButtonSetContext = createContext({
    variant: 'outlined',
    isDisabled: false,
    size: 'md',
    layoutWidth: 'auto',
    display: 'all',
    buttonSetValue: undefined,
    onCommit: undefined
});

/**
 * Utility hook for consuming the ButtonSetContext
 *
 * @returns The value of closest ButtonSetControl provider
 */
function useButtonSetContext() {
    return useContext(ButtonSetContext);
}

export { ButtonSetContext as B, useButtonSetContext as u };
//# sourceMappingURL=useButtonSetContext-6a483d7f.js.map

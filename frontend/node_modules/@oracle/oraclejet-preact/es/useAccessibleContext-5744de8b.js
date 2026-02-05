/* @oracle/oraclejet-preact: undefined */
import { useContext } from 'preact/hooks';
import { createContext } from 'preact';

/**
 * Context used by the parent to pass accessibility related information.
 */
const AccessibleContext = createContext({
    UNSAFE_ariaLabelledBy: undefined
});

/**
 * Utility hook for consuming the AccessibleContext
 *
 * @returns The value of closest AccessibleContext provider
 */
function useAccessibleContext() {
    return useContext(AccessibleContext);
}

export { AccessibleContext as A, useAccessibleContext as u };
//# sourceMappingURL=useAccessibleContext-5744de8b.js.map

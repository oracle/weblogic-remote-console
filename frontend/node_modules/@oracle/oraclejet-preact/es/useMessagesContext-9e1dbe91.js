/* @oracle/oraclejet-preact: undefined */
import { useContext } from 'preact/hooks';
import { M as MessagesContext } from './MessagesContext-76544845.js';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Uses the MessagesContext if one is available.
 *
 * @returns The context from the closes provider
 */
function useMessagesContext() {
    return useContext(MessagesContext);
}

export { useMessagesContext as u };
//# sourceMappingURL=useMessagesContext-9e1dbe91.js.map

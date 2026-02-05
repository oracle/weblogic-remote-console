/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Messages Context
 */
type MessagesContextProps = {
    /**
     * An optional function that adds busy state to the root element
     */
    addBusyState?: (description?: string) => () => void;
    /**
     * A unique identifier to be set on the layered content.
     */
    UNSAFE_messagesLayerId?: string;
};
/**
 * Context which the parent custom element components can use for passing down
 * the busy context
 */
export declare const MessagesContext: import("preact").Context<MessagesContextProps>;
export {};

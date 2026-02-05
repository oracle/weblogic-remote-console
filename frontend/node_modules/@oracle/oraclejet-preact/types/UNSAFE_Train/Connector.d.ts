/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
interface ConnectorProps {
    /**
     * Determines if the adjacent steps should be connected.
     */
    isConnected: boolean;
}
export declare const Connector: ({ isConnected }: ConnectorProps) => import("preact").JSX.Element;
export {};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { RefObject } from 'preact';
export declare function useWhenReadyContext(elemRef: RefObject<HTMLElement>): {
    whenReady: (timeout?: number) => Promise<void> | Promise<boolean | Error>;
};

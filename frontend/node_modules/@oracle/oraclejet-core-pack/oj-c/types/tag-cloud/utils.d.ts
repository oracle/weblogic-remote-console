/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { UnpackSignals } from '@oracle/oraclejet-preact/utils/UNSAFE_attributeUtils';
import type { JSX } from 'preact';
/**
 * Transforms the corepack tagcloud item to preact tagcloud item.
 * @param item
 * @param index
 * @returns
 */
export declare function transformItem(dataItem: any): {
    color: any;
    accessibleLabel: any;
    value: any;
    label: any;
    id: any;
    role: UnpackSignals<JSX.HTMLAttributes>["role"];
};
/**
 * Get a pseudo link callback that loads a document into the existing or a new window.
 * @param {string} dest a URL to be loaded for the link
 */
export declare function executeLink(dest: string): void;

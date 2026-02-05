/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Helper to find the first tabbable element inside the given element.
 * @param {HTMLElement|null} element
 * @returns focusElement
 */
export declare const focusFirstTabStop: (element: HTMLElement | null) => HTMLElement | null | undefined;
/**
 * Get the first tabbable element inside the given element
 * @param {HTMLElement} element Return first tabbable element inside this element
 * @returns {HTMLElement|null} The first tabbable element inside the given element.
 */
export declare const getFirstTabStop: (element: HTMLElement) => HTMLElement | null;

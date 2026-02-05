/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @ojmetadata main "oj-c/legend-utils"
 * @ojmetadata type "resource"
 * @ojmetadata name legendUtils
 * @ojmetadata description "A collection of utility functions related to determining the dimensions of an element."
 * @since 18.0.0
 **/
/**
 * Returns the preferred size of the legend for given width and height.
 * @param {CLegendElement} element  An oj-c-legend element.
 * @param {number} width The width allocated for rendering the legend.
 * @param {number} height The height allocated for rendering the legend.
 * @return {Object} An object containing preferred width and height required by legend to render.
 * */
export declare const getPreferredSize: (element: HTMLElement, width: number, height: number) => {
    width: number;
    height: number;
};

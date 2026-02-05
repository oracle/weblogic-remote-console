/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Adjusts the value to be "valid".
 * The logic follows that of HTML-5's input number.
 * http://www.w3.org/TR/html5/forms.html#dom-input-stepup
 * A valid value is one that is a multiple of
 * step starting at stepBase, where stepBase is min (if present),
 * else initial value (if present),
 * else (if type == number) 0
 * If max is not a valid value, stepUp/stepDown will never go to max. It
 * will go to the calculated valid max (one that is the largest value
 * that is an integral multiple of the step, and that is less than or equal
 * to the maximum.
 * @param {number} step - the step you want to adjust the value by. Negative values mean we are decreasing the number.
 * @param {number} stepOpt - the step option which is a positive number or 0. If it is negative, it will be abs(stepOpt)
 * @param {number} currentParsedValue - the current parsed value
 * @param {number} initialValue - the value when the component was created. This could be undefined or null in big jet. TODO: Can I make it 0?
 * @param {number} maxOpt - the max option
 * @param {number} minOpt - the min option
 * @returns {number} - the new value after it has been adjusted
 */
export declare function determineSteppedValue(step: number, stepOpt: number, currentParsedValue: number, initialValue?: number, maxOpt?: number, minOpt?: number): number;

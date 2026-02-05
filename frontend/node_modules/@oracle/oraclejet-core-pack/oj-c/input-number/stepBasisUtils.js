/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.determineSteppedValue = determineSteppedValue;
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
    function determineSteppedValue(step, stepOpt, currentParsedValue, initialValue, maxOpt, minOpt) {
        const precision = _precision(stepOpt, initialValue, minOpt);
        if (precision > 0) {
            const power = Math.pow(10, precision);
            // if minOpt, maxOpt, stepOpt are undefined, keep them that way
            // when we adjust the values to make them decimals, they should be whole numbers.
            // javascript sometimes gives them fractions (
            // e.g., 10000000.45*100=1000000044.9999999), so everywhere here we multiply
            // by power, round the value to make it a whole number.
            const minOptPower = minOpt !== undefined ? Math.round(minOpt * power) : minOpt;
            const maxOptPower = maxOpt != null ? Math.round(maxOpt * power) : maxOpt;
            const stepOptPower = Math.round(stepOpt * power);
            const adjustValuePower = _adjustValueForZeroPrecision(Math.round(step * power), stepOptPower, Math.round(currentParsedValue * power), initialValue !== undefined && initialValue !== null
                ? Math.round(initialValue * power)
                : initialValue, maxOptPower, minOptPower);
            return adjustValuePower / power;
        }
        return _adjustValueForZeroPrecision(step, stepOpt, currentParsedValue, initialValue, maxOpt, minOpt);
    }
    function _adjustValueForZeroPrecision(step, stepOpt, currentParsedValue, initialValue, maxOpt, minOpt) {
        // make sure we're at a valid step when we step up or down.
        // - find out where we are relative to the base.
        // follow these rules. use min, else use initial value, else use 0.
        // https://www.w3.org/TR/html5/forms.html#concept-input-min-zero
        let stepBase = minOpt != null ? minOpt : initialValue;
        if (stepBase === null || stepBase === undefined) {
            stepBase = 0;
        }
        // From http://www.w3.org/TR/html5/forms.html#dom-input-stepup:
        // If value subtracted from the step base is not an integral multiple
        // of the step, then set value to the nearest value that, when subtracted
        // from the step base, is an integral multiple of the allowed value step,
        // and that is less than value if the method invoked was stepDown() and
        // more than value if the method invoked was stepUp().
        // is value-stepBase an integral multiple of step?
        try {
            currentParsedValue = parseFloat(currentParsedValue.toFixed(0));
        }
        catch (e) {
            if (e instanceof TypeError) {
                // I've only seen this fail if they set a null converter.
                // Logger.warn("inputNumber's value after conversion is not a number. \n" +
                //                'The converter must convert the value to a Number. coercing using +');
                currentParsedValue = +currentParsedValue; // coerce
            }
        }
        let aboveMin = currentParsedValue - stepBase;
        let rounded = Math.round(aboveMin / stepOpt) * stepOpt;
        rounded = parseFloat(rounded.toFixed(0));
        const multiple = rounded === aboveMin;
        let newValue;
        if (!multiple) {
            if (step < 0) {
                aboveMin = Math.ceil(aboveMin / stepOpt) * stepOpt;
            }
            else {
                aboveMin = Math.floor(aboveMin / stepOpt) * stepOpt;
            }
            // rounding is based on 0, so adjust back to our base
            newValue = stepBase + aboveMin + step;
        }
        else {
            newValue = currentParsedValue + step;
        }
        // fix precision from bad JS floating point math
        // toFixed returns the newValue with a specific # of digits after the
        // decimal point (this_precision() looks at max of step/min/value's # of
        // digits.
        newValue = parseFloat(newValue.toFixed(0));
        if (minOpt != null && newValue < minOpt) {
            return minOpt;
        }
        if (maxOpt != null && newValue > maxOpt) {
            let validMax = Math.floor((maxOpt - stepBase) / stepOpt) * stepOpt + stepBase;
            // fix precision from bad JS floating point math
            validMax = parseFloat(validMax.toFixed(0));
            return validMax;
        }
        return newValue;
    }
    /**
     */
    function _precision(stepOpt, initialValue, minOpt) {
        let precision = _precisionOf(stepOpt);
        if (minOpt != null) {
            precision = Math.max(precision, _precisionOf(minOpt));
        }
        if (initialValue != null) {
            precision = Math.max(precision, _precisionOf(initialValue));
        }
        return precision;
    }
    /**
     * return the number of digits after the '.'
     * @param {number} num - number from which to calculate the precision
     */
    function _precisionOf(num) {
        const str = num.toString();
        const decimal = str.indexOf('.');
        return decimal === -1 ? 0 : str.length - decimal - 1;
    }
});

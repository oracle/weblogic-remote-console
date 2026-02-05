/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
define(["require", "exports", "./utils"], function (require, exports, utils_1) {
    "use strict";
    var _DateRestrictionValidator_instances, _DateRestrictionValidator_getErrorDetail, _DateRestrictionValidator_getDayState;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DateRestrictionValidator = void 0;
    /**
     * Constructs a DateRestrictionValidator that ensures the date provided is
     * not a disabled or restricted date.
     * @template V type of the value to be validated
     * @implements {Validator}
     */
    class DateRestrictionValidator {
        /**
         * Instantiates the DateRestrictionValidator
         * @param options The validator options
         */
        constructor(options) {
            _DateRestrictionValidator_instances.add(this);
            this.options = options;
        }
        /**
         * Validates that the provided date is not disabled or restricted
         * @param value The date to be validated
         * @throws {Error} when the date is disabled or restricted
         */
        validate(value) {
            if (value == null)
                return;
            // if value is specified, then convert the value to CalendarDate format
            const valueCalendarDate = this.options.converter.format(value);
            // if it is not disabled or restricted, then return
            const { state } = __classPrivateFieldGet(this, _DateRestrictionValidator_instances, "m", _DateRestrictionValidator_getDayState).call(this, valueCalendarDate);
            if (state === 'enabled')
                return;
            // validation failed, construct the error message and throw
            throw new Error(__classPrivateFieldGet(this, _DateRestrictionValidator_instances, "m", _DateRestrictionValidator_getErrorDetail).call(this, value, state));
        }
    }
    exports.DateRestrictionValidator = DateRestrictionValidator;
    _DateRestrictionValidator_instances = new WeakSet(), _DateRestrictionValidator_getErrorDetail = function _DateRestrictionValidator_getErrorDetail(value, state) {
        if (this.options.dateRestrictionMessageDetail)
            return this.options.dateRestrictionMessageDetail({ state, value });
        return this.options.defaultRestrictionMessageDetail();
    }, _DateRestrictionValidator_getDayState = function _DateRestrictionValidator_getDayState(date) {
        (0, utils_1.assertCompleteDate)(date);
        return this.options.dayFormatter(date);
    };
});

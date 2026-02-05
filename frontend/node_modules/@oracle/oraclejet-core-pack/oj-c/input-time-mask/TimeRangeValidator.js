var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
define(["require", "exports", "@oracle/oraclejet-preact/utils/UNSAFE_timeUtils"], function (require, exports, UNSAFE_timeUtils_1) {
    "use strict";
    var _TimeRangeValidator_instances, _TimeRangeValidator_getOverflowErrorDetail, _TimeRangeValidator_getUnderflowErrorDetail;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimeRangeValidator = void 0;
    /**
     * Constructs a TimeRangeValidator that ensures the time provided is
     * within the range specified using min and max. This throws an error if min is not less than max.
     * @template V type of the value to be validated. This is a time only iso string.
     * @implements {Validator}
     */
    class TimeRangeValidator {
        /**
         * Instantiates the TimeRangeValidator
         * @param options The validator options
         */
        constructor(options) {
            _TimeRangeValidator_instances.add(this);
            if (options.min && options.max && (0, UNSAFE_timeUtils_1.compareTimes)(options.min, options.max) > 0) {
                // this is an app developer error, so it doesn't need to be translated.
                throw new Error('min must be less than max');
            }
            this.options = options;
        }
        /**
         * Validates that the provided time is within the range.
         * @param value The time to be validated. V is a time-only iso string.
         * @throws {Error} when the time is not within the range
         */
        validate(value) {
            if (value === null)
                return;
            const { converter, max, min } = this.options;
            // if value is specified, then convert the time-only iso string value to Time format
            // converter.format throws an error if the value is not formatted correctly, like if it is empty, null, undefined, or has an offset or zulu,
            // or isn't a valid time-only local iso string.
            // valueTime is guaranteed to have hour+minute.
            const valueTime = converter.format(value);
            if (max !== undefined && (0, UNSAFE_timeUtils_1.compareTimes)(valueTime, max) > 0) {
                throw new Error(__classPrivateFieldGet(this, _TimeRangeValidator_instances, "m", _TimeRangeValidator_getOverflowErrorDetail).call(this, value, max));
            }
            if (min !== undefined && (0, UNSAFE_timeUtils_1.compareTimes)(valueTime, min) < 0) {
                throw new Error(__classPrivateFieldGet(this, _TimeRangeValidator_instances, "m", _TimeRangeValidator_getUnderflowErrorDetail).call(this, value, min));
            }
        }
    }
    exports.TimeRangeValidator = TimeRangeValidator;
    _TimeRangeValidator_instances = new WeakSet(), _TimeRangeValidator_getOverflowErrorDetail = function _TimeRangeValidator_getOverflowErrorDetail(value, max) {
        const { converter, timeRangeOverflowMessageDetail, defaultRangeOverflowMessageDetailFn, formatObj } = this.options;
        const isoMax = converter.parse(max);
        const maxString = formatObj.format(isoMax);
        if (timeRangeOverflowMessageDetail) {
            const valueString = formatObj.format(value);
            return timeRangeOverflowMessageDetail({ value: valueString, max: maxString });
        }
        return defaultRangeOverflowMessageDetailFn({ max: maxString });
    }, _TimeRangeValidator_getUnderflowErrorDetail = function _TimeRangeValidator_getUnderflowErrorDetail(value, min) {
        const { converter, timeRangeUnderflowMessageDetail, defaultRangeUnderflowMessageDetailFn, formatObj } = this.options;
        const isoMin = converter.parse(min);
        const minString = formatObj.format(isoMin);
        if (timeRangeUnderflowMessageDetail) {
            const valueString = formatObj.format(value);
            return timeRangeUnderflowMessageDetail({ value: valueString, min: minString });
        }
        return defaultRangeUnderflowMessageDetailFn({ min: minString });
    };
});

var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
define(["require", "exports", "./SelectionRangeValidatorError"], function (require, exports, SelectionRangeValidatorError_1) {
    "use strict";
    var _SelectionRangeValidator_instances, _SelectionRangeValidator_getOverflowErrorDetail, _SelectionRangeValidator_getUnderflowErrorDetail, _SelectionRangeValidator_getExactErrorDetail, _SelectionRangeValidator_getRangeErrorDetail;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionRangeValidator = void 0;
    /**
     * Constructs a SelectionRangeValidator that ensures the number of
     * selections is within the range specified using min and max.
     * @template V type of the value to be validated
     * @implements {Validator}
     */
    class SelectionRangeValidator {
        /**
         * Instantiates the SelectionRangeValidator
         * @param options The validator options
         */
        constructor(options) {
            _SelectionRangeValidator_instances.add(this);
            if (options.min && options.max && options.min > options.max) {
                // this is an app developer error, so it doesn't need to be translated.
                throw new Error('min must be less than max');
            }
            this.options = options;
        }
        /**
         * Validates that the number of selections is within the range
         * @param value The value to be validated
         * @throws {SelectionRangeValidatorError} when the value is not within the range
         */
        validate(value) {
            const { max, min } = this.options;
            const selections = value;
            const numSelections = selections.length;
            // Check for selection underflow (min only).
            if (min !== undefined && max === undefined && numSelections < min) {
                throw new SelectionRangeValidatorError_1.SelectionRangeValidatorError(__classPrivateFieldGet(this, _SelectionRangeValidator_instances, "m", _SelectionRangeValidator_getUnderflowErrorDetail).call(this, min));
            }
            // Check for selection overflow (max only).
            if (min === undefined && max !== undefined && numSelections > max) {
                throw new SelectionRangeValidatorError_1.SelectionRangeValidatorError(__classPrivateFieldGet(this, _SelectionRangeValidator_instances, "m", _SelectionRangeValidator_getOverflowErrorDetail).call(this, max));
            }
            // Check for exact number of selections (min === max).
            if (min !== undefined && max !== undefined && min === max && numSelections !== min) {
                throw new SelectionRangeValidatorError_1.SelectionRangeValidatorError(__classPrivateFieldGet(this, _SelectionRangeValidator_instances, "m", _SelectionRangeValidator_getExactErrorDetail).call(this, min));
            }
            // Check the number of selections falls between min and max (> min && < max).
            if (min !== undefined &&
                max !== undefined &&
                min !== max &&
                (numSelections < min || numSelections > max)) {
                throw new SelectionRangeValidatorError_1.SelectionRangeValidatorError(__classPrivateFieldGet(this, _SelectionRangeValidator_instances, "m", _SelectionRangeValidator_getRangeErrorDetail).call(this, min, max));
            }
        }
    }
    exports.SelectionRangeValidator = SelectionRangeValidator;
    _SelectionRangeValidator_instances = new WeakSet(), _SelectionRangeValidator_getOverflowErrorDetail = function _SelectionRangeValidator_getOverflowErrorDetail(max) {
        const { selectionOverflowMessageDetail, defaultSelectionOverflowMessageDetail } = this.options;
        return selectionOverflowMessageDetail
            ? selectionOverflowMessageDetail({ max })
            : defaultSelectionOverflowMessageDetail({ max: max.toString() });
    }, _SelectionRangeValidator_getUnderflowErrorDetail = function _SelectionRangeValidator_getUnderflowErrorDetail(min) {
        const { selectionUnderflowMessageDetail, defaultSelectionUnderflowMessageDetail } = this.options;
        return selectionUnderflowMessageDetail
            ? selectionUnderflowMessageDetail({ min })
            : defaultSelectionUnderflowMessageDetail({ min: min.toString() });
    }, _SelectionRangeValidator_getExactErrorDetail = function _SelectionRangeValidator_getExactErrorDetail(exact) {
        const { selectionExactMessageDetail, defaultSelectionExactMessageDetail } = this.options;
        return selectionExactMessageDetail
            ? selectionExactMessageDetail({ exact })
            : defaultSelectionExactMessageDetail({ n: exact.toString() });
    }, _SelectionRangeValidator_getRangeErrorDetail = function _SelectionRangeValidator_getRangeErrorDetail(min, max) {
        const { selectionRangeMessageDetail, defaultSelectionRangeMessageDetail } = this.options;
        return selectionRangeMessageDetail
            ? selectionRangeMessageDetail({ min, max })
            : defaultSelectionRangeMessageDetail({ min: min.toString(), max: max.toString() });
    };
});

define(["require", "exports", "preact/hooks", "ojs/ojvalidator-numberrange"], function (require, exports, hooks_1, NumberRangeValidator) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useImplicitNumberRangeValidator = useImplicitNumberRangeValidator;
    /**
     * A custom hook the creates an implicit new NumberRangeValidator for oj-c-input-number if there is a min or max property.
     * Otherwise it will return null.
     *
     * @param param0 The props for the export function useImplicitNumberRangeValidator({
     hook
     * @returns A NumberRangeValidator instance or null
     */
    function useImplicitNumberRangeValidator({ converter, max, min, numberRangeExactMessageDetail, numberRangeOverflowMessageDetail, numberRangeUnderflowMessageDetail }) {
        const numberRangeValidator = (0, hooks_1.useMemo)(() => {
            if (min !== undefined || max !== undefined) {
                return new NumberRangeValidator({
                    converter,
                    max,
                    min,
                    messageDetail: {
                        exact: numberRangeExactMessageDetail,
                        rangeOverflow: numberRangeOverflowMessageDetail,
                        rangeUnderflow: numberRangeUnderflowMessageDetail
                    }
                });
            }
            return null;
        }, [
            converter,
            min,
            max,
            numberRangeExactMessageDetail,
            numberRangeOverflowMessageDetail,
            numberRangeUnderflowMessageDetail
        ]);
        return numberRangeValidator;
    }
});

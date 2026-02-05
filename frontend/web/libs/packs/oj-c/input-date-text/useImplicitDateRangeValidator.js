define(["require", "exports", "ojs/ojvalidator-localdaterange", "preact/hooks"], function (require, exports, ojvalidator_localdaterange_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useImplicitDateRangeValidator = useImplicitDateRangeValidator;
    /**
     * Custom hook that creates an implicit DateTimeRangeValidator for oj-c-input-date if there is a min or max property.
     * Otherwise it will return null.
     *
     * @returns A DateTimeRangeValidator instance or null
     */
    function useImplicitDateRangeValidator({ formatObj, dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, max, min }) {
        const dateRangeValidator = (0, hooks_1.useMemo)(() => {
            if (min !== undefined || max !== undefined) {
                return new ojvalidator_localdaterange_1.LocalDateRangeValidator({
                    formatObj,
                    max,
                    min,
                    rangeOverflowMessageDetail: dateRangeOverflowMessageDetail,
                    rangeUnderflowMessageDetail: dateRangeUnderflowMessageDetail
                });
            }
            return null;
        }, [formatObj, dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, min, max]);
        return dateRangeValidator;
    }
});

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "preact/hooks", "./DateRangeValidator"], function (require, exports, hooks_1, DateRangeValidator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useImplicitDateRangeValidator = void 0;
    /**
     * Custom hook that creates an implicit DateRangeValidator for oj-c-input-date-picker
     * if there is a dayFormatter property. Otherwise it will return null.
     *
     * @returns A DateRangeValidator instance or null
     */
    const useImplicitDateRangeValidator = ({ converter, defaultRangeOverflowMessageDetailFn, defaultRangeUnderflowMessageDetailFn, dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, formatObj, max, min }) => (0, hooks_1.useMemo)(() => {
        // if there is no min and no max, no need for validation
        if (!min && !max)
            return undefined;
        // since there is a min or max, return a validator
        return new DateRangeValidator_1.DateRangeValidator({
            converter,
            defaultRangeOverflowMessageDetailFn,
            defaultRangeUnderflowMessageDetailFn,
            dateRangeOverflowMessageDetail,
            dateRangeUnderflowMessageDetail,
            formatObj,
            max,
            min
        });
    }, [
        converter,
        defaultRangeOverflowMessageDetailFn,
        defaultRangeUnderflowMessageDetailFn,
        dateRangeOverflowMessageDetail,
        dateRangeUnderflowMessageDetail,
        formatObj,
        max,
        min
    ]);
    exports.useImplicitDateRangeValidator = useImplicitDateRangeValidator;
});

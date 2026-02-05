/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "preact/hooks", "./TimeRangeValidator"], function (require, exports, hooks_1, TimeRangeValidator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useImplicitTimeRangeValidator = void 0;
    /**
     * Custom hook that creates an implicit TimeRangeValidator for oj-c-input-time-mask.
     *
     * @returns A TimeRangeValidator instance or undefined if there is no min and no max, and therefore no need for validation.
     */
    const useImplicitTimeRangeValidator = ({ converter, defaultRangeOverflowMessageDetailFn, defaultRangeUnderflowMessageDetailFn, timeRangeOverflowMessageDetail, timeRangeUnderflowMessageDetail, formatObj, max, min }) => (0, hooks_1.useMemo)(() => {
        // if there is no min and no max, no need for validation
        if (!min && !max)
            return undefined;
        // since there is a min or max, return a validator
        return new TimeRangeValidator_1.TimeRangeValidator({
            converter,
            defaultRangeOverflowMessageDetailFn,
            defaultRangeUnderflowMessageDetailFn,
            timeRangeOverflowMessageDetail,
            timeRangeUnderflowMessageDetail,
            formatObj,
            max,
            min
        });
    }, [
        converter,
        defaultRangeOverflowMessageDetailFn,
        defaultRangeUnderflowMessageDetailFn,
        timeRangeOverflowMessageDetail,
        timeRangeUnderflowMessageDetail,
        formatObj,
        max,
        min
    ]);
    exports.useImplicitTimeRangeValidator = useImplicitTimeRangeValidator;
});

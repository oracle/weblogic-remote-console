/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "oj-c/input-date-mask/CalendarDateConverter", "oj-c/input-date-mask/useInputDateMaskPreact", "preact/hooks"], function (require, exports, CalendarDateConverter_1, useInputDateMaskPreact_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useImplicitCalendarDateConverter = void 0;
    /**
     * Custom hook that creates an implicit CalendarDateConverter for oj-c-input-date-picker.
     *
     * @returns A CalendarDateConverter instance
     */
    const useImplicitCalendarDateConverter = ({ calendarDateConverter_parseErrorFn }) => {
        // User preferences are set before the application runs, and never after that.
        const masksFromUserPref = (0, hooks_1.useMemo)(() => {
            return (0, useInputDateMaskPreact_1.getMasksFromDatePatternPreferences)();
        }, []);
        // Create a converter for getting min/max
        return (0, hooks_1.useMemo)(() => {
            return new CalendarDateConverter_1.CalendarDateConverter({
                calendarDateConverter_parseErrorFn,
                customMask: masksFromUserPref
            });
        }, [calendarDateConverter_parseErrorFn, masksFromUserPref]);
    };
    exports.useImplicitCalendarDateConverter = useImplicitCalendarDateConverter;
});

define(["require", "exports", "./CalendarDateConverter", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "ojs/ojconverter-preferences", "@oracle/oraclejet-preact/utils/UNSAFE_calendarDateUtils", "oj-c/hooks/UNSAFE_useComponentMessages/useComponentMessages", "oj-c/input-date-text/useImplicitDateRangeValidator", "ojs/ojconfig", "oj-c/hooks/UNSAFE_useEditableValue/index", "oj-c/editable-value/UNSAFE_useDeferredValidators/useDeferredValidators"], function (require, exports, CalendarDateConverter_1, hooks_1, UNSAFE_useTranslationBundle_1, ojconverter_preferences_1, UNSAFE_calendarDateUtils_1, useComponentMessages_1, useImplicitDateRangeValidator_1, ojconfig_1, index_1, useDeferredValidators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getMasksFromDatePatternPreferences = void 0;
    exports.useInputDateMaskPreact = useInputDateMaskPreact;
    /**
     * This hook manages state and other related props for the Input Date Mask component.
     */
    function useInputDateMaskPreact({ dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, max, messagesCustom, min, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, textAlign, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }, addBusyState) {
        // Treat null as undefined for the min/max options.
        const minTreatNull = (0, index_1.treatNull)(min);
        const maxTreatNull = (0, index_1.treatNull)(max);
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const calendarDateConverter_parseErrorFn = translations.calendarDateConverter_parseError;
        // User preferences are set before the application runs, and never after that.
        const masksFromUserPref = (0, hooks_1.useMemo)(() => {
            return (0, exports.getMasksFromDatePatternPreferences)();
        }, []);
        const implicitConverter = (0, hooks_1.useMemo)(() => {
            return new CalendarDateConverter_1.CalendarDateConverter({
                calendarDateConverter_parseErrorFn,
                customMask: masksFromUserPref
            });
        }, [calendarDateConverter_parseErrorFn, masksFromUserPref]);
        // returns a formatted date to use in the example.
        // Memoize this because formatObj in useImplicitDateRangeValidator is a dependency. If we do not memoize,
        // then our code would create a new converter on every keystroke the user types.
        const exampleFormatter = (0, hooks_1.useMemo)(() => {
            return {
                format: (value) => {
                    // Format based on masks from user pref, if any, or the locale.
                    return (0, UNSAFE_calendarDateUtils_1.formatIsoDateStrAsExample)((0, ojconfig_1.getLocale)(), value, masksFromUserPref);
                }
            };
        }, [masksFromUserPref]);
        const implicitComponentValidator = (0, useImplicitDateRangeValidator_1.useImplicitDateRangeValidator)({
            formatObj: exampleFormatter,
            dateRangeOverflowMessageDetail,
            dateRangeUnderflowMessageDetail,
            max: maxTreatNull,
            min: minTreatNull
        });
        const combinedValidators = (0, hooks_1.useMemo)(() => {
            const v1 = implicitComponentValidator ? [implicitComponentValidator] : [];
            const v2 = validators ? validators : [];
            return [...v1, ...v2];
        }, [implicitComponentValidator, validators]);
        const deferredValidators = (0, useDeferredValidators_1.useDeferredValidators)({
            labelHint,
            required,
            requiredMessageDetail
        });
        const { methods, textFieldProps: evTextFieldProps, value } = (0, index_1.useEditableValue)({
            addBusyState,
            ariaDescribedBy: otherProps['aria-describedby'],
            converter: implicitConverter,
            defaultDisplayValue: undefined,
            deferredValidators,
            disabled,
            displayOptions,
            messagesCustom,
            onMessagesCustomChanged,
            onRawValueChanged,
            onValidChanged,
            onValueChanged,
            readonly,
            validators: combinedValidators,
            value: propValue
        });
        const { messages: evMessages, ...textFieldProps } = evTextFieldProps;
        const messages = (0, useComponentMessages_1.useComponentMessages)({
            evMessages,
            messagesCustom,
            readonly,
            readonlyUserAssistanceShown
        });
        // this is used to determine isRequiredShown
        const hasNoValue = value === undefined || !isPartialDate(textFieldProps.value);
        return {
            methods,
            inputDateMaskProps: {
                isDisabled: disabled,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || hasNoValue),
                label: labelHint,
                labelEdge,
                labelStartWidth,
                masks: masksFromUserPref,
                messages,
                textAlign,
                userAssistanceDensity,
                ...textFieldProps
            }
        };
    }
    const isPartialDate = (value) => {
        if (value === undefined)
            return false;
        return value.year !== undefined || value.month !== undefined || value.day !== undefined;
    };
    // get the DatePlaceholders array. If it is not undefined, we will set this on the masks property of InputDateMask.
    // If the pattern has MMM in it, then it must be in their language and use their locale since MMM is an abbreviation for the month not a number.
    // For example, it can be Oct for October in English.
    // Therefore, if the pattern has MMM in it, we assume that they are using locale and we will not set a custom masks.
    // They will get the order of month, day and year and the placeholder based on their locale.
    const getMasksFromDatePatternPreferences = () => {
        // get the user preference pattern for date, and from that we get order of year, month, day and store it in
        // masks: DatePlaceholders;
        // masks overrides the locale specific order of the individual date segments as well as the locale specific separator.
        // we use masks when we show a date in an error message and we pass it to the PreactInputDateMask.
        // this way the order of the month, day, year segments in the field matches the order of any error messages, like
        // 'Enter a complete date like this: 11/29/2023'.
        const prefs = (0, ojconverter_preferences_1.getDateTimePreferences)();
        const pattern = prefs.dateStyle?.short?.pattern;
        // return undefined if no pattern or if pattern contains MMM/mmm
        if (!pattern || pattern.toUpperCase().includes('MMM')) {
            return undefined;
        }
        return (0, UNSAFE_calendarDateUtils_1.getDatePlaceholdersFromPattern)(pattern);
    };
    exports.getMasksFromDatePatternPreferences = getMasksFromDatePatternPreferences;
});

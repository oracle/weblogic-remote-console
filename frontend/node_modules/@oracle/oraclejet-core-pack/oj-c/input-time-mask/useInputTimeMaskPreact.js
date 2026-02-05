define(["require", "exports", "oj-c/hooks/UNSAFE_useComponentMessages/useComponentMessages", "oj-c/editable-value/UNSAFE_useDeferredValidators/useDeferredValidators", "oj-c/hooks/UNSAFE_useEditableValue/index", "preact/hooks", "./TimeConverter", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "ojs/ojconfig", "@oracle/oraclejet-preact/UNSAFE_IntlDateTime", "./useImplicitTimeRangeValidator", "@oracle/oraclejet-preact/utils/UNSAFE_timeUtils", "ojs/ojconverter-preferences"], function (require, exports, useComponentMessages_1, useDeferredValidators_1, index_1, hooks_1, TimeConverter_1, UNSAFE_useTranslationBundle_1, ojconfig_1, UNSAFE_IntlDateTime_1, useImplicitTimeRangeValidator_1, UNSAFE_timeUtils_1, ojconverter_preferences_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useInputTimeMaskPreact = useInputTimeMaskPreact;
    /**
     * This hook manages state and other related props for the Input Time Mask component.
     */
    function useInputTimeMaskPreact({ disabled, displayOptions, granularity = 'minute', hourClock, labelEdge, labelHint, labelStartWidth, leadingZeroForHour, max, messagesCustom, min, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, textAlign, timeRangeOverflowMessageDetail, timeRangeUnderflowMessageDetail, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }, addBusyState) {
        // First assert that all the props are expected.
        assertProps({ value: propValue, min, max });
        // get the translation resources
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        // User preferences are set before the application runs, and never after that.
        const { masksFromUserPref, leadingZeroForHourFromUserPref } = (0, hooks_1.useMemo)(() => {
            return getMasksFromTimePatternPreferences();
        }, []);
        // create implicit converter.
        const implicitConverter = (0, hooks_1.useMemo)(() => {
            return new TimeConverter_1.TimeConverter({
                timeConverter_parseErrorFn: translations.timeConverter_parseError
            });
        }, [translations.timeConverter_parseError]);
        // get min and max as TimeWithValidIsoStrParts. Treats null as undefined for the min/max options.
        const { max: maxTime, min: minTime } = useMinMax({
            converter: implicitConverter,
            max,
            min
        });
        const masksFromLocaleAndOptions = (0, hooks_1.useMemo)(() => {
            const isHour12 = hourClock === '12' ? true : hourClock === '24' ? false : undefined;
            return (0, UNSAFE_timeUtils_1.getTimeMasksFromLocaleAndOptions)((0, ojconfig_1.getLocale)(), granularity, isHour12);
        }, [granularity, hourClock]);
        // returns a formatted time to use in error messages shown to the user, like the min/max error. We
        // want this time to match the format in the field.
        // Memoize this because formatObj in useImplicitTimeRangeValidator is a dependency. If we do not memoize,
        // then our code would create a new converter on every keystroke the user types.
        const timeFormatter = (0, hooks_1.useMemo)(() => {
            return {
                format: (value) => {
                    const locale = (0, ojconfig_1.getLocale)();
                    let hasLeadingZeroForHour;
                    if (leadingZeroForHourFromUserPref !== undefined) {
                        hasLeadingZeroForHour = leadingZeroForHourFromUserPref === 'show';
                    }
                    else {
                        hasLeadingZeroForHour =
                            leadingZeroForHour === 'show'
                                ? true
                                : leadingZeroForHour === 'hide'
                                    ? false
                                    : (0, UNSAFE_timeUtils_1.getLeadingZeroForHour)(locale);
                    }
                    return (0, UNSAFE_timeUtils_1.formatIsoTimeStrAsExample)(value, locale, granularity, hasLeadingZeroForHour, masksFromUserPref ?? masksFromLocaleAndOptions);
                }
            };
        }, [
            granularity,
            leadingZeroForHour,
            leadingZeroForHourFromUserPref,
            masksFromLocaleAndOptions,
            masksFromUserPref
        ]);
        // create implicit validators
        const implicitComponentValidator = (0, useImplicitTimeRangeValidator_1.useImplicitTimeRangeValidator)({
            converter: implicitConverter,
            timeRangeOverflowMessageDetail,
            timeRangeUnderflowMessageDetail,
            defaultRangeOverflowMessageDetailFn: translations.inputTimeMask_timeRangeOverflowMessageDetail,
            defaultRangeUnderflowMessageDetailFn: translations.inputTimeMask_timeRangeUnderflowMessageDetail,
            formatObj: timeFormatter,
            max: maxTime,
            min: minTime
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
        const hasNoValue = value === undefined || !isPartialOrCompleteTime(textFieldProps.value);
        // These properties will get passed down to InputTimeMask.
        return {
            methods,
            inputTimeMaskProps: {
                granularity,
                leadingZeroForHour: leadingZeroForHourFromUserPref ?? leadingZeroForHour,
                isDisabled: disabled,
                hourClock,
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
    const isPartialOrCompleteTime = (value) => {
        if (value === undefined)
            return false;
        return Object.values(value).some((t) => t !== undefined);
    };
    /**
     * Gets the user preference pattern for time, if any, and from that we get the masks: TimePlaceholder and the leading zero for hour.
     * If there are no user preferences
     * for time, this function returns {masksFromUserPref: undefined, leadingZeroForHourFromUserPref: undefined}.
     * The masks property is an array-based representation of the segments used for time based on the time pattern from user preferences.
     * The masks property overrides the locale-specific time format, like whether or not it has a dayPeriod field (AM/PM) and what the segment separators are.
     * Some user preferences for time are: 'H.mm', 'HH:mm:ss', 'a h:mm', 'ah:mm', 'h.mm.a'. The order of hour, minute, second is always the same.
     * The leadingZeroForHourFromUserPref looks at the user preference pattern for HH or hh. Two h's means 'show' leading zero for hour.
     * @returns {masksFromUserPref: undefined, leadingZeroForHourFromUserPref: undefined} if no user preferences, otherwise returns
     * {masksFromUserPref: TimePlaceholders, leadingZeroForHourFromUserPref: 'show'|'hide'}.
     */
    const getMasksFromTimePatternPreferences = () => {
        const prefs = (0, ojconverter_preferences_1.getDateTimePreferences)();
        const pattern = prefs.timeStyle?.short?.pattern;
        // return undefined if no pattern
        if (!pattern) {
            return { leadingZeroForHourFromUserPref: undefined, masksFromUserPref: undefined };
        }
        // Parse the pattern to get the masks and the leading zero for hour.
        const hasTwoHs = pattern.toLowerCase().includes('hh');
        const leadingZeroForHourFromUserPref = hasTwoHs ? 'show' : 'hide';
        return {
            leadingZeroForHourFromUserPref,
            masksFromUserPref: (0, UNSAFE_timeUtils_1.getTimePlaceholdersFromPattern)(pattern)
        };
    };
    /**
     * Asserts if the props provided are valid.
     * @param props The props provided to the InputTimeMask that need to be checked.
     * @throws If any of the props provided has invalid value.
     */
    const assertProps = ({ min, max, value }) => {
        if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isTimeOnlyIsoString(value)) {
            throw new Error(`InputTimeMask - value must be a time-only ISO string`);
        }
        if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isTimeOnlyIsoString(min)) {
            throw new Error(`InputTimeMask - min must be a time-only ISO string`);
        }
        if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isTimeOnlyIsoString(max)) {
            throw new Error(`InputTimeMask - max must be a time-only ISO string`);
        }
    };
    /**
     * A custom hook for getting min and max as TimeWithValidIsoStrParts.
     * If min or max are null, this treats them as undefined.
     */
    const useMinMax = ({ converter, max, min }) => {
        // convert min and max
        return (0, hooks_1.useMemo)(() => {
            const formattedMax = max ? converter.format(max) : undefined;
            const formattedMin = min ? converter.format(min) : undefined;
            return {
                max: formattedMax,
                min: formattedMin
            };
        }, [converter, max, min]);
    };
});

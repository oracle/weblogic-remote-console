/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "@oracle/oraclejet-preact/UNSAFE_IntlDateTime", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "@oracle/oraclejet-preact/utils/UNSAFE_calendarDateUtils", "@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "oj-c/hooks/UNSAFE_useMergedFormContext/useMergedFormContext", "oj-c/input-date-mask/useInputDateMaskPreact", "preact/hooks", "./useCombinedImplicitValidators", "./useImplicitCalendarDateConverter", "./useImplicitDateRangeValidator", "./useImplicitDateRestrictionValidator", "./utils", "ojs/ojcontext", "ojs/ojconfig", "@oracle/oraclejet-preact/UNSAFE_TextField", "@oracle/oraclejet-preact/hooks/UNSAFE_useComponentTheme", "@oracle/oraclejet-preact/utils/UNSAFE_classNames"], function (require, exports, UNSAFE_IntlDateTime_1, UNSAFE_useFormVariantContext_1, UNSAFE_useTranslationBundle_1, UNSAFE_calendarDateUtils_1, Layout_1, useAssistiveText_1, useMergedFormContext_1, useInputDateMaskPreact_1, hooks_1, useCombinedImplicitValidators_1, useImplicitCalendarDateConverter_1, useImplicitDateRangeValidator_1, useImplicitDateRestrictionValidator_1, utils_1, Context, ojconfig_1, UNSAFE_TextField_1, UNSAFE_useComponentTheme_1, UNSAFE_classNames_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useInputDatePicker = void 0;
    /**
     * A custom hook that adds functionality to the InputDatePicker component.
     */
    const useInputDatePicker = (props, ref) => {
        // first assert that all the props are expected
        assertProps(props);
        // get the translation resources
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        // create refs for busyState and adding methods
        const rootRef = (0, hooks_1.useRef)(null);
        const inputDatePickerRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((description = 'InputDatePicker: busyState') => {
            return rootRef.current
                ? Context.getContext(rootRef.current).getBusyContext().addBusyState({ description })
                : () => { }; // if the component is not mounted return Noop
        }, []);
        // merge the props with form context
        const { containerProps: formContextValue, readonlyValue: mergedReadonly, uadValue: mergedUserAssistanceDensity } = (0, useMergedFormContext_1.useMergedFormContext)({
            propContainerReadonly: props.containerReadonly,
            propLabelWrapping: props.labelWrapping,
            propReadonly: props.readonly,
            propUserAssistanceDensity: props.userAssistanceDensity,
            propTextAlign: props.textAlign
        });
        // get the variant
        const variant = (0, UNSAFE_useFormVariantContext_1.useFormVariantContext)();
        // create implicit converter
        const implicitConverter = (0, useImplicitCalendarDateConverter_1.useImplicitCalendarDateConverter)({
            calendarDateConverter_parseErrorFn: translations.calendarDateConverter_parseError
        });
        // get min and max as CalendarDate
        const { max: maxCalendarDate, min: minCalendarDate } = useMinMax({
            converter: implicitConverter,
            max: props.max,
            min: props.min
        });
        // make sure that min and max are complete dates
        if (maxCalendarDate)
            (0, utils_1.assertCompleteDate)(maxCalendarDate);
        if (minCalendarDate)
            (0, utils_1.assertCompleteDate)(minCalendarDate);
        // User preferences are set before the application runs, and never after that.
        const masksFromUserPref = (0, hooks_1.useMemo)(() => {
            return (0, useInputDateMaskPreact_1.getMasksFromDatePatternPreferences)();
        }, []);
        // returns a formatted date to use in the example.
        // Memoize this because formatObj in useImplicitDateRangeValidator is a dependency.
        const exampleFormatter = (0, hooks_1.useMemo)(() => {
            return {
                format: (value) => {
                    // Format based on masks from user pref, if any, or the locale.
                    return (0, UNSAFE_calendarDateUtils_1.formatIsoDateStrAsExample)((0, ojconfig_1.getLocale)(), value, masksFromUserPref);
                }
            };
        }, [masksFromUserPref]);
        // create implicit validators
        const implicitDateRestrictionValidator = (0, useImplicitDateRestrictionValidator_1.useImplicitDateRestrictionValidator)({
            converter: implicitConverter,
            dateRestrictionMessageDetail: props.dateRestrictionMessageDetail,
            dayFormatter: props.dayFormatter,
            defaultRestrictionMessageDetail: translations.inputDatePicker_dateRestrictionMessageDetail
        });
        const implicitDateRangeValidator = (0, useImplicitDateRangeValidator_1.useImplicitDateRangeValidator)({
            converter: implicitConverter,
            dateRangeOverflowMessageDetail: props.dateRangeOverflowMessageDetail,
            dateRangeUnderflowMessageDetail: props.dateRangeUnderflowMessageDetail,
            defaultRangeOverflowMessageDetailFn: translations.inputDatePicker_dateRangeOverflowMessageDetail,
            defaultRangeUnderflowMessageDetailFn: translations.inputDatePicker_dateRangeUnderflowMessageDetail,
            formatObj: exampleFormatter,
            max: maxCalendarDate,
            min: minCalendarDate
        });
        // If a date is both out of range and disabled/restricted, we only need to show a single
        // message. The out of range error takes precedence and only that should be shown. So, we
        // combine the implicit validators into one.
        const implicitValidator = (0, useCombinedImplicitValidators_1.useCombinedImplicitValidators)(implicitDateRangeValidator, implicitDateRestrictionValidator);
        // merge validators
        const mergedValidators = (0, hooks_1.useMemo)(() => [implicitValidator, ...(props.validators ?? [])], [implicitValidator, props.validators]);
        // this component has the same functionality as the input-date-mask,
        // so we reuse the useInputDateMaskPreact hook here
        const { inputDateMaskProps, methods } = (0, useInputDateMaskPreact_1.useInputDateMaskPreact)({
            ...props,
            // overrides
            readonly: mergedReadonly,
            validators: mergedValidators,
            userAssistanceDensity: mergedUserAssistanceDensity,
            // we handled min and max here, so do not pass props related
            // to min and max
            dateRangeOverflowMessageDetail: undefined,
            dateRangeUnderflowMessageDetail: undefined,
            max: undefined,
            min: undefined
        }, addBusyState);
        // get assistive text props
        const { assistiveText, helpSourceLink, helpSourceText } = (0, useAssistiveText_1.useAssistiveText)({
            addBusyState,
            displayOptions: props.displayOptions,
            help: props.help,
            helpHints: props.helpHints,
            userAssistanceDensity: inputDateMaskProps.userAssistanceDensity,
            validators: props.validators ?? []
        });
        // add methods to ref
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => inputDatePickerRef.current?.blur(),
            focus: () => inputDatePickerRef.current?.focus(),
            ...methods
        }), [methods]);
        const { classes } = (0, UNSAFE_useComponentTheme_1.useComponentTheme)(UNSAFE_TextField_1.TextFieldRedwoodTheme, {
            maxWidth: props.maxWidth === 'md' || props.maxWidth === 'sm' ? props.maxWidth : 'none',
            width: props.width === 'md' || props.width === 'sm' ? props.width : 'none'
        });
        const rootClasses = (0, UNSAFE_classNames_1.classNames)([
            Layout_1.layoutSpanStyles.layoutSpanColumn[props.columnSpan ?? 1],
            formContextValue.isFormLayout && 'in-form-layout',
            classes
        ]);
        const widthStyle = props.width === 'md' || props.width === 'sm' ? undefined : props.width;
        const maxWidthStyle = props.maxWidth === 'md' || props.maxWidth === 'sm' ? undefined : props.maxWidth;
        const styleProps = { style: { width: widthStyle, maxWidth: maxWidthStyle } };
        return {
            formContextValue,
            inputDatePickerProps: {
                'aria-describedby': inputDateMaskProps['aria-describedby'],
                assistiveText: assistiveText,
                dayFormatter: props.dayFormatter,
                daysOutsideMonth: props.daysOutsideMonth,
                helpSourceLink: helpSourceLink,
                helpSourceText: helpSourceText,
                isDisabled: inputDateMaskProps.isDisabled,
                isReadonly: inputDateMaskProps.isReadonly,
                isRequired: inputDateMaskProps.isRequired,
                isRequiredShown: inputDateMaskProps.isRequiredShown,
                label: inputDateMaskProps.label,
                labelEdge: inputDateMaskProps.labelEdge,
                labelStartWidth: inputDateMaskProps.labelStartWidth,
                masks: inputDateMaskProps.masks,
                max: maxCalendarDate,
                messages: inputDateMaskProps.messages,
                min: minCalendarDate,
                monthAndYearPicker: props.monthAndYearPicker,
                onCommit: inputDateMaskProps.onCommit,
                onInput: inputDateMaskProps.onInput,
                ref: inputDatePickerRef,
                textAlign: inputDateMaskProps.textAlign,
                todayTimeZone: props.todayTimeZone,
                todayButton: props.todayButton,
                userAssistanceDensity: inputDateMaskProps.userAssistanceDensity,
                value: inputDateMaskProps.value,
                variant: variant,
                weekDisplay: props.weekDisplay
            },
            rootProps: {
                id: props.id,
                // Because we are handling columnSpan here, there is no need to pass the this property down to the
                // Preact InputDatePicker component.
                class: rootClasses,
                style: styleProps.style,
                ref: rootRef
            }
        };
    };
    exports.useInputDatePicker = useInputDatePicker;
    /**
     * Asserts if the props provided are valid.
     * @param props The props provided to the InputDatePicker
     * @throws If any of the props provided has invalid value.
     */
    const assertProps = (props) => {
        if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isDateOnlyIsoString(props.value)) {
            throw new Error(`InputDatePicker - value must be a date-only ISO string: ${props.value}`);
        }
        if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isDateOnlyIsoString(props.min)) {
            throw new Error(`InputDatePicker - min must be a date-only ISO string: ${props.min}`);
        }
        if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isDateOnlyIsoString(props.max)) {
            throw new Error(`InputDatePicker - max must be a date-only ISO string: ${props.max}`);
        }
    };
    /**
     * A custom hook for getting min and max as CalendarDate
     */
    const useMinMax = ({ converter, max, min }) => {
        // convert min and max
        return (0, hooks_1.useMemo)(() => ({
            max: max ? converter.format(max) : undefined,
            min: min ? converter.format(min) : undefined
        }), [converter, max, min]);
    };
});

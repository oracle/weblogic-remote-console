define(["require", "exports", "preact/hooks", "oj-c/hooks/UNSAFE_useComponentMessages/useComponentMessages", "./useImplicitDateConverter", "./useImplicitDateRangeValidator", "oj-c/hooks/UNSAFE_useEditableValue/index", "oj-c/editable-value/UNSAFE_useDeferredValidators/useDeferredValidators"], function (require, exports, hooks_1, useComponentMessages_1, useImplicitDateConverter_1, useImplicitDateRangeValidator_1, index_1, useDeferredValidators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useInputDateTextPreact = useInputDateTextPreact;
    /**
     * This hook manages state and other related props for the Input Date Text component.
     * Note that InputDateText uses PreactInputText.
     */
    function useInputDateTextPreact({ autocomplete = 'on', autofocus, converter: propConverter, dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, max, messagesCustom, min, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, textAlign, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }, addBusyState) {
        // Treat null as undefined for the min/max options.
        const minTreatNull = (0, index_1.treatNull)(min);
        const maxTreatNull = (0, index_1.treatNull)(max);
        // If no converter, use an instance of LocalDateConverter which uses the stricter, newer format/parse type that doesn't allow null.
        const converter = (0, useImplicitDateConverter_1.useImplicitDateConverter)({
            converter: propConverter
        });
        const implicitComponentValidator = (0, useImplicitDateRangeValidator_1.useImplicitDateRangeValidator)({
            formatObj: converter,
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
            converter,
            defaultDisplayValue: '',
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
        const hasNoValue = value === null || (typeof value === 'string' && value === '');
        return {
            methods,
            // Certain props will have null as default values, but we need them to be
            // undefined in the preact component.
            inputTextProps: {
                autoComplete: autocomplete,
                autoFocus: autofocus,
                isDisabled: disabled,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || hasNoValue),
                label: labelHint,
                labelEdge,
                labelStartWidth,
                messages,
                textAlign,
                userAssistanceDensity,
                ...textFieldProps
            }
        };
    }
});

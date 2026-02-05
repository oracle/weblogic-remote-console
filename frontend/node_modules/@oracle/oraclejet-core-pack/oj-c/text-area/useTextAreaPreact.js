define(["require", "exports", "oj-c/hooks/UNSAFE_useEditableValue/index", "oj-c/hooks/UNSAFE_useComponentMessages/useComponentMessages", "oj-c/editable-value/UNSAFE_useDeferredValidators/useDeferredValidators"], function (require, exports, index_1, useComponentMessages_1, useDeferredValidators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useTextAreaPreact = useTextAreaPreact;
    /**
     * This hook manages state and other related props for the Input Text
     * component.
     */
    function useTextAreaPreact({ autocomplete = 'on', autofocus, converter, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, length, messagesCustom, placeholder, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, resizeBehavior, rows, textAlign, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValueChanged, onValidChanged, ...otherProps }, addBusyState) {
        const deferredValidators = (0, useDeferredValidators_1.useDeferredValidators)({
            labelHint,
            required,
            requiredMessageDetail
        });
        // legacy converter takes V | null for formatting, and string for parsing.
        const { methods, textFieldProps: evTextFieldProps, value } = (0, index_1.useEditableValue)({
            addBusyState,
            ariaDescribedBy: otherProps['aria-describedby'],
            // We are casting this because the legacy Converter's format returns V | null, but the useEV's converter format returns DV, which we set as string.
            // In useEV/converterUtils we make sure not to call format when the value is null and if format returns null we normalize it to
            // return the defaultDisplayValue, which is a string, so format never returns null;
            converter: converter,
            defaultDisplayValue: '',
            deferredValidators,
            disabled,
            displayOptions,
            messagesCustom,
            readonly,
            // In corepack we are allowed to have null as validators, but useEV uses undefined, so we map null to undefined.
            validators: (0, index_1.treatNull)(validators, undefined),
            value: propValue,
            onMessagesCustomChanged,
            onRawValueChanged,
            onValidChanged,
            onValueChanged
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
            textAreaProps: {
                autoComplete: autocomplete,
                autoFocus: autofocus,
                isDisabled: disabled,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || hasNoValue),
                label: labelHint,
                labelEdge,
                labelStartWidth,
                maxLength: length?.max ? length.max : undefined, // coerce null to undefined
                maxLengthUnit: length?.countBy,
                maxLengthCounter: length?.counter,
                messages,
                resize: resizeBehavior != 'none' ? resizeBehavior : undefined,
                rows,
                placeholder,
                textAlign,
                userAssistanceDensity,
                ...textFieldProps
            }
        };
    }
});

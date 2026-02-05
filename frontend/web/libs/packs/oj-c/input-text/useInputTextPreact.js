define(["require", "exports", "preact/hooks", "oj-c/hooks/UNSAFE_useEditableValue/index", "oj-c/hooks/UNSAFE_useComponentMessages/useComponentMessages", "oj-c/editable-value/UNSAFE_useDeferredValidators/useDeferredValidators", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "ojs/ojconverter-nativenumber"], function (require, exports, hooks_1, index_1, useComponentMessages_1, useDeferredValidators_1, UNSAFE_useTranslationBundle_1, ojconverter_nativenumber_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useInputTextPreact = useInputTextPreact;
    /**
     * This hook manages state and other related props for the Input Text
     * component.
     */
    function useInputTextPreact({ autocomplete = 'on', autofocus, clearIcon = 'never', converter, disabled, displayOptions, end, inputPrefix, inputSuffix, labelEdge, labelHint, labelStartWidth, length, messagesCustom, placeholder, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, start, textAlign, userAssistanceDensity, validators, value: propValue, virtualKeyboard, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }, addBusyState) {
        const deferredValidators = (0, useDeferredValidators_1.useDeferredValidators)({
            labelHint,
            required,
            requiredMessageDetail
        });
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const converterParseError = translations.inputNumber_converterParseError();
        const translateConverterParseError = (0, hooks_1.useCallback)((error) => {
            // JET-54847: Display a user-friendly localized message if the parse failure is due to
            // user input error from either NumberConverter or BigDecimalStringConverter.
            return error?.cause === ojconverter_nativenumber_1.USER_INPUT_ERROR
                ? { severity: 'error', detail: converterParseError }
                : undefined;
        }, [converterParseError]);
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
            onMessagesCustomChanged,
            onRawValueChanged,
            onValidChanged,
            onValueChanged,
            readonly,
            translateConverterParseError,
            // In corepack we are allowed to have null as validators, but useEV uses undefined, so we map null to undefined.
            validators: (0, index_1.treatNull)(validators, undefined),
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
        const hasClearIcon = clearIcon === 'conditional' ? 'conditionally' : clearIcon;
        const normalizedVirtualKeyboard = virtualKeyboard === 'auto' ? (0, index_1.getVirtualKeyboardHintFromConverter)(converter) : virtualKeyboard;
        return {
            methods,
            // Certain props will have null as default values, but we need them to be
            // undefined in the preact component.
            inputTextProps: {
                autoComplete: autocomplete,
                autoFocus: autofocus,
                hasClearIcon,
                endContent: end,
                isDisabled: disabled,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || hasNoValue),
                label: labelHint,
                labelEdge,
                labelStartWidth,
                maxLength: (0, index_1.treatNull)(length?.max),
                maxLengthUnit: length?.countBy,
                messages,
                placeholder,
                prefix: inputPrefix,
                startContent: start,
                suffix: inputSuffix,
                textAlign,
                userAssistanceDensity,
                virtualKeyboard: normalizedVirtualKeyboard,
                ...textFieldProps
            }
        };
    }
});

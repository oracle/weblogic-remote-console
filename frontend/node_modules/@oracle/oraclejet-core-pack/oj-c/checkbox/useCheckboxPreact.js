define(["require", "exports", "preact/hooks", "oj-c/hooks/UNSAFE_useComponentMessages/useComponentMessages", "oj-c/hooks/UNSAFE_useEditableValue/index", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle"], function (require, exports, hooks_1, useComponentMessages_1, index_1, UNSAFE_useTranslationBundle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useCheckboxPreact = useCheckboxPreact;
    function useCheckboxPreact({ ['aria-describedby']: ariaDescribedBy, disabled, displayOptions, messagesCustom, readonly, readonlyUserAssistanceShown, requiredMessageDetail: propRequiredMessageDetail, required, userAssistanceDensity, value: propValue, onMessagesCustomChanged, onValidChanged, onValueChanged }, addBusyState) {
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const requiredMessageDetail = propRequiredMessageDetail || translations.checkbox_requiredMessageDetail();
        // Create a custom deferred validator since "false" is considered a value and
        // would pass the default validator returned by the useDeferredValidators hook.
        const deferredValidators = (0, hooks_1.useMemo)(() => {
            return [
                {
                    validate: (value) => {
                        if (required && value !== true) {
                            throw new Error(requiredMessageDetail);
                        }
                        return;
                    }
                }
            ];
        }, [requiredMessageDetail, required]);
        const { methods, onCommitValue, displayValue, refreshDisplayValue, textFieldProps } = (0, index_1.useEditableValue)({
            addBusyState,
            ariaDescribedBy,
            defaultDisplayValue: false,
            deferredValidators,
            disabled,
            displayOptions,
            messagesCustom,
            onMessagesCustomChanged,
            onValidChanged,
            onValueChanged,
            readonly,
            value: propValue
        });
        const messages = (0, useComponentMessages_1.useComponentMessages)({
            evMessages: textFieldProps.messages,
            messagesCustom,
            readonly,
            readonlyUserAssistanceShown
        });
        // if the committed value is invalid (ie empty when required), we retain the last valid value
        // but give the internal Preact component a false display
        const onCommitHandler = (0, hooks_1.useCallback)(async ({ value }) => {
            // onCommitValue returns true if the value passes validation, otherwise it returns false.
            const commitSucceeded = await onCommitValue(value);
            const newValue = commitSucceeded ? value : false;
            refreshDisplayValue(newValue);
        }, [onCommitValue, refreshDisplayValue]);
        const checkboxProps = {
            'aria-describedby': textFieldProps['aria-describedby'],
            isRequired: required,
            isReadonly: readonly,
            isDisabled: disabled,
            messages,
            onCommit: onCommitHandler,
            userAssistanceDensity,
            value: displayValue
        };
        return {
            methods,
            checkboxProps
        };
    }
});

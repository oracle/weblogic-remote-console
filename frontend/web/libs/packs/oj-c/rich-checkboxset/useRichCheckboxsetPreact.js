define(["require", "exports", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "oj-c/hooks/UNSAFE_useComponentMessages/useComponentMessages", "oj-c/hooks/UNSAFE_useEditableValue/index", "oj-c/editable-value/UNSAFE_useDeferredValidators/useDeferredValidators", "oj-c/editable-value/UNSAFE_useSelectionRangeValidator/useSelectionRangeValidator"], function (require, exports, hooks_1, UNSAFE_useTranslationBundle_1, useComponentMessages_1, index_1, useDeferredValidators_1, useSelectionRangeValidator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useRichCheckboxsetPreact = useRichCheckboxsetPreact;
    function useRichCheckboxsetPreact({ 'aria-describedby': ariaDescribedBy, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, maxSelected, messagesCustom, minSelected, onMessagesCustomChanged, onValidChanged, onValueChanged, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail: propRequiredMessageDetail, selectionExactMessageDetail, selectionOverflowMessageDetail, selectionRangeMessageDetail, selectionUnderflowMessageDetail, userAssistanceDensity, value: propValue }, addBusyState) {
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const requiredMessageDetail = propRequiredMessageDetail || translations.checkboxSet_requiredMessageDetail?.();
        const deferredValidators = (0, useDeferredValidators_1.useDeferredValidators)({
            labelHint,
            required,
            requiredMessageDetail
        });
        const selectionRangeValidators = (0, useSelectionRangeValidator_1.useSelectionRangeValidator)({
            defaultSelectionExactMessageDetail: translations.formControl_selectionExactMessageDetail,
            defaultSelectionOverflowMessageDetail: translations.formControl_selectionOverflowMessageDetail,
            defaultSelectionRangeMessageDetail: translations.formControl_selectionRangeMessageDetail,
            defaultSelectionUnderflowMessageDetail: translations.formControl_selectionUnderflowMessageDetail,
            max: maxSelected,
            min: minSelected,
            selectionExactMessageDetail,
            selectionOverflowMessageDetail,
            selectionRangeMessageDetail,
            selectionUnderflowMessageDetail
        });
        const { addMessage, clearInteractionFlags, displayValue, methods, onCommitValue, refreshDisplayValue, textFieldProps: evTextFieldProps } = (0, index_1.useEditableValue)({
            addBusyState,
            ariaDescribedBy,
            defaultDisplayValue: null,
            deferredValidators,
            disabled,
            displayOptions,
            messagesCustom,
            onMessagesCustomChanged,
            onValidChanged,
            onValueChanged,
            readonly,
            validators: selectionRangeValidators,
            value: propValue
        });
        const { messages: evMessages, ...textFieldProps } = evTextFieldProps;
        const messages = (0, useComponentMessages_1.useComponentMessages)({
            evMessages,
            messagesCustom,
            readonly,
            readonlyUserAssistanceShown
        });
        // Maintain a ref that tells us if the user has interacted with the control at all.
        // Tabbing through without interacting should never show errors.
        const isInteractedRef = (0, hooks_1.useRef)(false);
        // Maintain a ref that keeps track of whether the component is focused.
        // When we blur, we want to show messages so that any hidden messages
        // from SelectionRangeValidator are shown. Note that the focusable area
        // includes the entire component, i.e. including any user assistance links,
        // in addition to the cards.
        const isFocusedRef = (0, hooks_1.useRef)(false);
        const onFocusIn = (0, hooks_1.useCallback)(() => {
            if (!isFocusedRef.current) {
                isFocusedRef.current = true;
            }
        }, []);
        const onFocusOut = (0, hooks_1.useCallback)((event) => {
            // Trigger focus event changes only when focus goes outside of the current target.
            // Ignore focus changes within the current target.
            if (isFocusedRef.current &&
                (event.relatedTarget == null ||
                    !event.currentTarget.contains(event.relatedTarget))) {
                isFocusedRef.current = false;
                if (isInteractedRef.current) {
                    methods.showMessages();
                }
                isInteractedRef.current = false;
                clearInteractionFlags();
            }
        }, [clearInteractionFlags, methods]);
        // we want to normalize the value to an array
        // if the committed value is invalid (ie empty when required), we retain the last valid value
        // but give the internal Preact component an empty displayValue
        const onCommitHandler = (0, hooks_1.useCallback)(async ({ value }) => {
            const valueAsArray = value ? Array.from(value) : null;
            const numSelected = valueAsArray ? valueAsArray.length : 0;
            // This ref tracks whether the user has interacted with the the component.
            // If they interact and then focus out, we want to show any hidden messages.
            isInteractedRef.current = true;
            // No-op if the number of selections exceeds the max. Short circuit and return.
            if (maxSelected && numSelected > maxSelected) {
                return;
            }
            await onCommitValue(valueAsArray);
            refreshDisplayValue(valueAsArray);
            // Display an info message when the number of selections equals the max.
            if (numSelected === maxSelected) {
                addMessage({
                    severity: 'info',
                    detail: translations.formControl_selectionOverflowMessageDetail({
                        max: maxSelected.toString()
                    })
                });
            }
        }, [addMessage, onCommitValue, maxSelected, refreshDisplayValue, translations]);
        return {
            methods,
            outerProps: disabled || readonly
                ? {}
                : {
                    onFocusIn,
                    onFocusOut
                },
            richCheckboxsetProps: {
                'aria-describedby': textFieldProps['aria-describedby'],
                isRequired: required,
                isReadonly: readonly,
                isDisabled: disabled,
                label: labelHint,
                labelEdge,
                labelStartWidth,
                messages,
                onCommit: onCommitHandler,
                userAssistanceDensity,
                value: displayValue
            }
        };
    }
});

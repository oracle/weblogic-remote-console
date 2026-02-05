define(["require", "exports", "preact/hooks", "./converterUtils", "./utils", "oj-c/editable-value/UNSAFE_useStaleIdentity/useStaleIdentity", "./reducer", "./validationUtils"], function (require, exports, hooks_1, converterUtils_1, utils_1, useStaleIdentity_1, reducer_1, validationUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useEditableValue = useEditableValue;
    /**
     * A custom hook to handle value and value based life cycle of an editable component.
     * This uses a reducer to handle form component states like value, displayValue, valid, etc.
     */
    function useEditableValue({ addBusyState, ariaDescribedBy, converter, defaultDisplayValue, deferredValidators, disabled, displayOptions, messagesCustom, onDisplayValueChanged, onMessagesCustomChanged, onRawValueChanged, onTransientValueChanged, onValidChanged: propOnValidChanged, onValueChanged, translateConverterParseError, readonly, validators, value }) {
        const initialRender = (0, hooks_1.useRef)(true);
        const { setStaleIdentity } = (0, useStaleIdentity_1.useStaleIdentity)();
        const [state, dispatch] = (0, hooks_1.useReducer)((reducer_1.reducer), {
            shownMessages: [],
            hiddenMessages: [],
            customMessages: messagesCustom,
            componentMessages: [],
            value: value,
            valid: 'pending'
        }, (args) => {
            const conversion = converter
                ? (0, converterUtils_1.format)(value, defaultDisplayValue, converter)
                : { result: 'success', value: (0, utils_1.treatNull)(value, defaultDisplayValue) };
            return {
                ...args,
                displayValue: conversion.result === 'success' ? conversion.value : defaultDisplayValue
            };
        });
        // JET-67412: Prevent redundant calls to onValidChanged.
        // Keep track of the current value of valid, and only call the original propOnValidChanged
        // if the new value differs from the current one. We use a Ref instead of relying on reducer
        // state because state updates only occur after all validation, sync or async, is complete.
        // Therefore we can't always rely on state.valid being up to date.
        // We also keep track of whether the component ever became valid so we can provide immediate
        // feedback when there are validators with hidden messages (e.g. SelectionRangeValidator).
        const currentValidRef = (0, hooks_1.useRef)();
        const componentWasValidRef = (0, hooks_1.useRef)(false);
        const onValidChanged = (0, hooks_1.useCallback)((newValid) => {
            if (newValid !== currentValidRef.current) {
                currentValidRef.current = newValid;
                propOnValidChanged?.(newValid);
            }
        }, [propOnValidChanged]);
        // Call a helper function to update the state and call any callbacks, if needed.
        const _dispatch = (0, hooks_1.useCallback)((updateFn, payload) => {
            updateFn(dispatch, payload, {
                onMessagesCustomChanged,
                onRawValueChanged,
                onTransientValueChanged,
                onValidChanged,
                onValueChanged
            });
            return true;
        }, [
            dispatch,
            onMessagesCustomChanged,
            onRawValueChanged,
            onTransientValueChanged,
            onValidChanged,
            onValueChanged
        ]);
        // Run deferred validation with a trimmed value.
        const validateDeferredSync = (0, hooks_1.useCallback)((value) => {
            const valueToSendToDeferredValidation = typeof value === 'string' ? value.trim() : value;
            const deferredValidate = (0, validationUtils_1.validateSync)({
                validators: deferredValidators ?? [],
                value: valueToSendToDeferredValidation
            });
            return deferredValidate;
        }, [deferredValidators]);
        // This method allows the value to be set outside of the hook; this is used by the
        // select components after syncing value to valueItems.
        const setValue = (0, hooks_1.useCallback)((value) => {
            _dispatch(reducer_1.updateValue, value);
        }, [_dispatch]);
        // This method allows the display value to be set outside of the hook; this is used by the
        // select components after syncing value to valueItems.
        const setDisplayValue = (0, hooks_1.useCallback)((value) => {
            _dispatch(reducer_1.updateDisplayValue, value);
        }, [_dispatch]);
        // This method allows the transient value to be set outside of the hook; this is used
        // by input number to set the last valid value while spinning.
        const setTransientValue = (0, hooks_1.useCallback)((transientValue) => {
            _dispatch(reducer_1.updateTransientValue, transientValue);
        }, [_dispatch]);
        // Run conversion on a value (i.e. format it) to get a new display value.
        // If conversion fails, display errors and set valid to "invalidShown".
        const formatValue = (0, hooks_1.useCallback)((value) => {
            let newDisplayValue;
            if (!converter) {
                // If there is no converter, use the treated value (null -> defaultDisplayValue).
                // This mimics useConverter#format.
                newDisplayValue = (0, utils_1.treatNull)(value, defaultDisplayValue);
            }
            else {
                const conversion = (0, converterUtils_1.format)(value, defaultDisplayValue, converter);
                if (conversion.result === 'failure') {
                    _dispatch(reducer_1.updateComponentMessages, [conversion.error]);
                    _dispatch(reducer_1.updateValidStatus, 'invalidShown');
                    // When formatting fails, return the original treated value.
                    newDisplayValue = (0, utils_1.treatNull)(value, defaultDisplayValue);
                }
                else {
                    newDisplayValue = conversion.value;
                }
            }
            return newDisplayValue;
        }, [converter, defaultDisplayValue, _dispatch]);
        // Update the display value by formatting the given value.
        const refreshDisplayValue = (0, hooks_1.useCallback)((value) => {
            const newDisplayValue = formatValue(value);
            _dispatch(reducer_1.updateDisplayValue, newDisplayValue);
            // onDisplayValueChanged is used by the select components to update their valueItems whenever
            // displayValue is updated by useEditableValue and its reducer. Value items are not managed
            // by this hook, although you could think of them as the display value of the select. So
            // whenever displayValue changes, select components need to update their valueItems.
            onDisplayValueChanged?.();
            return true;
        }, [_dispatch, formatValue, onDisplayValueChanged]);
        // Get the value to validate from the component.
        const getValueForValidation = (0, hooks_1.useCallback)(() => {
            if (state.valid !== 'invalidShown') {
                return { result: 'success', value: state.value };
            }
            // If there is no converter, return the display value but cast it to V.
            if (!converter) {
                // If displayValue is '', like when the user clears the field, we want the value to be normalized to null.
                return { result: 'success', value: (0, utils_1.normalizeValue)(state.displayValue) };
            }
            // If we get here, get the value candidate from the display value and parse it to get the value.
            return (0, converterUtils_1.parse)((0, utils_1.normalizeValue)(state.displayValue), converter, translateConverterParseError);
        }, [converter, state.displayValue, state.valid, state.value, translateConverterParseError]);
        // Parse a display value to get the new value.
        const normalizeAndParseValue = (0, hooks_1.useCallback)((value) => {
            if (!converter) {
                return {
                    result: 'success',
                    value: (0, utils_1.normalizeValue)(value)
                };
            }
            return (0, converterUtils_1.parse)((0, utils_1.normalizeValue)(value), converter, translateConverterParseError);
        }, [converter, translateConverterParseError]);
        // Parses a display value. If parsing fails, display errors and update valid.
        // This callback is used by input number, which uses it in order to step/spin.
        const parseValue = (0, hooks_1.useCallback)((value) => {
            const conversion = normalizeAndParseValue(value);
            if (conversion.result === 'failure') {
                // Conversion failed. Update messages and valid and return.
                _dispatch(reducer_1.updateComponentMessages, [conversion.error]);
                _dispatch(reducer_1.updateValidStatus, 'invalidShown');
            }
            return conversion;
        }, [_dispatch, normalizeAndParseValue]);
        // Run both deferred and non-deferred validation and update messages.
        // Returns a promise that resolves to true if validation passes.
        const fullValidate = (0, hooks_1.useCallback)(async (value, options = {}) => {
            const { doNotClearMessagesCustom = false, forceHiddenMessagesToBeShown = false } = options;
            const hasCustomErrorMessages = doNotClearMessagesCustom && (0, utils_1.hasErrorMessages)(messagesCustom);
            // Clear all the messages including messagesCustom (if doNotClearMessagesCustom flag is not set)
            // before running the validation. If there are any validation errors, we will show the errors after this.
            if (doNotClearMessagesCustom) {
                _dispatch(reducer_1.updateComponentMessages, []);
                _dispatch(reducer_1.updateHiddenMessages, []);
            }
            else {
                _dispatch(reducer_1.clearAllMessages);
            }
            // If there are no validators, return early.
            if ((!validators || validators.length === 0) &&
                (!deferredValidators || deferredValidators.length === 0)) {
                // No validators mean all values are valid.
                // Set invalidShown when still showing custom error messages but return true as the validation succeeded.
                _dispatch(reducer_1.updateValidStatus, hasCustomErrorMessages ? 'invalidShown' : 'valid');
                return true;
            }
            // Run the deferred validator (e.g. required).
            const shownSyncErrors = [];
            const hiddenSyncErrors = [];
            const deferredValidate = validateDeferredSync(value);
            deferredValidate.result === 'failure' && shownSyncErrors.push(...deferredValidate.errors);
            // Next we will run the regular validators.
            // We don't run these when value is null (e.g., the field is empty)
            // or undefined (input-date-mask field is empty).
            let nonDeferredValidate = undefined;
            if (value !== null && value !== undefined) {
                nonDeferredValidate = (0, validationUtils_1.validateAsync)({ validators: validators ?? [], value });
                nonDeferredValidate.errors.forEach(({ message, messageDisplayStrategy }) => {
                    // messageDisplayStrategy === undefined -> messages should display immediately
                    // messageDisplayStrategy === displayOnBlur -> hide the messages, unless the
                    // component was previously valid; then we want immediate feedback.
                    if (messageDisplayStrategy === 'displayOnBlur' &&
                        !componentWasValidRef.current &&
                        !forceHiddenMessagesToBeShown) {
                        hiddenSyncErrors.push(message);
                    }
                    else {
                        shownSyncErrors.push(message);
                    }
                });
            }
            const maybeErrorPromises = nonDeferredValidate?.maybeErrorPromises ?? [];
            const hasSyncError = shownSyncErrors.length !== 0 || hiddenSyncErrors.length !== 0;
            // If there are no sync errors and no async validations, set the valid state and return.
            if (!hasSyncError && !maybeErrorPromises.length) {
                _dispatch(reducer_1.updateValidStatus, hasCustomErrorMessages ? 'invalidShown' : 'valid');
                return true;
            }
            // If there are any sync errors, update messages and valid.
            if (shownSyncErrors.length !== 0) {
                _dispatch(reducer_1.updateComponentMessages, shownSyncErrors);
                _dispatch(reducer_1.updateValidStatus, 'invalidShown');
            }
            else if (hiddenSyncErrors.length !== 0) {
                _dispatch(reducer_1.updateHiddenMessages, hiddenSyncErrors);
                _dispatch(reducer_1.updateValidStatus, 'invalidHidden');
            }
            // If no async validations, nothing to do here and you can return
            // the validation result based on the sync errors.
            if (!maybeErrorPromises.length) {
                return !hasSyncError;
            }
            // Set valid status to pending before starting async validation, only if there are no sync errors
            // because we want to fail-fast. We don't need to set it before sync validation because reducer
            // updates are asynchronous and by the time the update happens, the valid state is already known.
            !hasSyncError && _dispatch(reducer_1.updateValidStatus, 'pending');
            // Now we have to deal with the async validation, so setup busyState and stale identity.
            const resolver = addBusyState?.('running asynchronous validation');
            // An async function will always run synchronously until the first await statement:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#description
            // So, setup a stale identity here. This helps us know if the validation has gone stale while processing.
            const { isStale } = setStaleIdentity('useEditableValue-full-validate');
            let hasAsyncShownError = false;
            let hasAsyncHiddenError = false;
            const asyncValidations = [];
            for (const maybeErrorPromise of maybeErrorPromises) {
                const asyncValidation = maybeErrorPromise.then((maybeValidationError) => {
                    // If the promise resolves with an error, handle it right away.
                    if (maybeValidationError && !isStale()) {
                        const { messageDisplayStrategy, message } = maybeValidationError;
                        if (messageDisplayStrategy === 'displayOnBlur' &&
                            !componentWasValidRef.current &&
                            !forceHiddenMessagesToBeShown) {
                            _dispatch(reducer_1.addHiddenMessage, message);
                            hasAsyncHiddenError = true;
                        }
                        else {
                            _dispatch(reducer_1.addComponentMessage, message);
                            hasAsyncShownError = true;
                        }
                    }
                });
                asyncValidations.push(asyncValidation);
            }
            // Wait for all the async validators to complete.
            await Promise.all(asyncValidations);
            const hasAsyncError = hasAsyncHiddenError || hasAsyncShownError;
            const hasAnyHiddenErrors = hasAsyncHiddenError || hiddenSyncErrors.length !== 0;
            const hasAnyShownErrors = hasAsyncShownError || shownSyncErrors.length !== 0;
            // If this transaction has not gone stale, set the valid prop.
            if (!isStale()) {
                if (!hasSyncError && !hasAsyncError) {
                    _dispatch(reducer_1.updateValidStatus, hasCustomErrorMessages ? 'invalidShown' : 'valid');
                }
                else if (hasAnyShownErrors) {
                    _dispatch(reducer_1.updateValidStatus, 'invalidShown');
                }
                else if (hasAnyHiddenErrors) {
                    _dispatch(reducer_1.updateValidStatus, hasCustomErrorMessages ? 'invalidShown' : 'invalidHidden');
                }
            }
            // Resolve the busy state.
            resolver?.();
            // Even though this validation might have gone stale, always return the correct result for the validation.
            // Consuming code can keep track of stale requests and act accordingly as needed.
            return !hasSyncError && !hasAsyncError;
        }, [
            addBusyState,
            _dispatch,
            deferredValidators,
            messagesCustom,
            setStaleIdentity,
            validateDeferredSync,
            validators
        ]);
        // A function that runs full validation by getting the value from the component.
        // This validation will not clear any messagesCustom set by the app.
        // If validation succeeds, updates both the value and display value.
        const runFullValidationAndUpdateValue = async () => {
            // If disabled or readonly, do nothing.
            if (disabled || readonly)
                return;
            // Get the value to validate. If conversion fails, stop.
            const conversion = getValueForValidation();
            if (conversion.result === 'failure') {
                _dispatch(reducer_1.updateComponentMessages, [conversion.error]);
                _dispatch(reducer_1.updateValidStatus, 'invalidShown');
                return;
            }
            const newValue = conversion.value;
            const validated = await validateValueOnInternalChange(newValue, {
                doNotClearMessagesCustom: true
            });
            // If validation succeeds, update both the value and display value.
            validated && _dispatch(reducer_1.updateValue, newValue) && refreshDisplayValue(newValue);
        };
        const validateValueOnExternalChange = (0, hooks_1.useCallback)(
        /**
         * A function that runs validation when the value is changed externally.
         *
         * @param value The new value provided by the app
         * @returns The result of the validation
         */
        (value) => {
            //  Clear all messages.
            _dispatch(reducer_1.clearAllMessages);
            // Run deferred validation.
            const validated = validateDeferredSync(value);
            // Update valid state.
            validated.result === 'failure' && _dispatch(reducer_1.updateHiddenMessages, validated.errors);
            _dispatch(reducer_1.updateValidStatus, validated.result === 'failure' ? 'invalidHidden' : 'valid');
            // We always return true even if the value is not valid when changed externally.
            return true;
        }, [_dispatch, validateDeferredSync]);
        const validateValueOnInternalChange = (0, hooks_1.useCallback)(
        /**
         * A function that validates a user typed value.
         *
         * @param value The new value typed by the user
         * @returns A promise that resolves to true if validation succeeds
         */
        async (value, options = {}) => {
            // An async function will always run synchronously until after the first await statement.
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#description
            // So, setup a stale identity here.
            const { isStale } = setStaleIdentity('useEditableValue-validateValueOnInternalChange');
            const resolver = addBusyState?.('Running validateValueOnInternalChange');
            const validationResult = await fullValidate(value, options);
            resolver?.();
            // If a new value has come in, we want to ignore the result of the pending validation
            // and return false so neither value nor displayValue is updated.
            if (isStale()) {
                return false;
            }
            return validationResult;
        }, [addBusyState, fullValidate, setStaleIdentity]);
        const onCommitValue = (0, hooks_1.useCallback)(async (value, doCommitOnValid = true) => {
            const validated = await validateValueOnInternalChange(value);
            validated && doCommitOnValid && _dispatch(reducer_1.updateValue, value);
            // Update componentWasValidRef here so it is only updated after user interaction.
            // If the component ever becomes valid and then becomes invalid due to hidden
            // messages, we show them instead to provide immediate user feedback.
            if (validated) {
                componentWasValidRef.current = true;
            }
            return validated;
        }, [_dispatch, validateValueOnInternalChange]);
        // Callback used to handle onCommit events.
        const onCommit = (0, hooks_1.useCallback)(async ({ value }) => {
            const conversion = parseValue(value);
            if (conversion.result === 'failure') {
                // parseValue will display messages and set valid in this case.
                return false;
            }
            const parsedValue = conversion.value;
            const succeeded = await onCommitValue(parsedValue);
            succeeded && refreshDisplayValue(parsedValue);
            return succeeded;
        }, [onCommitValue, parseValue, refreshDisplayValue]);
        // Callback used to handle onInput events.
        const onInput = (0, hooks_1.useCallback)(({ value }) => {
            // Do not use formatter when simply pushing back the value from onInput.
            _dispatch(reducer_1.updateDisplayValue, value ?? defaultDisplayValue);
        }, [_dispatch, defaultDisplayValue]);
        // This is the component's validate method. It follows the same rules as big jet's validate method does.
        // Validation lifecycle (clearAllMessages, parse, validate, format) is skipped if readonly or disabled
        // and 'valid' is returned.
        const validate = (0, hooks_1.useCallback)(async () => {
            if (readonly || disabled) {
                return 'valid';
            }
            // Parse the display value to get the value to validate. If conversion fails, return 'invalid'.
            const conversion = parseValue(state.displayValue);
            if (conversion.result === 'failure') {
                // parseValue will display messages and update valid in this case.
                return 'invalid';
            }
            const newValue = conversion.value;
            const resolver = addBusyState?.('Running component method validate');
            const validated = await fullValidate(newValue, { forceHiddenMessagesToBeShown: true });
            // resolve busy state
            resolver?.();
            // If validation succeeds, update both the value and display value (only if new value is different).
            // Note: fullValidate handles updating the valid state, depending on whether validation succeeded.
            if (validated) {
                if (newValue !== state.value) {
                    _dispatch(reducer_1.updateValue, newValue);
                    refreshDisplayValue(newValue);
                }
                return 'valid';
            }
            return 'invalid';
        }, [
            addBusyState,
            disabled,
            _dispatch,
            fullValidate,
            parseValue,
            readonly,
            refreshDisplayValue,
            state.displayValue,
            state.value
        ]);
        // This is the component's reset method.
        const reset = (0, hooks_1.useCallback)(() => {
            // We are pushing the component value to the UI, so only run deferred validation.
            // This is similar to setting the value externally.
            validateValueOnExternalChange(state.value);
            refreshDisplayValue(state.value);
        }, [refreshDisplayValue, state.value, validateValueOnExternalChange]);
        // This is the component's showMessages method.
        const showMessages = (0, hooks_1.useCallback)(() => {
            // If there are hidden messages, show them and set valid to invalidShown.
            if (state.hiddenMessages && state.hiddenMessages.length > 0) {
                _dispatch(reducer_1.showHiddenMessages);
                _dispatch(reducer_1.updateValidStatus, 'invalidShown');
            }
        }, [_dispatch, state.hiddenMessages]);
        const clearInteractionFlags = (0, hooks_1.useCallback)(() => {
            // This flag is reset when the user finishes interacting and tabs or clicks away.
            // It is used to force hidden messages to be shown.
            componentWasValidRef.current = false;
        }, []);
        const addMessage = (0, hooks_1.useCallback)((message) => {
            _dispatch(reducer_1.addComponentMessage, message);
        }, [_dispatch]);
        // VALUE CHANGED LIFECYCLE (chores to run when the value is programmatically changed)
        // 1. Update the previous value.
        // 2. Clear all messages.
        // 3. Run deferred validation.
        // 4. If it fails, set valid to invalidHidden; otherwise set valid to valid.
        // 5. Always update state with new value and display value.
        // This gets called when the value is changed either programmatically or by the user.
        if (!initialRender.current && state.previousValue !== value) {
            _dispatch(reducer_1.updatePreviousValue, value);
            // Ignore if value being pushed from the parent is the same as our internal state.
            // This happens when the user changes the value and commits.
            if (value !== state.value) {
                validateValueOnExternalChange(value);
                // We always set the value even if it is not valid when changed externally.
                _dispatch(reducer_1.updateValue, value);
                refreshDisplayValue(value);
            }
        }
        // CONVERTER CHANGED LIFECYCLE  (chores to run when the converter is changed)
        // 1. If valid == invalidShown, run full validation including conversion and update the value.
        // 2. If valid != invalidShown, update the display value only.
        if (!initialRender.current && state.previousConverter !== converter) {
            _dispatch(reducer_1.updatePreviousConverter, converter);
            state.valid !== 'invalidShown' && refreshDisplayValue(value);
            // Run full validation including conversion and update the value. This will happen
            // asynchronously if there are any async validators.
            state.valid === 'invalidShown' && runFullValidationAndUpdateValue();
        }
        // VALIDATORS CHANGED LIFECYCLE  (chores to run when the validators are changed)
        // 1. If valid state == valid or state == invalidHidden, do nothing.
        // 2. If valid state == invalidShown, run full validation with the current value and validators.
        if (!initialRender.current && state.previousValidators !== validators) {
            _dispatch(reducer_1.updatePreviousValidators, validators);
            // Run full validation including conversion and update the value. This will happen
            // asynchronously if there are any async validators.
            state.valid === 'invalidShown' && runFullValidationAndUpdateValue();
        }
        // MESSAGES CUSTOM CHANGED LIFECYCLE  (chores to run when messagesCustom is changed)
        // 1. If contains errors, set valid to invalidShown.
        // 2. If does not contain errors:
        //    If valid state is pending, do nothing
        //    Otherwise, if no errors in any type of messages set valid to "valid" OR
        //    if there are hidden messages set valid to "invalidHidden"
        if (!initialRender.current &&
            ((!state.customMessages && messagesCustom) ||
                (state.customMessages && !messagesCustom) ||
                (state.customMessages &&
                    messagesCustom &&
                    !(0, utils_1.isShallowEqual)(state.customMessages, messagesCustom)))) {
            const compMsgs = state.componentMessages ?? [];
            const hiddenMsgs = state.hiddenMessages ?? [];
            const customMsgs = messagesCustom ?? [];
            const hasErrors = (0, utils_1.hasErrorMessages)(customMsgs);
            const hasHiddenMessages = hiddenMsgs.length > 0;
            const hasNoMessages = compMsgs.length === 0 && hiddenMsgs.length === 0 && customMsgs.length === 0;
            _dispatch(reducer_1.updateCustomMessages, customMsgs);
            hasErrors && _dispatch(reducer_1.updateValidStatus, 'invalidShown');
            !hasErrors &&
                state.valid !== 'pending' &&
                ((hasNoMessages && _dispatch(reducer_1.updateValidStatus, 'valid')) ||
                    (hasHiddenMessages && _dispatch(reducer_1.updateValidStatus, 'invalidHidden')));
        }
        // REQUIRED CHANGED LIFECYCLE
        // Chores to do if deferredValidators change (this happens when the required property is toggled).
        // We don't run these if disabled or readonly, except when required is toggled to false.
        // 1. If component is in valid state, run deferred validation
        // 2. If the component is in invalidHidden state and deferred validators are cleared,
        //    clear messages and do not run validation
        // 3. If the component is in invalidShown state, clear messages (not messagesCustom) and
        //    run normal validation
        if (!initialRender.current &&
            (state.previousDeferredValidators !== deferredValidators ||
                state.previousDisabled !== disabled ||
                state.previousReadonly !== readonly)) {
            const isRequiredToggledToFalse = deferredValidators?.length === 0;
            state.previousDeferredValidators !== deferredValidators &&
                _dispatch(reducer_1.updatePreviousDeferredValidators, deferredValidators);
            state.previousDisabled !== disabled && _dispatch(reducer_1.updatePreviousDisabled, disabled);
            state.previousReadonly !== readonly && _dispatch(reducer_1.updatePreviousReadonly, readonly);
            // Run validation if required has been toggled to false (regardless of what
            // readonly/disabled are), or if the component is enabled.
            if (isRequiredToggledToFalse || (!readonly && !disabled)) {
                switch (state.valid) {
                    case 'valid': {
                        const conversion = getValueForValidation();
                        // If getValueForValidation fails, show errors and update valid.
                        if (conversion.result === 'failure') {
                            _dispatch(reducer_1.updateComponentMessages, [conversion.error]);
                            _dispatch(reducer_1.updateValidStatus, 'invalidShown');
                        }
                        else {
                            // Run deferred validation on the value.
                            const deferredValidate = validateDeferredSync(conversion.value);
                            deferredValidate.result === 'failure' &&
                                _dispatch(reducer_1.updateHiddenMessages, deferredValidate.errors) &&
                                _dispatch(reducer_1.updateValidStatus, 'invalidHidden');
                        }
                        break;
                    }
                    case 'invalidHidden':
                        if (deferredValidators?.length === 0) {
                            // no deferred validators, so clear messages and set to valid
                            _dispatch(reducer_1.updateValidStatus, 'valid');
                            _dispatch(reducer_1.updateHiddenMessages, []);
                        }
                        break;
                    case 'invalidShown':
                        runFullValidationAndUpdateValue();
                        break;
                }
            }
        }
        // INITIAL RENDER LIFECYCLE
        // 1. Run deferred validation using the initial value, if not readonly or disabled.
        // 2. Update valid based on result of validation and if there are custom messages.
        // 3. Format and update the display value.
        if (initialRender.current) {
            initialRender.current = false;
            // Store the current value of props so we can see if they change and run needed chores.
            _dispatch(reducer_1.updatePreviousValue, value);
            _dispatch(reducer_1.updatePreviousConverter, converter);
            _dispatch(reducer_1.updatePreviousValidators, validators);
            _dispatch(reducer_1.updatePreviousDeferredValidators, deferredValidators);
            _dispatch(reducer_1.updatePreviousDisabled, disabled);
            _dispatch(reducer_1.updatePreviousReadonly, readonly);
            _dispatch(reducer_1.updateCustomMessages, messagesCustom);
            // Initialize transient value from value.
            _dispatch(reducer_1.updateTransientValue, value);
            // Run deferred validation only if component is enabled. Otherwise, set valid state to 'valid'.
            if (!disabled && !readonly) {
                const validated = validateDeferredSync(value);
                validated.result === 'failure' &&
                    _dispatch(reducer_1.updateHiddenMessages, validated.errors) &&
                    _dispatch(reducer_1.updateValidStatus, (0, utils_1.hasErrorMessages)(messagesCustom) ? 'invalidShown' : 'invalidHidden');
                validated.result === 'success' &&
                    _dispatch(reducer_1.updateValidStatus, (0, utils_1.hasErrorMessages)(messagesCustom) ? 'invalidShown' : 'valid') &&
                    refreshDisplayValue(value);
            }
            else {
                // initial render for readonly or disabled, we want to format the value
                // and update the rawValue.
                _dispatch(reducer_1.updateValidStatus, 'valid');
                refreshDisplayValue(value);
            }
        }
        return {
            value: state.value,
            addMessage,
            clearInteractionFlags,
            displayValue: state.displayValue,
            formatValue,
            methods: {
                reset,
                showMessages,
                validate
            },
            onCommitValue,
            parseValue,
            refreshDisplayValue,
            setDisplayValue,
            setTransientValue,
            setValue,
            textFieldProps: {
                'aria-describedby': ariaDescribedBy,
                messages: displayOptions?.messages !== 'none' ? state.shownMessages : undefined,
                onCommit,
                onInput,
                value: state.displayValue
            },
            validateValueOnExternalChange
        };
    }
});

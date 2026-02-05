define(["require", "exports", "preact/hooks", "oj-c/hooks/UNSAFE_useEditableValue/index", "oj-c/hooks/UNSAFE_useComponentMessages/useComponentMessages", "oj-c/editable-value/UNSAFE_useDeferredValidators/useDeferredValidators", "./useImplicitNumberConverter", "./useImplicitNumberRangeValidator", "preact/hooks", "./stepBasisUtils", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "ojs/ojconverter-nativenumber"], function (require, exports, hooks_1, index_1, useComponentMessages_1, useDeferredValidators_1, useImplicitNumberConverter_1, useImplicitNumberRangeValidator_1, hooks_2, stepBasisUtils_1, UNSAFE_useTranslationBundle_1, ojconverter_nativenumber_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useNumberInputTextPreact = useNumberInputTextPreact;
    /**
     * This hook manages state and other related props for the Preact NumberInputText
     * component. It is a very primitive component that takes aria-valuenow, aria-valuetext, aria-valuemin, aria-valuemax,
     * and whether or not the up/down buttons are shown and disabled, etc.
     */
    function useNumberInputTextPreact({ autocomplete = 'on', // TODO: Should we make this off in oj-c comps?
    autofocus, converter: propConverter, disabled, displayOptions, inputPrefix, inputSuffix, labelEdge, labelHint, labelStartWidth, max, messagesCustom, min, numberRangeExactMessageDetail, numberRangeOverflowMessageDetail, numberRangeUnderflowMessageDetail, placeholder, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail, step, stepperVariant, textAlign, userAssistanceDensity, validators, value: propValue, virtualKeyboard, onMessagesCustomChanged, onRawValueChanged, onTransientValueChanged, onValidChanged, onValueChanged, ...otherProps }, addBusyState) {
        // Treat null as undefined for the min/max options. This will simplify the code.
        const minTreatNull = (0, index_1.treatNull)(min);
        const maxTreatNull = (0, index_1.treatNull)(max);
        // If no converter, use the IntlNumberConverter
        const converter = (0, useImplicitNumberConverter_1.useImplicitNumberConverter)({
            converter: propConverter
        });
        const implicitComponentValidator = (0, useImplicitNumberRangeValidator_1.useImplicitNumberRangeValidator)({
            converter,
            max: maxTreatNull,
            min: minTreatNull,
            numberRangeExactMessageDetail,
            numberRangeOverflowMessageDetail,
            numberRangeUnderflowMessageDetail
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
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const converterParseError = translations.inputNumber_converterParseError();
        const translateConverterParseError = (0, hooks_2.useCallback)((error) => {
            // JET-54847: Display a user-friendly localized message if the parse failure is due to user input error.
            return error?.cause === ojconverter_nativenumber_1.USER_INPUT_ERROR
                ? { severity: 'error', detail: converterParseError }
                : undefined;
        }, [converterParseError]);
        // useEditableValue passes in propValue and passes out value. The only time they are different is when the component's
        // value property is programmatically changed, not changed by user action. Like if value is
        // programmatically changed, say like inputNumber.value = 20,
        // propValue will be 20 and value will be the previous value. Then in useEV->useValueLifecycle, setValue is called
        // when value is programmatically changed, and that triggers a re-render and then propValue and value will be the same.
        const { onCommitValue, formatValue, parseValue, methods, textFieldProps: evTextFieldProps, value, setValue, displayValue, setDisplayValue, setTransientValue } = (0, index_1.useEditableValue)({
            addBusyState,
            ariaDescribedBy: otherProps['aria-describedby'],
            // We are casting this because legacy oj.Converter format returns string | null, but useEV's format
            // returns DV, which we set as string. In useEV/converterUtils we make sure not to call format when
            // the value is null and if format returns null we normalize it to return the defaultDisplayValue,
            // which is a string, so format never returns null.
            converter: converter,
            defaultDisplayValue: '',
            deferredValidators,
            disabled,
            displayOptions,
            messagesCustom,
            onMessagesCustomChanged,
            onRawValueChanged,
            onTransientValueChanged,
            onValidChanged,
            onValueChanged,
            readonly,
            translateConverterParseError,
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
        //
        const hasMin = minTreatNull !== undefined;
        const hasMax = maxTreatNull !== undefined;
        // these useRefs are to keep track of the spinning/stepping for async validation that could be slow.
        const isValidating = (0, hooks_2.useRef)(false);
        // this is used when the user clicks the up/down arrows faster than a slow validator can keep up.
        const stepQueue = (0, hooks_2.useRef)(new Array());
        // if we have a slow validator, then displayValue is what it is when the arrow is pressed. We use the displayValue
        // in doStep to get what we should increase or decrease. This ref keeps the most recent display value, not
        // what it was when the increase/decrease arrows were pressed.
        const currentDisplayValueInStep = (0, hooks_2.useRef)(displayValue);
        // We need to store the initial value so that we can use it to determine the step basis,
        // and also we recalculate step basis when value programmatically changes.
        const initialValue = (0, hooks_2.useRef)((0, index_1.treatNull)(propValue));
        // this only gets called when we programmatically change value, not when the user steps with arrows nor when the user commits a new value (that changes both value and propValue).
        // propValue changes when we programmatically change the value and it is different at this point than value.
        if (propValue !== value) {
            initialValue.current = (0, index_1.treatNull)(propValue);
        }
        // The setValueNow is updated:
        // 1. initial render, it is value.
        // 2. when value changes, either if value programmatically changes, or if value changes because it is committed.
        // 3. when the user steps or spins the number (see doStep). value doesn't change when we spin, so in this case value and valueNow diverge.
        // 4. when the user tries to commit and it fails validation (value doesn't change when validation fails, so in this case value and valueNow diverge).
        // if it is parseable, it is the number the user typed in. (see onCommit)
        const [valueNow, setValueNow] = (0, hooks_2.useState)((0, index_1.treatNull)(value));
        const [prevValue, setPrevValue] = (0, hooks_2.useState)(value);
        // this gets called anytime value changes which can be programmatically, or when the user steps with arrows or when the user commits a new value.
        if (value !== prevValue) {
            setPrevValue(value);
            setValueNow((0, index_1.treatNull)(value));
            // The setTransientValue is called when value changes, either programmatically or otherwise. It also changes during spinning
            // when the value doesn't get updated.
            setTransientValue(value);
        }
        // Used to track whether the user typed something into the field but did not commit.
        // This is used to calculate valueText, which in turn affects rendering, so it needs to be state.
        const [hasUncommittedDisplayValue, setHasUncommittedDisplayValue] = (0, hooks_2.useState)(false);
        // update every time we render if displayValue changes
        currentDisplayValueInStep.current = displayValue;
        // Overriding useEditableValue#onCommit to additionally set valueNow.
        const onCommit = (0, hooks_2.useCallback)(async ({ value }) => {
            setHasUncommittedDisplayValue(false);
            // parse
            const conversion = parseValue(value);
            if (conversion.result === 'failure') {
                // Parse failed. E.g., the user typed in a non-number.
                // In this case do nothing other than update valueNow and return
                // STATE: Commit (user action, stepping, end spinning, etc.) and parse failed.
                setValueNow(undefined);
                return;
            }
            // parse succeeded. onCommitValue tries to validate the value and commits it.
            const parsedValue = conversion.value;
            const commitSucceeded = await onCommitValue(parsedValue);
            if (commitSucceeded) {
                // if validation succeeds value is updated which in turn updates value/valueNow, so no need to do it explicitly here.
                const formattedValue = formatValue(parsedValue);
                setDisplayValue(formattedValue);
            }
            else {
                // The value the user typed in and tried to commit is not valid; validation failed.
                // E.g., a user typed in 800 when the range is 0-100. We want to disable the up button, we want aria-valuenow to show
                // 800.
                // STATE: Commit, parse succeeded, but validation failed.
                // parsedValue is number | null, setValueNow expects number | undefined.
                setValueNow(parsedValue ?? undefined);
            }
        }, [formatValue, parseValue, onCommitValue, setDisplayValue]);
        // Overriding useEditableValue#onInput so we can keep track if someone typed something in but didn't commit.
        // This is needed to figure out what valueText should be: displayValue unless someone typed something in but didn't commit.
        const onInput = (0, hooks_2.useCallback)(({ value }) => {
            // Do not use formatter when simply pushing back the text from event
            setDisplayValue(value ?? '');
            setHasUncommittedDisplayValue(true);
        }, [setDisplayValue]);
        const textFieldPropsWithOverride = { ...textFieldProps, onCommit, onInput };
        // This gets called when the user steps or spins. It is similar to the onCommit but it steps the value up or down first.
        // And it doesn't commit if it is spinning. It only commits the value if it is stepping or if spinning is complete.
        // stepping is a click, spinning is holding down the mouse or key. spinning is complete when they let go of the mouse or key.
        // This function will return right away if isValidating.current is true. isValidating.current is set to
        // false when the validation is done and this function is complete. This avoids running the validation
        // while a slow validator is still running.
        const doStep = (0, hooks_2.useCallback)(async (direction, doCommit) => {
            if (step === undefined || isValidating.current) {
                return;
            }
            // get the displayValue or if it is not set, use '0' and parse it to a number.
            const displayValueToStep = currentDisplayValueInStep.current || '0';
            const conversion = parseValue(displayValueToStep);
            if (conversion.result === 'failure') {
                // Conversion failed, do nothing
                return;
            }
            const parsedValue = conversion.value;
            // Take the parsed number and step it up or down based on direction, if any
            let newSteppedValue;
            if (direction !== undefined) {
                const stepValue = direction === 'increase' ? step : -1 * step;
                newSteppedValue = (0, stepBasisUtils_1.determineSteppedValue)(stepValue, step, parsedValue, initialValue.current, maxTreatNull, minTreatNull);
            }
            else {
                newSteppedValue = parsedValue;
            }
            // for spinning we want to run the full validation lifecycle, but not commit the value (doCommit is false).
            // for stepping, we want to run the full validation lifecycle and commit the value. (doCommit is true)
            isValidating.current = true;
            // no matter if it is valid or invalid, update the display value.
            const formattedValue = formatValue(newSteppedValue);
            setDisplayValue(formattedValue);
            currentDisplayValueInStep.current = formattedValue;
            // onCommit calls onCommitValue, not vice versa.
            // onCommitValue calls setValue if valid.
            // So stepping or spinning does not call onCommit.
            const commitSucceeded = await onCommitValue(newSteppedValue, doCommit);
            const isSpinning = doCommit === false;
            const valueCommitted = doCommit && commitSucceeded;
            // STATE: Spinning and VALID
            if (isSpinning && commitSucceeded) {
                // When spinning, we update the transientValue but only if the validation succeeded.
                // If we aren't spinning, the value is committed if valid, and the transientValue will get updated as a result, so no need to set it here.
                setTransientValue(newSteppedValue);
            }
            // STATE: Spinning or Stepping, parse succeeded, value was not committed.
            // If it is doCommit and VALID, then we don't need to because in that case value gets updated, and as a result, valueNow will be updated.
            if (!valueCommitted) {
                setValueNow(newSteppedValue);
            }
            isValidating.current = false;
        }, [
            formatValue,
            maxTreatNull,
            minTreatNull,
            parseValue,
            onCommitValue,
            setDisplayValue,
            setTransientValue,
            step
        ]);
        const processStepQueue = (0, hooks_2.useCallback)(async (direction) => {
            // kick off doStep and wait until it finishes. It could be slow if there is a slow validator.
            await doStep(direction, true);
            // if we have queued up more steps, process them
            if (stepQueue.current.length > 0) {
                // pull this out of the array, and call doStep again.
                const direction = stepQueue.current.shift();
                processStepQueue(direction);
            }
        }, [doStep]);
        // This gets called every time the user clicks on the up/down arrows
        // or presses the arrow up/down keys.
        // NumberInputText stops sending the step event when the up/down buttons are disabled.
        // If a user steps 3 times really fast, the number will step up 3 times, even if the validation is slow.
        const handleStep = (0, hooks_2.useCallback)(async ({ direction }) => {
            // if we are already processing something, then just push onto the queue and return
            if (isValidating.current) {
                // isValidating, so push direction onto the array and return.
                stepQueue.current.push(direction);
            }
            else {
                // not already processing.
                // kick off the process but do not wait for it to finish, return.
                processStepQueue(direction);
            }
        }, [processStepQueue]);
        // This gets called every 40ms while the user is holding down the arrow up/down key.
        const handleSpin = (0, hooks_2.useCallback)(async ({ direction }) => {
            // Don't commit until after spinning has completed.
            const doCommit = false;
            // clear the step queue if we start spinning
            stepQueue.current = [];
            // doStep will return early if it is waiting for validation to complete from a previous step or spin.
            doStep(direction, doCommit);
        }, [doStep]);
        // This gets called when the user releases the arrow key when spinning is complete.
        const handleSpinComplete = (0, hooks_2.useCallback)(async () => {
            // This will try to commit the latest value that the handleSpin handled. handleSpin does not commit.
            // We only commit when the spin is complete.
            // currentDisplayValueInStep.current is the most recent display value the spinning got to.
            // It could be valid or invalid. However, when handleSpinComplete is called it should never be undefined.
            // parseValue expects a string as the display value.
            const conversion = parseValue(currentDisplayValueInStep.current);
            if (conversion.result === 'failure') {
                // Parse failed.
                return;
            }
            // parse succeeded. onCommitValue tries to validate the value and commits it.
            await onCommitValue(conversion.value);
        }, [onCommitValue, parseValue]);
        // We calculate the valueText from other state.
        // We did have to add 'hasUncommittedDisplayValue' state for this calculation, but it doesn't
        // get updated as often as we would have to update the valueText if it were state.
        // Note: since format is potentially called on every render, which could throw an error, an
        // infinite rerender can happen because the new useEV attempts to rerender to show messages, which
        // leads to calling format again. To prevent this from happening, we cache the last valueText.
        const lastValueNow = (0, hooks_2.useRef)();
        const lastDisplayValue = (0, hooks_2.useRef)();
        const lastHasUncommittedDisplayValue = (0, hooks_2.useRef)();
        const lastValueText = (0, hooks_2.useRef)();
        let valueText;
        if (hasUncommittedDisplayValue !== lastHasUncommittedDisplayValue.current ||
            displayValue !== lastDisplayValue.current ||
            valueNow !== lastValueNow.current) {
            // If any of the params to calculateValueText have changed, call it again.
            valueText = calculateValueText(hasUncommittedDisplayValue, displayValue, // displayValue is always '' or an actual string value
            valueNow, formatValue);
            lastHasUncommittedDisplayValue.current = hasUncommittedDisplayValue;
            lastDisplayValue.current = displayValue;
            lastValueNow.current = valueNow;
            lastValueText.current = valueText;
        }
        else {
            valueText = lastValueText.current;
        }
        const normalizedVirtualKeyboard = virtualKeyboard === 'auto' ? (0, index_1.getVirtualKeyboardHintFromConverter)(converter) : virtualKeyboard;
        return {
            value,
            setValue,
            methods,
            // Certain props will have null as default values, but we need them to be
            // undefined in the preact component.
            inputNumberProps: {
                'aria-valuemax': maxTreatNull,
                'aria-valuemin': minTreatNull,
                'aria-valuenow': valueNow ?? undefined,
                'aria-valuetext': valueText,
                autoComplete: autocomplete,
                autoFocus: autofocus,
                hasSteppers: step !== undefined && step > 0,
                isDisabled: disabled,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || (0, index_1.treatNull)(value) === undefined),
                label: labelHint,
                labelEdge,
                labelStartWidth,
                stepperVariant,
                onSpin: step ? handleSpin : undefined, // step=0 is falsey
                onSpinComplete: step ? handleSpinComplete : undefined,
                onStep: step ? handleStep : undefined,
                placeholder,
                prefix: inputPrefix,
                suffix: inputSuffix,
                isStepDownDisabled: disabled ||
                    (hasMin &&
                        ((valueNow !== undefined && valueNow <= minTreatNull) ||
                            (displayValue === '' && minTreatNull === 0))),
                isStepUpDisabled: disabled ||
                    (hasMax &&
                        ((valueNow !== undefined && valueNow >= maxTreatNull) ||
                            (displayValue === '' && maxTreatNull === 0))),
                messages,
                textAlign,
                userAssistanceDensity,
                virtualKeyboard: normalizedVirtualKeyboard,
                ...textFieldPropsWithOverride
            }
        };
    }
    // calculate the valueText based on the input parameters.
    function calculateValueText(hasUncommittedDisplayValue, displayValue, valueNow, format) {
        // The displayValue is committed, so go ahead and use it for the valueText.
        if (!hasUncommittedDisplayValue) {
            return displayValue !== '' ? displayValue : undefined;
        }
        // The display value is not committed, that is, someone typed in and didn't try to commit it by pressing Enter/blur,
        // and we can't use displayValue for valuetext.
        let valueText;
        if (valueNow) {
            valueText = format(valueNow);
        }
        return valueText === '' || valueText === null ? undefined : valueText;
    }
});

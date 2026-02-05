define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reducer = reducer;
    exports.addComponentMessage = addComponentMessage;
    exports.addHiddenMessage = addHiddenMessage;
    exports.clearAllMessages = clearAllMessages;
    exports.showHiddenMessages = showHiddenMessages;
    exports.updateComponentMessages = updateComponentMessages;
    exports.updateCustomMessages = updateCustomMessages;
    exports.updateDisplayValue = updateDisplayValue;
    exports.updateHiddenMessages = updateHiddenMessages;
    exports.updatePreviousConverter = updatePreviousConverter;
    exports.updatePreviousDeferredValidators = updatePreviousDeferredValidators;
    exports.updatePreviousDisabled = updatePreviousDisabled;
    exports.updatePreviousReadonly = updatePreviousReadonly;
    exports.updatePreviousValidators = updatePreviousValidators;
    exports.updatePreviousValue = updatePreviousValue;
    exports.updateTransientValue = updateTransientValue;
    exports.updateValidStatus = updateValidStatus;
    exports.updateValue = updateValue;
    /**
     * Reducer which manages state for useEditableValue hook.
     * @param state
     * @param action
     * @returns
     */
    function reducer(state, action) {
        const customMsgs = state.customMessages ?? [];
        const hiddenMsgs = state.hiddenMessages;
        const componentMsgs = state.componentMessages;
        const shownMsgs = state.shownMessages;
        switch (action.type) {
            case 'ADD_COMPONENT_MESSAGE':
                return {
                    ...state,
                    componentMessages: [...componentMsgs, action.payload],
                    shownMessages: [...shownMsgs, action.payload]
                };
            case 'ADD_HIDDEN_MESSAGE':
                return {
                    ...state,
                    hiddenMessages: [...hiddenMsgs, action.payload]
                };
            case 'CLEAR_ALL_MESSAGES':
                return {
                    ...state,
                    shownMessages: [],
                    hiddenMessages: [],
                    customMessages: [],
                    componentMessages: []
                };
            case 'SHOW_HIDDEN_MESSAGES':
                // If there are no hidden messages in the state, return the original state.
                // Otherwise, we will end up clearing some messages incorrectly when this action is
                // dispatched multiple time during the same render cycle.
                // The reducer's state here always has the latest value. So, during the first dispatch,
                // it clears the hiddenMessages and updates the shownMessages. During the next, it does the same thing,
                // but the hiddenMessages were already cleared. So, the new shownMessages will only contain customMgs and
                // componentMgs. The hiddenMessages are now lost.
                return hiddenMsgs.length === 0
                    ? state
                    : {
                        ...state,
                        hiddenMessages: [],
                        shownMessages: [...customMsgs, ...componentMsgs, ...hiddenMsgs]
                    };
            case 'UPDATE_DISPLAY_VALUE':
                return {
                    ...state,
                    displayValue: action.payload
                };
            case 'UPDATE_VALID':
                return {
                    ...state,
                    valid: action.payload
                };
            case 'UPDATE_VALUE':
                return {
                    ...state,
                    value: action.payload
                };
            case 'UPDATE_TRANSIENT_VALUE':
                return {
                    ...state,
                    transientValue: action.payload
                };
            case 'UPDATE_PREVIOUS_CONVERTER':
                return {
                    ...state,
                    previousConverter: action.payload
                };
            case 'UPDATE_PREVIOUS_DEFERRED_VALIDATORS':
                return {
                    ...state,
                    previousDeferredValidators: action.payload
                };
            case 'UPDATE_PREVIOUS_DISABLED':
                return {
                    ...state,
                    previousDisabled: action.payload
                };
            case 'UPDATE_PREVIOUS_READONLY':
                return {
                    ...state,
                    previousReadonly: action.payload
                };
            case 'UPDATE_PREVIOUS_VALIDATORS':
                return {
                    ...state,
                    previousValidators: action.payload
                };
            case 'UPDATE_PREVIOUS_VALUE':
                return {
                    ...state,
                    previousValue: action.payload
                };
            case 'UPDATE_COMPONENT_MESSAGES':
                return {
                    ...state,
                    componentMessages: action.payload,
                    shownMessages: [...customMsgs, ...action.payload]
                };
            case 'UPDATE_HIDDEN_MESSAGES':
                return {
                    ...state,
                    hiddenMessages: action.payload
                };
            case 'UPDATE_CUSTOM_MESSAGES':
                return {
                    ...state,
                    customMessages: action.payload,
                    shownMessages: [...action.payload, ...componentMsgs]
                };
            default:
                return state;
        }
    }
    //////////////////////////////////////////////////////////////////
    // UTILTIES TO UPDATE STATE AND INVOKE CALLBACKS
    // To keep these pure functions, the dispatch method and callbacks
    // as passed from the useEV hook.
    ///////////////////////////////////////////////////////////////////
    // Update the display value and call onRawValueChanged.
    function updateDisplayValue(dispatch, displayValue, { onRawValueChanged }) {
        dispatch({ type: 'UPDATE_DISPLAY_VALUE', payload: displayValue });
        onRawValueChanged?.(displayValue);
    }
    // Update valid and call onValidChanged.
    function updateValidStatus(dispatch, state, { onValidChanged }) {
        dispatch({ type: 'UPDATE_VALID', payload: state });
        onValidChanged?.(state);
    }
    // Update value and call onValueChanged.
    function updateValue(dispatch, value, { onValueChanged }) {
        dispatch({ type: 'UPDATE_VALUE', payload: value });
        onValueChanged?.(value);
    }
    // Update transient value and call onTransientValueChanged.
    function updateTransientValue(dispatch, transientValue, { onTransientValueChanged }) {
        dispatch({ type: 'UPDATE_TRANSIENT_VALUE', payload: transientValue });
        onTransientValueChanged?.(transientValue);
    }
    // Update component messages.
    function updateComponentMessages(dispatch, messages) {
        dispatch({ type: 'UPDATE_COMPONENT_MESSAGES', payload: messages });
    }
    // Update hidden messages.
    function updateHiddenMessages(dispatch, messages) {
        dispatch({ type: 'UPDATE_HIDDEN_MESSAGES', payload: messages });
    }
    // Update custom messages.
    function updateCustomMessages(dispatch, messages) {
        dispatch({ type: 'UPDATE_CUSTOM_MESSAGES', payload: messages });
    }
    // Update the previous value stored in the state.
    function updatePreviousValue(dispatch, value) {
        dispatch({ type: 'UPDATE_PREVIOUS_VALUE', payload: value });
    }
    // Update the previousConverter stored in state.
    function updatePreviousConverter(dispatch, converter) {
        dispatch({ type: 'UPDATE_PREVIOUS_CONVERTER', payload: converter });
    }
    // Update the previousDeferredValidators stored in state.
    function updatePreviousDeferredValidators(dispatch, validators) {
        dispatch({ type: 'UPDATE_PREVIOUS_DEFERRED_VALIDATORS', payload: validators });
    }
    // Update previousDisabled.
    function updatePreviousDisabled(dispatch, disabled) {
        dispatch({ type: 'UPDATE_PREVIOUS_DISABLED', payload: disabled });
    }
    // Update previousReadonly.
    function updatePreviousReadonly(dispatch, readonly) {
        dispatch({ type: 'UPDATE_PREVIOUS_READONLY', payload: readonly });
    }
    // Update the previousValidators stored in state.
    function updatePreviousValidators(dispatch, validators) {
        dispatch({ type: 'UPDATE_PREVIOUS_VALIDATORS', payload: validators });
    }
    // Clear all messages and call onMessagesCustomChanged.
    function clearAllMessages(dispatch, _value, { onMessagesCustomChanged }) {
        dispatch({ type: 'CLEAR_ALL_MESSAGES' });
        onMessagesCustomChanged?.([]);
    }
    // Show hidden messages from deferred validation.
    function showHiddenMessages(dispatch) {
        dispatch({ type: 'SHOW_HIDDEN_MESSAGES' });
    }
    // Add a component message.
    function addComponentMessage(dispatch, message) {
        dispatch({ type: 'ADD_COMPONENT_MESSAGE', payload: message });
    }
    // Add a hidden message.
    function addHiddenMessage(dispatch, message) {
        dispatch({ type: 'ADD_HIDDEN_MESSAGE', payload: message });
    }
});

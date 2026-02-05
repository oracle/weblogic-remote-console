/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const componentsMap = new Map();
const componentsOrder = [];
const priorFocusCache = new Map();
let hasDocumentListener = false;
let priorFocusedElement;
let currentFocusedMessage;
/**
 * Handles KeyDown event in the document element during the capture phase.
 *
 * @param event The keydown event object
 */
function handleDocumentKeyDownCapture(event) {
    // Do nothing if any of the following is true:
    // 1. No components are registered
    // 2. Pressed key is not F6
    // 3. Event is defaultPrevented
    if (componentsMap.size === 0 || event.key !== 'F6' || event.defaultPrevented) {
        return;
    }
    // Try cycling focus through the messages and if that fails
    // set the focus to the prior focused element.
    if (!cycleFocusThroughMessages(event)) {
        currentFocusedMessage && togglePreviousFocus(currentFocusedMessage, event);
    }
}
/**
 * Handles the blur event captured on the document
 * @param event Blur event object
 */
function handleDocumentBlurCapture(event) {
    priorFocusedElement = event.target;
}
/**
 * Handles the keyup event in the component
 * @param id A unique symbol that ids the component to be registered for managing focus
 * @param event The keyup event object
 */
function handleComponentKeyUp(id, event) {
    // Ignore the call if the comp is not registered anymore or event default is prevented
    if (!componentsMap.has(id) || event.defaultPrevented) {
        return;
    }
    // Additional checks for keyup event and recognized keys
    if (event.type === 'keyup' && ['Escape'].includes(event.key)) {
        // toggle focus to the previously focused element
        togglePreviousFocus(id, event);
    }
}
/**
 * Handles the focus event in the component
 * @param id A unique symbol that ids the component to be registered for managing focus
 * @param event The focus event object
 */
function handleComponentFocus(id, event) {
    // Ignore the call if the comp is not registered anymore or event default is prevented
    if (!componentsMap.has(id) || event.defaultPrevented) {
        return;
    }
    // Store the id of the current focused message
    currentFocusedMessage = id;
    // Track previous focus if the priorFocused element is not a part of this or any other
    // registered component
    const { callbacks } = componentsMap.get(id);
    if (priorFocusedElement && !isPartOfRegisteredMessages(priorFocusedElement)) {
        priorFocusCache.set(id, priorFocusedElement);
        // since the focus moved to this component from outside, call the
        // onFocus callbacks if available
        callbacks?.onFocus?.();
    }
}
/**
 * Handles the blur event in the component
 * @param id A unique symbol that ids the component to be registered for managing focus
 * @param event The focus event object
 */
function handleComponentBlur(id, event) {
    // Ignore the call if the comp is not registered anymore or event default is prevented
    if (!componentsMap.has(id) || event.defaultPrevented) {
        return;
    }
    // reset the current focus message ID
    currentFocusedMessage = undefined;
}
/**
 * Cycles the focus through the registered messages component from the previous message of current focused
 * message to the top of the hierarchy.
 *
 * @param event The event that initiated this action
 * @returns boolean indicating the result of this action
 */
function cycleFocusThroughMessages(event) {
    // At this point, we need to focus the previous message from the current focused
    // message
    const nextPosition = indexOfOrDefaultTo(componentsOrder, currentFocusedMessage, componentsOrder.length) - 1;
    for (let i = nextPosition; i > -1; i--) {
        const id = componentsOrder[i];
        const { ref } = componentsMap.get(id) ?? {};
        if (ref?.current?.focus?.()) {
            // prevent default action as the event has transferred focus
            event.preventDefault();
            // invoke callback to let the current component know the focus is left
            if (currentFocusedMessage) {
                const { callbacks } = componentsMap.get(currentFocusedMessage) ?? {};
                callbacks?.onFocusLeave?.();
            }
            // Focus is set, so break the loop
            return true;
        }
    }
    return false;
}
/**
 * Checks if the provided element is a part of any of the registered messages
 *
 * @param element The candidate element
 * @returns true if is inside any of the registered messages
 */
function isPartOfRegisteredMessages(element) {
    for (const { ref } of componentsMap.values()) {
        if (ref.current?.contains(element)) {
            return true;
        }
    }
    return false;
}
/**
 * Finds the index of the item in the array, if it does not exist returns the
 * default value instead
 *
 * @param arr The array to perform the search
 * @param search The item to be searched
 * @param defaultIndex The default value if the item is not found
 * @returns The index of the item or the default value
 */
function indexOfOrDefaultTo(arr, search, defaultIndex = -1) {
    const index = arr.indexOf(search);
    if (index !== -1)
        return index;
    return defaultIndex;
}
/**
 * Traverses through the priorFocusCache to fetch the last focused
 * element outside of the messages region.
 *
 * @param id The current focused message's ID
 * @returns The closest prior focused element, null if not found
 */
function getClosestPriorFocusedElement(id) {
    // F6 navigation cycles through messages in reverse order
    // so to get the closest prior focused element we need to
    // traverse in natural order from the current message
    const index = componentsOrder.indexOf(id);
    for (let i = index; i < componentsOrder.length; i++) {
        if (priorFocusCache.has(componentsOrder[i])) {
            return priorFocusCache.get(componentsOrder[i]);
        }
    }
    // No prior cache found, so return null
    return null;
}
/**
 * Adds the component to the internal members.
 *
 * @param id A unique symbol that ids the component to be registered for managing focus
 * @param ref A ref handle to the focusable component
 * @param callbacks Optional callbacks
 */
function addComponent(id, options) {
    componentsMap.set(id, options);
    componentsOrder.push(id);
}
/**
 * Removes the component from the internal members
 *
 * @param id A unique symbol that ids the component to be registered for managing focus
 */
function removeComponent(id) {
    if (!componentsMap.has(id)) {
        return;
    }
    componentsMap.delete(id);
    componentsOrder.splice(componentsOrder.indexOf(id), 1);
}
/**
 * Clears the priorFocusCache of the specified component
 *
 * @param id The id of the component whose cache is to be cleared
 */
function clearFocusCache(id) {
    priorFocusCache.delete(id);
}
/**
 * Adds event listeners to the document element
 */
function addDocumentListeners() {
    // Add the events in capture phase, as we do not want this to be stopped by the elements
    // in the DOM tree.
    // make sure to use keydown as we need to prevent the default behavior which is moving to
    // the address bar in some browsers & OS.
    document.documentElement.addEventListener('keydown', handleDocumentKeyDownCapture, true);
    document.documentElement.addEventListener('blur', handleDocumentBlurCapture, true);
    hasDocumentListener = true;
}
/**
 * Removes event listeners from the document element
 */
function removeDocumentListeners() {
    document.documentElement.removeEventListener('keydown', handleDocumentKeyDownCapture, true);
    document.documentElement.removeEventListener('blur', handleDocumentBlurCapture, true);
    hasDocumentListener = false;
}
/**
 * Registers a component for its focus to be managed.
 *
 * @param id A unique symbol that ids the component to be registered for managing focus
 * @param componentOptions An object containing component options
 * @param focusManagerOptions An object containing focus manager options
 *
 * @returns An object containing focus event listeners
 */
function register(id, componentOptions, focusManagerOptions = { handleEscapeKey: true }) {
    if (!hasDocumentListener) {
        addDocumentListeners();
    }
    addComponent(id, componentOptions);
    const handlers = {
        onFocusIn: (event) => handleComponentFocus(id, event),
        onFocusOut: (event) => handleComponentBlur(id, event)
    };
    if (focusManagerOptions.handleEscapeKey) {
        handlers['onKeyUp'] = (event) => handleComponentKeyUp(id, event);
    }
    return handlers;
}
/**
 * Focuses the element which was focused prior to the passed component.
 * @param id A unique symbol that ids the component to be registered for managing focus
 * @param event The event that initiated the focus transfer. The event will be default prevented if the focus
 *              is transferred successfully.
 * @returns true, if focus is restored. false otherwise.
 */
function togglePreviousFocus(id, event) {
    const target = getClosestPriorFocusedElement(id);
    const { callbacks } = componentsMap.get(id) ?? {};
    if (target && document.body.contains(target)) {
        target.focus();
        // invoke callback to let the component know the focus is left
        callbacks?.onFocusLeave?.();
        // As the prior focus is restored, empty the focus cache
        priorFocusCache.clear();
        event?.preventDefault();
        return true;
    }
    // Prior focused element does not exist or
    // Element does not exist in DOM.
    return false;
}
/**
 * Unregisters a component from focus management
 *
 * @param id A unique symbol that ids the component to be registered for managing focus
 */
function unregister(id) {
    removeComponent(id);
    clearFocusCache(id);
    if (hasDocumentListener && componentsMap.size === 0) {
        // no component is registered, so remove the document listeners
        removeDocumentListeners();
    }
}
/**
 * Moves the priority of the component with the specified id
 *
 * @param id A unique symbol that ids the component to be registered for managing focus
 */
function prioritize(id) {
    if (!componentsMap.has(id)) {
        // Do nothing if the component is not registered
        return;
    }
    // Remove and add the component with the same ref
    // to move it in the priority queue
    const options = componentsMap.get(id);
    removeComponent(id);
    addComponent(id, options);
}
/**
 * The focus manager object
 */
const messagesFocusManager = {
    prioritize,
    register,
    togglePreviousFocus,
    unregister
};
/**
 * A custom hook that handles focus management for the messages component.
 * @param ref The custom ref handle for the component
 * @param callbacks Optional callbacks
 * @returns The handlers and a controller
 */
function useMessageFocusManager(ref, callbacks, options) {
    const id = hooks.useRef(Symbol());
    const focusManager = hooks.useRef(messagesFocusManager);
    const [handlers, setHandlers] = hooks.useState({});
    const controller = hooks.useMemo(() => ({
        prioritize: () => focusManager.current.prioritize(id.current),
        restorePriorFocus: () => focusManager.current.togglePreviousFocus(id.current)
    }), []);
    // Register handlers for focus management
    hooks.useEffect(() => {
        const currentFocusManager = focusManager.current;
        const currentId = id.current;
        setHandlers(currentFocusManager.register(currentId, { ref, callbacks }, options));
        return () => currentFocusManager.unregister(currentId);
        // eslint-disable-next-line
    }, []); // we only want this to run on mount
    return {
        handlers,
        controller
    };
}

exports.useMessageFocusManager = useMessageFocusManager;
//# sourceMappingURL=useMessagesFocusManager-1bf493a6.js.map

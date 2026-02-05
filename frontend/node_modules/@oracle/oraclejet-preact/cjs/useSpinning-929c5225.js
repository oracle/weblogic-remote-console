/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');
var useToggle = require('./useToggle-3ebba7d8.js');

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const SPIN_DELAY = 500;
const SPIN_INTERVAL = 40;
/**
 * A hook that provides keyboard and pointer event handlers that can be spread
 * onto any component that wants to support stepping and spinning through the
 * Arrow Up or Down Keys, or by clicking a StepButton. Holding down the key
 * or button first emits a step, then waits for SPIN_DELAY before producing
 * continuous step events (aka spinning) for every SPIN_INTERVAL.
 *
 * @param isStepDownDisabled Controls whether stepping down is disabled
 * @param isStepUpDisabled Controls whether stepping up is disabled
 * @param onSpin Called when a continuous step (aka spin) is requested
 * @param onSpinComplete Called when spinning is complete
 * @param onStep Called when a single step is requested
 * @returns Keyboard and pointer event handlers
 */
const useSpinning = ({ isStepDownDisabled, isStepUpDisabled, onSpin, onSpinComplete, onStep }) => {
    const { bool: isStarted, setTrue: setStartedTrue, setFalse: setStartedFalse } = useToggle.useToggle(false);
    const { bool: isSpinning, setTrue: setSpinningTrue, setFalse: setSpinningFalse } = useToggle.useToggle(false);
    const startTimerRef = hooks.useRef(null);
    const spinTimerRef = hooks.useRef(null);
    const directionRef = hooks.useRef('increase');
    const spinCompleteRef = hooks.useRef(false);
    const onKeyDown = hooks.useCallback((event) => {
        if (!(event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            return;
        }
        // By default, pressing the arrow keys moves the cursor to the
        // beginning or end which we don't want, so call preventDefault.
        // We also want to stop propagation of handled events.
        event.preventDefault();
        event.stopPropagation();
        if (isStarted) {
            // If already started, ignore repeated key down events.
            return;
        }
        if ((event.key === 'ArrowDown' && isStepDownDisabled) ||
            (event.key === 'ArrowUp' && isStepUpDisabled)) {
            // If requested step is disabled, return.
            return;
        }
        directionRef.current = event.key === 'ArrowDown' ? 'decrease' : 'increase';
        setStartedTrue();
        // Do an initial step, which is what oj-input-number did as well.
        onStep?.({ direction: directionRef.current });
    }, [isStarted, onStep, isStepDownDisabled, isStepUpDisabled, setStartedTrue]);
    const onKeyUp = hooks.useCallback((event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            if (isSpinning) {
                // Only want to call onSpinComplete if we were actually spinning.
                spinCompleteRef.current = true;
            }
            setStartedFalse();
            setSpinningFalse();
            event.stopPropagation();
        }
    }, [isSpinning, setStartedFalse, setSpinningFalse]);
    const onIncreasePointerDown = hooks.useCallback((event) => {
        // Similar to Arrow Up, stop propagation of the event, start the timer, and
        // do an initial 'increase' step.
        event.stopPropagation();
        // We don't want the step buttons getting focus, so call preventDefault.
        event.preventDefault();
        if (isStepUpDisabled) {
            return;
        }
        directionRef.current = 'increase';
        setStartedTrue();
        onStep?.({ direction: directionRef.current });
    }, [onStep, isStepUpDisabled, setStartedTrue]);
    const onDecreasePointerDown = hooks.useCallback((event) => {
        // Similar to Arrow Down, stop propagation of the event, start the timer, and
        // do an initial 'decrease' step.
        event.stopPropagation();
        // We don't want the step buttons getting focus, so call preventDefault.
        event.preventDefault();
        if (isStepDownDisabled) {
            return;
        }
        directionRef.current = 'decrease';
        setStartedTrue();
        onStep?.({ direction: directionRef.current });
    }, [onStep, isStepDownDisabled, setStartedTrue]);
    const onPointerUpOutOrCancel = hooks.useCallback(
    // Handle spin cancellation on pointer up, out, or cancel.
    // This is for both the increase and decrease cases.
    (event) => {
        if (isSpinning) {
            spinCompleteRef.current = true;
        }
        setStartedFalse();
        setSpinningFalse();
        event.stopPropagation();
    }, [isSpinning, setStartedFalse, setSpinningFalse]);
    hooks.useEffect(() => {
        if (isStarted && !startTimerRef.current) {
            startTimerRef.current = setTimeout(() => {
                setSpinningTrue();
            }, SPIN_DELAY);
        }
        return () => {
            // Clean up between renders.
            if (startTimerRef.current) {
                clearTimeout(startTimerRef.current);
                startTimerRef.current = null;
            }
        };
    }, [isStarted, setSpinningTrue]);
    hooks.useEffect(() => {
        if (!isSpinning) {
            if (spinTimerRef.current) {
                clearInterval(spinTimerRef.current);
                spinTimerRef.current = null;
            }
        }
        else {
            if (!spinTimerRef.current) {
                spinTimerRef.current = setInterval(() => {
                    // If further spinning is disabled, call setSpinningFalse to
                    // clean up the timer otherwise repeat the step.
                    if ((directionRef.current === 'increase' && isStepUpDisabled) ||
                        (directionRef.current === 'decrease' && isStepDownDisabled)) {
                        setSpinningFalse();
                        spinCompleteRef.current = true;
                    }
                    else {
                        onSpin?.({ direction: directionRef.current });
                    }
                }, SPIN_INTERVAL);
            }
        }
        return () => {
            // Clean up between renders.
            if (spinTimerRef.current) {
                clearInterval(spinTimerRef.current);
                spinTimerRef.current = null;
            }
        };
    }, [isSpinning, isStepDownDisabled, isStepUpDisabled, onSpin, setSpinningFalse]);
    // Only want to run this effect when isSpinning is false and our ref is true.
    // This helps guarantee onSpinComplete is only called once after spinning stops,
    // even if onSpinComplete's identity is changing.
    hooks.useEffect(() => {
        if (!isSpinning && spinCompleteRef.current) {
            spinCompleteRef.current = false;
            onSpinComplete?.();
        }
    }, [isSpinning, onSpinComplete]);
    // Handlers for arrow key up and down events.
    const keyboardHandlerProps = { onKeyDown, onKeyUp };
    // Handlers for pointer events on a step button that increases the value.
    const pointerIncreaseHandlerProps = {
        onPointerDown: onIncreasePointerDown,
        onPointerUp: onPointerUpOutOrCancel,
        onPointerOut: onPointerUpOutOrCancel,
        onPointerCancel: onPointerUpOutOrCancel
    };
    // Handlers for pointer events on a step button that decreases the value.
    const pointerDecreaseHandlerProps = {
        onPointerDown: onDecreasePointerDown,
        onPointerUp: onPointerUpOutOrCancel,
        onPointerOut: onPointerUpOutOrCancel,
        onPointerCancel: onPointerUpOutOrCancel
    };
    return { keyboardHandlerProps, pointerIncreaseHandlerProps, pointerDecreaseHandlerProps };
};

exports.useSpinning = useSpinning;
//# sourceMappingURL=useSpinning-929c5225.js.map

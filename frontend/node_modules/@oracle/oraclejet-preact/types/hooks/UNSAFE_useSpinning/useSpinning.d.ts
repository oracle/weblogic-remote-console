/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
export type StepDirection = 'increase' | 'decrease';
export type StepEvent = {
    /**
     * The direction of the requested step.
     */
    direction: StepDirection;
};
export type StepProps = {
    /**
     * Controls whether step down is disabled.
     */
    isStepDownDisabled?: boolean;
    /**
     * Controls whether step up is disabled.
     */
    isStepUpDisabled?: boolean;
    /**
     * Called when a continuous step is requested (aka "spin")
     * by holding down the arrow up or arrow down keys, or
     * by pressing and holding down a step button.
     */
    onSpin?: (event: StepEvent) => void;
    /**
     * Called when spinning is complete and the user has
     * released the arrow key or step button.
     */
    onSpinComplete?: () => void;
    /**
     * Called when a single step is requested by clicking a step button
     * or by pressing the arrow up or arrow down keys.
     */
    onStep?: (event: StepEvent) => void;
};
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
export declare const useSpinning: ({ isStepDownDisabled, isStepUpDisabled, onSpin, onSpinComplete, onStep }: StepProps) => {
    keyboardHandlerProps: {
        onKeyDown: (event: KeyboardEvent) => void;
        onKeyUp: (event: KeyboardEvent) => void;
    };
    pointerIncreaseHandlerProps: {
        onPointerDown: (event: PointerEvent) => void;
        onPointerUp: (event: PointerEvent) => void;
        onPointerOut: (event: PointerEvent) => void;
        onPointerCancel: (event: PointerEvent) => void;
    };
    pointerDecreaseHandlerProps: {
        onPointerDown: (event: PointerEvent) => void;
        onPointerUp: (event: PointerEvent) => void;
        onPointerOut: (event: PointerEvent) => void;
        onPointerCancel: (event: PointerEvent) => void;
    };
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
type CallbackFunction = (event: Event) => void;
type UseDoubleTapProps = {
    isSingleTapImmediate?: boolean;
    onDoubleTap: CallbackFunction;
    onSingleTap?: CallbackFunction;
    threshold?: number;
};
/**
 * A hook that supports double tap on mobile. You can optionally pass an onSingleTap handler
 * which is called if the user taps once, but doesn't tap again within the threshold waiting
 * period (isSingleTapImmediate = false). If isSingleTapImmediate is true, onSingleTap is
 * invoked immediately after the first tap.
 *
 * If the user taps again within the threshold wait period, then onDoubleTap is called.
 */
export declare function useDoubleTap({ isSingleTapImmediate, onDoubleTap, onSingleTap, threshold }: UseDoubleTapProps): {
    onClick: (event: MouseEvent) => void;
};
export {};

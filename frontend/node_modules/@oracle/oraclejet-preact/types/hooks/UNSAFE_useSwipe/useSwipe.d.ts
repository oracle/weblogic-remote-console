/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
type SwipeOptions = {
    threshold?: number;
    maximumTime?: number;
    tolerance?: number;
    isDisabled?: boolean;
};
type SwipeInfo = {
    direction: 'left' | 'right' | 'up' | 'down';
};
export declare function useSwipe(onSwipe: (e: SwipeInfo) => void, { threshold, maximumTime, tolerance, isDisabled }?: SwipeOptions): {
    swipeProps: Record<string, any>;
};
export {};

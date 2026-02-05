/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
type WheelDetail = {
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    ctrlKey: boolean;
};
type UseWheelOptions = {
    onWheel: (detail: WheelDetail) => void;
    preventDefault?: boolean;
    isDisabled?: boolean;
};
declare const PX_FACTOR_PER_LINE = 15;
declare const useWheel: ({ onWheel: onWheelCallback, preventDefault, isDisabled }: UseWheelOptions) => {
    onWheel?: undefined;
} | {
    onWheel: (e: WheelEvent) => void;
};
export { useWheel, PX_FACTOR_PER_LINE };

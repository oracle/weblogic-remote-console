/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import { StepDirection } from "../hooks/UNSAFE_useSpinning";
type Props = {
    /**
     * The children are Icons for the button.
     */
    children: ComponentChildren;
    /**
     * The direction of the step.
     */
    direction: StepDirection;
    /**
     * Whether the button is disabled.
     */
    isDisabled?: boolean;
    /**
     * Pointer event down handler
     */
    onPointerDown?: (event: PointerEvent) => void;
    /**
     * Pointer event up handler
     */
    onPointerUp?: (event: PointerEvent) => void;
    /**
     * Pointer event out handler
     */
    onPointerOut?: (event: PointerEvent) => void;
    /**
     * Pointer event cancel handler
     */
    onPointerCancel?: (event: PointerEvent) => void;
};
/**
 * A StepButton is used to request a "step up" or "step down" to a value in NumberInputText.
 * @param children The children are Icons for the button
 * @param direction The direction of the step
 * @param isDisabled Whether the button should be disabled
 * @param onPointerDown Handler called when pointer is down
 * @param onPointerUp Handler called when pointer is up
 * @param onPointerOut Handler called when pointer is out
 * @param onPointerCancel Handler called when pointer is canceled
 */
export declare function StepButton({ direction, isDisabled, children, onPointerDown, onPointerUp, onPointerOut, onPointerCancel }: Props): import("preact").JSX.Element;
export {};

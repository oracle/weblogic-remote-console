/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { TestIdProps } from '../hooks/UNSAFE_useTestId';
type TrainProps = {
    /**
     * Id of the currently selected step.
     */
    selectedStep: string;
    /**
     * Children of Train which are of type Step.
     */
    children: JSX.Element[];
    /**
     * A callback function to be invoked when the Step is selected.
     */
    onSelect?: (detail: selectDetail) => void;
} & TestIdProps;
export type selectDetail = {
    /**
     * Click event object
     */
    event: Event;
    /**
     * To step id
     */
    toStep: string;
};
/**
The JET Train component serves as a visual navigator enabling users to traverse through different 'steps'. Each 'step' is represented by the Step sub-component which can manifest its own state - 'visited', 'unvisited', or 'disabled', and is capable of communicating various message types including 'error', 'confirmation', 'warning', or 'info'.
 */
export declare function Train({ onSelect, selectedStep, children, testId }: TrainProps): import("preact").JSX.Element;
export {};

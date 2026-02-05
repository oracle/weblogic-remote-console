/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { MessageSeverity } from './TrainIcons.types';
interface StepIconProps {
    /**
     * Determines if the step is disabled or not
     */
    isDisabled: boolean;
    /**
     * Determines if the step has been visited
     */
    isVisited: boolean;
    /**
     * A string that defines which icon type the step should take
     */
    messageType?: Exclude<MessageSeverity, 'none'>;
}
/**
 * Step icon
 */
export declare const StepIcon: ({ isDisabled, isVisited, messageType }: StepIconProps) => import("preact").JSX.Element;
export {};

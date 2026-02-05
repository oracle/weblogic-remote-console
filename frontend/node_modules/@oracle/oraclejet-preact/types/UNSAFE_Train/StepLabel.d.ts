/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { MessageSeverity } from './TrainIcons.types';
interface StepLabelProps {
    /**
     * Determines if the step is disabled or not
     */
    isDisabled: boolean;
    /**
     * Determines if the step is visited or not
     */
    isVisited: boolean;
    /**
     * Label of the step
     */
    label: string;
    /**
     * Determines the message type icon from the following types 'error', 'warning', 'confirmation', 'info' and 'none'.
     */
    messageType?: Exclude<MessageSeverity, 'none'>;
}
/**
 * Step label component
 */
export declare const StepLabel: ({ label, isDisabled, isVisited, messageType }: StepLabelProps) => import("preact").JSX.Element;
export {};

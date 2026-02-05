/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { FunctionComponent } from 'preact';
import { MessageSeverity } from './TrainIcons.types';
interface StepProps {
    /**
     * Unique step id
     */
    id: string;
    /**
     * Determines if the step is disabled or not
     */
    isDisabled: boolean;
    /**
     * Determines if the step has been visited or not
     */
    isVisited: boolean;
    /**
     * Determines which icon the step has from the following types 'error', 'warning', 'confirmation', 'info' and 'none'.
     */
    messageType?: Exclude<MessageSeverity, 'none'>;
    /**
     * Step Label
     */
    label: string;
}
/**
 * Step component
 */
export declare const Step: FunctionComponent<StepProps>;
export {};

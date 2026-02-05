/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { MessageSeverity } from './TrainIcons.types';
/**
 * Props for the UserChosenIcon component
 */
type Props = {
    /**
     * Determines the message type icon from the following types 'error', 'warning', 'confirmation', 'info' and 'none'.
     */
    messageType: Exclude<MessageSeverity, 'none'>;
    /**
     * Determines if the step is disabled or not
     */
    isDisabled: boolean;
    /**
     * Translations resources
     */
    translations?: {
        /**
         * Text for 'error' severity level
         */
        error?: string;
        /**
         * Text for 'error' severity level
         */
        fatal?: string;
        /**
         * Text for 'warning' severity level
         */
        warning?: string;
        /**
         * Text for 'info' severity level
         */
        info?: string;
        /**
         * Text for 'confirmation' severity level
         */
        confirmation?: string;
    };
};
/**
 * UserChosenIcon Component for rendering the severity based icon in Message
 */
declare function UserChosenIcon({ messageType, isDisabled }: Props): import("preact").JSX.Element;
export { UserChosenIcon };

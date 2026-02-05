/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentMessageItem } from './ComponentMessage';
import { type TestIdProps } from "../hooks/UNSAFE_useTestId";
/**
 * Props for the ComponentMessaging component
 */
type Props = TestIdProps & {
    /**
     * The label of the field which is showing this error
     */
    fieldLabel?: string;
    /**
     * Data for the messages. This data is used for rendering each message.
     */
    messages?: ComponentMessageItem[];
};
export declare function ComponentMessageContainer({ fieldLabel, messages, testId }: Props): import("preact").JSX.Element;
export {};

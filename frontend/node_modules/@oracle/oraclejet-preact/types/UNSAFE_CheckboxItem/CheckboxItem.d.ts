/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentProps } from 'preact';
import { InlineUserAssistance } from "../UNSAFE_UserAssistance";
type InlineUserAssistanceProps = ComponentProps<typeof InlineUserAssistance>;
type Props = {
    /**
     * Text that describes the checkbox item value.
     */
    children: string;
    /**
     * Text to provide guidance to help the user understand what data to enter.
     */
    assistiveText?: InlineUserAssistanceProps['assistiveText'];
    /**
     * Help source URL associated with the component.
     */
    helpSourceLink?: InlineUserAssistanceProps['helpSourceLink'];
    /**
     * Custom text to be rendered for the `helpSourceLink`.
     */
    helpSourceText?: InlineUserAssistanceProps['helpSourceText'];
    /**
     * Value of the checkbox item.
     */
    value: string | number;
};
/**
 * CheckboxItem is a child component of CheckboxSet. It contains the checkbox, label, and assistive text.
 */
declare const CheckboxItem: ({ children, value, assistiveText, helpSourceLink, helpSourceText }: Props) => import("preact").JSX.Element;
export { CheckboxItem };

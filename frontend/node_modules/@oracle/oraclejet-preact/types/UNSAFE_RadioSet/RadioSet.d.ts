/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren, ComponentProps, Ref } from 'preact';
import { FocusableHandle } from '../hooks/UNSAFE_useFocusableTextField';
import { FlexboxProps } from '../utils/UNSAFE_interpolations/flexbox';
import { Size } from '../utils/UNSAFE_size';
import { ValueUpdateDetail } from '../utils/UNSAFE_valueUpdateDetail';
import { InlineUserAssistance, UserAssistanceDensityType } from '../UNSAFE_UserAssistance';
import { LayoutColumnSpan } from '../utils/UNSAFE_styles/Layout';
import type { TestIdProps } from "../hooks/UNSAFE_useTestId";
type InlineUserAssistanceProps = ComponentProps<typeof InlineUserAssistance>;
type Props = TestIdProps & {
    /**
     * The ID of an element (or space separated IDs of multiple elements) that
     * describes the input.
     */
    'aria-describedby'?: string;
    /**
     * Text to provide guidance to help the user understand what data to enter.
     */
    assistiveText?: InlineUserAssistanceProps['assistiveText'];
    /**
     * RadioItem
     */
    children: ComponentChildren;
    /**
     * Specifies how many columns to span in a FormLayout with direction === 'row'
     */
    columnSpan?: LayoutColumnSpan;
    /**
     * layout direction of the children elements
     */
    direction?: FlexboxProps['direction'];
    /**
     * Help source URL associated with the component.
     */
    helpSourceLink?: InlineUserAssistanceProps['helpSourceLink'];
    /**
     * Custom text to be rendered for the <code>helpSourceLink</code>.
     */
    helpSourceText?: InlineUserAssistanceProps['helpSourceText'];
    /**
     * Specifies whether the radio set requires a selection to be made.
     */
    isRequired?: boolean;
    /**
     * Specifies if the radio set is read-only.
     */
    isReadonly?: boolean;
    /**
     * Specifies if the radio set is disabled.
     */
    isDisabled?: boolean;
    /**
     * Label text for the group of radio items.
     *
     */
    label: string;
    /**
     * Specifies where the label is positioned relative to the field.
     */
    labelEdge?: 'none' | 'top' | 'start' | 'inside';
    /**
     * Specifies the width of the label when <code>labelEdge</code> is <code>"start"</code>.
     */
    labelStartWidth?: Size;
    /**
     * Messages to show on screen that are associated with the component.
     */
    messages?: InlineUserAssistanceProps['messages'];
    /**
     * Callback invoked each time the user changes selected option.
     */
    onCommit: (detail: ValueUpdateDetail<string | number | undefined>) => void;
    /**
     * Specifies the density of the user assistance presentation.  It can be set to:
     * <ul>
     * <li><code>'reflow'</code>: Show inline.  Layout will reflow when text is displayed.</li>
     * <li><code>'efficient'</code>: Show inline and reserve space to prevent layout reflow when user
     * assistance text is displayed.</li>
     * <li><code>'compact'</code>: Show inline and reserve space to prevent layout reflow when user
     * assistance text is displayed.</li>
     * </ul>
     */
    userAssistanceDensity?: UserAssistanceDensityType;
    /**
     * Value of the radio option.
     */
    value?: string | number;
};
/**
 * A radio set allows the user to select one option from a set of mutually exclusive options.
 */
export declare const RadioSet: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<Props> & {
    ref?: Ref<FocusableHandle> | undefined;
}>;
export {};

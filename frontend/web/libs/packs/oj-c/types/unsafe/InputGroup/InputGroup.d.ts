/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { type ComponentChildren, type JSX } from 'preact';
import type { UnpackSignals } from '@oracle/oraclejet-preact/utils/UNSAFE_attributeUtils';
import { InlineUserAssistance } from '@oracle/oraclejet-preact/UNSAFE_UserAssistance';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { DisplayOptions, Help, HelpHints } from '../../editable-value/UNSAFE_useAssistiveText/useAssistiveText';
type InlineUserAssistanceProps = Parameters<typeof InlineUserAssistance>[0];
type Props = Pick<UnpackSignals<JSX.HTMLAttributes>, 'aria-describedby' | 'id' | 'onBlur' | 'onFocus'> & {
    /**
     * @description
     * Currently allowed children are SelectSingle, InputText, and InputNumber
     *
     * @ojmetadata description "Currently allowed children SelectSingle, InputText, InputNumber"
     * @ojmetadata displayName "Children"
     * @ojmetadata help "#children"
     * @ignore
     */
    children: ComponentChildren;
    /**
     * @description
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     * @ojmetadata description "Specifies whether an ancestor container, like oj-c-form-layout, is readonly."
     * @ojmetadata displayName "Container Readonly"
     * @ojmetadata help "#containerReadonly"
     * @ignore
     */
    containerReadonly?: boolean;
    /**
     * @description
     * Specifies whether the wrapping component is disabled in order to suppress assistive text from being displayed.
     * Individual inputs will still need to have their own disabled prop set.
     * @ojmetadata description "Specifies whether the wrapping component is disabled in order to suppress assistive text from being displayed."
     * @ojmetadata displayName "Disabled"
     * @ojmetadata help "#disabled"
     * @default false
     * @ignore
     */
    disabled?: boolean;
    /**
     * @description
     * The ID applied to the assistive text and aria-describedby within the inputs
     *
     * @ojmetadata description "The ID applied to the assistive text and aria-describedby within the inputs"
     * @ojmetadata displayName "Assist ID"
     * @ojmetadata help "#userAssistanceId"
     * @ignore
     */
    userAssistanceId: string;
    /**
     * @description
     * Represents a hint for rendering a label on the component.
     * This is used in combination with the label-edge attribute to control how the label should be rendered.
     *
     * @ojmetadata description "Represents a hint for rendering a label on the component."
     * @ojmetadata displayName "Label Hint"
     * @ojmetadata help "#labelHint"
     * @ojmetadata translatable
     * @ignore
     */
    labelHint: string;
    /**
     * @description
     * Specifies how the label of the component is positioned when the label-hint
     * attribute is set on the component.
     *
     * @ojmetadata description "Specifies how the label is positioned for the component"
     * @ojmetadata displayName "Label Edge"
     * @ojmetadata help "#labelEdge"
     * @ojmetadata propertyEditorValues {
     *   "none": {
     *     "description": "The component will not create a label, but instead set the aria-label property on the input element.",
     *     "displayName": "None"
     *   },
     *   "start": {
     *     "description": "The label will be placed before the start of the component.",
     *     "displayName": "Start"
     *   },
     *   "inside": {
     *     "description": "To support form layout with inside label, this label will be placed on top of the component.",
     *     "displayName": "Inside"
     *   },
     *   "top": {
     *     "description": "The label will be placed on top of the component.",
     *     "displayName": "Top"
     *   }
     * }
     * @ignore
     */
    labelEdge?: 'start' | 'top' | 'inside' | 'none';
    /**
     * @description
     * <p> The width of the label when labelEdge is 'start'.</p>
     * <p> This attribute accepts values of type
     * <code>0 | `--${string}` | `${number}%` | `${number}x` | `calc(${string})`</code></p>
     *
     * @ojmetadata description "The width of the label when labelEdge is 'start'."
     * @ojmetadata displayName "Label Start Width"
     * @ojmetadata help "#labelStartWidth"
     * @ignore
     */
    labelStartWidth?: Size;
    /**
     * @deprecated
     * @ojmetadata status [
     *   {
     *     type: "deprecated",
     *     since: "18.0.0",
     *     description: "Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value."
     *   }
     * ]
     * @ojmetadata description "Should the labels wrap or truncate when there is not enough available space."
     * @ojmetadata displayName "Label Wrapping"
     * @ojmetadata help "#labelWrapping"
     * @ojmetadata propertyEditorValues {
     *   "truncate": {
     *     "description": "Label will truncate if needed.",
     *     "displayName": "Truncate"
     *   },
     *   "wrap": {
     *     "description": "Label will wrap if needed.",
     *     "displayName": "Wrap"
     *   }
     * }
     * @ignore
     */
    labelWrapping?: 'truncate' | 'wrap';
    /**
     * @description
     *
     * @ojmetadata description "Data for the messages. This data is used for rendering each message."
     * @ojmetadata displayName "Messages"
     * @ojmetadata help "#messages"
     * @ignore
     */
    messagesCustom?: InlineUserAssistanceProps['messages'];
    /**
     * @description
     * Whether the InputGroup is readonly. This does not effect the individual inputs. This is used
     * to determine if assistive text is displayed.
     *
     * @ojmetadata description "Whether the InputGroup is readonly"
     * @ojmetadata displayName "Readonly"
     * @ojmetadata help "#readonly"
     */
    readonly?: boolean;
    /**
     * @description
     * Specifies whether to show an indicator on screen that a value is required, for example
     * before the user has committed a value.
     *
     * @ojmetadata description "Specifies whether "required" indicator is shown."
     * @ojmetadata displayName "isRequiredShown"
     * @ojmetadata help "#isRequiredShown"
     * @ignore
     */
    isRequiredShown?: boolean;
    /**
     * @description
     * Display options for auxiliary content that determines whether or not it should be displayed.
     *
     * @ojmetadata description "Display options for auxiliary content that determines whether or not it should be displayed."
     * @ojmetadata displayName "Display Options"
     * @ojmetadata help "#displayOptions"
     * @ignore
     */
    displayOptions?: DisplayOptions;
    /**
     * @description
     * Form component help information.
     *
     * @ojmetadata description "Form component help information."
     * @ojmetadata displayName "Help"
     * @ojmetadata help "#help"
     * @ignore
     */
    help?: Help;
    /**
     * @description
     * The helpHints object contains a definition property and a source property.
     *
     * @ojmetadata description "The helpHints object contains a definition property and a source property."
     * @ojmetadata displayName "Help Hints"
     * @ojmetadata help "#helpHints"
     * @ignore
     */
    helpHints?: HelpHints;
    /**
     * @description
     * Specifies the density of the user assistance presentation.  It can be set to:
     * <ul>
     * <li><code>'efficient'</code>: Show inline and reserve space to prevent layout reflow when user
     * assistance text is displayed.</li>
     * <li><code>'reflow'</code>: Show inline.  Layout will reflow when text is displayed.</li>
     * </ul>
     *
     * @ojmetadata description "Specifies the density of the user assistance presentation."
     * @ojmetadata displayName "User Assistance Density"
     * @ojmetadata help "#userAssistanceDensity"
     * @ignore
     */
    userAssistanceDensity?: 'reflow' | 'efficient';
};
/**
 * @ojmetadata pack "oj-c"
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "Input Group"
 * @ojmetadata description "Layout component for grouping multiple inputs"
 * @ignore
 */
declare function InputGroup({ id, children, labelHint, displayOptions, help, helpHints, readonly, containerReadonly, labelWrapping, labelStartWidth, onBlur, onFocus, isRequiredShown, userAssistanceId, messagesCustom, disabled, labelEdge: labelEdgeProp, userAssistanceDensity: userAssistanceDensityProp, ...otherProps }: Props): JSX.Element;
export { InputGroup };

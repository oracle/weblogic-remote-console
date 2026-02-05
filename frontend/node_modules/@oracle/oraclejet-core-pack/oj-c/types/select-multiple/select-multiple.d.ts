/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { SelectMultiple as PreactSelectMultiple } from '@oracle/oraclejet-preact/UNSAFE_SelectMultiple';
import type { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { type LayoutColumnSpan } from '@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout';
import { type DisplayOptions, type Help, type HelpHints } from 'oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText';
import type { ItemContext } from 'ojs/ojcommontypes';
import type { DataProvider, Item, TextFilter } from 'ojs/ojdataprovider';
import type { ImmutableKeySet } from 'ojs/ojkeyset';
import { type ExtendGlobalProps, type ObservedGlobalProps, type PropertyChanged, type ReadOnlyPropertyChanged, type TemplateSlot } from 'ojs/ojvcomponent';
import type { ComponentProps, Ref, ComponentChildren } from 'preact';
import 'css!oj-c/select-multiple/select-multiple-styles.css';
type PreactSelectMultipleProps = ComponentProps<typeof PreactSelectMultiple>;
/**
 * Display options for auxiliary content that determines whether or not it should be displayed.
 */
type DisplayOptionsProps = Omit<DisplayOptions, 'converterHint' | 'validatorHint'>;
type ItemTemplateContext<K extends string | number, D extends Record<string, any>> = Pick<Parameters<NonNullable<PreactSelectMultipleProps['itemRenderer']>>[0], 'searchText'> & {
    /**
     * Contains the data and metadata of the item.
     */
    item: Item<K, D>;
    /**
     * Selected keys.
     * This property should be wired up to the selected-keys attribute of oj-c-selector.
     */
    selectedKeys: ImmutableKeySet<K>;
    /**
     * Callback to notify when selected keys have changed via user interaction with oj-c-selector.
     * This callback should be wired up to the on-selected-keys-changed attribute of
     * oj-c-selector.
     */
    onSelectedKeysChanged: PropertyChanged<ImmutableKeySet<K>> | ((event: CustomEvent<{
        value: ImmutableKeySet<K>;
    }>) => void);
};
export type CollectionTemplateContext<K extends string | number, D extends Record<string, any>> = {
    /**
     * A data provider that provide information including data and metadata to the collection.
     */
    data?: DataProvider<K, D> | null;
    /**
     * The text entered by the user for filtering the collection data. This can be used for highlighting the matches.
     */
    searchText?: string;
    /**
     * This property can be used to set the current focused row/item in the collection.
     */
    currentRowOverride?: {
        rowKey: K;
    };
    /**
     * A callback function to be called to let the select component know that the current row is changed by a user interaction.
     * @param detail The detail containing the new current row.
     */
    onCurrentRowChanged: (detail: {
        rowKey?: K;
    }) => void;
    /**
     * This property provides the selected row/item for the collection component.
     */
    selected: ImmutableKeySet<K>;
    /**
     * A callback function to be called to let the select component know that the selection is changed by a user interaction.
     * @param detail The detail containing the current selection.
     */
    onSelectedChanged: (detail: {
        value?: ImmutableKeySet<K>;
    }) => void;
};
/**
 * Various supported valid states
 */
type ValidState = 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
/**
 * The properties of the SelectMultiple component
 */
type Props<K extends string | number, D extends Record<string, any>> = ObservedGlobalProps<'aria-describedby' | 'id'> & {
    /**
     * @description
     * <p>The <code class="prettyprint">collectionTemplate</code> slot is used to specify the template
     * for rendering items in the dropdown.
     * The slot must be a &lt;template> element containing a child core-pack collection element (e.g. &lt;oj-c-table/>).
     * <p>When the template is executed, it will have access to the binding context
     * containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the collection. (See the table
     * below for a list of properties available on $current)</li>
     *  <li>alias - if the data-oj-as attribute was specified on the template, the value will be
     * used to provide an application-named alias for $current.</li>
     * </ul>
     * <p>If no <code class="prettyprint">collectionTemplate</code> is specified, the component will check whether an
     * <code class="prettyprint">itemTemplate</code> is specified. Otherwise, the component will
     * render based on the value of the <code class="prettyprint">itemText</code> property.</p>
     * <p>Note: The collectionTemplate currently only supports oj-c-table. The oj-c-list-view will be supported in
     * forthcoming versions.</p>
     *
     * @ojmetadata description "The collectionTemplate slot is used to specify the template for rendering the items in the dropdown."
     * @ojmetadata displayName "collectionTemplate"
     * @ojmetadata help "#collectionTemplate"
     * @ojmetadata maxItems 1
     * @ojmetadata preferredContent ["CTableElement"]
     */
    collectionTemplate?: TemplateSlot<CollectionTemplateContext<K, D>>;
    /**
     * @description
     * Specifies how many columns this component should span.
     * This only takes effect when this component is a child of a form layout
     * that has direction 'row'.
     *
     * @ojmetadata description Specifies how many columns this component should span.
     * @ojmetadata displayName "Column Span"
     * @ojmetadata help "#columnSpan"
     */
    columnSpan?: LayoutColumnSpan;
    /**
     * @description
     * Specifies whether an ancestor container, like oj-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     * This is also currently used to determine if there is an ancestor container by checking if the value
     * is not equal to undefined.
     * @ojmetadata description "Specifies whether an ancestor container, like oj-c-form-layout, is readonly."
     * @ojmetadata displayName "Container Readonly"
     * @ojmetadata help "#containerReadonly"
     */
    containerReadonly?: boolean;
    /**
     * @description
     * The data for the Select Multiple.
     *
     * @ojmetadata description "The data source for SelectMultiple."
     * @ojmetadata displayName "Data"
     * @ojmetadata help "#data"
     * @ojmetadata extension {
     *   "webelement": {
     *     "exceptionStatus": [
     *       {
     *         "type": "deprecated",
     *         "since": "15.0.0",
     *         "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
     *       }
     *     ]
     *   }
     * }
     */
    data?: DataProvider<K, D> | null;
    /**
     * @description
     * Whether the component is disabled. The default is false.
     *
     * <p>
     * When the <code class="prettyprint">disabled</code> property changes due to programmatic
     * intervention, the component may clear messages and run validation in some cases. </br>
     * <ul>
     * <li>when a required component is initialized as disabled
     * <code class="prettyprint">value="{{currentValue}}" required disabled</code>,
     * deferred validation is skipped.</li>
     * <li>when a disabled component is enabled,
     *  <ul>
     *  <li>if component is invalid and showing messages then all component messages are cleared,
     *  and full validation run using the display value.
     *   <ul>
     *    <li>if there are validation errors, they are shown.</li>
     *    <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *    property is updated. Page authors can listen to the <code class="prettyprint">valueChanged</code>
     *    event to clear custom errors.</li>
     *   </ul>
     *  </li>
     *
     *  <li>if component is valid and has no errors then deferred validation is run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated. </li>
     *    </ul>
     *  </li>
     *  <li>if component is invalid and deferred errors then component messages are cleared and
     *  deferred validation re-run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated.</li>
     *    </ul>
     *  </li>
     *  </ul>
     * </li>
     * <li>when enabled component is disabled then no validation is run and the component appears
     * disabled.</li>
     * </ul>
     * </p>
     *
     * @ojmetadata description "Specifies whether the component is disabled."
     * @ojmetadata displayName "Disabled"
     * @ojmetadata help "#disabled"
     */
    disabled?: boolean;
    /**
     * @description
     * Display options for auxiliary content that determines whether or not it should be displayed.
     *
     * @ojmetadata description "Display options for auxiliary content that determines whether or not it should be displayed."
     * @ojmetadata displayName "Display Options"
     * @ojmetadata help "#displayOptions"
     */
    displayOptions?: DisplayOptionsProps;
    /**
     * @description
     * Form component help information.
     *
     * @ojmetadata description "Form component help information."
     * @ojmetadata displayName "Help"
     * @ojmetadata help "#help"
     */
    help?: Help;
    /**
     * @description
     * The helpHints object contains a definition property and a source property.
     *
     * @ojmetadata description "The helpHints object contains a definition property and a source property."
     * @ojmetadata displayName "Help Hints"
     * @ojmetadata help "#helpHints"
     */
    helpHints?: HelpHints;
    /**
     * @description
     * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template
     * for rendering each item in the dropdown list.
     * The slot must be a &lt;template> element.
     * <p>When the template is executed for each item, it will have access to the binding context
     * containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item. (See the table
     * below for a list of properties available on $current)</li>
     *  <li>alias - if the data-oj-as attribute was specified on the template, the value will be
     * used to provide an application-named alias for $current.</li>
     * </ul>
     * <p>If no <code class="prettyprint">itemTemplate</code> is specified, the component will
     * render based on the value of the <code class="prettyprint">itemText</code> property.</p>
     *
     * @ojmetadata description "The itemTemplate slot is used to specify the template for rendering each item in the dropdown. See the Help documentation for more information."
     * @ojmetadata displayName "itemTemplate"
     * @ojmetadata help "#itemTemplate"
     * @ojmetadata maxItems 1
     */
    itemTemplate?: TemplateSlot<ItemTemplateContext<K, D>>;
    /**
     * @description
     * Specifies how to get the text string to render for a data item.
     * This attribute can be set to either:
     * <ul>
     * <li>a string that specifies the name of a top level data attribute to render as text, or</li>
     * <li>a callback function that takes a properties object and returns the text string to
     * display</li>
     * </ul>
     *
     * <p>This text will be rendered for the selected value of the component and for each data item
     * in the dropdown.  When rendered for the dropdown items, default matching search term
     * highlighting will be applied.</p>
     *
     * @ojmetadata description "Specifies how to get the text string to render for a data item."
     * @ojmetadata displayName "Item Text"
     * @ojmetadata help "#itemText"
     * @ojmetadata required
     */
    itemText: keyof D | ((itemContext: ItemContext<K, D>) => string);
    /**
     * @description
     * Specifies how the label of the component is positioned when the label-hint
     * attribute is set on the component.
     *
     * @ojmetadata description "Specifies how the label is positioned for the component"
     * @ojmetadata displayName "Label Edge"
     * @ojmetadata help "#labelEdge"
     * @ojmetadata propertyEditorValues {
     *   "inside": {
     *     "description": "The label floats over the input element, but moves up on focus or when the component has a value (default, if unspecified).",
     *     "displayName": "Inside"
     *   },
     *   "none": {
     *     "description": "The component will not create a label, but instead set the aria-label property on the input element.",
     *     "displayName": "None"
     *   },
     *   "start": {
     *     "description": "The label will be placed before the start of the component.",
     *     "displayName": "Start"
     *   },
     *   "top": {
     *     "description": "The label will be placed on top of the component.",
     *     "displayName": "Top"
     *   }
     * }
     */
    labelEdge?: PreactSelectMultipleProps['labelEdge'];
    /**
     * @description
     * Represents a hint for rendering a label on the component.
     * This is used in combination with the label-edge attribute to control how the label should be rendered.
     *
     * @ojmetadata description "Represents a hint for rendering a label on the component."
     * @ojmetadata displayName "Label Hint"
     * @ojmetadata help "#labelHint"
     * @ojmetadata required
     * @ojmetadata translatable
     */
    labelHint: string;
    /**
     * @description
     * <p> The width of the label when labelEdge is 'start'.</p>
     * <p> This attribute accepts values of type
     * <code>0 | `--${string}` | `${number}%` | `${number}x` | `calc(${string})`</code></p>
     *
     * @ojmetadata description The width of the label when labelEdge is 'start'
     * @ojmetadata displayName "Label Start Width"
     * @ojmetadata help "#labelStartWidth"
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
     */
    labelWrapping?: 'truncate' | 'wrap';
    /**
     * @description
     * The list of <a href="TextFilter.html#matchBy">TextFilter.matchBy</a> behaviors to use
     * when fetching data filtered by a user's typed search text, in order of descending priority
     * with the preferred behavior first.
     * If the preferred behavior is not supported by the DataProvider, then the component will
     * check the next behavior, and so on, until it finds one that is supported.
     * If none of the specified behaviors are supported or if this property is not specified,
     * then the behavior will effectively be "unknown".
     *
     * @ojmetadata description "List of text filter matching behaviors to use when filtering."
     * @ojmetadata displayName "Match By"
     * @ojmetadata help "#matchBy"
     */
    matchBy?: Array<TextFilter<D>['matchBy']> | null;
    /**
     * @description
     * Specifies the component's max width.  If unset, the default max width is 100%.
     *
     * @ojmetadata description "The max width of the control."
     * @ojmetadata displayName "Max Width"
     * @ojmetadata help "#maxWidth"
     */
    maxWidth?: 'sm' | 'md' | Size;
    /**
     * @description
     * List of messages an app would add to the component when it has business/custom validation
     * errors that it wants the component to show. This allows the app to perform further validation
     * before sending data to the server. When this option is set the message shows to the
     * user right away. To clear the custom message, set <code class="prettyprint">messagesCustom</code>
     * back to an empty array.<br/>
     * <p>
     * See the <a href="#validation-section">Validation and Messages</a> section
     * for details on when the component clears <code class="prettyprint">messagesCustom</code>;
     * for example, when full validation is run.
     * </p>
     *
     * @ojmetadata description "List of custom component messages"
     * @ojmetadata displayName "Messages Custom"
     * @ojmetadata help "#messagesCustom"
     */
    messagesCustom?: PreactSelectMultipleProps['messages'];
    /**
     * @description
     * The placeholder text to set on the element.
     *
     * @ojmetadata description "The placeholder text to set on the element."
     * @ojmetadata displayName "Placeholder"
     * @ojmetadata help "#placeholder"
     * @ojmetadata translatable
     */
    placeholder?: string;
    /**
     * @description
     * <p>
     * Whether the component is readonly. The readonly property sets or returns whether an element
     * is readonly, or not. A readonly element cannot be modified. However, a user can tab to it,
     * highlight it, focus on it, and copy the text from it. If you want to prevent the user from
     * interacting with the element, use the disabled property instead.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were false.
     * </p>
     *
     * @ojmetadata description "Whether the component is readonly"
     * @ojmetadata displayName "Readonly"
     * @ojmetadata help "#readonly"
     */
    readonly?: boolean;
    /**
     * @description
     * <p>
     * Specifies which user assistance types should be shown when the component is readonly.
     * </p>
     *
     * @ojmetadata description "Specifies which user assistance types should be shown when the component is readonly."
     * @ojmetadata displayName "ReadonlyUserAssistanceShown"
     * @ojmetadata help "#readonlyUserAssistanceShown"
     */
    readonlyUserAssistanceShown?: 'confirmationAndInfoMessages' | 'none';
    /**
     * @description
     * <p>
     * This property set to <code class="prettyprint">false</code> implies that a value is not required to be provided by the user.
     * This is the default.
     * This property set to <code class="prettyprint">true</code> implies that a value is required to be provided by the user.
     * </p>
     * <p>
     * In the Redwood theme, by default, a Required text is rendered inline when the field is empty.
     * If user-assistance-density is 'compact', it will show on the label as an icon.
     * </p>
     * <p>The Required error text is based on Redwood UX designs, and it is not recommended that
     * it be changed.
     * To override the required error message,
     * use the <code class="prettyprint">required-message-detail</code> attribute.
     * The component's label text is passed in as a token {label} and can be used in the message detail.
     * </p>
     * <p>When required is set to true, an implicit
     * required validator is created, i.e.,
     * <code class="prettyprint">new RequiredValidator()</code>. The required validator is the only
     * validator to run during initial render, and its error is not shown to the user at this time;
     * this is called deferred validation. The required validator also runs during normal validation;
     * this is when the errors are shown to the user.
     * See the <a href="#validation-section">Validation and Messaging</a> section for details.
     * </p>
     * <p>
     * When the <code class="prettyprint">required</code> property changes due to programmatic intervention,
     * the component may clear component messages and run validation, based on the current state it's in. </br>
     *
     * <h4>Running Validation when required property changes</h4>
     * <ul>
     * <li>if component is valid when required is set to true, then it runs deferred validation on
     * the value property. If the field is empty, the valid state is invalidHidden. No errors are
     * shown to the user.
     * </li>
     * <li>if component is valid when required is set from true to false, then no validation is run.
     * </li>
     * <li>if component is invalid and has deferred messages (invalidHidden) when required is set to false, then
     * component messages are cleared (messages-custom messages are not cleared)
     * but no deferred validation is run because required is false.
     * </li>
     * <li>if component is invalid and currently showing invalid messages (invalidShown) when required is changed
     * to either true or false, then
     * component messages are cleared and normal validation is run using the current display value.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated and the error is shown.
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event on the component to clear custom errors.</li>
     * </ul>
     * </li>
     * </ul>
     *
     * <h4>Clearing Messages when required property changes</h4>
     * <ul>
     * <li>Only messages created by the component, like validation messages, are cleared when the required property changes.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     *
     * </p>
     *
     * @ojmetadata description "Specifies whether or not the component is required."
     * @ojmetadata displayName "Required"
     * @ojmetadata help "#required"
     */
    required?: boolean;
    /**
     * @description
     * <p>
     * The component-specific message detail when the required validation fails.
     * If the component needs a required validation error message that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     *
     * @ojmetadata description "Overrides the default Required error message."
     * @ojmetadata displayName "Required Message Detail"
     * @ojmetadata help "#requiredMessageDetail"
     * @ojmetadata translatable
     */
    requiredMessageDetail?: string;
    /**
     * @description
     * Specifies how the text is aligned within the text field
     *
     * @ojmetadata description "Specifies how the text is aligned within the text field"
     * @ojmetadata displayName "Text Align"
     * @ojmetadata help "#textAlign"
     * @ojmetadata propertyEditorValues {
     *   "start": {
     *     "description": "Aligns text left when reading direction is ltr and right when reading direction is rtl (default, if unspecified).",
     *     "displayName": "Start"
     *   },
     *   "end": {
     *     "description": "Aligns text right when reading direction is ltr and left when reading direction is rtl.",
     *     "displayName": "End"
     *   },
     *   "right": {
     *     "description": "Aligns text right regardless of reading direction, often used for numbers.",
     *     "displayName": "Right"
     *   }
     * }
     */
    textAlign?: PreactSelectMultipleProps['textAlign'];
    /**
     * @description
     * <p>
     * Specifies the density of the form component's user assistance presentation. It can be shown inline with
     * reserved rows to prevent reflow if a user assistance text shows up, inline without reserved rows that would
     * reflow if a user assistance text shows up, or it can be shown compactly in a popup instead.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were "reflow".
     * </p>
     *
     * @ojmetadata description "Specifies the density of the form component's user assistance presentation."
     * @ojmetadata displayName "User Assistance Density"
     * @ojmetadata help "#userAssistanceDensity"
     * @ojmetadata propertyEditorValues {
     *   "reflow": {
     *     "description": "Messages, help, hints, and required are all shown inline under the field with no reserved space.",
     *     "displayName": "Reflow"
     *   },
     *   "efficient": {
     *     "description": "Messages, help, hints, and required are all shown inline under the field with reserved space.",
     *     "displayName": "Efficient"
     *   },
     *   "compact": {
     *     "description": "Messages, help, hints, and required will not be shown inline; they will show in a mode that keeps the screen more compact, like a popup for the messages, and a required icon to indicate Required.",
     *     "displayName": "Compact"
     *   }
     * }
     */
    userAssistanceDensity?: PreactSelectMultipleProps['userAssistanceDensity'];
    /**
     * @description
     * The value of the component. Set value to null to initialize the component with
     * no selected value or to clear the selected value.
     *
     * <p>
     * When the <code class="prettyprint">value</code> property changes due to programmatic
     * intervention, the component always clears all messages
     * including <code class="prettyprint">messagesCustom</code>, runs deferred validation, and
     * always refreshes the UI display value.</br>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>component always runs deferred validation; the
     * <code class="prettyprint">valid</code> property is updated with the result.</li>
     * </ul>
     * </p>
     *
     * @ojmetadata description "The value of the component."
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     */
    value?: Set<K> | null;
    /**
     * @description
     * The <code class="prettyprint">valueItems</code> is similar to the
     * <code class="prettyprint">value</code>, but is a map of objects that
     * contain both a key and data, and optional metadata.
     * The keys will be set as the <code class="prettyprint">value</code> of the element.
     * The <code class="prettyprint">value</code> and <code class="prettyprint">valueItems</code>
     * are kept in sync, both during programmatic property sets as well as during interactive user
     * selection.
     * If initially both are set, the selected values in the <code class="prettyprint">value</code>
     * attribute have precedence.
     * <p>Note: If there is an initial selection, setting it via the
     * <code class="prettyprint">valueItems</code> attribute initially can improve page load
     * performance because the element will not have to fetch the selected data from the data
     * provider.</p>
     * <p>If <code class="prettyprint">valueItems</code> is not specified or the selected value is
     * missing, then the selected data will be fetched from the data provider.</p>
     *
     * @ojmetadata description "The current value of the element and its associated data."
     * @ojmetadata displayName "Value Items"
     * @ojmetadata help "#valueItems"
     */
    valueItems?: Map<K, ItemContext<K, D>> | null;
    /**
     * @description
     * The type of virtual keyboard to display for entering a value on mobile browsers. This attribute has no effect on desktop browsers.
     *
     * @ojmetadata description "The type of virtual keyboard to display for entering a value on mobile browsers"
     * @ojmetadata displayName "Virtual Keyboard"
     * @ojmetadata help "#virtualKeyboard"
     * @ojmetadata propertyEditorValues {
     *   "number": {
     *     "description": "Use a mobile virtual keyboard for entering numbers. Note that on Android and Windows Mobile, the 'number' keyboard does not contain the minus sign. This value should not be used on fields that accept negative values.",
     *     "displayName": "Number"
     *   },
     *   "auto": {
     *     "description": "The component will determine the best mobile virtual keyboard to use (default, if unspecified).",
     *     "displayName": "Auto"
     *   },
     *   "email": {
     *     "description": "Use a mobile virtual keyboard for entering email addresses.",
     *     "displayName": "Email"
     *   },
     *   "search": {
     *     "description": "Use a mobile virtual keyboard for entering search terms.",
     *     "displayName": "Search"
     *   },
     *   "tel": {
     *     "description": "Use a mobile virtual keyboard for entering telephone numbers.",
     *     "displayName": "Tel"
     *   },
     *   "text": {
     *     "description": "Use a mobile virtual keyboard for entering text.",
     *     "displayName": "Text"
     *   },
     *   "url": {
     *     "description": "Use a mobile virtual keyboard for URL entry.",
     *     "displayName": "URL"
     *   }
     * }
     */
    virtualKeyboard?: PreactSelectMultipleProps['virtualKeyboard'];
    /**
     * @description
     * Specifies the component's width.  If unset, the default width is 100%.
     * Note that by default max-width is 100%, which will override the width if the container is smaller than the width specified.
     *
     * @ojmetadata description "The width of the control."
     * @ojmetadata displayName "Width"
     * @ojmetadata help "#width"
     */
    width?: 'sm' | 'md' | Size;
    /**
     * @ojmetadata description Writeback support for the messagesCustom property
     * @ojmetadata displayName "Messages Custom"
     * @ojmetadata help "#messagesCustom"
     */
    onMessagesCustomChanged?: PropertyChanged<PreactSelectMultipleProps['messages']>;
    /**
     * @description
     * <p>
     * The current valid state of the component. It is evaluated on initial render.
     * It is re-evaluated
     * <ul>
     *   <li>after each validator (validators or async-validators) is run (full or deferred)</li>
     *   <li>when messagesCustom is updated,
     *   since messagesCustom can be added by the app developer any time.</li>
     *   <li>when showMessages() is called. Since showMessages() moves the
     *   hidden messages into messages shown,
     *   if the valid state was "invalidHidden" then it would become "invalidShown".</li>
     *   <li>when the required property has changed. If a component is empty and has required
     *   set, the valid state may be "invalidHidden" (if no invalid messages are being shown as well).
     *   If required property is removed, the valid state would change to "valid".</li>
     * </ul>
     * </p>
     * <p>
     *  Note: New valid states may be added to the list of valid values in future releases.
     *  Any new values will start with "invalid"
     *  if it is an invalid state, "pending" if it is pending state,
     *  and "valid" if it is a valid state.
     * </p>
     *
     * @ojmetadata description "Specifies how the valid state of the component"
     * @ojmetadata displayName "Valid"
     * @ojmetadata help "#valid"
     * @ojmetadata propertyEditorValues {
     *   "valid": {
     *     "description": "The component is valid",
     *     "displayName": "Valid"
     *   },
     *   "pending": {
     *     "description": "The component is waiting for the validation state to be determined. The 'pending' state is set at the start of the convert/validate process.",
     *     "displayName": "Pending"
     *   },
     *   "invalidHidden": {
     *     "description": "The component has invalid messages hidden and no invalid messages showing. An invalid message is one with severity 'error'.",
     *     "displayName": "Invalid Hidden"
     *   },
     *   "invalidShown": {
     *     "description": "The component has invalid messages showing. An invalid message is one with severity 'error'.",
     *     "displayName": "Invalid Shown"
     *   }
     * }
     */
    onValidChanged?: ReadOnlyPropertyChanged<ValidState>;
    /**
     * @ojmetadata description Writeback support for the value property
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     */
    onValueChanged?: PropertyChanged<Set<K> | null | undefined>;
    /**
     * @ojmetadata description Writeback support for the valueItems property
     * @ojmetadata displayName "ValueItems"
     * @ojmetadata help "#valueItems"
     */
    onValueItemsChanged?: PropertyChanged<Map<K, ItemContext<K, D>> | null | undefined>;
};
type SelectMultipleHandle<K> = {
    /**
     * @ojmetadata description "Blurs the input field."
     * @ignore
     */
    blur: () => void;
    /**
     * @ojmetadata description "Focuses the input field."
     * @ignore
     */
    focus: () => void;
    /**
     * Takes all deferred messages and shows them.
     * It then updates the valid property;
     * e.g., if the valid state was "invalidHidden" before showMessages(),
     * the valid state will become "invalidShown" after showMessages().
     * If there were no deferred messages this method simply returns.
     * @ojmetadata description "Takes all deferred messages and shows them."
     */
    showMessages: () => void;
    /**
     * Resets the component by clearing all messages and messagesCustom attribute
     * and updates the component's display value using the attribute value.
     * User entered values will be erased when this method is called.
     * @ojmetadata description "Resets the component by clearing all messages
     * and updating the component's display value using the attribute value."
     */
    reset: () => void;
    /**
     * If enabled, validates the component's display value using the converter and
     * all validators registered on the component and updates the value
     * option by performing the following steps.
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app.</li>
     * <li>
     *  If no converter is present then processing continues to next step. If a converter is present,
     *  the UI value is first converted (i.e., parsed). If there is a parse error then the messages are shown.
     * </li>
     * <li>
     *  If there are no validators setup for the component the value option is updated using the display value.
     *  Otherwise all validators are run in sequence using the parsed value from the previous step.
     *  The implicit required validator is run first if the component is marked required.
     *  When a validation error is encountered it is remembered and the next validator in the sequence is run.
     * </li>
     * <li>
     *  At the end of validation if there are errors, the messages are shown.
     *  If there were no errors, then the value option is updated.
     * </li>
     * </ol>
     * <p>If the component is readonly or disabled, returns a Promise that resolves to 'valid'
     * without doing any validation.</p>
     * @returns Promise resolves to "valid" if there were no converter parse errors and the component
     *          passed all validations. The Promise resolves to "valid" if the component is disabled or readonly.
     *          The Promise resolves to "invalid" if there were converter
     *          parse errors or if there were validation errors.
     *
     * @ojmetadata description "If enabled, validates the component's display value using the converter and all validators
     * registered on the component. The Promise resolves to 'valid' if there were no converter parse errors and the component
     * passed all validations, or if the component is disabled or readonly."
     */
    validate: () => Promise<'valid' | 'invalid'>;
    /**
     * @ojmetadata description "This method imitates an option selection from the dropdown by using keys of
     * items from the options. This is used by the WebElement implementation of oj-c-select-multiple."
     * @param {Set<K> | null} value The value to be selected
     * @return {Promise} A Promise that resolves once the operation is completed
     * @ignore
     */
    _selectItemsByValue: (value: Set<K> | null) => Promise<void>;
    /**
     * This is an UNSAFE method that focuses the select component and opens the dropdown
     * @ignore
     */
    UNSAFE_focusAndOpenDropdown: () => void;
};
/**
 * This export corresponds to the SelectMultiple Preact component. For the oj-c-select-multiple custom element, import CSelectMultipleElement instead.
 */
export declare const SelectMultiple: <K extends string | number = string | number, D extends Record<string, any> = Record<string, any>>(props: ExtendGlobalProps<Props<K, D>> & {
    ref?: Ref<SelectMultipleHandle<K>>;
}) => ComponentChildren;
export type SelectMultipleProps<K extends string | number, D extends Record<string, any>> = Props<K, D>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-select-multiple custom element. For the SelectMultiple Preact component, import SelectMultiple instead.
 */
export interface CSelectMultipleElement<K extends string | number, D extends Record<string, any>> extends JetElement<CSelectMultipleElementSettableProperties<K, D>>, CSelectMultipleElementSettableProperties<K, D> {
    /**
     * <p>
     * The current valid state of the component. It is evaluated on initial render.
     * It is re-evaluated
     * <ul>
     *   <li>after each validator (validators or async-validators) is run (full or deferred)</li>
     *   <li>when messagesCustom is updated,
     *   since messagesCustom can be added by the app developer any time.</li>
     *   <li>when showMessages() is called. Since showMessages() moves the
     *   hidden messages into messages shown,
     *   if the valid state was "invalidHidden" then it would become "invalidShown".</li>
     *   <li>when the required property has changed. If a component is empty and has required
     *   set, the valid state may be "invalidHidden" (if no invalid messages are being shown as well).
     *   If required property is removed, the valid state would change to "valid".</li>
     * </ul>
     * </p>
     * <p>
     *  Note: New valid states may be added to the list of valid values in future releases.
     *  Any new values will start with "invalid"
     *  if it is an invalid state, "pending" if it is pending state,
     *  and "valid" if it is a valid state.
     * </p>
     */
    readonly valid?: Parameters<Required<Props<K, D>>['onValidChanged']>[0];
    addEventListener<T extends keyof CSelectMultipleElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: CSelectMultipleElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CSelectMultipleElementSettableProperties<K, D>>(property: T): CSelectMultipleElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CSelectMultipleElementSettableProperties<K, D>>(property: T, value: CSelectMultipleElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CSelectMultipleElementSettableProperties<K, D>>): void;
    setProperties(properties: CSelectMultipleElementSettablePropertiesLenient<K, D>): void;
    /**
     * This is an UNSAFE method that focuses the select component and opens the dropdown
     */
    UNSAFE_focusAndOpenDropdown: () => void;
    _selectItemsByValue: (value: Set<K> | null) => Promise<void>;
    blur: () => void;
    focus: () => void;
    /**
     * Resets the component by clearing all messages and messagesCustom attribute
     * and updates the component's display value using the attribute value.
     * User entered values will be erased when this method is called.
     */
    reset: () => void;
    /**
     * Takes all deferred messages and shows them.
     * It then updates the valid property;
     * e.g., if the valid state was "invalidHidden" before showMessages(),
     * the valid state will become "invalidShown" after showMessages().
     * If there were no deferred messages this method simply returns.
     */
    showMessages: () => void;
    /**
     * If enabled, validates the component's display value using the converter and
     * all validators registered on the component and updates the value
     * option by performing the following steps.
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app.</li>
     * <li>
     *  If no converter is present then processing continues to next step. If a converter is present,
     *  the UI value is first converted (i.e., parsed). If there is a parse error then the messages are shown.
     * </li>
     * <li>
     *  If there are no validators setup for the component the value option is updated using the display value.
     *  Otherwise all validators are run in sequence using the parsed value from the previous step.
     *  The implicit required validator is run first if the component is marked required.
     *  When a validation error is encountered it is remembered and the next validator in the sequence is run.
     * </li>
     * <li>
     *  At the end of validation if there are errors, the messages are shown.
     *  If there were no errors, then the value option is updated.
     * </li>
     * </ol>
     * <p>If the component is readonly or disabled, returns a Promise that resolves to 'valid'
     * without doing any validation.</p>
     */
    validate: () => Promise<'invalid' | 'valid'>;
}
declare namespace _CSelectMultipleElementTypes {
    type _CollectionTemplateContext<K extends string | number, D extends Record<string, any>> = CollectionTemplateContext<K, D>;
    type _ItemTemplateContext<K extends string | number, D extends Record<string, any>> = ItemTemplateContext<K, D>;
}
export namespace CSelectMultipleElement {
    type columnSpanChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['columnSpan']>;
    type containerReadonlyChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['containerReadonly']>;
    type dataChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['data']>;
    type disabledChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['disabled']>;
    type displayOptionsChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['displayOptions']>;
    type helpChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['help']>;
    type helpHintsChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['helpHints']>;
    type itemTextChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['itemText']>;
    type labelEdgeChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['labelEdge']>;
    type labelHintChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['labelHint']>;
    type labelStartWidthChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['labelStartWidth']>;
    type labelWrappingChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['labelWrapping']>;
    type matchByChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['matchBy']>;
    type maxWidthChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['maxWidth']>;
    type messagesCustomChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['messagesCustom']>;
    type placeholderChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['placeholder']>;
    type readonlyChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['readonly']>;
    type readonlyUserAssistanceShownChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['readonlyUserAssistanceShown']>;
    type requiredChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['required']>;
    type requiredMessageDetailChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['requiredMessageDetail']>;
    type textAlignChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['textAlign']>;
    type userAssistanceDensityChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['userAssistanceDensity']>;
    type validChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['valid']>;
    type valueChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['value']>;
    type valueItemsChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['valueItems']>;
    type virtualKeyboardChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['virtualKeyboard']>;
    type widthChanged<K extends string | number, D extends Record<string, any>> = JetElementCustomEventStrict<CSelectMultipleElement<K, D>['width']>;
    type CollectionTemplateContext<K extends string | number, D extends Record<string, any>> = _CSelectMultipleElementTypes._CollectionTemplateContext<K, D>;
    type RenderCollectionTemplate<K extends string | number, D extends Record<string, any>> = import('ojs/ojvcomponent').TemplateSlot<CollectionTemplateContext<K, D>>;
    type ItemTemplateContext<K extends string | number, D extends Record<string, any>> = _CSelectMultipleElementTypes._ItemTemplateContext<K, D>;
    type RenderItemTemplate<K extends string | number, D extends Record<string, any>> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
}
export interface CSelectMultipleElementEventMap<K extends string | number, D extends Record<string, any>> extends HTMLElementEventMap {
    'columnSpanChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['columnSpan']>;
    'containerReadonlyChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['containerReadonly']>;
    'dataChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['data']>;
    'disabledChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['disabled']>;
    'displayOptionsChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['displayOptions']>;
    'helpChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['help']>;
    'helpHintsChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['helpHints']>;
    'itemTextChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['itemText']>;
    'labelEdgeChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['labelEdge']>;
    'labelHintChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['labelHint']>;
    'labelStartWidthChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['labelStartWidth']>;
    'labelWrappingChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['labelWrapping']>;
    'matchByChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['matchBy']>;
    'maxWidthChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['maxWidth']>;
    'messagesCustomChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['messagesCustom']>;
    'placeholderChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['placeholder']>;
    'readonlyChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['readonly']>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['readonlyUserAssistanceShown']>;
    'requiredChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['required']>;
    'requiredMessageDetailChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['requiredMessageDetail']>;
    'textAlignChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['textAlign']>;
    'userAssistanceDensityChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['userAssistanceDensity']>;
    'validChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['valid']>;
    'valueChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['value']>;
    'valueItemsChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['valueItems']>;
    'virtualKeyboardChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['virtualKeyboard']>;
    'widthChanged': JetElementCustomEventStrict<CSelectMultipleElement<K, D>['width']>;
}
export interface CSelectMultipleElementSettableProperties<K extends string | number, D extends Record<string, any>> extends JetSettableProperties {
    /**
     * Specifies how many columns this component should span.
     * This only takes effect when this component is a child of a form layout
     * that has direction 'row'.
     */
    columnSpan?: Props<K, D>['columnSpan'];
    /**
     * Specifies whether an ancestor container, like oj-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     * This is also currently used to determine if there is an ancestor container by checking if the value
     * is not equal to undefined.
     */
    containerReadonly?: Props<K, D>['containerReadonly'];
    /**
     * The data for the Select Multiple.
     */
    data?: Props<K, D>['data'];
    /**
     * Whether the component is disabled. The default is false.
     *
     * <p>
     * When the <code class="prettyprint">disabled</code> property changes due to programmatic
     * intervention, the component may clear messages and run validation in some cases. </br>
     * <ul>
     * <li>when a required component is initialized as disabled
     * <code class="prettyprint">value="{{currentValue}}" required disabled</code>,
     * deferred validation is skipped.</li>
     * <li>when a disabled component is enabled,
     *  <ul>
     *  <li>if component is invalid and showing messages then all component messages are cleared,
     *  and full validation run using the display value.
     *   <ul>
     *    <li>if there are validation errors, they are shown.</li>
     *    <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *    property is updated. Page authors can listen to the <code class="prettyprint">valueChanged</code>
     *    event to clear custom errors.</li>
     *   </ul>
     *  </li>
     *
     *  <li>if component is valid and has no errors then deferred validation is run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated. </li>
     *    </ul>
     *  </li>
     *  <li>if component is invalid and deferred errors then component messages are cleared and
     *  deferred validation re-run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated.</li>
     *    </ul>
     *  </li>
     *  </ul>
     * </li>
     * <li>when enabled component is disabled then no validation is run and the component appears
     * disabled.</li>
     * </ul>
     * </p>
     */
    disabled?: Props<K, D>['disabled'];
    /**
     * Display options for auxiliary content that determines whether or not it should be displayed.
     */
    displayOptions?: Props<K, D>['displayOptions'];
    /**
     * Form component help information.
     */
    help?: Props<K, D>['help'];
    /**
     * The helpHints object contains a definition property and a source property.
     */
    helpHints?: Props<K, D>['helpHints'];
    /**
     * Specifies how to get the text string to render for a data item.
     * This attribute can be set to either:
     * <ul>
     * <li>a string that specifies the name of a top level data attribute to render as text, or</li>
     * <li>a callback function that takes a properties object and returns the text string to
     * display</li>
     * </ul>
     *
     * <p>This text will be rendered for the selected value of the component and for each data item
     * in the dropdown.  When rendered for the dropdown items, default matching search term
     * highlighting will be applied.</p>
     */
    itemText: Props<K, D>['itemText'];
    /**
     * Specifies how the label of the component is positioned when the label-hint
     * attribute is set on the component.
     */
    labelEdge?: Props<K, D>['labelEdge'];
    /**
     * Represents a hint for rendering a label on the component.
     * This is used in combination with the label-edge attribute to control how the label should be rendered.
     */
    labelHint: Props<K, D>['labelHint'];
    /**
     * <p> The width of the label when labelEdge is 'start'.</p>
     * <p> This attribute accepts values of type
     * <code>0 | `--${string}` | `${number}%` | `${number}x` | `calc(${string})`</code></p>
     */
    labelStartWidth?: Props<K, D>['labelStartWidth'];
    /**
     * @deprecated since 18.0.0  - Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value.
     */
    labelWrapping?: Props<K, D>['labelWrapping'];
    /**
     * The list of <a href="TextFilter.html#matchBy">TextFilter.matchBy</a> behaviors to use
     * when fetching data filtered by a user's typed search text, in order of descending priority
     * with the preferred behavior first.
     * If the preferred behavior is not supported by the DataProvider, then the component will
     * check the next behavior, and so on, until it finds one that is supported.
     * If none of the specified behaviors are supported or if this property is not specified,
     * then the behavior will effectively be "unknown".
     */
    matchBy?: Props<K, D>['matchBy'];
    /**
     * Specifies the component's max width.  If unset, the default max width is 100%.
     */
    maxWidth?: Props<K, D>['maxWidth'];
    /**
     * List of messages an app would add to the component when it has business/custom validation
     * errors that it wants the component to show. This allows the app to perform further validation
     * before sending data to the server. When this option is set the message shows to the
     * user right away. To clear the custom message, set <code class="prettyprint">messagesCustom</code>
     * back to an empty array.<br/>
     * <p>
     * See the <a href="#validation-section">Validation and Messages</a> section
     * for details on when the component clears <code class="prettyprint">messagesCustom</code>;
     * for example, when full validation is run.
     * </p>
     */
    messagesCustom?: Props<K, D>['messagesCustom'];
    /**
     * The placeholder text to set on the element.
     */
    placeholder?: Props<K, D>['placeholder'];
    /**
     * <p>
     * Whether the component is readonly. The readonly property sets or returns whether an element
     * is readonly, or not. A readonly element cannot be modified. However, a user can tab to it,
     * highlight it, focus on it, and copy the text from it. If you want to prevent the user from
     * interacting with the element, use the disabled property instead.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were false.
     * </p>
     */
    readonly?: Props<K, D>['readonly'];
    /**
     * <p>
     * Specifies which user assistance types should be shown when the component is readonly.
     * </p>
     */
    readonlyUserAssistanceShown?: Props<K, D>['readonlyUserAssistanceShown'];
    /**
     * <p>
     * This property set to <code class="prettyprint">false</code> implies that a value is not required to be provided by the user.
     * This is the default.
     * This property set to <code class="prettyprint">true</code> implies that a value is required to be provided by the user.
     * </p>
     * <p>
     * In the Redwood theme, by default, a Required text is rendered inline when the field is empty.
     * If user-assistance-density is 'compact', it will show on the label as an icon.
     * </p>
     * <p>The Required error text is based on Redwood UX designs, and it is not recommended that
     * it be changed.
     * To override the required error message,
     * use the <code class="prettyprint">required-message-detail</code> attribute.
     * The component's label text is passed in as a token {label} and can be used in the message detail.
     * </p>
     * <p>When required is set to true, an implicit
     * required validator is created, i.e.,
     * <code class="prettyprint">new RequiredValidator()</code>. The required validator is the only
     * validator to run during initial render, and its error is not shown to the user at this time;
     * this is called deferred validation. The required validator also runs during normal validation;
     * this is when the errors are shown to the user.
     * See the <a href="#validation-section">Validation and Messaging</a> section for details.
     * </p>
     * <p>
     * When the <code class="prettyprint">required</code> property changes due to programmatic intervention,
     * the component may clear component messages and run validation, based on the current state it's in. </br>
     *
     * <h4>Running Validation when required property changes</h4>
     * <ul>
     * <li>if component is valid when required is set to true, then it runs deferred validation on
     * the value property. If the field is empty, the valid state is invalidHidden. No errors are
     * shown to the user.
     * </li>
     * <li>if component is valid when required is set from true to false, then no validation is run.
     * </li>
     * <li>if component is invalid and has deferred messages (invalidHidden) when required is set to false, then
     * component messages are cleared (messages-custom messages are not cleared)
     * but no deferred validation is run because required is false.
     * </li>
     * <li>if component is invalid and currently showing invalid messages (invalidShown) when required is changed
     * to either true or false, then
     * component messages are cleared and normal validation is run using the current display value.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated and the error is shown.
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event on the component to clear custom errors.</li>
     * </ul>
     * </li>
     * </ul>
     *
     * <h4>Clearing Messages when required property changes</h4>
     * <ul>
     * <li>Only messages created by the component, like validation messages, are cleared when the required property changes.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     *
     * </p>
     */
    required?: Props<K, D>['required'];
    /**
     * <p>
     * The component-specific message detail when the required validation fails.
     * If the component needs a required validation error message that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     */
    requiredMessageDetail?: Props<K, D>['requiredMessageDetail'];
    /**
     * Specifies how the text is aligned within the text field
     */
    textAlign?: Props<K, D>['textAlign'];
    /**
     * <p>
     * Specifies the density of the form component's user assistance presentation. It can be shown inline with
     * reserved rows to prevent reflow if a user assistance text shows up, inline without reserved rows that would
     * reflow if a user assistance text shows up, or it can be shown compactly in a popup instead.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were "reflow".
     * </p>
     */
    userAssistanceDensity?: Props<K, D>['userAssistanceDensity'];
    /**
     * The value of the component. Set value to null to initialize the component with
     * no selected value or to clear the selected value.
     *
     * <p>
     * When the <code class="prettyprint">value</code> property changes due to programmatic
     * intervention, the component always clears all messages
     * including <code class="prettyprint">messagesCustom</code>, runs deferred validation, and
     * always refreshes the UI display value.</br>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>component always runs deferred validation; the
     * <code class="prettyprint">valid</code> property is updated with the result.</li>
     * </ul>
     * </p>
     */
    value?: Props<K, D>['value'];
    /**
     * The <code class="prettyprint">valueItems</code> is similar to the
     * <code class="prettyprint">value</code>, but is a map of objects that
     * contain both a key and data, and optional metadata.
     * The keys will be set as the <code class="prettyprint">value</code> of the element.
     * The <code class="prettyprint">value</code> and <code class="prettyprint">valueItems</code>
     * are kept in sync, both during programmatic property sets as well as during interactive user
     * selection.
     * If initially both are set, the selected values in the <code class="prettyprint">value</code>
     * attribute have precedence.
     * <p>Note: If there is an initial selection, setting it via the
     * <code class="prettyprint">valueItems</code> attribute initially can improve page load
     * performance because the element will not have to fetch the selected data from the data
     * provider.</p>
     * <p>If <code class="prettyprint">valueItems</code> is not specified or the selected value is
     * missing, then the selected data will be fetched from the data provider.</p>
     */
    valueItems?: Props<K, D>['valueItems'];
    /**
     * The type of virtual keyboard to display for entering a value on mobile browsers. This attribute has no effect on desktop browsers.
     */
    virtualKeyboard?: Props<K, D>['virtualKeyboard'];
    /**
     * Specifies the component's width.  If unset, the default width is 100%.
     * Note that by default max-width is 100%, which will override the width if the container is smaller than the width specified.
     */
    width?: Props<K, D>['width'];
}
export interface CSelectMultipleElementSettablePropertiesLenient<K extends string | number, D extends Record<string, any>> extends Partial<CSelectMultipleElementSettableProperties<K, D>> {
    [key: string]: any;
}
export interface SelectMultipleIntrinsicProps extends Partial<Readonly<CSelectMultipleElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    valid?: never;
    children?: import('preact').ComponentChildren;
    oncolumnSpanChanged?: (value: CSelectMultipleElementEventMap<any, any>['columnSpanChanged']) => void;
    oncontainerReadonlyChanged?: (value: CSelectMultipleElementEventMap<any, any>['containerReadonlyChanged']) => void;
    ondataChanged?: (value: CSelectMultipleElementEventMap<any, any>['dataChanged']) => void;
    ondisabledChanged?: (value: CSelectMultipleElementEventMap<any, any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: CSelectMultipleElementEventMap<any, any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: CSelectMultipleElementEventMap<any, any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: CSelectMultipleElementEventMap<any, any>['helpHintsChanged']) => void;
    onitemTextChanged?: (value: CSelectMultipleElementEventMap<any, any>['itemTextChanged']) => void;
    onlabelEdgeChanged?: (value: CSelectMultipleElementEventMap<any, any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: CSelectMultipleElementEventMap<any, any>['labelHintChanged']) => void;
    onlabelStartWidthChanged?: (value: CSelectMultipleElementEventMap<any, any>['labelStartWidthChanged']) => void;
    /** @deprecated since 18.0.0 */ onlabelWrappingChanged?: (value: CSelectMultipleElementEventMap<any, any>['labelWrappingChanged']) => void;
    onmatchByChanged?: (value: CSelectMultipleElementEventMap<any, any>['matchByChanged']) => void;
    onmaxWidthChanged?: (value: CSelectMultipleElementEventMap<any, any>['maxWidthChanged']) => void;
    onmessagesCustomChanged?: (value: CSelectMultipleElementEventMap<any, any>['messagesCustomChanged']) => void;
    onplaceholderChanged?: (value: CSelectMultipleElementEventMap<any, any>['placeholderChanged']) => void;
    onreadonlyChanged?: (value: CSelectMultipleElementEventMap<any, any>['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: CSelectMultipleElementEventMap<any, any>['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: CSelectMultipleElementEventMap<any, any>['requiredChanged']) => void;
    onrequiredMessageDetailChanged?: (value: CSelectMultipleElementEventMap<any, any>['requiredMessageDetailChanged']) => void;
    ontextAlignChanged?: (value: CSelectMultipleElementEventMap<any, any>['textAlignChanged']) => void;
    onuserAssistanceDensityChanged?: (value: CSelectMultipleElementEventMap<any, any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: CSelectMultipleElementEventMap<any, any>['validChanged']) => void;
    onvalueChanged?: (value: CSelectMultipleElementEventMap<any, any>['valueChanged']) => void;
    onvalueItemsChanged?: (value: CSelectMultipleElementEventMap<any, any>['valueItemsChanged']) => void;
    onvirtualKeyboardChanged?: (value: CSelectMultipleElementEventMap<any, any>['virtualKeyboardChanged']) => void;
    onwidthChanged?: (value: CSelectMultipleElementEventMap<any, any>['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-select-multiple': SelectMultipleIntrinsicProps;
        }
    }
}

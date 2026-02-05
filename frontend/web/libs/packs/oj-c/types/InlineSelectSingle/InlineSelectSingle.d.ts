/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren, Ref } from 'preact';
import type { ItemContext } from 'ojs/ojcommontypes';
import type { DataProvider, TextFilter } from 'ojs/ojdataprovider';
import type { HelpHints } from 'oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText';
import type { Data, InlineSelectHandle, ItemRendererContext, ItemText, Key, ValueActionPayload } from './types';
export type InlineSelectSingleProps<V extends Key, D extends Data> = {
    /**
     * Specifies the aria-describedby on the rendered component.
     */
    'aria-describedby'?: string;
    /**
     * Specifies whether the back icon should be shown.
     * <ul>
     * <li><code>'always'</code>: The back icon is always visible.</li>
     * <li><code>'never'</code>: The back icon is never visible.</li>
     * </ul>
     * @default 'never'
     */
    backIcon?: 'always' | 'never';
    /**
     * Specifies whether the clear icon should be shown.
     * <ul>
     * <li><code>'conditional'</code>: The clear icon is visible if the component has a non-empty value.</li>
     * <li><code>'never'</code>: The clear icon is never visible.</li>
     * </ul>
     * @default 'never'
     */
    clearIcon?: 'conditional' | 'never';
    /**
     * The data for the Inline Select Single.
     */
    data?: DataProvider<V, D>;
    /**
     * The helpHints object contains definition, source, and sourceText properties used for
     * specifying user assistance information.
     */
    helpHints?: HelpHints;
    /**
     * The <code class="prettyprint">itemRenderer</code> is used to specify the custom
     * rendering for each item in the dropdown list.
     * If no <code class="prettyprint">itemRenderer</code> is specified, the component will
     * render based on the value of the <code class="prettyprint">itemText</code> property.
     */
    itemRenderer?: (context: ItemRendererContext<V, D>) => ComponentChildren;
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
     * in the dropdown. When rendered for the dropdown items, default matching search term
     * highlighting will be applied.</p>
     */
    itemText: ItemText<V, D>;
    /**
     * Represents a hint for rendering a label on the component.
     */
    labelHint: string;
    /**
     * The list of TextFilter.matchBy behaviors to use when fetching data filtered by a user's
     * typed search text, in order of descending priority with the preferred behavior first.
     * If the preferred behavior is not supported by the DataProvider, then the component will
     * check the next behavior, and so on, until it finds one that is supported.
     * If none of the specified behaviors are supported or if this property is not specified,
     * then the behavior will effectively be "unknown".
     */
    matchBy?: Array<TextFilter<D>['matchBy']>;
    /**
     * The placeholder text to set on the component.
     */
    placeholder?: string;
    /**
     * Specifies how the text is aligned within the text field.
     */
    textAlign?: 'start' | 'end' | 'right';
    /**
     * Specifies where the UserAssistance should be placed.
     * @default 'belowList'
     */
    userAssistancePosition?: 'aboveList' | 'belowList';
    /**
     * The value of the component.
     */
    value?: V | null;
    /**
     * The <code class="prettyprint">valueItem</code> is similar to the
     * <code class="prettyprint">value</code>, but is an object that
     * contains both a key and data, and optional metadata.
     * The key will be set as the <code class="prettyprint">value</code> of the component.
     * The <code class="prettyprint">value</code> and <code class="prettyprint">valueItem</code>
     * are kept in sync, both during programmatic property sets as well as during interactive user
     * selection.
     * If initially both are set, the selected value in the <code class="prettyprint">value</code>
     * attribute has precedence.
     * <p>Note: If there is an initial selection, setting it via the
     * <code class="prettyprint">valueItem</code> attribute initially can improve page load
     * performance because the component will not have to fetch the selected data from the data
     * provider.</p>
     * <p>If <code class="prettyprint">valueItem</code> is not specified or the selected value is
     * missing, then the selected data will be fetched from the data provider.</p>
     */
    valueItem?: ItemContext<V, D> | null;
    /**
     * The type of virtual keyboard to display for entering a value on mobile browsers.
     * This attribute has no effect on desktop browsers.
     */
    virtualKeyboard?: 'auto' | 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';
    /**
     * Called when one clicks on the back icon.
     * Note: Only applicable when `backIcon` is set to 'always'.
     */
    onBackIconAction?: () => void;
    /**
     * Callback when a value is submitted by the user, even if the value is the same as the previous value.
     */
    onValueAction?: (detail: ValueActionPayload<V, D>) => void;
    /**
     * Callback when the value property is changed.
     */
    onValueChanged?: (value: V | null) => void;
    /**
     * Callback when the value item property is changed.
     */
    onValueItemChanged?: (value: ItemContext<V, D> | null) => void;
};
/**
 * An Inline Select Single component for selecting a value from a list of values for the
 * Ask Oracle complex filter chip.
 */
export declare const InlineSelectSingle: {
    <K extends Key, D extends Data>(props: InlineSelectSingleProps<K, D> & {
        ref?: Ref<InlineSelectHandle>;
    }): JSX.Element;
};

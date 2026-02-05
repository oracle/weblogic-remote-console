import { LabelledLink as PreactLabelledLink } from '@oracle/oraclejet-preact/UNSAFE_LabelledLink';
import { LayoutColumnSpan } from '@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout';
import { Action, ExtendGlobalProps, ObservedGlobalProps } from 'ojs/ojvcomponent';
import { ComponentProps, ComponentType, Ref } from 'preact';
import 'css!oj-c/labelled-link/labelled-link-styles.css';
type PreactLabelledLinkProps = ComponentProps<typeof PreactLabelledLink>;
type LabelledLinkHandle = {
    /**
     * @ojmetadata description "Blurs the link."
     * @ignore
     */
    blur: () => void;
    /**
     * @ojmetadata description "Focuses the link."
     * @ignore
     */
    focus: () => void;
};
/**
 * The properties of the LabelledLink component
 */
export type LabelledLinkProps = ObservedGlobalProps<'aria-describedby'> & {
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
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     * @ojmetadata description "Specifies whether an ancestor container, like oj-c-form-layout, is readonly."
     * @ojmetadata displayName "Container Readonly"
     * @ojmetadata help "#containerReadonly"
     */
    containerReadonly?: boolean;
    /**
     * @description
     * Specifies the URL that the link points to. If the href is provided, clicking the link
     * will trigger the default browser behavior and will open the link. The
     * <code class="prettyprint">ojAction</code> event will not be triggered. If the href property is
     * not provided, then the default browser behavior will be prevented and the
     * <code class="prettyprint">ojAction</code> event will be triggered.
     * @ojmetadata description "Sets the URL that the link points to."
     * @ojmetadata displayName "Href"
     * @ojmetadata help "#href"
     */
    href?: PreactLabelledLinkProps['href'];
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
     *     "description": "The label will be placed inside the component and above the link (default, if unspecified).",
     *     "displayName": "Inside"
     *   },
     *   "none": {
     *     "description": "The component will not create a label, but instead set the aria-labelledby property on the anchor element.",
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
    labelEdge?: PreactLabelledLinkProps['labelEdge'];
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
    labelHint: PreactLabelledLinkProps['label'];
    /**
     * @description
     * <p> The width of the label when labelEdge is 'start'.</p>
     * <p> This attribute accepts values of type
     * <code>0 | `--${string}` | `${number}%` | `${number}x` | `calc(${string})`</code></p>
     *
     * @ojmetadata description "The width of the label when labelEdge is 'start'."
     * @ojmetadata displayName "Label Start Width"
     * @ojmetadata help "#labelStartWidth"
     */
    labelStartWidth?: PreactLabelledLinkProps['labelStartWidth'];
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
     * @ojmetadata description "Sets the target attribute of the link."
     * @ojmetadata displayName "Target"
     * @ojmetadata help "#target"
     */
    target?: PreactLabelledLinkProps['target'];
    /**
     * @description
     * Specifies the text that should appear in the field. If this property
     * is not provided, then the URL provided using the <code class="prettyprint">href</code> property
     * will be used as the text in the field.
     * @ojmetadata description "Specifies the text that should appear in the field."
     * @ojmetadata displayName "Text"
     * @ojmetadata help "#text"
     */
    text?: PreactLabelledLinkProps['children'];
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
    textAlign?: PreactLabelledLinkProps['textAlign'];
    /**
     * This is temporary unsafe API for JET-52089. It enables a wrapper VComponent to pass
     * the id of an external label that it wants to associate with the inner input.
     *
     * @ignore
     */
    unsafe_labelledBy?: string;
    /**
     * @description
     * The component does not support any assistive text. But, this property can be used to specify
     * whether or not the component should reserve space to be consistent with the other form components
     * in the Form Layout.
     *
     * @ojmetadata description "Specifies the density of the form component's user assistance presentation."
     * @ojmetadata displayName "User Assistance Density"
     * @ojmetadata help "#userAssistanceDensity"
     * @ojmetadata propertyEditorValues {
     *   "reflow": {
     *     "description": "The field will not reserve any space.",
     *     "displayName": "Reflow"
     *   },
     *   "efficient": {
     *     "description": "The field will reserve space to prevent reflow.",
     *     "displayName": "Efficient"
     *   },
     *   "compact": {
     *     "description": "The field will not reserve any space.",
     *     "displayName": "Compact"
     *   }
     * }
     */
    userAssistanceDensity?: PreactLabelledLinkProps['userAssistanceDensity'];
    /**
     * @ojmetadata description "Triggered when the link is clicked, whether by keyboard, mouse,
     *    or touch events. This event is triggered only when the href is not provided. If the href
     *    is provided, clicking the link will not trigger this event."
     * @ojmetadata eventGroup "common"
     * @ojmetadata displayName "onOjAction"
     * @ojmetadata help "#event:action"
     */
    onOjAction?: Action;
};
/**
 * @classdesc
 * <h3 id="labelledLinkOverview-section">
 *   JET LabelledLink
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#labelledLinkOverview-section"></a>
 * </h3>
 *
 * <p>
 * Description: LabelledLink component can be used to render a readonly form control
 * field that has a link for its content.
 * </p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-c-labelled-link
 *   href="www.oracle.com"
 *   text="Website"
 *   label-hint="Labelled Link">
 * &lt;/oj-c-linked-link>
 * </code></pre>
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Link</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Sets focus to the link. Opens the link or invokes the ojAction event.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Link</td>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Set focus to the link.</td>
 *     </tr>
 *
 *      <tr>
 *       <td>Link</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Opens the link or invokes the ojAction event.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>
 * For accessibility, set the <a href="#labelHint">label-hint</a> property.
 * If there is no visible label, then to make this accessible to screen reader users,
 * set the <a href="#labelHint">label-hint</a> and <a href="#labelEdge">label-edge</a>='none'
 * which renders a visually hidden and screen-reader accessible label.
 * </p>
 *
 * @ojmetadata displayName "LabelledLink"
 * @ojmetadata description "The Labelled Link component displays a readonly field that has a link for its content."
 * @ojmetadata help "oj-c.LabelledLink.html"
 * @ojmetadata main "oj-c/labelled-link"
 * @ojmetadata status [
 *   {
 *     type: "production",
 *     since: "17.0.0"
 *   }
 * ]
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Forms"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/labelled-link",
 *     "defaultColumns": 6,
 *     "minColumns": 2,
 *     "componentPalette": {
 *       "visibility": "never"
 *     },
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-link",
 *     "uxSpecs": [
 *       "input-text"
 *     ]
 *   }
 * }
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "labelHint",
 *       "textAlign"
 *     ]
 *   },
 *   {
 *     "propertyGroup": "data",
 *     "items": [
 *       "href",
 *       "target",
 *       "text"
 *     ]
 *   }
 * ]
 * @ojmetadata since "16.0.0"
 */
declare const LabelledLinkImpl: (props: LabelledLinkProps, ref: Ref<LabelledLinkHandle>) => import("preact").JSX.Element;
/**
 * This export corresponds to the LabelledLink Preact component. For the oj-c-labelled-link custom element, import CLabelledLinkElement instead.
 */
export declare const LabelledLink: ComponentType<ExtendGlobalProps<ComponentProps<typeof LabelledLinkImpl>> & {
    ref?: Ref<LabelledLinkHandle>;
}>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-labelled-link custom element. For the LabelledLink Preact component, import LabelledLink instead.
 */
export interface CLabelledLinkElement extends JetElement<CLabelledLinkElementSettableProperties>, CLabelledLinkElementSettableProperties {
    addEventListener<T extends keyof CLabelledLinkElementEventMap>(type: T, listener: (this: HTMLElement, ev: CLabelledLinkElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CLabelledLinkElementSettableProperties>(property: T): CLabelledLinkElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CLabelledLinkElementSettableProperties>(property: T, value: CLabelledLinkElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CLabelledLinkElementSettableProperties>): void;
    setProperties(properties: CLabelledLinkElementSettablePropertiesLenient): void;
    blur: () => void;
    focus: () => void;
}
export namespace CLabelledLinkElement {
    interface ojAction extends CustomEvent<{}> {
    }
    type columnSpanChanged = JetElementCustomEventStrict<CLabelledLinkElement['columnSpan']>;
    type containerReadonlyChanged = JetElementCustomEventStrict<CLabelledLinkElement['containerReadonly']>;
    type hrefChanged = JetElementCustomEventStrict<CLabelledLinkElement['href']>;
    type labelEdgeChanged = JetElementCustomEventStrict<CLabelledLinkElement['labelEdge']>;
    type labelHintChanged = JetElementCustomEventStrict<CLabelledLinkElement['labelHint']>;
    type labelStartWidthChanged = JetElementCustomEventStrict<CLabelledLinkElement['labelStartWidth']>;
    type labelWrappingChanged = JetElementCustomEventStrict<CLabelledLinkElement['labelWrapping']>;
    type targetChanged = JetElementCustomEventStrict<CLabelledLinkElement['target']>;
    type textChanged = JetElementCustomEventStrict<CLabelledLinkElement['text']>;
    type textAlignChanged = JetElementCustomEventStrict<CLabelledLinkElement['textAlign']>;
    type unsafe_labelledByChanged = JetElementCustomEventStrict<CLabelledLinkElement['unsafe_labelledBy']>;
    type userAssistanceDensityChanged = JetElementCustomEventStrict<CLabelledLinkElement['userAssistanceDensity']>;
}
export interface CLabelledLinkElementEventMap extends HTMLElementEventMap {
    'ojAction': CLabelledLinkElement.ojAction;
    'columnSpanChanged': JetElementCustomEventStrict<CLabelledLinkElement['columnSpan']>;
    'containerReadonlyChanged': JetElementCustomEventStrict<CLabelledLinkElement['containerReadonly']>;
    'hrefChanged': JetElementCustomEventStrict<CLabelledLinkElement['href']>;
    'labelEdgeChanged': JetElementCustomEventStrict<CLabelledLinkElement['labelEdge']>;
    'labelHintChanged': JetElementCustomEventStrict<CLabelledLinkElement['labelHint']>;
    'labelStartWidthChanged': JetElementCustomEventStrict<CLabelledLinkElement['labelStartWidth']>;
    'labelWrappingChanged': JetElementCustomEventStrict<CLabelledLinkElement['labelWrapping']>;
    'targetChanged': JetElementCustomEventStrict<CLabelledLinkElement['target']>;
    'textChanged': JetElementCustomEventStrict<CLabelledLinkElement['text']>;
    'textAlignChanged': JetElementCustomEventStrict<CLabelledLinkElement['textAlign']>;
    'unsafe_labelledByChanged': JetElementCustomEventStrict<CLabelledLinkElement['unsafe_labelledBy']>;
    'userAssistanceDensityChanged': JetElementCustomEventStrict<CLabelledLinkElement['userAssistanceDensity']>;
}
export interface CLabelledLinkElementSettableProperties extends JetSettableProperties {
    /**
     * Specifies how many columns this component should span.
     * This only takes effect when this component is a child of a form layout
     * that has direction 'row'.
     */
    columnSpan?: LabelledLinkProps['columnSpan'];
    /**
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     */
    containerReadonly?: LabelledLinkProps['containerReadonly'];
    /**
     * Specifies the URL that the link points to. If the href is provided, clicking the link
     * will trigger the default browser behavior and will open the link. The
     * <code class="prettyprint">ojAction</code> event will not be triggered. If the href property is
     * not provided, then the default browser behavior will be prevented and the
     * <code class="prettyprint">ojAction</code> event will be triggered.
     */
    href?: LabelledLinkProps['href'];
    /**
     * Specifies how the label of the component is positioned when the label-hint
     * attribute is set on the component.
     */
    labelEdge?: LabelledLinkProps['labelEdge'];
    /**
     * Represents a hint for rendering a label on the component.
     * This is used in combination with the label-edge attribute to control how the label should be rendered.
     */
    labelHint: LabelledLinkProps['labelHint'];
    /**
     * <p> The width of the label when labelEdge is 'start'.</p>
     * <p> This attribute accepts values of type
     * <code>0 | `--${string}` | `${number}%` | `${number}x` | `calc(${string})`</code></p>
     */
    labelStartWidth?: LabelledLinkProps['labelStartWidth'];
    /**
     * @deprecated since 18.0.0  - Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value.
     */
    labelWrapping?: LabelledLinkProps['labelWrapping'];
    target?: LabelledLinkProps['target'];
    /**
     * Specifies the text that should appear in the field. If this property
     * is not provided, then the URL provided using the <code class="prettyprint">href</code> property
     * will be used as the text in the field.
     */
    text?: LabelledLinkProps['text'];
    /**
     * Specifies how the text is aligned within the text field
     */
    textAlign?: LabelledLinkProps['textAlign'];
    /**
     * This is temporary unsafe API for JET-52089. It enables a wrapper VComponent to pass
     * the id of an external label that it wants to associate with the inner input.
     */
    unsafe_labelledBy?: LabelledLinkProps['unsafe_labelledBy'];
    /**
     * The component does not support any assistive text. But, this property can be used to specify
     * whether or not the component should reserve space to be consistent with the other form components
     * in the Form Layout.
     */
    userAssistanceDensity?: LabelledLinkProps['userAssistanceDensity'];
}
export interface CLabelledLinkElementSettablePropertiesLenient extends Partial<CLabelledLinkElementSettableProperties> {
    [key: string]: any;
}
export interface LabelledLinkIntrinsicProps extends Partial<Readonly<CLabelledLinkElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAction?: (value: CLabelledLinkElementEventMap['ojAction']) => void;
    oncolumnSpanChanged?: (value: CLabelledLinkElementEventMap['columnSpanChanged']) => void;
    oncontainerReadonlyChanged?: (value: CLabelledLinkElementEventMap['containerReadonlyChanged']) => void;
    onhrefChanged?: (value: CLabelledLinkElementEventMap['hrefChanged']) => void;
    onlabelEdgeChanged?: (value: CLabelledLinkElementEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: CLabelledLinkElementEventMap['labelHintChanged']) => void;
    onlabelStartWidthChanged?: (value: CLabelledLinkElementEventMap['labelStartWidthChanged']) => void;
    /** @deprecated since 18.0.0 */ onlabelWrappingChanged?: (value: CLabelledLinkElementEventMap['labelWrappingChanged']) => void;
    ontargetChanged?: (value: CLabelledLinkElementEventMap['targetChanged']) => void;
    ontextChanged?: (value: CLabelledLinkElementEventMap['textChanged']) => void;
    ontextAlignChanged?: (value: CLabelledLinkElementEventMap['textAlignChanged']) => void;
    onunsafe_labelledByChanged?: (value: CLabelledLinkElementEventMap['unsafe_labelledByChanged']) => void;
    onuserAssistanceDensityChanged?: (value: CLabelledLinkElementEventMap['userAssistanceDensityChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-labelled-link': LabelledLinkIntrinsicProps;
        }
    }
}

import { ComponentType, ComponentProps, ComponentChildren } from 'preact';
import { FormLayout as PreactFormLayout } from '@oracle/oraclejet-preact/UNSAFE_FormLayout';
import { LayoutColumnSpan } from '@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout';
import { ExtendGlobalProps, ObservedGlobalProps } from 'ojs/ojvcomponent';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import 'css!oj-c/form-layout/form-layout-styles.css';
type PreactFormLayoutProps = ComponentProps<typeof PreactFormLayout>;
type Props = ObservedGlobalProps<'id'> & {
    /**
     * @ojmetadata description "The default slot is the content of the form layout. The oj-c-form-layout element expects core pack form component children for the default slot."
     * @ojmetadata displayName "default"
     * @ojmetadata help "#Default"
     */
    children: ComponentChildren;
    /**
     * @description
     * Specifies the absolute number of columns and overrides maxColumns, if the value is
     * positive. If the value is not positive, then this attribute is ignored and max-columns
     * is used to determine the number of columns. This attribute should only be used in
     * special circumstances where you need a specific number of columns even if the fields
     * will be narrower than the suggested minimum (a nested form layout is an example).
     *
     * @ojmetadata description "Specifies how many columns should be displayed (fixed). If positive, overrides maxColumns."
     * @ojmetadata displayName "Columns"
     * @ojmetadata help "#columns"
     */
    columns?: PreactFormLayoutProps['columns'] | 0;
    /**
     * @description
     * Specifies how many columns this component should span.
     * This only takes effect when this component is a child of a form layout
     * that has direction 'row'.
     *
     * @ojmetadata description "Specifies how many columns this component should span when this it is a child of a form layout."
     * @ojmetadata displayName "Column Span"
     * @ojmetadata help "#columnSpan"
     */
    columnSpan?: LayoutColumnSpan;
    /**
     * @description
     * Specifies if the child elements should be laid out column first or row first.
     *
     * @ojmetadata description "Specifies the layout direction of the form layout children."
     * @ojmetadata displayName "Direction"
     * @ojmetadata help "#direction"
     * @ojmetadata propertyEditorValues {
     *   "column": {
     *     "description": "Components are laid out in columns.",
     *     "displayName": "Column"
     *   },
     *   "row": {
     *     "description": "Components are laid out in rows.",
     *     "displayName": "Row"
     *   }
     * }
     */
    direction?: PreactFormLayoutProps['direction'];
    /**
     * @description
     * Indicates if the form layout will use 100% of the container's width, and will ignore the theme's max column width.
     *
     * @ojmetadata description "Indicates if the form layout will use 100% of the container's width."
     * @ojmetadata displayName "Full Width"
     * @ojmetadata help "#fullWidth"
     */
    fullWidth?: PreactFormLayoutProps['isFullWidth'];
    /**
     * @description
     * <p>
     * Specifies how the child form components should position their labels.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were 'inside'.
     * </p>
     * <p>
     * When using the oj-c-form-layout custom element inside of a VDOM application, this property will not propagate down to the child components.
     * This is because binding propagation is Knockout-based, and VDOM applications are not Knockout-based.
     * </p>
     *
     * @ojmetadata description "Specifies how the child form components should position their labels."
     * @ojmetadata displayName "Label Edge"
     * @ojmetadata help "#labelEdge"
     * @ojmetadata propertyEditorValues {
     *   "inside": {
     *     "description": "The label floats over the input element, but moves up on focus or when the component has a value (default, if unspecified).",
     *     "displayName": "Inside"
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
    labelEdge?: PreactFormLayoutProps['labelEdge'];
    /**
     * @description
     * <p> The width of the label when labelEdge is 'start'.</p>
     * <p> This attribute accepts values of type
     * <code>0 | `--${string}` | `${number}%` | `${number}x` | `calc(${string})`</code></p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were '33%'.
     * </p>
     * <p>
     * When using the oj-c-form-layout custom element inside of a VDOM application, this property will not propagate down to the child components.
     * This is because binding propagation is Knockout-based, and VDOM applications are not Knockout-based.
     * </p>
     * @ojmetadata description "The width of the label when labelEdge is 'start'."
     * @ojmetadata displayName "Label Start Width"
     * @ojmetadata help "#labelStartWidth"
     */
    labelStartWidth?: Size;
    /**
     * <p>
     * Should the labels wrap or truncate when there is not enough available space.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were 'wrap'.
     * </p>
     * <p>
     * When using the oj-c-form-layout custom element inside of a VDOM application, this property will not propagate down to the child components.
     * This is because binding propagation is Knockout-based, and VDOM applications are not Knockout-based.
     * </p>
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
    labelWrapping?: PreactFormLayoutProps['labelWrapping'];
    /**
     * @description
     * Specifies how many columns should be displayed.
     * This property is used when the actual number of columns rendered
     * is responsive and depends on the container's available width.
     * Note that maxColumns will be ignored if columns has a positive value.
     *
     * @ojmetadata description "Specifies how many columns should be displayed (responsive). This prop is ignored if columns has a positive value."
     * @ojmetadata displayName "Max Columns"
     * @ojmetadata help "#maxColumns"
     */
    maxColumns?: PreactFormLayoutProps['columns'];
    /**
     * @description
     * <p>
     * Whether the child components should be rendered as readonly.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were 'false'.
     * </p>
     * <p>
     * When using the oj-c-form-layout custom element inside of a VDOM application, this property will not propagate down to the child components.
     * This is because binding propagation is Knockout-based, and VDOM applications are not Knockout-based.
     * </p>
     *
     * @ojmetadata description "Whether the child components should be rendered as readonly."
     * @ojmetadata displayName "Readonly"
     * @ojmetadata help "#readonly"
     */
    readonly?: boolean;
    /**
     * @description
     * <p>
     * Specifies the density of the children form component's user assistance presentation. It can be shown inline with
     * reserved rows to prevent reflow if a user assistance text shows up, inline without reserved rows that would
     * reflow if a user assistance text shows up, or it can be shown compactly in a popup instead.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were "efficient".
     * </p>
     * <p>
     * When using the oj-c-form-layout custom element inside of a VDOM application, this property will not propagate down to the child components.
     * This is because binding propagation is Knockout-based, and VDOM applications are not Knockout-based.
     * </p>
     *
     * @ojmetadata description "Specifies the density of the children form component's user assistance presentation."
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
    userAssistanceDensity?: PreactFormLayoutProps['userAssistanceDensity'];
};
/**
 * @classdesc
 * <h3 id="formLayoutOverview-section">
 *   JET FormLayout Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#formLayoutOverview-section"></a>
 * </h3>
 *
 * <p>Description: The oj-c-form-layout component provides a responsive layout capability to lay out child
 * elements in the row or column direction where the number of columns displayed depends on the available
 * width of the container.  Child components are responsible for rendering the label with the alignment as
 * specified by the oj-c-form-layout's label-edge property, which the child components consume.</p>
 *
 * <pre class="prettyprint"><code>&lt;oj-c-form-layout columns="2">
 *   &ltoj-c-input-text label-hint="First Name">&lt/oj-c-input-text>
 *   &ltoj-c-input-text label-hint="Last Name">&lt/oj-c-input-text>
 *   &ltoj-c-input-text label-hint="address" column-span="2">&lt/oj-c-input-text>
 * &lt;/oj-c-form-layout></code></pre>
 *
 * @ojmetadata displayName "Form Layout"
 * @ojmetadata description "A form layout manages the layout of labels and fields in a form."
 * @ojmetadata help "oj-c.FormLayout.html"
 * @ojmetadata main "oj-c/form-layout"
 * @ojmetadata status [
 *   {
 *     type: "candidate",
 *     since: "17.0.0"
 *   }
 * ]
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Forms"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/form-layout",
 *     "defaultColumns": 6,
 *     "minColumns": 2
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-form-layout",
 *     "uxSpecs": [
 *       "form-layout"
 *     ]
 *   }
 * }
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "columns",
 *       "columnSpan",
 *       "direction",
 *       "labelEdge",
 *       "labelStartWidth",
 *       "labelWrapping",
 *       "maxColumns",
 *       "readonly",
 *       "userAssistanceDensity"
 *     ]
 *   }
 * ]
 * @ojmetadata requirements [
 *   {
 *     type: "anyOf",
 *     label: "accessibility",
 *     slots: [""]
 *   }
 * ]
 * @ojmetadata since "16.0.0"
 */
declare function FormLayoutImpl({ columns, columnSpan, direction, fullWidth, id, maxColumns, ...otherProps }: Props): import("preact").JSX.Element;
/**
 * This export corresponds to the FormLayout Preact component. For the oj-c-form-layout custom element, import CFormLayoutElement instead.
 */
export declare const FormLayout: ComponentType<ExtendGlobalProps<ComponentProps<typeof FormLayoutImpl>>>;
export type FormLayoutProps = Props;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-form-layout custom element. For the FormLayout Preact component, import FormLayout instead.
 */
export interface CFormLayoutElement extends JetElement<CFormLayoutElementSettableProperties>, CFormLayoutElementSettableProperties {
    addEventListener<T extends keyof CFormLayoutElementEventMap>(type: T, listener: (this: HTMLElement, ev: CFormLayoutElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CFormLayoutElementSettableProperties>(property: T): CFormLayoutElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CFormLayoutElementSettableProperties>(property: T, value: CFormLayoutElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CFormLayoutElementSettableProperties>): void;
    setProperties(properties: CFormLayoutElementSettablePropertiesLenient): void;
}
export namespace CFormLayoutElement {
    type columnSpanChanged = JetElementCustomEventStrict<CFormLayoutElement['columnSpan']>;
    type columnsChanged = JetElementCustomEventStrict<CFormLayoutElement['columns']>;
    type directionChanged = JetElementCustomEventStrict<CFormLayoutElement['direction']>;
    type fullWidthChanged = JetElementCustomEventStrict<CFormLayoutElement['fullWidth']>;
    type labelEdgeChanged = JetElementCustomEventStrict<CFormLayoutElement['labelEdge']>;
    type labelStartWidthChanged = JetElementCustomEventStrict<CFormLayoutElement['labelStartWidth']>;
    type labelWrappingChanged = JetElementCustomEventStrict<CFormLayoutElement['labelWrapping']>;
    type maxColumnsChanged = JetElementCustomEventStrict<CFormLayoutElement['maxColumns']>;
    type readonlyChanged = JetElementCustomEventStrict<CFormLayoutElement['readonly']>;
    type userAssistanceDensityChanged = JetElementCustomEventStrict<CFormLayoutElement['userAssistanceDensity']>;
}
export interface CFormLayoutElementEventMap extends HTMLElementEventMap {
    'columnSpanChanged': JetElementCustomEventStrict<CFormLayoutElement['columnSpan']>;
    'columnsChanged': JetElementCustomEventStrict<CFormLayoutElement['columns']>;
    'directionChanged': JetElementCustomEventStrict<CFormLayoutElement['direction']>;
    'fullWidthChanged': JetElementCustomEventStrict<CFormLayoutElement['fullWidth']>;
    'labelEdgeChanged': JetElementCustomEventStrict<CFormLayoutElement['labelEdge']>;
    'labelStartWidthChanged': JetElementCustomEventStrict<CFormLayoutElement['labelStartWidth']>;
    'labelWrappingChanged': JetElementCustomEventStrict<CFormLayoutElement['labelWrapping']>;
    'maxColumnsChanged': JetElementCustomEventStrict<CFormLayoutElement['maxColumns']>;
    'readonlyChanged': JetElementCustomEventStrict<CFormLayoutElement['readonly']>;
    'userAssistanceDensityChanged': JetElementCustomEventStrict<CFormLayoutElement['userAssistanceDensity']>;
}
export interface CFormLayoutElementSettableProperties extends JetSettableProperties {
    /**
     * Specifies how many columns this component should span.
     * This only takes effect when this component is a child of a form layout
     * that has direction 'row'.
     */
    columnSpan?: Props['columnSpan'];
    /**
     * Specifies the absolute number of columns and overrides maxColumns, if the value is
     * positive. If the value is not positive, then this attribute is ignored and max-columns
     * is used to determine the number of columns. This attribute should only be used in
     * special circumstances where you need a specific number of columns even if the fields
     * will be narrower than the suggested minimum (a nested form layout is an example).
     */
    columns?: Props['columns'];
    /**
     * Specifies if the child elements should be laid out column first or row first.
     */
    direction?: Props['direction'];
    /**
     * Indicates if the form layout will use 100% of the container's width, and will ignore the theme's max column width.
     */
    fullWidth?: Props['fullWidth'];
    /**
     * <p>
     * Specifies how the child form components should position their labels.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were 'inside'.
     * </p>
     * <p>
     * When using the oj-c-form-layout custom element inside of a VDOM application, this property will not propagate down to the child components.
     * This is because binding propagation is Knockout-based, and VDOM applications are not Knockout-based.
     * </p>
     */
    labelEdge?: Props['labelEdge'];
    /**
     * <p> The width of the label when labelEdge is 'start'.</p>
     * <p> This attribute accepts values of type
     * <code>0 | `--${string}` | `${number}%` | `${number}x` | `calc(${string})`</code></p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were '33%'.
     * </p>
     * <p>
     * When using the oj-c-form-layout custom element inside of a VDOM application, this property will not propagate down to the child components.
     * This is because binding propagation is Knockout-based, and VDOM applications are not Knockout-based.
     * </p>
     */
    labelStartWidth?: Props['labelStartWidth'];
    /**
     * <p>
     * Should the labels wrap or truncate when there is not enough available space.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were 'wrap'.
     * </p>
     * <p>
     * When using the oj-c-form-layout custom element inside of a VDOM application, this property will not propagate down to the child components.
     * This is because binding propagation is Knockout-based, and VDOM applications are not Knockout-based.
     * </p>
     * @deprecated since 18.0.0 - Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value.
     */
    labelWrapping?: Props['labelWrapping'];
    /**
     * Specifies how many columns should be displayed.
     * This property is used when the actual number of columns rendered
     * is responsive and depends on the container's available width.
     * Note that maxColumns will be ignored if columns has a positive value.
     */
    maxColumns?: Props['maxColumns'];
    /**
     * <p>
     * Whether the child components should be rendered as readonly.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were 'false'.
     * </p>
     * <p>
     * When using the oj-c-form-layout custom element inside of a VDOM application, this property will not propagate down to the child components.
     * This is because binding propagation is Knockout-based, and VDOM applications are not Knockout-based.
     * </p>
     */
    readonly?: Props['readonly'];
    /**
     * <p>
     * Specifies the density of the children form component's user assistance presentation. It can be shown inline with
     * reserved rows to prevent reflow if a user assistance text shows up, inline without reserved rows that would
     * reflow if a user assistance text shows up, or it can be shown compactly in a popup instead.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were "efficient".
     * </p>
     * <p>
     * When using the oj-c-form-layout custom element inside of a VDOM application, this property will not propagate down to the child components.
     * This is because binding propagation is Knockout-based, and VDOM applications are not Knockout-based.
     * </p>
     */
    userAssistanceDensity?: Props['userAssistanceDensity'];
}
export interface CFormLayoutElementSettablePropertiesLenient extends Partial<CFormLayoutElementSettableProperties> {
    [key: string]: any;
}
export interface FormLayoutIntrinsicProps extends Partial<Readonly<CFormLayoutElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    oncolumnSpanChanged?: (value: CFormLayoutElementEventMap['columnSpanChanged']) => void;
    oncolumnsChanged?: (value: CFormLayoutElementEventMap['columnsChanged']) => void;
    ondirectionChanged?: (value: CFormLayoutElementEventMap['directionChanged']) => void;
    onfullWidthChanged?: (value: CFormLayoutElementEventMap['fullWidthChanged']) => void;
    onlabelEdgeChanged?: (value: CFormLayoutElementEventMap['labelEdgeChanged']) => void;
    onlabelStartWidthChanged?: (value: CFormLayoutElementEventMap['labelStartWidthChanged']) => void;
    /** @deprecated since 18.0.0 */ onlabelWrappingChanged?: (value: CFormLayoutElementEventMap['labelWrappingChanged']) => void;
    onmaxColumnsChanged?: (value: CFormLayoutElementEventMap['maxColumnsChanged']) => void;
    onreadonlyChanged?: (value: CFormLayoutElementEventMap['readonlyChanged']) => void;
    onuserAssistanceDensityChanged?: (value: CFormLayoutElementEventMap['userAssistanceDensityChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-form-layout': FormLayoutIntrinsicProps;
        }
    }
}

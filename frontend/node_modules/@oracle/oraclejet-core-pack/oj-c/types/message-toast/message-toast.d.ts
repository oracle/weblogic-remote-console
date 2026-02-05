import { MessageToastItem, MessageToast as PreactMessageToast } from '@oracle/oraclejet-preact/UNSAFE_MessageToast';
import { DataProvider, ItemMetadata } from 'ojs/ojdataprovider';
import { Action, DynamicTemplateSlots, ExtendGlobalProps } from 'ojs/ojvcomponent';
import { ComponentProps, ComponentChildren } from 'preact';
import 'css!oj-c/message-toast/message-toast-styles.css';
/**
 * The event payload for the ojClose event.
 * Note: This has a similar structure to the ItemContext. We define it here
 * because using ItemContext will not generate the docs for this payload.
 */
type CloseActionDetail<K extends string | number, D extends MessageToastItem> = {
    /**
     * @description 'The data that was used to render the message.'
     */
    data: D;
    /**
     * @description 'The key for the message.'
     */
    key: K;
    /**
     * @description 'The metadata of the message.'
     */
    metadata: ItemMetadata<K>;
};
type PreactMessageToastProps = ComponentProps<typeof PreactMessageToast>;
/**
 * Structure of template context used for dynamic templates
 */
type MessageToastTemplateContext<K extends string | number, D extends MessageToastItem> = {
    /**
     * @description 'The data for the current message'
     */
    data: D;
    /**
     * @description 'The key for the current message'
     */
    key: K;
    /**
     * @description 'The metadata for the current message'
     */
    metadata: ItemMetadata<K>;
};
/**
 * Structure of parameters passed on to the templateKey properties.
 */
type MessageToastTemplateValueParameters<K extends string | number, D extends MessageToastItem> = {
    /**
     * @description 'The data for the current message'
     */
    data: D;
    /**
     * @description 'The key for the current message'
     */
    key: K;
    /**
     * @description 'The metadata for the current message'
     */
    metadata: ItemMetadata<K>;
};
/**
 * Props for the oj-c-message-toast Component
 */
type MessageToastProps<K extends string | number, D extends MessageToastItem> = {
    /**
     * @description
     * <p>Data for the Message Toast component. This data is used for rendering each toast message.
     * This is a required attribute. If an application needs to initialize the component with
     * no initial messages, it would need to provide an empty DataProvider. When the application
     * wants to show messages, it can then add new data to the existing DataProvider.</p>
     *
     * <p>When specifying a DataProvider for the data attribute, you need to provide the keyAttributes
     * for the DataProvider. The oj-c-message-toast component expects a single attribute of type
     * string or number as the key of the DataProvider. When the data is updated this key attribute
     * will be used to determine whether a new message is being added or an existing message is being
     * updated. This is required for performing necessary animations. When the application replaces
     * the DataProvider, the component assumes that all the messages are newly added irrespective of their
     * keys and performs animation accordingly.</p>
     *
     * @ojmetadata description 'Data for the Message Toast component.'
     * @ojmetadata displayName 'Data'
     * @ojmetadata help '#data'
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
    data: DataProvider<K, D>;
    /**
     * @description
     * Applications can use this property to provide the name of a template or a function that
     * returns the name of a template to use for rendering the detail content.
     *
     * When a template name is provided as a value for this property, the corresponding template
     * will be used for rendering the detail content for all the messages. If applications want
     * to use a different template for different messages, they can provide a function that
     * returns a template name instead.
     *
     * The provided function should accept an object of type MessageToastTemplateValueParameters
     * and return a key to a template for rendering the corresponding message's detail content.
     * The value returned from this function should be a key to one of the dynamic template slots
     * provided. If the returned value is not one of the keys of the provided dynamic template slots,
     * the component will throw an Error.
     *
     * If the function returns null or undefined, the component then will perform default rendering
     * of the detail content using the detail property of the corresponding message.
     *
     * If an application specifies both detail and a valid detail-template-value, the detail-template-value
     * will take precedence and the corresponding template will be used for rendering the detail content.
     *
     * @ojmetadata description 'A dynamic template key or a function that determines the detail template for the current row.'
     * @ojmetadata displayName 'Current Detail Template'
     * @ojmetadata help '#detailTemplateValue'
     * @ojmetadata dynamicSlotDef 'MessageToastTemplateContext'
     * @ojmetadata templateSlotAlias "detailTemplate"
     */
    detailTemplateValue?: string | ((parameters: MessageToastTemplateValueParameters<K, D>) => string | undefined);
    /**
     * @description
     * Applications can use this property to provide the name of a template or a function that
     * returns the name of a template to use for rendering the icon content.
     *
     * When a template name is provided as a value for this property, the corresponding template
     * will be used for rendering the icon content for all the messages. If applications want
     * to use a different template for different messages, they can provide a function that
     * returns a template name instead.
     *
     * The provided function should accept an object of type MessageToastTemplateValueParameters
     * and return a key to a template for rendering the corresponding message's icon content.
     * The value returned from this function should be a key to one of the dynamic template slots
     * provided. If the returned value is not one of the keys of the provided dynamic template slots,
     * the component will throw an Error.
     *
     * If the function returns null or undefined, the component then will perform default rendering
     * of the icon content using the icon property of the corresponding message.
     *
     * If an application specifies both icon and a valid icon-template-value, the icon-template-value
     * will take precedence and the corresponding template will be used for rendering the icon content.
     *
     * @ojmetadata description 'A dynamic template key or a function that determines the icon template for the current row.'
     * @ojmetadata displayName 'Current Icon Template'
     * @ojmetadata help '#iconTemplateValue'
     * @ojmetadata dynamicSlotDef 'MessageToastTemplateContext'
     * @ojmetadata templateSlotAlias "iconTemplate"
     */
    iconTemplateValue?: string | ((parameters: MessageToastTemplateValueParameters<K, D>) => string | undefined);
    /**
     * @description
     * A set of templates for rendering the message content. Which template is used
     * for rendering which content will be decided by specific properties in the row data.
     *
     * @ojmetadata description 'The dynamic template slots for the Toast message.'
     * @ojmetadata displayName 'Dynamic Template Slots'
     * @ojmetadata help '#dynamicTemplates'
     */
    messageTemplates?: DynamicTemplateSlots<MessageToastTemplateContext<K, D>>;
    /**
     * @description
     * Defines an offset (in pixels) in the placement. Value can be supplied as a number or
     * an object with horizontal and vertical values.
     *
     * @ojmetadata description 'Offset for the Message Toast component's position.'
     * @ojmetadata displayName 'Offset'
     * @ojmetadata help '#offset'
     */
    offset?: PreactMessageToastProps['offset'];
    /**
     * @description
     * Defines the fixed position where the messages will be positioned on the screen.
     * - top-start resolves to top-left in LTR (top-right in RTL)
     * - top-end resolves to top-right in LTR (top-left in RTL)
     * - bottom-start resolves to bottom-left in LTR (bottom-right in RTL)
     * - bottom-end resolves to bottom-right in LTR (bottom-left in RTL)
     *
     * @ojmetadata description 'Position for the Message Toast component.'
     * @ojmetadata displayName 'Position'
     * @ojmetadata help '#position'
     */
    position?: PreactMessageToastProps['position'];
    /**
     * @description
     * Triggered when a user tries to close a message through UI interaction. The application
     * should listen to this event and remove the corresponding message item from the data
     * which would then result in the message being closed. If the application
     * fails to remove the message item from the data, then no change will be done in the
     * UI by the component and the message will stay in the UI opened.
     *
     * @ojmetadata description 'Event emitted when the user tries to close a message though UI interaction'
     * @ojmetadata help '#event:ojClose'
     */
    onOjClose?: Action<CloseActionDetail<K, D>>;
};
/**
 * @classdesc
 * <h3 id="toastOverview-section">
 *   JET Message Toast
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#toastOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>Message toasts are short, non-critical, auto-dismissible messages that communicate non-disruptive contextual messages.</p>
 * <p>
 *   Toast messages are used to:
 *   <ul>
 *    <li>Communicate messages that are relevant in the moment like the acknowledgement of an action.</li>
 *    <li>Allow user to take actions related to an event or process, such as: retry, undo, view.</li>
 *   </ul>
 * </p>
 *
 * <h4 id="messages-syntax-section">
 *  Syntax
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#messages-syntax-section"></a>
 * </h4>
 * Message Toast can be created with the following markup.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-c-message-toast data="[[messages]]">
 * &lt;/oj-c-message-toast>
 * </code></pre>
 *
 * <p>The Message Toast component will show messages based on the data provided keeping it as a single
 * source of truth. Applications should register a listener for the ojClose event to be notified
 * when one performs an action that requires a message to be closed. The application then should use the
 * event payload to identify and remove the corresponding row from the data which would then close the
 * message.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-c-message-toast data="[[messages]]" on-oj-close="[[handleClose]]">
 * &lt;/oj-c-message-toast>
 * </code></pre>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>The <code class="prettyprint">MessageToastItem["sound"]</code> property is an accessibility
 * feature for playing a sound when a message is opened. This property defaults to "none", and can
 * be enabled by setting it to "default" or by providing a URL to an audio file of a format that the
 * browser supports. An accessible application must provide a way for users to enable sound on a
 * settings or preferences page. Some browsers will have auto-play disabled by default, enabling
 * it may require adjusting the browser settings.</p>
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
 *       <td rowspan = "4">Focus within Messages</td>
 *       <td><kbd>Tab</kbd> or <kbd>Shift + Tab</kbd></td>
 *       <td>Navigate the content of the messages region.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>F6</kbd></td>
 *       <td>Cycles the focus through all the messages sections on the page starting from the most recent one.
 *           Then finally, moves the focus back to the last focused element outside the messages region.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Moves focus back to the last focused element outside the messages region and closes the current message if it is closable.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
 *       <td>Activates the currently focused element in the message.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan = "1">Focus outside Messages</td>
 *       <td><kbd>F6</kbd></td>
 *       <td>Move focus to the first message within the more recently disclosed messages region.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="data-attributes-section">
 *   Custom Data Attributes
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-attributes-section"></a>
 * </h3>
 *
 * <p>MessageToast supports the following custom data attributes.
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>data-oj-as</kbd></td>
 *       <td><p>Provides an alias for a specific template instance and has the same subproperties as the $current variable.</p>
 *         <pre class="prettyprint"><code>&lt;oj-c-message-toast
 *   data="[[messages]]"
 *   detail-template-value="detailText">
 *   &lt;!-- Template for rendering custom detail text -->
 *   &lt;template slot="detailText" data-oj-as="message">
 *     &lt;!-- The detail text -->
 *     &lt;div>
 *       &lt;span>&lt;oj-bind-text value="[[message.data.detail]]">&lt;/oj-bind-text>&lt;/span>
 *     &lt;/div>
 *   &lt;/template>
 * &lt;/oj-c-message-toast></code></pre>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @typeparam K Type of key of the dataprovider. It can either be a string or a number.
 * @typeparam D Type of the data from the dataprovider. It must extend the MessageToastItem type.
 * @ojmetadata displayName "MessageToast"
 * @ojmetadata description "Toast messages are short, noncritical, auto-dismissible messages that communicate non-disruptive contextual messages."
 * @ojmetadata help "oj-c.MessageToast.html"
 * @ojmetadata main "oj-c/message-toast"
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Controls"
 *   },
 *   "vbdt": {
 *     "defaultColumns": 2,
 *     "minColumns": 1,
 *     "module": "oj-c/message-toast"
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-messages",
 *     "uxSpecs": ["messages-toast-jet"]
 *   }
 * }
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "data",
 *     "items": [
 *       "data"
 *     ]
 *   }
 * ]
 * @ojmetadata since "14.0.0"
 * @ojmetadata status [
 *   {
 *     "type": "supersedes",
 *     "since": "15.0.0",
 *     "value": ["oj-messages"]
 *   }
 * ]
 */
declare function MessageToastImpl<K extends string | number, D extends MessageToastItem>({ data, detailTemplateValue, iconTemplateValue, messageTemplates, offset, position, onOjClose }: MessageToastProps<K, D>): import("preact").JSX.Element;
/**
 * This export corresponds to the MessageToast Preact component. For the oj-c-message-toast custom element, import CMessageToastElement instead.
 */
export declare const MessageToast: <K extends string | number = string | number, D extends MessageToastItem = MessageToastItem>(props: ExtendGlobalProps<ComponentProps<typeof MessageToastImpl<K, D>>>) => ComponentChildren;
export type { MessageToastItem, MessageToastProps, MessageToastTemplateContext, MessageToastTemplateValueParameters };
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-message-toast custom element. For the MessageToast Preact component, import MessageToast instead.
 */
export interface CMessageToastElement<K extends string | number, D extends MessageToastItem> extends JetElement<CMessageToastElementSettableProperties<K, D>>, CMessageToastElementSettableProperties<K, D> {
    addEventListener<T extends keyof CMessageToastElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: CMessageToastElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CMessageToastElementSettableProperties<K, D>>(property: T): CMessageToastElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CMessageToastElementSettableProperties<K, D>>(property: T, value: CMessageToastElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CMessageToastElementSettableProperties<K, D>>): void;
    setProperties(properties: CMessageToastElementSettablePropertiesLenient<K, D>): void;
}
export namespace CMessageToastElement {
    interface ojClose<K extends string | number, D extends MessageToastItem> extends CustomEvent<CloseActionDetail<K, D> & {}> {
    }
    type dataChanged<K extends string | number, D extends MessageToastItem> = JetElementCustomEventStrict<CMessageToastElement<K, D>['data']>;
    type detailTemplateValueChanged<K extends string | number, D extends MessageToastItem> = JetElementCustomEventStrict<CMessageToastElement<K, D>['detailTemplateValue']>;
    type iconTemplateValueChanged<K extends string | number, D extends MessageToastItem> = JetElementCustomEventStrict<CMessageToastElement<K, D>['iconTemplateValue']>;
    type offsetChanged<K extends string | number, D extends MessageToastItem> = JetElementCustomEventStrict<CMessageToastElement<K, D>['offset']>;
    type positionChanged<K extends string | number, D extends MessageToastItem> = JetElementCustomEventStrict<CMessageToastElement<K, D>['position']>;
    type DetailTemplateContext<K extends string | number, D extends MessageToastItem> = MessageToastTemplateContext<K, D>;
    type RenderDetailTemplate<K extends string | number, D extends MessageToastItem> = import('ojs/ojvcomponent').TemplateSlot<MessageToastTemplateContext<K, D>>;
    type IconTemplateContext<K extends string | number, D extends MessageToastItem> = MessageToastTemplateContext<K, D>;
    type RenderIconTemplate<K extends string | number, D extends MessageToastItem> = import('ojs/ojvcomponent').TemplateSlot<MessageToastTemplateContext<K, D>>;
}
export interface CMessageToastElementEventMap<K extends string | number, D extends MessageToastItem> extends HTMLElementEventMap {
    'ojClose': CMessageToastElement.ojClose<K, D>;
    'dataChanged': JetElementCustomEventStrict<CMessageToastElement<K, D>['data']>;
    'detailTemplateValueChanged': JetElementCustomEventStrict<CMessageToastElement<K, D>['detailTemplateValue']>;
    'iconTemplateValueChanged': JetElementCustomEventStrict<CMessageToastElement<K, D>['iconTemplateValue']>;
    'offsetChanged': JetElementCustomEventStrict<CMessageToastElement<K, D>['offset']>;
    'positionChanged': JetElementCustomEventStrict<CMessageToastElement<K, D>['position']>;
}
export interface CMessageToastElementSettableProperties<K extends string | number, D extends MessageToastItem> extends JetSettableProperties {
    /**
     * <p>Data for the Message Toast component. This data is used for rendering each toast message.
     * This is a required attribute. If an application needs to initialize the component with
     * no initial messages, it would need to provide an empty DataProvider. When the application
     * wants to show messages, it can then add new data to the existing DataProvider.</p>
     *
     * <p>When specifying a DataProvider for the data attribute, you need to provide the keyAttributes
     * for the DataProvider. The oj-c-message-toast component expects a single attribute of type
     * string or number as the key of the DataProvider. When the data is updated this key attribute
     * will be used to determine whether a new message is being added or an existing message is being
     * updated. This is required for performing necessary animations. When the application replaces
     * the DataProvider, the component assumes that all the messages are newly added irrespective of their
     * keys and performs animation accordingly.</p>
     */
    data: MessageToastProps<K, D>['data'];
    /**
     * Applications can use this property to provide the name of a template or a function that
     * returns the name of a template to use for rendering the detail content.
     *
     * When a template name is provided as a value for this property, the corresponding template
     * will be used for rendering the detail content for all the messages. If applications want
     * to use a different template for different messages, they can provide a function that
     * returns a template name instead.
     *
     * The provided function should accept an object of type MessageToastTemplateValueParameters
     * and return a key to a template for rendering the corresponding message's detail content.
     * The value returned from this function should be a key to one of the dynamic template slots
     * provided. If the returned value is not one of the keys of the provided dynamic template slots,
     * the component will throw an Error.
     *
     * If the function returns null or undefined, the component then will perform default rendering
     * of the detail content using the detail property of the corresponding message.
     *
     * If an application specifies both detail and a valid detail-template-value, the detail-template-value
     * will take precedence and the corresponding template will be used for rendering the detail content.
     */
    detailTemplateValue?: MessageToastProps<K, D>['detailTemplateValue'];
    /**
     * Applications can use this property to provide the name of a template or a function that
     * returns the name of a template to use for rendering the icon content.
     *
     * When a template name is provided as a value for this property, the corresponding template
     * will be used for rendering the icon content for all the messages. If applications want
     * to use a different template for different messages, they can provide a function that
     * returns a template name instead.
     *
     * The provided function should accept an object of type MessageToastTemplateValueParameters
     * and return a key to a template for rendering the corresponding message's icon content.
     * The value returned from this function should be a key to one of the dynamic template slots
     * provided. If the returned value is not one of the keys of the provided dynamic template slots,
     * the component will throw an Error.
     *
     * If the function returns null or undefined, the component then will perform default rendering
     * of the icon content using the icon property of the corresponding message.
     *
     * If an application specifies both icon and a valid icon-template-value, the icon-template-value
     * will take precedence and the corresponding template will be used for rendering the icon content.
     */
    iconTemplateValue?: MessageToastProps<K, D>['iconTemplateValue'];
    /**
     * Defines an offset (in pixels) in the placement. Value can be supplied as a number or
     * an object with horizontal and vertical values.
     */
    offset?: MessageToastProps<K, D>['offset'];
    /**
     * Defines the fixed position where the messages will be positioned on the screen.
     * - top-start resolves to top-left in LTR (top-right in RTL)
     * - top-end resolves to top-right in LTR (top-left in RTL)
     * - bottom-start resolves to bottom-left in LTR (bottom-right in RTL)
     * - bottom-end resolves to bottom-right in LTR (bottom-left in RTL)
     */
    position?: MessageToastProps<K, D>['position'];
}
export interface CMessageToastElementSettablePropertiesLenient<K extends string | number, D extends MessageToastItem> extends Partial<CMessageToastElementSettableProperties<K, D>> {
    [key: string]: any;
}
export interface MessageToastIntrinsicProps extends Partial<Readonly<CMessageToastElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    /**
     * Triggered when a user tries to close a message through UI interaction. The application
     * should listen to this event and remove the corresponding message item from the data
     * which would then result in the message being closed. If the application
     * fails to remove the message item from the data, then no change will be done in the
     * UI by the component and the message will stay in the UI opened.
     */
    onojClose?: (value: CMessageToastElementEventMap<any, any>['ojClose']) => void;
    ondataChanged?: (value: CMessageToastElementEventMap<any, any>['dataChanged']) => void;
    ondetailTemplateValueChanged?: (value: CMessageToastElementEventMap<any, any>['detailTemplateValueChanged']) => void;
    oniconTemplateValueChanged?: (value: CMessageToastElementEventMap<any, any>['iconTemplateValueChanged']) => void;
    onoffsetChanged?: (value: CMessageToastElementEventMap<any, any>['offsetChanged']) => void;
    onpositionChanged?: (value: CMessageToastElementEventMap<any, any>['positionChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-message-toast': MessageToastIntrinsicProps;
        }
    }
}

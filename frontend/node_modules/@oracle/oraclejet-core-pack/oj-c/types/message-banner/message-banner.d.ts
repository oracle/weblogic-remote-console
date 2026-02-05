import { MessageBannerItem } from '@oracle/oraclejet-preact/UNSAFE_MessageBanner';
import { DataProvider, ItemMetadata } from 'ojs/ojdataprovider';
import { Action, DynamicTemplateSlots, ExtendGlobalProps } from 'ojs/ojvcomponent';
import { ComponentProps, ComponentChildren } from 'preact';
import 'css!oj-c/message-banner/message-banner-styles.css';
/**
 * Structure of template context used for dynamic templates
 */
type MessageBannerTemplateContext<K extends string | number, D extends MessageBannerItem> = {
    /**
     * @description "The data for the current message"
     */
    data: D;
    /**
     * @description "The key for the current message"
     */
    key: K;
    /**
     * @description "The metadata for the current message"
     */
    metadata: ItemMetadata<K>;
};
/**
 * The event payload for the ojClose event.
 * Note: This has a similar structure to the ItemContext. We define it here
 * because using ItemContext will not generate the docs for this payload.
 */
type CloseActionDetail<K extends string | number, D extends MessageBannerItem> = {
    /**
     * @ojmetadata description "The data that was used to render the message."
     */
    data: D;
    /**
     * @ojmetadata description "The key for the message."
     */
    key: K;
    /**
     * @ojmetadata description "The metadata of the message."
     */
    metadata: ItemMetadata<K>;
};
/**
 * Structure of parameters passed on to the templateKey properties.
 */
type MessageBannerTemplateValueParameters<K extends string | number, D extends MessageBannerItem> = {
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
 * Props for the oj-c-message-banner Component
 */
type MessageBannerProps<K extends string | number, D extends MessageBannerItem> = {
    /**
     * @description
     * <p>Data for the Message Banner component. This data is used for rendering each banner message.
     * This is a required attribute. If an application needs to initialize the component with
     * no initial messages, it would need to provide an empty DataProvider. When the application
     * wants to show messages, it can then add new data to the existing DataProvider.
     * See <a href="MutableArrayDataProvider.html">MutableArrayDataProvider</a> for more details.</p>
     *
     * <p>When specifying a DataProvider for the data attribute, you need to provide the keyAttributes
     * for the DataProvider. The oj-c-message-banner component expects a single attribute of type
     * string or number as the key of the DataProvider. When the data is updated this key attribute
     * will be used to determine whether a new message is being added or an existing message is being
     * updated. This is required for performing necessary animations. When the application replaces
     * the DataProvider, the component assumes that all the messages are newly added irrespective of their
     * keys and performs animation accordingly.</p>
     *
     * @ojmetadata description "Data for the Message Banner component."
     * @ojmetadata displayName "Data"
     * @ojmetadata help "#data"
     * @ojmetadata extension {
     *   "webelement": {
     *     "exceptionStatus": [
     *       { "type": "unsupported" }
     *     ]
     *   }
     * }
     */
    data: DataProvider<K, D>;
    /**
     * @description
     * A Banner message can have a different look and feel. For example, when using page-level
     * messaging the messages need to be rendered from edge to edge without any outline. On the other
     * hand, when they are being used in a section of a page or a dialog, they need to be rendered
     * with an outline. This attribute can be used to specify where the component is being used so that
     * it will render the messages accordingly.
     *
     * @ojmetadata description "The type of the Banner message."
     * @ojmetadata displayName "Type"
     * @ojmetadata help "#type"
     * @ojmetadata propertyEditorValues {
     *   "page": {
     *     "description": "Renders the messages as edge-to-edge messages with no gap in between them.",
     *     "displayName": "Page"
     *   },
     *   "section": {
     *     "description": "Renders the messages as section messages - with rounded corners, outline and gap between messages.",
     *     "displayName": "Section"
     *   }
     * }
     */
    type?: 'page' | 'section';
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
     * The provided function should accept an object of type MessageBannerTemplateValueParameters
     * and return a key to a template for rendering the corresponding message's detail content.
     * The value returned from this function should be a key to one of the dynamic template slots
     * provided. If the returned value is not one of the keys of the provided dynamic template slots,
     * the component will throw an Error.
     *
     * If the function returns undefined, the component then will perform default rendering
     * of the detail content using the detail property of the corresponding message.
     *
     * If an application specifies both detail and a valid detail-template-value, the detail-template-value
     * will take precedence and the corresponding template will be used for rendering the detail content.
     *
     * @ojmetadata description "The function that determines the detail template for the current row."
     * @ojmetadata displayName "Current Detail Template"
     * @ojmetadata help "#detailTemplateValue"
     * @ojmetadata dynamicSlotDef "MessageBannerTemplateContext"
     * @ojmetadata templateSlotAlias "detailTemplate"
     */
    detailTemplateValue?: string | ((parameters: MessageBannerTemplateValueParameters<K, D>) => string | undefined);
    /**
     * @description
     * A set of templates for rendering the message content. Which template is used
     * for rendering which content will be decided by specific properties in the row data.
     *
     * @ojmetadata description "The dynamic template slots for the Banner message."
     * @ojmetadata displayName "Dynamic Template Slots"
     * @ojmetadata help "#dynamicTemplates"
     *
     */
    messageTemplates?: DynamicTemplateSlots<MessageBannerTemplateContext<K, D>>;
    /**
     * @description
     * Triggered when a user tries to close a message through UI interaction. The application
     * should listen to this event and remove the corresponding message item from the data
     * which would then result in the message being closed. If the application
     * fails to remove the message item from the data, then no change will be done in the
     * UI by the component and the message will stay in the UI opened.
     *
     * @ojmetadata description "Event emitted when the user tries to close a message though UI interaction"
     * @ojmetadata help "#event:ojClose"
     */
    onOjClose?: Action<CloseActionDetail<K, D>>;
    /**
     * @description
     * Specifies how to sort the messages from the dataprovider.
     *
     * @ojmetadata description "Specifies how to sort the messages from the dataprovider."
     * @ojmetadata displayName "Sorting"
     * @ojmetadata help "#sorting"
     * @ojmetadata propertyEditorValues {
     *   "severity": {
     *     "description": "Sort the messages in the decreasing order of severity: error, warning, info, confirmation, and none. Then sort the messages of the same severity in reverse chronological order using the timestamp property.",
     *     "displayName": "Severity"
     *   },
     *   "off": {
     *     "description": "Messages appear in the order they are supplied with no additional sorting.",
     *     "displayName": "Off"
     *   }
     * }
     */
    sorting?: 'severity' | 'off';
};
/**
 * @classdesc
 * <h3 id="bannerOverview-section">
 *   JET Message Banner
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#bannerOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>Message banners are brief, moderately disruptive, semi-permanent messages that help communicate
 * relevant and useful information in the context of the current page or actions in progress,
 * without blocking the interaction on that page.</p>
 *
 * <h4 id="messages-syntax-section">
 *  Syntax
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#messages-syntax-section"></a>
 * </h4>
 * Message Banner can be created with the following markup.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-c-message-banner data="[[messages]]" type="page">
 * &lt;/oj-c-message-banner>
 * </code></pre>
 *
 * <p>The Message Banner component will show messages based on the data provided keeping it as a single
 * source of truth. Applications should register a listener for the ojClose event to be notified
 * when one performs an action that requires a message to be closed. The application then should use the
 * event payload to identify and remove the corresponding row from the data which would then close the
 * message.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-c-message-banner data="[[messages]]" type="page" on-oj-close="[[handleClose]]">
 * &lt;/oj-c-message-banner>
 * </code></pre>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>The <code class="prettyprint">MessageBannerItem["sound"]</code> property is an accessibility
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
 *       <td rowspan="4">Focus within Messages</td>
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
 * <p>MessageBanner supports the following custom data attributes.
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
 *         <pre class="prettyprint"><code>&lt;oj-c-message-banner
 *   data="[[messages]]"
 *   type="page"
 *   detail-template-value="detailText">
 *   &lt;!-- Template for rendering custom detail text -->
 *   &lt;template slot="detailText" data-oj-as="message">
 *     &lt;!-- The detail text -->
 *     &lt;div>
 *       &lt;span>&lt;oj-bind-text value="[[message.data.detail]]">&lt;/oj-bind-text>&lt;/span>
 *     &lt;/div>
 *   &lt;/template>
 * &lt;/oj-c-message-banner></code></pre>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @typeparam K Type of key of the dataprovider. It can either be a string or a number.
 * @typeparam D Type of the data from the dataprovider. It must extend the MessageBannerItem type.
 * @ojmetadata description "Message Banners are brief, moderately disruptive, semi-permanent messages that help communicate relevant and useful information."
 * @ojmetadata displayName "Message Banner"
 * @ojmetadata main "oj-c/message-banner"
 * @ojmetadata help "oj-c.MessageBanner.html"
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Controls"
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-message-banner",
 *     "uxSpecs": ["bannerMessages"]
 *   },
 *   "vbdt": {
 *     "defaultColumns": 2,
 *     "minColumns": 1,
 *     "module": "oj-c/message-banner"
 *   }
 * }
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "type"
 *     ]
 *   },
 *   {
 *     "propertyGroup": "data",
 *     "items": [
 *       "data"
 *     ]
 *   }
 * ]
 * @ojmetadata since "16.0.0"
 * @ojmetadata status [
 *   {
 *     "type": "supersedes",
 *     "since": "16.0.0",
 *     "value": ["oj-messages", "oj-message-banner"]
 *   }
 * ]
 */
declare function MessageBannerImpl<K extends string | number, D extends MessageBannerItem>({ data, detailTemplateValue, messageTemplates, type, sorting, onOjClose }: MessageBannerProps<K, D>): import("preact").JSX.Element;
/**
 * This export corresponds to the MessageBanner Preact component. For the oj-c-message-banner custom element, import CMessageBannerElement instead.
 */
export declare const MessageBanner: <K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem>(props: ExtendGlobalProps<ComponentProps<typeof MessageBannerImpl<K, D>>>) => ComponentChildren;
export type { MessageBannerItem, MessageBannerProps, MessageBannerTemplateContext, MessageBannerTemplateValueParameters };
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-message-banner custom element. For the MessageBanner Preact component, import MessageBanner instead.
 */
export interface CMessageBannerElement<K extends string | number, D extends MessageBannerItem> extends JetElement<CMessageBannerElementSettableProperties<K, D>>, CMessageBannerElementSettableProperties<K, D> {
    addEventListener<T extends keyof CMessageBannerElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: CMessageBannerElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CMessageBannerElementSettableProperties<K, D>>(property: T): CMessageBannerElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CMessageBannerElementSettableProperties<K, D>>(property: T, value: CMessageBannerElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CMessageBannerElementSettableProperties<K, D>>): void;
    setProperties(properties: CMessageBannerElementSettablePropertiesLenient<K, D>): void;
}
export namespace CMessageBannerElement {
    interface ojClose<K extends string | number, D extends MessageBannerItem> extends CustomEvent<CloseActionDetail<K, D> & {}> {
    }
    type dataChanged<K extends string | number, D extends MessageBannerItem> = JetElementCustomEventStrict<CMessageBannerElement<K, D>['data']>;
    type detailTemplateValueChanged<K extends string | number, D extends MessageBannerItem> = JetElementCustomEventStrict<CMessageBannerElement<K, D>['detailTemplateValue']>;
    type sortingChanged<K extends string | number, D extends MessageBannerItem> = JetElementCustomEventStrict<CMessageBannerElement<K, D>['sorting']>;
    type typeChanged<K extends string | number, D extends MessageBannerItem> = JetElementCustomEventStrict<CMessageBannerElement<K, D>['type']>;
    type DetailTemplateContext<K extends string | number, D extends MessageBannerItem> = MessageBannerTemplateContext<K, D>;
    type RenderDetailTemplate<K extends string | number, D extends MessageBannerItem> = import('ojs/ojvcomponent').TemplateSlot<MessageBannerTemplateContext<K, D>>;
}
export interface CMessageBannerElementEventMap<K extends string | number, D extends MessageBannerItem> extends HTMLElementEventMap {
    'ojClose': CMessageBannerElement.ojClose<K, D>;
    'dataChanged': JetElementCustomEventStrict<CMessageBannerElement<K, D>['data']>;
    'detailTemplateValueChanged': JetElementCustomEventStrict<CMessageBannerElement<K, D>['detailTemplateValue']>;
    'sortingChanged': JetElementCustomEventStrict<CMessageBannerElement<K, D>['sorting']>;
    'typeChanged': JetElementCustomEventStrict<CMessageBannerElement<K, D>['type']>;
}
export interface CMessageBannerElementSettableProperties<K extends string | number, D extends MessageBannerItem> extends JetSettableProperties {
    /**
     * <p>Data for the Message Banner component. This data is used for rendering each banner message.
     * This is a required attribute. If an application needs to initialize the component with
     * no initial messages, it would need to provide an empty DataProvider. When the application
     * wants to show messages, it can then add new data to the existing DataProvider.
     * See <a href="MutableArrayDataProvider.html">MutableArrayDataProvider</a> for more details.</p>
     *
     * <p>When specifying a DataProvider for the data attribute, you need to provide the keyAttributes
     * for the DataProvider. The oj-c-message-banner component expects a single attribute of type
     * string or number as the key of the DataProvider. When the data is updated this key attribute
     * will be used to determine whether a new message is being added or an existing message is being
     * updated. This is required for performing necessary animations. When the application replaces
     * the DataProvider, the component assumes that all the messages are newly added irrespective of their
     * keys and performs animation accordingly.</p>
     */
    data: MessageBannerProps<K, D>['data'];
    /**
     * Applications can use this property to provide the name of a template or a function that
     * returns the name of a template to use for rendering the detail content.
     *
     * When a template name is provided as a value for this property, the corresponding template
     * will be used for rendering the detail content for all the messages. If applications want
     * to use a different template for different messages, they can provide a function that
     * returns a template name instead.
     *
     * The provided function should accept an object of type MessageBannerTemplateValueParameters
     * and return a key to a template for rendering the corresponding message's detail content.
     * The value returned from this function should be a key to one of the dynamic template slots
     * provided. If the returned value is not one of the keys of the provided dynamic template slots,
     * the component will throw an Error.
     *
     * If the function returns undefined, the component then will perform default rendering
     * of the detail content using the detail property of the corresponding message.
     *
     * If an application specifies both detail and a valid detail-template-value, the detail-template-value
     * will take precedence and the corresponding template will be used for rendering the detail content.
     */
    detailTemplateValue?: MessageBannerProps<K, D>['detailTemplateValue'];
    /**
     * Specifies how to sort the messages from the dataprovider.
     */
    sorting?: MessageBannerProps<K, D>['sorting'];
    /**
     * A Banner message can have a different look and feel. For example, when using page-level
     * messaging the messages need to be rendered from edge to edge without any outline. On the other
     * hand, when they are being used in a section of a page or a dialog, they need to be rendered
     * with an outline. This attribute can be used to specify where the component is being used so that
     * it will render the messages accordingly.
     */
    type?: MessageBannerProps<K, D>['type'];
}
export interface CMessageBannerElementSettablePropertiesLenient<K extends string | number, D extends MessageBannerItem> extends Partial<CMessageBannerElementSettableProperties<K, D>> {
    [key: string]: any;
}
export interface MessageBannerIntrinsicProps extends Partial<Readonly<CMessageBannerElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    /**
     * Triggered when a user tries to close a message through UI interaction. The application
     * should listen to this event and remove the corresponding message item from the data
     * which would then result in the message being closed. If the application
     * fails to remove the message item from the data, then no change will be done in the
     * UI by the component and the message will stay in the UI opened.
     */
    onojClose?: (value: CMessageBannerElementEventMap<any, any>['ojClose']) => void;
    ondataChanged?: (value: CMessageBannerElementEventMap<any, any>['dataChanged']) => void;
    ondetailTemplateValueChanged?: (value: CMessageBannerElementEventMap<any, any>['detailTemplateValueChanged']) => void;
    onsortingChanged?: (value: CMessageBannerElementEventMap<any, any>['sortingChanged']) => void;
    ontypeChanged?: (value: CMessageBannerElementEventMap<any, any>['typeChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-message-banner': MessageBannerIntrinsicProps;
        }
    }
}

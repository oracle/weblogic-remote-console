/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import { Item, ItemMetadata } from '../utils/UNSAFE_dataProvider';
import { type TestIdProps } from "../hooks/UNSAFE_useTestId";
/**
 * An object representing a single message in MessageBanner component.
 */
export type MessageBannerItem = {
    /**
     * Defines whether or not to include the close icon for the message
     */
    closeAffordance?: 'on' | 'off';
    /**
     * Defines the detail text of the message
     */
    detail?: string;
    /**
     * Defines the severity of the message
     */
    severity?: 'none' | 'error' | 'warning' | 'confirmation' | 'info';
    /**
     * Defines the sound to be played when opening the message
     */
    sound?: 'default' | 'none' | string;
    /**
     * Defines the primary text of the message
     */
    summary?: string;
    /**
     * Defines the timestamp for the message in ISO format
     */
    timestamp?: string;
};
/**
 * Structure of data item passed to the renderers
 */
export type MessageBannerRendererDataItem<K, D> = {
    /**
     * The data for the current message
     */
    data: D;
    /**
     * The key for the current message
     */
    key: K;
    /**
     * The metadata for the current message
     */
    metadata?: ItemMetadata<K>;
};
/**
 * Props for the MessageBanner Component
 */
type Props<Key, Data> = TestIdProps & {
    /**
     * Data for the MessageBanner component. This data is used for rendering each banner message.
     * The key for each message will be configured using the key of the corresponding item. This way,
     * the component will know whether a new message is being added or an existing message is being updated/removed
     * when the new data comes in.
     */
    data: Item<Key, Data>[];
    /**
     * Triggered when a user tries to close a message through UI interaction. The application
     * should listen to this event and remove the corresponding message item from the data
     * which would then result in the message closed. If the application
     * fails to remove the message item from the data, then no change will be done in the
     * UI by the component and the message will stay in the UI opened.
     */
    onClose?: (item: Item<Key, Data>) => void;
    /**
     * Applications can use this property to provide the key of a renderer or a function that
     * returns the key of a renderer to use for rendering the detail content.
     *
     * When a renderer key is provided as a value for this property, the corresponding renderer
     * will be used for rendering the detail content for all the messages. If applications want
     * to use a different renderer for different messages, they can provide a function that
     * returns a renderer key instead.
     *
     * The provided function should accept an Item and return a key to a renderer for
     * rendering the corresponding message's detail content. The value returned from this function
     * should be a key to one of the renderers provided. If the returned value is not
     * one of the keys of the provided renderers, the component will throw an Error.
     *
     * If the function returns undefined, the component then will perform default rendering
     * of the detail content using the detail property of the corresponding message.
     *
     * If an application specifies both detail and a valid detailRendererKey, the detailRendererKey will
     * take precedence and the corresponding renderer will be used for rendering the detail content.
     */
    detailRendererKey?: string | ((item: Item<Key, Data>) => string | undefined);
    /**
     * A set of available renderers for rendering the message content. Which renderer is used
     * for rendering which content will be decided by specific properties in the row data.
     */
    renderers?: Record<string, (data: MessageBannerRendererDataItem<Key, Data>) => ComponentChildren>;
    /**
     * A Banner message can have a different look and feel. For example, when using page-level
     * messaging the messages need to be rendered from edge to edge without any outline. On the other
     * hand, when they are being used in a section of a page or a dialog, they need to be rendered
     * with an outline. This attribute can be used to specify where the component is being used so that
     * it will render the messages accordingly.
     */
    variant?: 'page' | 'section';
};
/**
 * Renders individual messages based on the provided data
 */
declare function MessageBanner<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem>({ detailRendererKey, data, onClose, renderers, testId, variant }: Props<K, D>): import("preact").JSX.Element | null;
export { MessageBanner };

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Internal sub-component for core pack list-view also serves as context provider for tabbable mode
 */
import { TemplateSlot } from 'ojs/ojvcomponent';
import { Item } from 'ojs/ojdataprovider';
export type ConveyorItemContext<K, D> = {
    /**
     * The data of the item.  Note this is made available primarily to ease migration.
     * Applications should get the data from the item property instead.
     */
    data: D;
    /**
     * Contains the data and metadata of the item.
     */
    item: Item<K, D>;
};
export type Metadata<K> = {
    /**
     * The key of the item.
     */
    key: K;
    /**
     * An optional suggestion metadata object that allows implementations
     * to provide information related to suggestions.
     */
    suggestion?: Record<string, any>;
    /**
     * A zero-based depth of the item.
     */
    treeDepth?: number;
    /**
     * Whether or not the item is a leaf node.
     */
    isLeaf?: boolean;
    /**
     * The key of the parent for the item.
     */
    parentKey?: K;
};
export type ConveyorBeltItemRendererContext<K, D> = {
    /**
     * zero based index of the item
     */
    index: number;
    /**
     * data for the item
     */
    data: D;
    /**
     * metadata for the item
     */
    metadata: Metadata<K>;
};
type ConveyorBeltItemProps<K extends string | number, D> = {
    context: ConveyorBeltItemRendererContext<K, Item<K, D>>;
    itemTemplate: TemplateSlot<ConveyorItemContext<K, D>>;
};
export declare const ConveyorBeltItem: <K extends string | number, D>({ context, itemTemplate }: ConveyorBeltItemProps<K, D>) => import("preact").JSX.Element;
export {};

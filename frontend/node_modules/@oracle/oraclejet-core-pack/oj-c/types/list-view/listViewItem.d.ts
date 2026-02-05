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
import { ListItemRendererContext as PreactListItemRendererContext } from '@oracle/oraclejet-preact/UNSAFE_Collection';
import { ListViewProps } from './list-view';
import { Item } from 'ojs/ojdataprovider';
type ListItemProps<K extends string | number, D> = {
    context: PreactListItemRendererContext<K, Item<K, D>>;
    itemTemplate: ListViewProps<K, D>['itemTemplate'];
};
export declare const ListItem: <K extends string | number, D>({ context, itemTemplate }: ListItemProps<K, D>) => import("preact").JSX.Element;
export {};

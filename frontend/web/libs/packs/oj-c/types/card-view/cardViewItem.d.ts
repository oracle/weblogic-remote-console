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
import { ListItemContext as PreactListItemContext } from '@oracle/oraclejet-preact/UNSAFE_Collection';
import { CardViewProps } from './card-view';
import { Item } from 'ojs/ojdataprovider';
type CardViewItemProps<K extends string | number, D> = {
    context: PreactListItemContext<K, Item<K, D>>;
    itemTemplate: CardViewProps<K, D>['itemTemplate'];
};
export declare const CardViewItem: <K extends string | number, D>({ context, itemTemplate }: CardViewItemProps<K, D>) => import("preact").JSX.Element;
export {};

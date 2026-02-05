/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { ItemContext } from 'ojs/ojcommontypes';
import type { DataProvider } from 'ojs/ojdataprovider';
import { type Dispatch } from 'preact/hooks';
import { type Optional } from '../utils/utils';
export type UseDataProviderListenerProps<K extends string | number, D extends Record<string, unknown>, V extends K | Set<K>, VI extends ItemContext<K, D> | Map<K, ItemContext<K, D>>> = {
    dataProvider?: Optional<DataProvider<K, D>>;
    setValue: Dispatch<Optional<V>>;
    setValueToSync: Dispatch<Optional<V>>;
    setValueItemsToSync: Dispatch<Optional<VI>>;
    value?: Optional<V>;
    valueItems?: Optional<VI>;
};
export declare function useDataProviderListeners<K extends string | number, D extends Record<string, unknown>, V extends K | Set<K>, VI extends ItemContext<K, D> | Map<K, ItemContext<K, D>>>({ dataProvider, setValue, setValueToSync, setValueItemsToSync, value, valueItems }: UseDataProviderListenerProps<K, D, V, VI>): void;

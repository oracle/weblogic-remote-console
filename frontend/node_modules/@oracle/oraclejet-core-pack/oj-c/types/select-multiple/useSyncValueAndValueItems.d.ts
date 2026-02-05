/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ItemContext } from 'ojs/ojcommontypes';
import { DataProvider } from 'ojs/ojdataprovider';
import { Dispatch, StateUpdater } from 'preact/hooks';
type Optional<T> = T | null | undefined;
type Value<K> = Optional<Set<K>>;
type ValueItems<K, D> = Optional<Map<K, ItemContext<K, D>>>;
export type UseSyncValueAndValueItemsProps<K, D> = {
    addBusyState: (desc?: string) => () => void;
    dataProvider?: Optional<DataProvider<K, D>>;
    setDisplayValue: (value: Value<K>) => void;
    setIsLoading: Dispatch<StateUpdater<boolean>>;
    setValue: (value: Value<K>) => void;
    setValueItems: (value: ValueItems<K, D>) => void;
    value?: Value<K>;
    valueItems?: ValueItems<K, D>;
    validateValueOnExternalChange: (value: Value<K>) => boolean;
};
export declare function useSyncValueAndValueItems<K extends string | number, D extends Record<string, any>>({ addBusyState, dataProvider, setDisplayValue, setIsLoading, setValue, setValueItems, value, valueItems, validateValueOnExternalChange }: UseSyncValueAndValueItemsProps<K, D>): void;
export {};

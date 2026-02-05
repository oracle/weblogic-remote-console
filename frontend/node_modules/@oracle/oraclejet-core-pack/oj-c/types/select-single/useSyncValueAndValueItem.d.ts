/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Optional } from 'oj-c/select-common/utils/utils';
import { ItemContext } from 'ojs/ojcommontypes';
import { DataProvider } from 'ojs/ojdataprovider';
import { Dispatch, StateUpdater } from 'preact/hooks';
type Value<K> = Optional<K>;
type WrappedValue<K> = Value<{
    value: K;
}>;
type ValueItem<K, D> = Optional<ItemContext<K, D>>;
export type UseSyncValueAndValueItemProps<K, D> = {
    addBusyState: (desc?: string) => () => void;
    dataProvider?: Optional<DataProvider<K, D>>;
    setDisplayValue: (value: Value<K>) => void;
    setIsLoading: Dispatch<StateUpdater<boolean>>;
    setValue: (value: Value<K>) => void;
    setValueItem: (value: ValueItem<K, D>) => void;
    value?: WrappedValue<K>;
    valueItem?: ValueItem<K, D>;
    validateValueOnExternalChange: (value: Value<K>) => boolean;
};
export declare function useSyncValueAndValueItem<K extends string | number, D extends Record<string, any>>({ addBusyState, dataProvider, setDisplayValue, setIsLoading, setValue, setValueItem, value, valueItem, validateValueOnExternalChange }: UseSyncValueAndValueItemProps<K, D>): void;
export {};

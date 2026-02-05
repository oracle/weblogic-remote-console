/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { PropertyChanged } from 'ojs/ojvcomponent';
export declare function useValueItems<K, D>(propValueItems?: Map<K, D> | null, onValueItemsChanged?: PropertyChanged<Map<K, D> | null | undefined>): {
    valueItems: Map<K, D> | null | undefined;
    setValueItems: (value: Map<K, D> | null, ...args: any[]) => void;
    preactValueItems: D[] | undefined;
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { PropertyChanged } from 'ojs/ojvcomponent';
export declare function useValueItem<V>(propValueItem?: V, onValueItemsChanged?: PropertyChanged<V>): {
    valueItem: V | undefined;
    setValueItem: (value: V, ...args: any[]) => void;
};

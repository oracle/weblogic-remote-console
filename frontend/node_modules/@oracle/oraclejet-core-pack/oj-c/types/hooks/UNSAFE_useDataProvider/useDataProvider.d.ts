/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ItemContext } from 'ojs/ojcommontypes';
import { DataProvider } from 'ojs/ojdataprovider';
/**
 * The props for the useDataProvider hook
 *
 * @template Key type of the key in DP
 * @template Data type of the Data in DP
 */
type Props<Key, Data> = {
    /**
     * @description
     * The data provider whose rows needs to be passed on as an array.
     */
    data?: DataProvider<Key, Data>;
    /**
     * @description
     * A function reference that sets busy state in the root component.
     * TODO: Need a way to obtain this through Preact Context API
     */
    addBusyState: (description: string) => () => void;
};
/**
 * Consumes a DP and converts the data into an array. This also attaches event listeners
 * to the DP and updates the array accordingly.
 *
 * @param param0 The props for the hook
 * @returns The data converted into an array
 */
export declare function useDataProvider<K, D>({ addBusyState, data }: Props<K, D>): {
    data: ItemContext<K, D>[];
};
export {};

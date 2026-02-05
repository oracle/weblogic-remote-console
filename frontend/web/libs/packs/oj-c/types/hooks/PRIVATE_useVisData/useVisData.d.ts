/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { DataProvider } from 'ojs/ojdataprovider';
type Props<K, D> = {
    dataProvider?: DataProvider<K, D>;
    addBusyState: (description: string) => () => void;
};
export declare function useVisData<K, D>({ addBusyState, dataProvider }: Props<K, D>): {
    data: import("ojs/ojcommontypes").ItemContext<K, D>[];
    isLoading: boolean;
};
export {};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { DataProvider } from 'ojs/ojdataprovider';
import { Optional } from '../utils/utils';
import { DebouncingDataProviderView } from '../PRIVATE_DebouncingDataProviderView/DebouncingDataProviderView';
export declare function useWrapDataProvider<K, D>(data?: Optional<DataProvider<K, D>>): DataProvider<K, D> | DebouncingDataProviderView<K, D> | null | undefined;

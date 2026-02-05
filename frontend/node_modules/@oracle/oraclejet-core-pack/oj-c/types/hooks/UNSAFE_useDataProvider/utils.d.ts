/**
 * @license
 * Copyright (c) %FIRSTYEAR% %CURRENTYEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ItemContext } from 'ojs/ojcommontypes';
import { DataProvider, DataProviderMutationEventDetail } from 'ojs/ojdataprovider';
/**
 * Constructs a new array with updates applied to the copy of the current data array.
 * A dataProvider can be passed which will be used to fetch
 * data, in case the data is not available in the mutation event detail.
 *
 * @param detail The mutation detail object
 * @param currentData The current data array
 * @param dataProvider The dataprovider instance
 * @returns The updated data array
 */
export declare function getUpdatedItemsFromMutationDetail<K, D>(detail: DataProviderMutationEventDetail<K, D>, currentData: ItemContext<K, D>[], dataProvider: DataProvider<K, D>): Promise<ItemContext<K, D>[]>;

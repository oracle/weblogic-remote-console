/**
 * @license
 * Copyright (c) %FIRSTYEAR% %CURRENTYEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getUpdatedItemsFromMutationDetail = getUpdatedItemsFromMutationDetail;
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
    async function getUpdatedItemsFromMutationDetail(detail, currentData, dataProvider) {
        const { add, remove, update } = detail ?? {};
        const keyIndexMap = new Map();
        // Build the keyIndex map for the current, so that future ops will be cheap
        for (const [index, item] of currentData.entries()) {
            keyIndexMap.set(item.key, index);
        }
        let mutatedData = [...currentData];
        // First remove the items
        if (remove) {
            mutatedData = removeItemsFromDetail(remove, mutatedData, keyIndexMap);
        }
        // Now add the new items
        if (add) {
            mutatedData = await addItemsFromDetail(add, mutatedData, keyIndexMap, dataProvider);
        }
        // Finally perform updates
        if (update) {
            mutatedData = await updateItemsFromDetail(update, mutatedData, keyIndexMap, dataProvider);
        }
        return mutatedData;
    }
    ////////////////////////////
    // Private Helper Methods //
    ////////////////////////////
    /**
     * Adds items to the original array at the end
     *
     * @param itemsToAdd The new items to be added
     * @param itemMetadataToAdd The new itemMetaData to be added
     * @param items The original array of items
     * @returns The mutated items array
     */
    function addItemsAtEnd(itemsToAdd, itemMetadataToAdd, items) {
        // adding at end means just addItems at index -1
        // so, create an indices array filled with -1, and delegate to addItemsAtIndices
        const indices = new Array(itemsToAdd.length).fill(-1);
        return addItemsAtIndices(indices, itemsToAdd, itemMetadataToAdd, items);
    }
    /**
     * Adds items to the original array at the specified indices with the corresponding
     * data
     *
     * @param indices The indices at which the new items are to be added
     * @param itemsToAdd The new items to be added
     * @param itemMetadataToAdd The new metadata corresponding to the items
     * @param items The original array of items
     * @returns The mutated items array
     */
    function addItemsAtIndices(indices, itemsToAdd, itemMetadataToAdd, items) {
        // make a shallow copy of the data array to mutate
        const returnItems = [...items];
        indices.forEach((addAtIndex, index) => {
            const addItem = {
                data: itemsToAdd[index],
                key: itemMetadataToAdd[index]?.key,
                metadata: itemMetadataToAdd[index]
            };
            // For all positive indices, add at the index
            if (addAtIndex >= 0) {
                returnItems.splice(addAtIndex, 0, addItem);
            }
            else {
                // id index is negative, then add the item to the end
                returnItems.push(addItem);
            }
        });
        return returnItems;
    }
    /**
     * Adds items to the original array at before the items with the specified keys
     * with the corresponding data
     *
     * @param beforeKeys The keys before which the new data should be added
     * @param itemsToAdd The new items to be added
     * @param items The original array of items
     * @param keyIndexMap A map containing key-index mapping
     * @returns The mutated items array
     */
    function addItemsBeforeKeys(beforeKeys, itemsToAdd, items, keyIndexMap) {
        const addIndices = [];
        const itemMetadataToAdd = [];
        beforeKeys.forEach((key) => {
            addIndices.push(getIndexByKey(keyIndexMap, key));
            itemMetadataToAdd.push({ key });
        });
        return addItemsAtIndices(addIndices, itemsToAdd, itemMetadataToAdd, items);
    }
    /**
     * Adds items to the array from the add operation detail
     *
     * @param detail The add operation detail
     * @param items The current items array
     * @param keyIndexMap A map containing key-index mapping
     * @param dataProvider The instance of DataProvider for fetching data
     * @returns Promise that resolves to the new items array
     */
    async function addItemsFromDetail(detail, items, keyIndexMap, dataProvider) {
        const { addBeforeKeys, data, indexes, keys, metadata } = detail;
        let mutatedData = [...items];
        let treatedData = data || [];
        let treatedMetaData = metadata || [];
        // Check if keys are available but the data is not, then fetch the data from the DP
        if (treatedData.length === 0 && keys?.size) {
            const fetchResults = (await fetchDataByKeys(dataProvider, keys)) ?? [];
            treatedData = fetchResults.map((itemContext) => itemContext.data);
            treatedMetaData = fetchResults.map((itemContext) => itemContext.metadata);
        }
        // Check if metadata is empty and keys are available, populate metadata from key
        if (treatedMetaData.length === 0 && keys?.size) {
            treatedMetaData = [...keys].map((key) => ({ key }));
        }
        // Perform the addition only if the data is available
        if (treatedData.length) {
            // Check in the following order of where the items need to be inserted
            // - indexes
            // - addBeforeKeys
            // - afterKeys
            // if none of them are available, just append to the end of the data
            if (indexes?.length) {
                mutatedData = addItemsAtIndices(indexes, treatedData, treatedMetaData, mutatedData);
            }
            else if (addBeforeKeys?.length) {
                mutatedData = addItemsBeforeKeys(addBeforeKeys, treatedData, mutatedData, keyIndexMap);
            }
            else {
                mutatedData = addItemsAtEnd(treatedData, treatedMetaData, mutatedData);
            }
        }
        return mutatedData;
    }
    /**
     * Fetches the data from the dataprovider for the keys specified and returns the fetched data
     *
     * @param dataProvider The dataProvider instance for fetching the data
     * @param keys The set of keys whose data needs to be fetched
     * @returns A promise that resolves with the fetched data
     */
    async function fetchDataByKeys(dataProvider, keys) {
        const fetchedData = [];
        const results = (await dataProvider.fetchByKeys({ keys })).results;
        for (const key of keys) {
            if (results.has(key)) {
                const result = results.get(key);
                fetchedData.push({ ...result, key });
            }
        }
        return fetchedData;
    }
    /**
     * Fetches the index of the item with the corresponding key
     *
     * @param keyIndexMap A map containing key-index mapping
     * @param key The key whose index has to be found
     * @returns The index of the item with the provided key
     */
    function getIndexByKey(keyIndexMap, key) {
        if (keyIndexMap.has(key)) {
            return keyIndexMap.get(key);
        }
        // If key is not in the data return -1
        return -1;
    }
    /**
     * Removes items from the original items array with the corresponding indices
     *
     * @param indices An array of indices to be removed
     * @param items The original items array
     * @returns The mutated items array
     */
    function removeItemsAtIndices(indices, items) {
        // make a shallow copy of the data array to mutate
        const returnItems = [...items];
        // sort the indices in desc order so the items can be removed from
        // the end
        indices.sort((a, b) => b - a);
        // iterate through indices and remove items
        indices.forEach((index) => {
            if (index < returnItems.length) {
                returnItems.splice(index, 1);
            }
        });
        return returnItems;
    }
    /**
     * Removes items from the original items array with the corresponding keys
     *
     * @param keys A set of keys whose corresponding data has to be removed
     * @param items The original items array
     * @param keyIndexMap A map containing key-index mapping
     * @returns The mutated items array
     */
    function removeItemsAtKeys(keys, items, keyIndexMap) {
        const indicesToRemove = [];
        keys.forEach((key) => {
            const index = getIndexByKey(keyIndexMap, key);
            if (index !== -1) {
                indicesToRemove.push(index);
            }
        });
        return removeItemsAtIndices(indicesToRemove, items);
    }
    /**
     * Removes items from the array using the remove operation detail
     *
     * @param detail The remove operation detail
     * @param items The current items array
     * @param keyIndexMap A map containing key-index mapping
     * @returns Promise that resolves to the new items array
     */
    function removeItemsFromDetail(detail, items, keyIndexMap) {
        const { indexes, keys } = detail;
        let mutatedData = [...items];
        // Check for list of indices first
        if (indexes?.length) {
            mutatedData = removeItemsAtIndices(indexes, mutatedData);
        }
        else if (keys?.size) {
            mutatedData = removeItemsAtKeys(keys, mutatedData, keyIndexMap);
        }
        return mutatedData;
    }
    /**
     * Updates items in the original array at the specified indices with the corresponding
     * data
     *
     * @param indices The indices at which the items are to be updated
     * @param itemsToUpdate The new items with updated data
     * @param itemMetadataToUpdate The new metadata corresponding to the items
     * @param items The original array of items
     * @returns The mutated items array
     */
    function updateItemsAtIndices(indices, itemsToUpdate, itemMetadataToUpdate, items) {
        // make a shallow copy of the data array to mutate
        const returnItems = [...items];
        indices.forEach((updateAtIndex, index) => {
            // Update values only for existing items
            if (returnItems[updateAtIndex]) {
                const addItem = {
                    data: itemsToUpdate[index],
                    key: itemMetadataToUpdate[index]?.key,
                    metadata: itemMetadataToUpdate[index]
                };
                returnItems.splice(updateAtIndex, 1, addItem);
            }
        });
        return returnItems;
    }
    /**
     * Updates items in the original array at the specified indices with the corresponding
     * data
     *
     * @param keys The keys at which the items are to be updated
     * @param itemsToUpdate The new items with updated data
     * @param itemMetadataToUpdate The new metadata corresponding to the items
     * @param items The original array of items
     * @param keyIndexMap A map containing key-index mapping
     * @returns The mutated items array
     */
    function updateItemsAtKeys(keys, itemsToUpdate, itemMetadataToUpdate, items, keyIndexMap) {
        // make a shallow copy of the data array to mutate
        const returnItems = [...items];
        keys.forEach((key) => {
            const index = getIndexByKey(keyIndexMap, key);
            const addItem = {
                data: itemsToUpdate[index],
                key: itemMetadataToUpdate[index]?.key,
                metadata: itemMetadataToUpdate[index]
            };
            // Update only if item exists in the current data
            if (index >= 0) {
                returnItems.splice(index, 1, addItem);
            }
        });
        return returnItems;
    }
    /**
     * Updates items in the array using the update operation detail
     *
     * @param detail The update operation detail
     * @param items The current items array
     * @param keyIndexMap A map containing key-index mapping
     * @param dataProvider The instance of DataProvider for fetching data
     * @returns Promise that resolves to the new items array
     */
    async function updateItemsFromDetail(detail, items, keyIndexMap, dataProvider) {
        const { data, indexes, keys, metadata } = detail;
        let mutatedData = [...items];
        let treatedData = data || [];
        let treatedMetaData = metadata || [];
        // Check if keys are available but the data is not, then fetch the data from the DP
        if (treatedData.length === 0 && keys?.size) {
            const fetchResults = (await fetchDataByKeys(dataProvider, keys)) ?? [];
            treatedData = fetchResults.map((itemContext) => itemContext.data);
            treatedMetaData = fetchResults.map((itemContext) => itemContext.metadata);
        }
        // Check if metadata is empty and keys are available, populate metadata from key
        if (treatedMetaData.length === 0 && keys?.size) {
            treatedMetaData = [...keys].map((key) => ({ key }));
        }
        // Perform the update only if the data is available
        if (treatedData.length) {
            // Check in the following order for updating data
            // - indexes
            // - keys
            if (indexes?.length) {
                mutatedData = updateItemsAtIndices(indexes, treatedData, treatedMetaData, mutatedData);
            }
            else if (keys?.size) {
                mutatedData = updateItemsAtKeys(keys, treatedData, treatedMetaData, mutatedData, keyIndexMap);
            }
        }
        return mutatedData;
    }
});

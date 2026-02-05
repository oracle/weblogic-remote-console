/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Item } from '../utils/UNSAFE_dataProvider';
import { ItemTextType } from '../utils/UNSAFE_selectUtils';
export declare function useDisplayValues<K, D>(itemText: ItemTextType<K, D>, valueItems?: Item<K, D>[]): {
    displayValue: string;
    textTags: {
        label: string;
        value: K;
    }[];
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { DataState } from 'src/UNSAFE_Collection';
import { Item } from '../utils/UNSAFE_dataProvider';
type Props<K, D> = {
    isDropdownSelectedOnlyView?: boolean;
    valueItems?: Item<K, D>[];
};
/**
 * Get the data to show in the dropdown for the selected-only view.
 * While the component is showing only selected values in the dropdown, that list of values should
 * not change as the user deselects items within it.  For example, if the list initially shows
 * selected items "Item A" and "Item B", and the user deselects "Item B", we do not want to remove
 * "Item B" from the list.  The reason is that the user may want to reselect it again.  So the
 * list should remain static as of the time the user toggled the selected-only view on.
 * If isDropdownSelectedOnlyView is false, then the data returned from this hook will be undefined.
 * If isDropdownSelectedOnlyView is true, then the data returned from this hook will consist of
 * all of the valueItems that were selected at the time isDropdownSelectedOnlyView was set to true.
 * @param isDropdownSelectedOnlyView Whether the component is showing only selected
 * values in the dropdown: true if so, false if not.
 * @param valueItems The keys, data, and optional metadata for the selected values.
 * @returns An object with data and onLoadRange properties that can be passed on to the
 * list in the dropdown.
 */
export declare function useSelectedOnlyData<K, D>({ isDropdownSelectedOnlyView, valueItems }: Props<K, D>): {
    data: DataState<K, D> | undefined;
    onLoadRange: undefined;
};
export {};

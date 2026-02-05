import { Item as CurrentItem } from '@oracle/oraclejet-preact/UNSAFE_Collection';
import { ListViewProps } from './list-view';
/**
 * This hook handles the currentItemOverride passing to preact layer.
 *
 * If the app provided new value for 'currentItemOverride', we pass that down to preact layer;
 * otherwise, we will pass down the value of internal override, which would be the value
 * updated by useHandleRemoveCurrentKey hook
 *
 * @param currentItemOverride
 */
export declare const useCurrentItemOverride: <K extends string | number, D>(currentItemOverride: ListViewProps<K, D>["currentItemOverride"]) => {
    preactCurrentItemOverride: CurrentItem<K> | undefined;
    updateCurrentItemOverride: (key: K) => void;
};

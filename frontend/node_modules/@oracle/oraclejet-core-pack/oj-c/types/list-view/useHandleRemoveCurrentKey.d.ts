import { DataState, CurrentKeyDetail } from '@oracle/oraclejet-preact/UNSAFE_Collection';
/**
 * Hook to detect and handle when the current key has been removed
 * and try to find the next available current key.
 * TODO: put in its own private module as we should be able to share
 * between other Collection components.
 * @param dataState
 * @param updateCurrentKey
 */
export declare function useHandleRemoveCurrentKey<K, D>(dataState: DataState<K, D> | null, updateCurrentKey: (key: K) => void): {
    notifyCurrentKeyChanged: (detail: CurrentKeyDetail<K>) => void;
};

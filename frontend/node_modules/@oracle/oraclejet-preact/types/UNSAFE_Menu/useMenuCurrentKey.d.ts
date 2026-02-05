import { MenuCollectionItem } from './menuUtils';
/**
 * Hook for handling current key update due to user interaction including keyboard navigation.
 *
 * @param getPrev function to get the previous key based on the current key
 * @param getNext function to get the next key based on the current key
 * @param getFirstVisible function to get the key of the first available item
 * @param getLastVisible function to get the key of the last available item
 * @param onChange function to invoke if the current key has changed
 * @returns
 */
export declare function useMenuCurrentKey(getPrev: () => string | null, getNext: () => string | null, getFirstVisible: () => string | null, getLastVisible: () => string | null, onChange?: (detail: MenuCollectionItem) => void): {
    currentKeyProps: {
        onKeyDown?: undefined;
    } | {
        onKeyDown: (event: KeyboardEvent) => void;
    };
};

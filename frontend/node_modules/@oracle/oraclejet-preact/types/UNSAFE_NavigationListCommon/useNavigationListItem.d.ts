export declare function useNavigationListItem<K extends string | number>({ itemKey }: {
    itemKey: K;
}): {
    itemId: string;
    itemHandlers: {
        [x: string]: unknown;
    };
    itemClasses: string;
    isSelected: boolean;
    labelContainerClasses: string;
    labelContainerStyle: {
        [x: string]: string;
    };
};

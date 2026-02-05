import { BaseNavigationListItemProps } from './BaseNavigationListItem';
type RemovableNavigationListItemProps<K extends string | number> = Omit<BaseNavigationListItemProps<K>, 'removeIcon'>;
export declare function RemovableNavigationListItem<K extends string | number>({ itemKey, label, badge, metadata, severity }: RemovableNavigationListItemProps<K>): import("preact").JSX.Element;
export {};

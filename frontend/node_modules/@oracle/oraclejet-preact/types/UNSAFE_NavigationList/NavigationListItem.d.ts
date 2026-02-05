import { BaseNavigationListItemProps } from '../UNSAFE_NavigationListCommon/BaseNavigationListItem';
export type NavigationListItemProps<K extends string | number> = Omit<BaseNavigationListItemProps<K>, 'removeIcon'>;
export declare function NavigationListItem<K extends string | number>({ itemKey, label, badge, metadata, severity }: NavigationListItemProps<K>): import("preact").JSX.Element;

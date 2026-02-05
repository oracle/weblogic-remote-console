export type TabIconData = {
    type?: 'class';
    class: string;
} | {
    type: 'img';
    src: string;
};
export type DataTabBarMixedIconProps = {
    icon?: TabIconData;
    label?: string;
};
export declare function DataTabBarMixedIcon(props: DataTabBarMixedIconProps): import("preact").JSX.Element | null;

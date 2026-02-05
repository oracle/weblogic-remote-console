export type TabIconData = {
    type?: 'class';
    class: string;
} | {
    type: 'img';
    src: string;
};
export declare function DataTabBarIcon(props: {
    icon: TabIconData;
}): import("preact").JSX.Element | null;

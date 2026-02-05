export type Props = {
    /**
     * Sets the variant for the badge. Badge can be subtle or solid with different colors. The default value of this property is theme driven.
     */
    variant?: 'neutral' | 'neutralSubtle' | 'danger' | 'dangerSubtle' | 'success' | 'successSubtle' | 'warning' | 'warningSubtle' | 'info' | 'infoSubtle';
    /**
     * Specifies the size of the badge. Consists of two options: Medium and small. The default value of this property is theme driven.
     */
    size?: 'xs' | 'sm' | 'md';
    /**
     * Specifies the edge of the badge. Badges can be attached to the end edge of another component. They lose their default corner rounding on right side for ltr direction or left side for rtl direction.
     */
    edge?: 'none' | 'end';
    /**
     * Specifies the string that will be rendered in the badge.
     */
    children: string;
};
export declare function Badge({ variant, size, edge, children }: Props): import("preact").JSX.Element;

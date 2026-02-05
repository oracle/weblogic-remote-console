import { ComponentChildren } from 'preact';
export declare const subheadingElementTypes: readonly ["h1", "h2", "h3", "h4", "h5", "h6", "div", "span"];
type ElementType = (typeof subheadingElementTypes)[number];
type SubheadingProps = {
    /**
     * Specifies the subheading tag. When a heading tag should not be used 'as' may be set to div or span, for example in collection group headers (such as list view group headers).
     */
    as: ElementType;
    /**
     * Specifies text color. If set as "inherit", takes text color from its parent element.
     */
    variant?: 'primary' | 'secondary' | 'disabled' | 'inherit';
    /**
     * Specifies the font size and line height.
     */
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inherit';
    /**
     * Specifies the subheader id
     */
    id?: string;
    /**
     * Specifies the children
     */
    children: ComponentChildren;
};
export declare const sizeOptions: string[];
/**
 * A Subheading is a title given to a subsection.
 */
export declare const Subheading: ({ children, as, size, id, variant }: SubheadingProps) => import("preact").JSX.Element;
export {};

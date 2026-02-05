import { ComponentChildren } from 'preact';
export declare const headingElementTypes: readonly ["h1", "h2", "h3", "h4", "h5", "h6"];
type ElementType = (typeof headingElementTypes)[number];
type HeadingProps = {
    /**
     * Specifies the heading tag
     */
    as: ElementType;
    /**
     * Specifies text color. If set as "inherit", takes text color from its parent element.
     */
    variant?: 'primary' | 'secondary' | 'disabled' | 'inherit';
    /**
     * Specifies the font size and line height.
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inherit';
    /**
     * Specifies the header id
     */
    id?: string;
    /**
     * Specifies the children
     */
    children: ComponentChildren;
};
export declare const sizeOptions: string[];
/**
 * A Heading is a title at the head of a page or section.
 */
export declare function Heading({ children, as, size, id, variant }: HeadingProps): import("preact").JSX.Element;
export {};

export type HoverOptions = {
    onMouseEnter: (e: MouseEvent) => void;
    onMouseLeave: (e: MouseEvent) => void;
};
/**
 * Returns listeners and status for hover
 *
 *
 * @returns
 */
export declare function useSubmenuItemHover(settings: HoverOptions): {
    hoverProps: Record<string, any>;
};

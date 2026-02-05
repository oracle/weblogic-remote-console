declare const directions: readonly ["row", "column"];
declare const wraps: ("inherit" | "initial" | "reverse" | "nowrap" | "wrap")[];
declare const flexbox: ((props: {
    flexDirection?: "column" | "row" | undefined;
    flexWrap?: "inherit" | "initial" | "reverse" | "nowrap" | "wrap" | undefined;
    direction?: "column" | "row" | undefined;
    wrap?: "inherit" | "initial" | "reverse" | "nowrap" | "wrap" | undefined;
}) => string) & {
    properties: Set<"direction" | "flexDirection" | "flexWrap" | "wrap">;
};
export { directions, flexbox, wraps };

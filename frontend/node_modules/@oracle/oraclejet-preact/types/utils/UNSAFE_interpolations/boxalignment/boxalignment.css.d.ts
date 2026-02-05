declare const boxAlignment: ((props: {
    alignItems?: "inherit" | "initial" | "stretch" | "center" | "end" | "start" | "baseline" | undefined;
    justifyContent?: "inherit" | "initial" | "left" | "right" | "center" | "end" | "start" | "around" | "between" | "evenly" | undefined;
    align?: "inherit" | "initial" | "stretch" | "center" | "end" | "start" | "baseline" | undefined;
    justify?: "inherit" | "initial" | "left" | "right" | "center" | "end" | "start" | "around" | "between" | "evenly" | undefined;
}) => string) & {
    properties: Set<"alignItems" | "justifyContent" | "justify" | "align">;
};
declare const aligns: ("inherit" | "initial" | "stretch" | "center" | "end" | "start" | "baseline")[];
declare const justifies: ("inherit" | "initial" | "left" | "right" | "center" | "end" | "start" | "around" | "between" | "evenly")[];
export { aligns, boxAlignment, justifies };

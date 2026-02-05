declare const flexitemAlignSelfs: ("inherit" | "initial" | "stretch" | "center" | "end" | "start" | "baseline")[];
declare const flexitemAlignSelf: ((props: {
    alignSelf?: "inherit" | "initial" | "stretch" | "center" | "end" | "start" | "baseline" | undefined;
}) => string) & {
    properties: Set<"alignSelf">;
};
export { flexitemAlignSelfs, flexitemAlignSelf };

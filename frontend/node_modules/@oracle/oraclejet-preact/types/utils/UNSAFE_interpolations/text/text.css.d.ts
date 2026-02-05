declare const textAligns: readonly ["start", "end", "right"];
declare const textAlign: ((props: {
    textAlign?: "right" | "end" | "start" | undefined;
}) => string) & {
    properties: Set<"textAlign">;
};
export { textAlign, textAligns };

type Obj = Record<string, unknown>;
type Interpolation<P> = (props: P) => Record<string, string> | object;
declare const mergeInterpolations: <P extends Obj>(interpolations: Interpolation<P>[]) => (props: P) => Record<string, string>;
export { mergeInterpolations };

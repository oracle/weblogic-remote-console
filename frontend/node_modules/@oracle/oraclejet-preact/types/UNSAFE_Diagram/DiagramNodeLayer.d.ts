import { ComponentChildren } from 'preact';
import type { States, NodeRendererContext, Bounds, DiagramNodeData } from './diagram.types';
type Props<K1, K2, D1> = {
    nodes: D1[];
    states: States<K1, K2>;
    previousStates: States<K1, K2>;
    nodeRenderer: (context: NodeRendererContext<D1>) => ComponentChildren;
    onNodeSizeChanged: (width: number, height: number, idx: number) => void;
    nodeBounds?: Bounds[];
    supportsSelection: boolean;
};
export declare function DiagramNodeLayer<K1, K2, D1 extends DiagramNodeData<K1>>({ nodes, states, previousStates, nodeRenderer, nodeBounds, onNodeSizeChanged, supportsSelection }: Props<K1, K2, D1>): import("preact").JSX.Element;
export {};

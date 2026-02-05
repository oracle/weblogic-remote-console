import type { Position, State, NodeRendererContext } from './diagram.types';
import { ComponentChildren } from 'preact';
/**
 * Props for node component
 */
type NodeProps<K1, D1> = {
    id: K1;
    position: Position;
    label?: string;
    state: State;
    previousState: State;
    isDimmed?: boolean;
    activeId?: string;
    accessibleLabel?: string;
    nodeIndex: number;
    data: D1;
    nodeRenderer: (context: NodeRendererContext<D1>) => ComponentChildren;
    onNodeSizeChanged: (width: number, height: number, idx: number) => void;
    supportsSelection: boolean;
};
export declare const DiagramNodeElement: <K1, D1>({ id, state, previousState, position, activeId, nodeRenderer, onNodeSizeChanged, nodeIndex, data, accessibleLabel, isDimmed, supportsSelection }: NodeProps<K1, D1>) => import("preact").JSX.Element;
export {};

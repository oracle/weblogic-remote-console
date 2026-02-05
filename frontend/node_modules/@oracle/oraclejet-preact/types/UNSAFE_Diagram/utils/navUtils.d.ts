/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { DiagramNodeData, DiagramLinkData, Bounds, ItemInfo } from '../diagram.types';
/**
 * Navigation direction
 */
export type NavDirection = 'right' | 'left' | 'up' | 'down';
type linkDetailType<K2> = {
    id: K2;
    angle: number;
    distance: number;
    /**
     * Ingoing = 1, outgoing = 0
     */
    direction: 0 | 1;
};
/**
 * Returns the node data based on node info in a diagram.
 * @param itemInfo
 * @returns
 */
export declare function getNodeDetailFromInfo<K1, K2, D1 extends DiagramNodeData<K1>>(itemInfo: ItemInfo<K1, K2>, nodes: D1[]): D1 | undefined;
/**
 * Returns the link data based on link info in a diagram.
 * @param itemInfo
 * @returns
 */
export declare function getLinkDetailFromInfo<K1, K2, D2 extends DiagramLinkData<K2, K1>>(itemInfo: ItemInfo<K1, K2>, links: D2[]): D2 | undefined;
/**
 * Creates a map with key node id and value node bounds
 */
export declare function createNodeBoundsMap<K1, D1 extends DiagramNodeData<K1>>(nodes: D1[], bounds: Bounds[]): Map<K1, Bounds>;
/**
 * Utility method that adds sorting attributes of each link to an array
 */
export declare function addSortingAttributes<K1, K2, D1 extends DiagramNodeData<K1>, D2 extends DiagramLinkData<K2, K1>>(node: D1, listOfLinks: D2[], nodes: D1[], nodeBounds: Map<K1, Bounds>): linkDetailType<K2>[];
/**
 * Returns a function that compares two link around a given node
 * The links are analyzed by angle, distance from the node and direction. The sorting attributes are added to the links before sorting.
 */
export declare function getLinkComparator<K2>(): (link1: linkDetailType<K2>, link2: linkDetailType<K2>) => number;
/**
 * Returns navigable links for a given node
 */
export declare function getNavigableLinksForNodeId<K1, K2, D2 extends DiagramLinkData<K2, K1>>(nodeId: K1, listOfLinks: D2[]): D2[];
/**
 * Calculates the angle weighted by distance
 */
export declare function calcDistanceAngleWeighted(objectBB: Bounds, currentBB: Bounds, direction: NavDirection): number;
/**
 * Given a direction, is a certain node is a valid destination to navigate to
 */
export declare function isValidDestination(objBB: Bounds, curBB: Bounds, direction: NavDirection, compareCenters: boolean): boolean;
/**
 * Returns true if two nodes are in contact
 */
export declare function calcInContact(objRect: Bounds, curRect: Bounds, direction: NavDirection): boolean;
export {};

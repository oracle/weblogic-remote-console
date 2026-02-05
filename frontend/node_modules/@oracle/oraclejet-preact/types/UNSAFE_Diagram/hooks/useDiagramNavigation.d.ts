/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { NavDirection } from '../utils/navUtils';
import type { DiagramNodeData, DiagramLinkData, Bounds, ItemInfo } from '../diagram.types';
export declare function useDiagramNavigation<K1, K2, D1 extends DiagramNodeData<K1>, D2 extends DiagramLinkData<K2, K1>>(nodes: D1[], links: D2[], bounds: Bounds[], linkIdToDataMap: Map<K2, D2>): {
    isNode: (itemInfo: ItemInfo<K1, K2>) => boolean;
    getNextNavigableNode: (direction: NavDirection, compareCenters: boolean, current?: D1, listOfObjects?: D1[]) => D1 | undefined;
    getNextNavigableLink: (direction: string, listOfNodes: D1[], currentLink?: D2, listOfLinks?: D2[]) => D2 | {
        id: K2;
        angle: number;
        distance: number;
        direction: 0 | 1;
    } | undefined;
    navigateFromNodeToLink: (listOfLinks: D2[], event: KeyboardEvent, node?: D1) => {
        id: K2;
        isNode: boolean;
    } | undefined;
    navigateFromLinkToNode: (linkId: K2, event: KeyboardEvent) => {
        id: K1;
        isNode: boolean;
    } | undefined;
};

/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { ComponentChildren, toChildArray, VNode } from 'preact';


type Props = { children: ComponentChildren }

/**
 * Node sorter - sorts children based on an optional custom data attribute 'data-weight'
 * 
 * @param children 
 * @returns sorted nodes
 */
export const WeightedSort = ({ children }: Props) => {
    
    /** 
     * Compare two Vnodes data-weight prop -- if there is no data-weight prop on a node
     * it is considered '0'
     */
    const compare = (a: VNode | string | number, b: VNode | string | number) => {
        if (typeof a !== 'object' || typeof b !== 'object') {
            return 0;
        }
        let a1 = walkNode(a);
        let b1 = walkNode(b);

        const weight1 = (a1?.props as any)?.['data-weight'] || 0;
        const weight2 = (b1?.props as any)?.['data-weight'] || 0;
        
        return Number(weight1) - Number(weight2);

        /**
         * a VNode may be a component or a simple html node. In the case of a 
         * component (when type is 'function'), it's necessary to get at the node's
         * children to get the props of the component. This function traverses through
         * children until it gets to a node that would have the props needed to do the compare
         * (i.e. once type is no longer a 'function' and is something like 'oj-button')
         * 
         * @param node 
         * @returns non-component node
         */
        function walkNode(node: VNode<{}>) {
            let vNode = node as VNode;

            while (typeof vNode.type === 'function' && vNode.props.children) {
                // End traversal when no children available
                if (Array.isArray(vNode.props.children) && vNode.props.children.length <= 0)
                    return null;
                // Otherwise continue to traverse children
                if (Array.isArray(vNode.props.children) && vNode.props.children.length > 0)
                    vNode = vNode.props.children[0];
                else if (typeof vNode.props.children === 'object')
                    vNode = vNode.props.children as VNode;
            }
            return vNode;
        }

    }
    return (<>{ toChildArray(children).sort(compare) }</>);
}
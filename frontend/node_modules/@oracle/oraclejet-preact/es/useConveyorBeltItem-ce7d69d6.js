/* @oracle/oraclejet-preact: undefined */
import { useContext, useRef, useCallback, useEffect } from 'preact/hooks';
import { C as ConveyorBeltContext } from './ConveyorBeltContext-76a29c59.js';
import { u as useId } from './useId-03dbfdf0.js';

/**
 * It is a convenience hook for interacting with ConveyorBeltContext.
 * Marks ConveyorBelt item and specifies current item to be scrolled into view.
 * The hook returns the necessary props: ref for ConveyorBelt child component
 * and 'data-oj-conveyorbelt-item' data attribute to mark conveyorbelt item.
 * If the item is set as current, then it is scrolled into the view.
 * If the hook detects ConveyorBeltContext then it should apply the methods of the ConveyorBeltContext.
 * @param options ConveyorBeltItemOptions: isCurrent boolean,
 * specifies whether the item is current and should be scrolled into the view and
 * itemRef Conevyor belt item reference which if not provided is created in the hook
 * @returns ref for ConveyorBelt child component
 * and 'data-oj-conveyorbelt-item' data attribute to mark conveyorbelt item.
 */
function useConveyorBeltItem(options) {
    const { isCurrent, itemRef } = options;
    const context = useContext(ConveyorBeltContext);
    const ref = useRef(null);
    const id = useId();
    const getResolvedRef = useCallback(() => {
        return itemRef ?? ref;
    }, [itemRef]);
    useEffect(() => {
        if (getResolvedRef().current && context && context.setCurrentItem) {
            if (isCurrent) {
                context.setCurrentItem(getResolvedRef().current);
            }
        }
    }, [context, isCurrent, getResolvedRef]);
    const conveyorBeltItemProps = {
        ref: ref,
        ...(context && { 'data-oj-conveyorbelt-item': id })
    };
    return conveyorBeltItemProps;
}

export { useConveyorBeltItem as u };
//# sourceMappingURL=useConveyorBeltItem-ce7d69d6.js.map

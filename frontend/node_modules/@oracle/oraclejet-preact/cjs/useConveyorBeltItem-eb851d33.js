/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');
var ConveyorBeltContext = require('./ConveyorBeltContext-bfe84b44.js');
var useId = require('./useId-6c0eeb27.js');

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
    const context = hooks.useContext(ConveyorBeltContext.ConveyorBeltContext);
    const ref = hooks.useRef(null);
    const id = useId.useId();
    const getResolvedRef = hooks.useCallback(() => {
        return itemRef ?? ref;
    }, [itemRef]);
    hooks.useEffect(() => {
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

exports.useConveyorBeltItem = useConveyorBeltItem;
//# sourceMappingURL=useConveyorBeltItem-eb851d33.js.map

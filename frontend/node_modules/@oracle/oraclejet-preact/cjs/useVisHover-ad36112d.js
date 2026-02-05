/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const TOUCH_HOLD_THRESHOLD_MS = 200;
/**
 * Returns the event handlers for visualization hover gestures.
 */
function useVisHover(onHover, onHoverEnter, onHoverLeave, touchResponse = 'touchStart', isDisabled = false) {
    const [isTouchHovering, setIsTouchHovering] = hooks.useState(false);
    const touchTimeoutId = hooks.useRef();
    const onTouchMove = hooks.useCallback((event) => {
        // Disable browser handling of touch gestures such as panning.
        if (isTouchHovering)
            event.preventDefault();
    }, [isTouchHovering]);
    const onPointerDown = hooks.useCallback((event) => {
        if (event.pointerType === 'touch') {
            // useDatatip currently depends on event.currentTarget during onHoverEnter
            // On 'touchHold', the event.currentTarget would be accessed in a setTimeout,
            // at which point it becomes null.
            // Solution for now is to store the currentTarget upfront and pass it as an
            // argument to onHoverEnter.
            // TODO: JET-68292 to improve this.
            const currentTarget = event.currentTarget;
            const initiateTouchHover = () => {
                setIsTouchHovering(true);
                onHoverEnter?.(event, currentTarget);
                onHover(event);
                if (event.target.hasPointerCapture(event.pointerId)) {
                    event.target.releasePointerCapture(event.pointerId);
                }
            };
            if (touchResponse === 'touchHold') {
                touchTimeoutId.current = setTimeout(initiateTouchHover, TOUCH_HOLD_THRESHOLD_MS);
            }
            else {
                initiateTouchHover();
            }
        }
    }, [onHoverEnter, onHover, touchResponse]);
    const onPointerMove = hooks.useCallback((event) => {
        if (event.pointerType === 'touch' && !isTouchHovering)
            return;
        onHover(event);
    }, [onHover, isTouchHovering]);
    const onPointerUp = hooks.useCallback((event) => {
        if (event.pointerType === 'touch') {
            clearTimeout(touchTimeoutId.current);
            touchTimeoutId.current = undefined;
            if (isTouchHovering)
                onHoverLeave?.();
            setIsTouchHovering(false);
        }
    }, [onHoverLeave, isTouchHovering]);
    const onPointerEnter = hooks.useCallback((event) => {
        if (event.pointerType === 'touch' && !isTouchHovering)
            return;
        onHoverEnter?.(event, event.currentTarget);
    }, [onHoverEnter, isTouchHovering]);
    const onPointerLeave = hooks.useCallback((event) => {
        if (event.pointerType === 'touch' && !isTouchHovering)
            return;
        onHoverLeave?.();
    }, [onHoverLeave, isTouchHovering]);
    const onPointerCancel = hooks.useCallback((event) => {
        if (event.pointerType === 'touch' && !isTouchHovering) {
            clearTimeout(touchTimeoutId.current);
            touchTimeoutId.current = undefined;
        }
    }, [isTouchHovering]);
    return isDisabled
        ? {}
        : {
            onTouchMove,
            onPointerDown,
            onPointerUp,
            onPointerMove,
            onPointerEnter,
            onPointerLeave,
            onPointerCancel
        };
}

exports.useVisHover = useVisHover;
//# sourceMappingURL=useVisHover-ad36112d.js.map

define(["require", "exports", "preact/hooks"], function (require, exports, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useLegendPosition = useLegendPosition;
    function useLegendPosition(rootRef, position) {
        const [legendPosition, setLegendPosition] = (0, hooks_1.useState)(position === 'auto' ? 'end' : position);
        (0, hooks_1.useLayoutEffect)(() => {
            if (position === 'auto' && rootRef.current) {
                const rootDims = rootRef.current.getBoundingClientRect();
                if (rootDims.height > rootDims.width) {
                    setLegendPosition('bottom');
                }
            }
        }, [position, rootRef]);
        return legendPosition;
    }
});

define(["require", "exports", "preact/hooks", "./SelectionRangeValidator"], function (require, exports, hooks_1, SelectionRangeValidator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSelectionRangeValidator = useSelectionRangeValidator;
    /**
     * A custom hook that creates an implicit SelectionRangeValidator if either min or max is defined.
     * @returns An array of validators, e.g. Validator<V>[]
     */
    function useSelectionRangeValidator({ defaultSelectionExactMessageDetail, defaultSelectionOverflowMessageDetail, defaultSelectionRangeMessageDetail, defaultSelectionUnderflowMessageDetail, max, min, selectionExactMessageDetail, selectionOverflowMessageDetail, selectionRangeMessageDetail, selectionUnderflowMessageDetail }) {
        return (0, hooks_1.useMemo)(() => {
            // If there is a min or max, we need a validator otherwise null.
            const selectionValidator = !min && !max
                ? null
                : new SelectionRangeValidator_1.SelectionRangeValidator({
                    defaultSelectionExactMessageDetail,
                    defaultSelectionOverflowMessageDetail,
                    defaultSelectionRangeMessageDetail,
                    defaultSelectionUnderflowMessageDetail,
                    max,
                    min,
                    selectionExactMessageDetail,
                    selectionOverflowMessageDetail,
                    selectionRangeMessageDetail,
                    selectionUnderflowMessageDetail
                });
            return [selectionValidator].filter(Boolean);
        }, [
            defaultSelectionExactMessageDetail,
            defaultSelectionOverflowMessageDetail,
            defaultSelectionRangeMessageDetail,
            defaultSelectionUnderflowMessageDetail,
            max,
            min,
            selectionExactMessageDetail,
            selectionOverflowMessageDetail,
            selectionRangeMessageDetail,
            selectionUnderflowMessageDetail
        ]);
    }
});

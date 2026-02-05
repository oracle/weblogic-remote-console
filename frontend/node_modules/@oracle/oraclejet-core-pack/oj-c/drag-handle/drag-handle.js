define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_DragHandle"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, UNSAFE_DragHandle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DragHandle = void 0;
    /**
     * @classdesc
     * <h3 id="dragHandleOverview-section">
     *   JET DragHandle Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#dragHandleOverview-section"></a>
     * </h3>
     *
     * <p>Description: The JET DragHandle is a draggable icon used in components with reorder features.</p>
     *
     * @ojmetadata displayName "Drag Handle"
     * @ojmetadata description "A drag handle is a draggable icon used in components with reorder features."
     * @ojmetadata help "oj-c.DragHandle.html"
     * @ojmetadata main "oj-c/drag-handle"
     * @ojmetadata status [
     *   {
     *     type: "candidate",
     *     since: "17.0.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Collections"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/drag-handle",
     *   },
     *   "oracle": {
     *     "uxSpecs": [
     *       "drag-handle"
     *     ]
     *   }
     * }
     * @ojmetadata since "17.0.0"
     */
    const DragHandleImpl = () => {
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_DragHandle_1.DragHandle, {}) }));
    };
    exports.DragHandle = (0, ojvcomponent_1.registerCustomElement)('oj-c-drag-handle', DragHandleImpl, "DragHandle", undefined, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

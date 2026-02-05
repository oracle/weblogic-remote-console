define(["require", "exports", "preact/jsx-runtime", "@oracle/oraclejet-preact/UNSAFE_ConveyorBelt"], function (require, exports, jsx_runtime_1, UNSAFE_ConveyorBelt_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConveyorBeltItem = void 0;
    const ConveyorBeltItem = ({ context, itemTemplate }) => {
        // context.data is Item<K, D> from DataProvider
        const itemContext = {
            data: context.data.data,
            item: context.data
        };
        return ((0, jsx_runtime_1.jsx)(UNSAFE_ConveyorBelt_1.ConveyorBeltItem, { children: itemTemplate && itemTemplate(itemContext) }));
    };
    exports.ConveyorBeltItem = ConveyorBeltItem;
});

define(["require", "exports", "preact/jsx-runtime", "preact", "@oracle/oraclejet-preact/UNSAFE_ConveyorBelt", "./ContentRenderer"], function (require, exports, jsx_runtime_1, preact_1, UNSAFE_ConveyorBelt_1, ContentRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataTabBar = DataTabBar;
    function DataTabBar(props) {
        const { onRemove, onReorder, onSelect, selection, data = [], display, layout, edge, overflow, reorderable, truncation, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, contextMenuConfig } = props;
        const tabBarRef = (0, preact_1.createRef)();
        const handleSelect = (event) => {
            if (event.value && onSelect) {
                onSelect(event);
            }
        };
        const conveyorRenderer = () => {
            return ((0, jsx_runtime_1.jsx)(UNSAFE_ConveyorBelt_1.ConveyorBelt, { children: (0, ContentRenderer_1.TabBarRenderer)({
                    onRemove,
                    selection,
                    layout,
                    display,
                    edge,
                    'aria-label': ariaLabel,
                    'aria-labelledby': ariaLabelledby,
                    data,
                    reorderable,
                    truncation,
                    onReorder,
                    contextMenuConfig
                }, handleSelect, tabBarRef) }));
        };
        return overflow === 'popup'
            ? (0, ContentRenderer_1.OverflowTabBarRenderer)({
                selection,
                onRemove,
                data,
                layout,
                display,
                edge,
                truncation,
                contextMenuConfig,
                'aria-label': ariaLabel,
                'aria-labelledby': ariaLabelledby
            }, handleSelect)
            : overflow === 'conveyor'
                ? conveyorRenderer()
                : (0, ContentRenderer_1.TabBarRenderer)({
                    onRemove,
                    selection,
                    layout,
                    display,
                    edge,
                    'aria-label': ariaLabel,
                    'aria-labelledby': ariaLabelledby,
                    data,
                    reorderable,
                    truncation,
                    onReorder,
                    contextMenuConfig
                }, handleSelect, tabBarRef);
    }
});

define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "../../utils/PRIVATE_ItemsMenu/items-menu"], function (require, exports, jsx_runtime_1, hooks_1, items_menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useVisContextMenu = useVisContextMenu;
    function useVisContextMenu(idToDPItemMap, contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection, transformContext) {
        const itemsRenderer = (0, hooks_1.useCallback)((context) => {
            let itemDetail = transformContext ? transformContext(context) : context;
            if (!transformContext && context.type === 'item') {
                const preactItemId = context.data?.id;
                const itemData = idToDPItemMap.get(preactItemId);
                itemDetail = { ...context, itemData };
            }
            const items = contextMenuConfig?.items(itemDetail);
            return ((0, jsx_runtime_1.jsx)(items_menu_1.ItemsMenu, { items: items, onOjMenuAction: ({ key }) => {
                    onOjContextMenuAction?.({
                        menuItemKey: key,
                        contextMenuContext: itemDetail
                    });
                }, onOjMenuSelection: ({ value, menuSelectionGroupKey }) => {
                    onOjContextMenuSelection?.({
                        value,
                        contextMenuContext: itemDetail,
                        menuSelectionGroupKey
                    });
                } }));
        }, [
            contextMenuConfig?.items,
            onOjContextMenuAction,
            onOjContextMenuSelection,
            idToDPItemMap,
            transformContext
        ]);
        const preactContextMenuConfig = (0, hooks_1.useMemo)(() => {
            return {
                itemsRenderer,
                accessibleLabel: contextMenuConfig?.accessibleLabel
            };
        }, [contextMenuConfig?.accessibleLabel, itemsRenderer]);
        return { preactContextMenuConfig };
    }
});

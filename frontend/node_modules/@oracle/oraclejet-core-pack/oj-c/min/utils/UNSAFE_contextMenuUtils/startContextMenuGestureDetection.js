define(["require", "exports", "preact/jsx-runtime", "preact", "preact/jsx-runtime", "ojs/ojconfig", "@oracle/oraclejet-preact/UNSAFE_Layer", "@oracle/oraclejet-preact/UNSAFE_Menu", "@oracle/oraclejet-preact/UNSAFE_Environment", "@oracle/oraclejet-preact/hooks/UNSAFE_useContextMenuGesture", "../PRIVATE_ItemsMenu/items-menu", "preact/hooks", "@oracle/oraclejet-preact/resources/nls/bundle", "ojs/ojlayerutils"], function (require, exports, jsx_runtime_1, preact_1, jsx_runtime_2, ojconfig_1, UNSAFE_Layer_1, UNSAFE_Menu_1, UNSAFE_Environment_1, UNSAFE_useContextMenuGesture_1, items_menu_1, hooks_1, bundle_1, ojlayerutils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.startContextMenuGestureDetection = void 0;
    const TOUCH_OFFSET_VALUE = 40;
    const menuPropGestureStates = {
        mouse: {
            initialFocus: 'menu',
            placement: 'bottom-start',
            offsetValue: 0
        },
        keyboard: {
            initialFocus: 'firstItem',
            placement: 'bottom-start',
            offsetValue: 0
        },
        touch: {
            initialFocus: 'menu',
            placement: 'end',
            offsetValue: TOUCH_OFFSET_VALUE
        }
    };
    const initialMenuProps = {
        isOpen: false,
        anchorRef: { current: null }
    };
    // Function to add/remove event listeners based on a record of callbacks
    const addRemoveEventListener = (rootNode, triggerProps, action) => {
        for (const [key, value] of Object.entries(triggerProps)) {
            const transformedKey = key.toLowerCase().replace('on', '');
            if (action === 'add') {
                rootNode.addEventListener(transformedKey, value, true);
            }
            else {
                rootNode.removeEventListener(transformedKey, value, true);
            }
        }
    };
    const PreactContextMenu = ({ rootNode, contextMenuHandler }) => {
        const [menuProps, setMenuProps] = (0, hooks_1.useState)(initialMenuProps);
        const [items, setItems] = (0, hooks_1.useState)(null);
        const { triggerProps } = (0, UNSAFE_useContextMenuGesture_1.useContextMenuGesture)(({ gesture, anchor }) => {
            const contextMenuConfig = contextMenuHandler();
            const obtainedItems = contextMenuConfig.items;
            const { anchor: configAnchor, placement, offset, collision } = contextMenuConfig;
            // We check if obtainedItem acts like a Promise
            if (typeof obtainedItems?.then === 'function') {
                setItems(null);
                obtainedItems
                    .then((menuItems) => {
                    // We check if array is empty to close the menu
                    if (menuItems.length) {
                        setItems(menuItems);
                    }
                    else {
                        // We close the menu. Since there are no items
                        setMenuProps({ ...initialMenuProps });
                        return;
                    }
                })
                    .catch(() => {
                    // We close the menu. Since promise was rejected or failed
                    setMenuProps({ ...initialMenuProps });
                    return;
                });
            }
            else {
                if (obtainedItems.length) {
                    setItems(obtainedItems);
                }
                else {
                    // We close the menu. Since there are no items
                    setMenuProps({ ...initialMenuProps });
                    return;
                }
            }
            setMenuProps({
                ...menuPropGestureStates[gesture],
                anchorRef: { current: configAnchor || anchor },
                ...(placement ? { placement: placement } : {}),
                ...(offset ? { offsetValue: offset } : {}),
                ...(collision === 'fit'
                    ? {
                        flipOptions: { mainAxis: false, crossAxis: false }
                    }
                    : {}),
                isOpen: true
            });
        });
        (0, hooks_1.useEffect)(() => {
            addRemoveEventListener(rootNode, triggerProps, 'add');
            return () => {
                addRemoveEventListener(rootNode, triggerProps, 'remove');
            };
        }, [rootNode, triggerProps]);
        const onClose = (0, hooks_1.useCallback)((detail) => {
            if (detail.reason === 'dismissed' || detail.reason === 'itemAction') {
                rootNode?.focus({ preventScroll: true });
            }
            // We close the menu. The only prop that matters here is isOpen
            setMenuProps({ ...initialMenuProps });
        }, []);
        return ((0, jsx_runtime_1.jsx)(UNSAFE_Layer_1.LayerContext.Provider, { value: (0, ojlayerutils_1.getLayerContext)(rootNode), children: (0, jsx_runtime_1.jsx)(UNSAFE_Environment_1.RootEnvironmentProvider, { environment: {
                    user: { locale: (0, ojconfig_1.getLocale)() },
                    translations: { '@oracle/oraclejet-preact': bundle_1.default }
                }, children: (0, jsx_runtime_1.jsx)(UNSAFE_Menu_1.Menu, { ...menuProps, onClose: onClose, children: items ? (0, jsx_runtime_1.jsx)(items_menu_1.ItemsMenu, { items: items }) : null }) }) }));
    };
    const startContextMenuGestureDetection = (rootNode, contextMenuHandler) => {
        (0, preact_1.render)((0, jsx_runtime_2.jsx)(PreactContextMenu, {
            rootNode,
            contextMenuHandler
        }), rootNode);
        return () => {
            (0, preact_1.render)(null, rootNode);
        };
    };
    exports.startContextMenuGestureDetection = startContextMenuGestureDetection;
});

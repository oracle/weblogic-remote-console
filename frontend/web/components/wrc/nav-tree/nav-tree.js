define(["require", "exports", "preact/jsx-runtime", "ojL10n!wrc/shared/resources/nls/frontend", "ojs/ojkeyset", "ojs/ojmutablearraytreedataprovider", "ojs/ojvcomponent", "preact/hooks", "wrc/integration/DatabusContext", "wrc/shared/model/transport", "../shared/global", "wrc/shared/refresh", "ojs/ojtranslation", "ojs/ojlogger", "css!./nav-tree-styles.css", "oj-c/button", "oj-c/buttonset-single", "ojs/ojcollapsible", "ojs/ojaccordion", "ojs/ojnavigationlist", "ojs/ojtoolbar", "preact"], function (require, exports, jsx_runtime_1, t, ojkeyset_1, ojmutablearraytreedataprovider_1, ojvcomponent_1, hooks_1, DatabusContext_1, transport_1, global_1, refresh_1, Translations, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NavTree = exports.ICONS = void 0;
    exports.ICONS = {
        edit: "oj-ux-ico-add-edit-page",
        serverConfig: "oj-ux-ico-file-view-details",
        domainRuntime: "oj-ux-ico-heart-rate-monitor",
        securityData: "oj-ux-ico-shield",
    };
    function getIconClass(node) {
        switch (node.type) {
            case 'group':
                return "oj-ux-ico-bag";
            case 'collection':
                return "oj-ux-ico-collection-alt";
            case 'collectionChild':
                return "oj-ux-ico-box";
            case 'singleton':
                return "oj-ux-ico-file-text";
            case 'root':
                return "oj-ux-ico-domain";
            default:
                break;
        }
        return "";
    }
    function NavTreeImpl({ context, unique, backendPrefix }) {
        const databus = (0, hooks_1.useContext)(DatabusContext_1.DatabusContext);
        const [navtree, setNavtree] = (0, hooks_1.useState)();
        const [navtreeString, setNavtreeString] = (0, hooks_1.useState)();
        const [selectedItem, setSelectedItem] = (0, hooks_1.useState)();
        const [expandedItems, setExpandedItems] = (0, hooks_1.useState)(new ojkeyset_1.KeySetImpl());
        const [rootsString, setRootsString] = (0, hooks_1.useState)();
        const [roots, setRoots] = (0, hooks_1.useState)();
        const [selectedRoot, setSelectedRoot] = (0, hooks_1.useState)();
        const [rootLabel, setRootLabel] = (0, hooks_1.useState)();
        const [treeMode, setTreeMode] = (0, hooks_1.useState)(true);
        const [navtreeUrlState, setNavtreeUrlState] = (0, hooks_1.useState)();
        const [rootReady, setRootReady] = (0, hooks_1.useState)(true);
        const dataProvider = (0, hooks_1.useMemo)(() => new ojmutablearraytreedataprovider_1.MutableArrayTreeDataProvider([], "name", {
            childrenAttribute: "contents",
            keyAttributeScope: "siblings",
        }), []);
        const [isDark, setIsDark] = (0, hooks_1.useState)(false);
        const getRootEl = () => (document.getElementById('globalBody') ||
            document.getElementById('appContainer') ||
            document.body);
        const checkDarkMode = () => {
            var _a;
            const root = getRootEl();
            return !!((_a = root === null || root === void 0 ? void 0 : root.classList) === null || _a === void 0 ? void 0 : _a.contains('oj-color-invert'));
        };
        (0, hooks_1.useEffect)(() => {
            setIsDark(checkDarkMode());
            const onDarkMode = (e) => {
                if (e && e.detail && typeof e.detail.enabled === 'boolean') {
                    setIsDark(!!e.detail.enabled);
                }
                else {
                    setIsDark(checkDarkMode());
                }
            };
            window.addEventListener('wrc:darkMode', onDarkMode);
            return () => window.removeEventListener('wrc:darkMode', onDarkMode);
        }, []);
        const navListClass = isDark ? "oj-color-invert oj-bg-neutral-170" : "oj-bg-neutral-20";
        const panelBgClass = isDark ? "oj-color-invert oj-bg-neutral-170" : "oj-bg-neutral-30";
        const CHILD_LIMIT = 10;
        const [showAllSet, setShowAllSet] = (0, hooks_1.useState)(new Set());
        const triedSelectionsRef = (0, hooks_1.useRef)(new Set());
        const joinPath = (arr) => arr.join("\u0000");
        const clampContents = (contents, path = []) => {
            if (!Array.isArray(contents))
                return [];
            const out = [];
            contents.forEach((c) => {
                const nodePath = [...path, c.name || ""];
                const clone = Object.assign({}, c);
                if (Array.isArray(c.contents)) {
                    const originalKids = c.contents;
                    if (originalKids.length > CHILD_LIMIT && c.type !== "group") {
                        const key = joinPath(nodePath);
                        if (showAllSet.has(key)) {
                            clone.contents = [
                                ...clampContents(originalKids, nodePath),
                                {
                                    name: "__less__",
                                    label: t["wrc-navtree"].labels.showless,
                                    type: "action",
                                    icons: "oj-ux-ico-chevron-double-up",
                                },
                            ];
                        }
                        else {
                            const restCount = originalKids.length - CHILD_LIMIT;
                            clone.contents = [
                                ...clampContents(originalKids.slice(0, CHILD_LIMIT), nodePath),
                                {
                                    name: "__more__",
                                    label: Translations.applyParameters(t["wrc-navtree"].labels.showmore, [new Number(restCount)]),
                                    type: "action",
                                    icons: "oj-ux-ico-chevron-double-down",
                                },
                            ];
                        }
                    }
                    else {
                        clone.contents = clampContents(originalKids, nodePath);
                    }
                }
                out.push(clone);
            });
            return out;
        };
        (0, hooks_1.useEffect)(() => {
            if (unique)
                global_1.Global.global.unique = unique;
            if (backendPrefix)
                global_1.Global.global.backendPrefix = backendPrefix;
            if (!databus) {
                return;
            }
            const signal = databus.subscribe((e) => {
                var _a, _b, _c, _d;
                const newRootsString = JSON.stringify(e.providers.current.roots);
                setRootsString(newRootsString);
                const { lastRootUsed } = e.providers.current;
                if (true || lastRootUsed) {
                    const currentRoot = (_b = (_a = e.providers.current) === null || _a === void 0 ? void 0 : _a.roots) === null || _b === void 0 ? void 0 : _b.find((r) => r.name === lastRootUsed);
                    setRootLabel(currentRoot === null || currentRoot === void 0 ? void 0 : currentRoot.label);
                    setSelectedRoot(currentRoot === null || currentRoot === void 0 ? void 0 : currentRoot.name);
                    setNavtreeUrlState(currentRoot === null || currentRoot === void 0 ? void 0 : currentRoot.navtree);
                }
                const navigation = (_d = (_c = e.contexts) === null || _c === void 0 ? void 0 : _c.main) === null || _d === void 0 ? void 0 : _d.navigation;
                if (typeof navigation !== 'undefined') {
                    const next = navigation.split('/').map((s) => {
                        try {
                            return decodeURIComponent(s);
                        }
                        catch (_a) {
                            return s;
                        }
                    });
                    setSelectedItem((prev) => {
                        const prevKey = Array.isArray(prev) ? joinPath(prev) : undefined;
                        const nextKey = joinPath(next);
                        return prevKey === nextKey ? prev : next;
                    });
                }
            });
            return () => signal.detach();
        }, []);
        (0, hooks_1.useEffect)(() => {
            setRoots(rootsString ? JSON.parse(rootsString) : undefined);
        }, [rootsString]);
        (0, hooks_1.useEffect)(() => {
            const buildExpandedSet = (navtree) => {
                const newSet = new Array();
                let contents = navtree.contents;
                const processContents = (contents, path) => {
                    contents.forEach((content) => {
                        const localPath = [...path];
                        localPath.push(content.name || "");
                        if (content.expanded) {
                            newSet.push(localPath);
                        }
                        if (content.contents) {
                            processContents(content.contents, localPath);
                        }
                    });
                };
                processContents(contents, []);
                const stubCollections = (contents) => {
                    contents === null || contents === void 0 ? void 0 : contents.forEach((content) => {
                        if (content.expandable && !content.contents) {
                            content.contents = [];
                        }
                        stubCollections(content.contents || []);
                    });
                };
                stubCollections(contents);
                const newExpanded = new ojkeyset_1.KeySetImpl(newSet);
                setExpandedItems(newExpanded);
            };
            if (navtreeString) {
                const newNavtree = JSON.parse(navtreeString);
                setNavtree(newNavtree);
                dataProvider.data = newNavtree.contents;
                buildExpandedSet(newNavtree);
                setRootReady(true);
            }
        }, [navtreeString]);
        (0, hooks_1.useEffect)(() => {
            if (selectedItem) {
                if (selectedItem.length === 1 && selectedItem[0] === '') {
                    return;
                }
                const selectedNode = findNodeFromEvent(selectedItem);
                const key = joinPath(selectedItem);
                if (!selectedNode || (selectedNode.expandable && !selectedNode.expanded)) {
                    if (!triedSelectionsRef.current.has(key)) {
                        triedSelectionsRef.current.add(key);
                        refreshTree([...expandedItems.values(), selectedItem]);
                    }
                }
                else {
                    triedSelectionsRef.current.delete(key);
                }
            }
        }, [selectedItem]);
        (0, hooks_1.useEffect)(() => {
            if (navtree) {
                const clamped = clampContents(navtree.contents, []);
                dataProvider.data = clamped;
            }
        }, [navtree, showAllSet]);
        const refreshTree = (pathsToExpand) => {
            const payload = buildSparseNavtree(pathsToExpand);
            try {
                Logger.info(JSON.stringify(payload));
            }
            catch (_a) {
                Logger.info(String(payload));
            }
            if (navtreeUrlState) {
                (0, transport_1._post)(navtreeUrlState, JSON.stringify(payload))
                    .then((r) => r.text())
                    .then((s) => setNavtreeString(s));
            }
        };
        (0, hooks_1.useEffect)(refreshTree, [navtreeUrlState]);
        (0, hooks_1.useEffect)(() => {
            const unsubscribe = (0, refresh_1.subscribeToRefresh)((detail) => {
                var _a, _b;
                const scope = (detail === null || detail === void 0 ? void 0 : detail.scope) || {};
                if (scope.navtree) {
                    const keysIter = (_b = (_a = (expandedItems)) === null || _a === void 0 ? void 0 : _a.values) === null || _b === void 0 ? void 0 : _b.call(_a);
                    const keys = keysIter ? Array.from(keysIter) : undefined;
                    refreshTree(keys);
                }
            });
            return unsubscribe;
        }, [expandedItems, navtreeUrlState]);
        const findNodeFromEvent = (path) => {
            if (navtree) {
                let contents = navtree.contents;
                let node;
                path.forEach((segment) => {
                    node = contents.find((c) => c.name === segment);
                    if (!node) {
                        return null;
                    }
                    contents = node.contents || [];
                });
                return node;
            }
        };
        const buildSparseNavtree = (pathsToExpand) => {
            const content = {};
            const expandedItemsArray = [];
            if (pathsToExpand) {
                expandedItemsArray.push(...pathsToExpand);
            }
            expandedItemsArray.forEach((key) => {
                let localContent = content;
                key.forEach((pathSegment) => {
                    var _a;
                    let newNode = (_a = localContent.contents) === null || _a === void 0 ? void 0 : _a.find((e) => e.name === pathSegment);
                    if (!newNode) {
                        newNode = {};
                        localContent.contents = localContent.contents || [];
                        localContent.contents.push(newNode);
                    }
                    newNode.name = pathSegment;
                    newNode.expanded = true;
                    localContent = newNode;
                });
            });
            return content;
        };
        const selectedChangeHandler = (event) => {
            var _a, _b, _c, _d;
            if (event.detail.updatedFrom === "internal") {
                const listRoot = ((_a = event.target) === null || _a === void 0 ? void 0 : _a.getAttribute("data-tree")) || undefined;
                if (listRoot && listRoot !== selectedRoot) {
                    setSelectedRoot(listRoot);
                }
                const path = event.detail.value;
                const last = Array.isArray(path) ? path[path.length - 1] : undefined;
                if (last === "__more__" || last === "__less__") {
                    const parentPath = Array.isArray(path) ? path.slice(0, -1) : [];
                    const key = joinPath(parentPath);
                    const next = new Set(showAllSet);
                    if (last === "__more__")
                        next.add(key);
                    else
                        next.delete(key);
                    setShowAllSet(next);
                    return;
                }
                setSelectedItem(path);
                refreshTree([...expandedItems.values(), path]);
                const node = findNodeFromEvent(path);
                if ((_b = node === null || node === void 0 ? void 0 : node.resourceData) === null || _b === void 0 ? void 0 : _b.resourceData) {
                    (_c = context === null || context === void 0 ? void 0 : context.routerController) === null || _c === void 0 ? void 0 : _c.navigateToAbsolutePath(node === null || node === void 0 ? void 0 : node.resourceData.resourceData);
                }
                else if ((node === null || node === void 0 ? void 0 : node.type) === 'group') {
                    (_d = context === null || context === void 0 ? void 0 : context.routerController) === null || _d === void 0 ? void 0 : _d.navigateToAbsolutePath(`/api/-current-/group/${selectedRoot}/${path.map(encodeURIComponent).join('/')}`);
                }
            }
        };
        const expandedChangeHandler = (event) => {
            if (event.detail.updatedFrom === "internal") {
                const keys = event.detail.value.values();
                refreshTree(Array.from(keys));
            }
        };
        const navItemTemplate = (item) => {
            return ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)("a", { href: "", children: [(0, jsx_runtime_1.jsx)("span", { class: "oj-navigationlist-item-icon " +
                                item.data.icons +
                                " " +
                                getIconClass(item.data) }), item.data.label] }) }));
        };
        const expandHandler = (event) => {
            var _a;
            const target = event.target;
            if ((target === null || target === void 0 ? void 0 : target.tagName.toLowerCase()) === "oj-collapsible") {
                const expandingRoot = event.target.dataset.id;
                if (expandingRoot && expandingRoot !== selectedRoot) {
                    setSelectedItem(undefined);
                    setExpandedItems(new ojkeyset_1.KeySetImpl([]));
                    setRootReady(false);
                    setSelectedRoot(expandingRoot);
                    (_a = context === null || context === void 0 ? void 0 : context.routerController) === null || _a === void 0 ? void 0 : _a.navigateToAbsolutePath("/api/-current-/group/" + expandingRoot);
                }
            }
        };
        const rootCollapseHandler = (event) => {
            var _a;
            const collapsingRoot = (_a = event.target) === null || _a === void 0 ? void 0 : _a.dataset.id;
            if (collapsingRoot) {
                setSelectedItem(undefined);
                setExpandedItems(new ojkeyset_1.KeySetImpl([]));
                if (collapsingRoot === selectedRoot) {
                    setSelectedRoot(undefined);
                }
            }
        };
        const collapseHandler = (event) => {
            const key = event.detail.key;
            let newExpandedItems = expandedItems;
            for (const value of newExpandedItems.values()) {
                if (value.length < key.length) {
                    continue;
                }
                if (value.join("/").startsWith(key.join("/"))) {
                    newExpandedItems = newExpandedItems.delete([value]);
                }
            }
            setExpandedItems(newExpandedItems);
        };
        const getNavTree = (root = '') => {
            var _a, _b, _c, _d;
            const selectionForList = (!roots || roots.length <= 1)
                ? selectedItem
                : (selectedRoot === root ? selectedItem : undefined);
            const rootObj = roots === null || roots === void 0 ? void 0 : roots.find(r => r.name === root);
            const ariaLabel = rootObj
                ? Translations.applyParameters((_b = (_a = t["wrc-navtree"]) === null || _a === void 0 ? void 0 : _a.ariaLabel) === null || _b === void 0 ? void 0 : _b.provider, [rootObj.label])
                : (_d = (_c = t["wrc-navtree"]) === null || _c === void 0 ? void 0 : _c.ariaLabel) === null || _d === void 0 ? void 0 : _d.default;
            return ((0, jsx_runtime_1.jsx)("oj-navigation-list", { class: navListClass, "data-tree": root, drillMode: "collapsible", "aria-label": ariaLabel, selection: selectionForList, expanded: expandedItems, data: dataProvider, onselectionChanged: selectedChangeHandler, onexpandedChanged: expandedChangeHandler, onojCollapse: collapseHandler, rootLabel: t["wrc-navtree"].labels.root, children: (0, jsx_runtime_1.jsx)("template", { slot: "itemTemplate", render: navItemTemplate }) }, `${root || 'single'}`));
        };
        const getAccordion = () => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("oj-accordion", { class: panelBgClass, multiple: false, expanded: selectedRoot ? [selectedRoot] : [], children: roots === null || roots === void 0 ? void 0 : roots.map((root) => ((0, jsx_runtime_1.jsxs)("oj-collapsible", { id: root.name, class: panelBgClass, "data-id": root.name, onojExpand: expandHandler, onojCollapse: rootCollapseHandler, "icon-position": "start", children: [(0, jsx_runtime_1.jsxs)("span", { slot: "header", class: "", children: [(0, jsx_runtime_1.jsx)("span", { class: exports.ICONS[root.name] + " oj-navigationlist-item-icon" }), (0, jsx_runtime_1.jsxs)("span", { class: "oj-navigationlist-item-label", children: ["\u00A0", root.label] })] }), selectedRoot === root.name && rootReady
                                ? getNavTree(root.name)
                                : null] }, root.name))) }), (0, jsx_runtime_1.jsx)("div", { style: { height: "5rem" } })] }));
        return ((0, jsx_runtime_1.jsx)("div", { class: "wrc-nav-tree oj-text-color-secondary", children: roots && roots.length > 1 ? getAccordion() : getNavTree() }));
    }
    exports.NavTree = (0, ojvcomponent_1.registerCustomElement)("wrc-nav-tree", NavTreeImpl, "NavTree", { "properties": { "navtreeUrl": { "type": "string" }, "url": { "type": "string" }, "context": { "type": "object", "properties": { "canExitCallBack": { "type": "function" }, "routerController": { "type": "object" }, "applicationController": { "type": "object" }, "broadcastMessage": { "type": "function" }, "startActionPolling": { "type": "function" }, "updateShoppingCart": { "type": "function" } } }, "unique": { "type": "string" }, "backendPrefix": { "type": "string" } } });
});
//# sourceMappingURL=nav-tree.js.map
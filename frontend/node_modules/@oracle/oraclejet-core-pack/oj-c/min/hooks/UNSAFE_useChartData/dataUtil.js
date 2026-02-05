/**
 * @license
 * Copyright (c) 2018 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "ojs/ojlogger", "../../utils/UNSAFE_vizUtils/TemplateHandler", "../../utils/PRIVATE_chartUtils/lineAreaUtils"], function (require, exports, Logger, TemplateHandler_1, lineAreaUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createGroupsAndSeries = void 0;
    /**
     * Takes the dataProvider and templates and returns the series, group and getDataItem needed by preact charts
     */
    const createGroupsAndSeries = (data, itemTemplate, seriesTemplate, groupTemplate, itemElementName, seriesElementName, groupElementName, seriesComparator, groupComparator) => {
        const getItemContext = (context, index) => {
            return {
                data: context.data,
                key: context.key,
                index
            };
        };
        const items = itemTemplate && itemElementName
            ? (0, TemplateHandler_1.processTemplate)(data, itemTemplate, getItemContext, itemElementName)
            : data.map((item) => {
                return { id: item.key, _itemData: item.data, ...item.data };
            });
        const groupMap = new Map();
        // Map for each group Symbol containing indices of belonging items
        // Only populated if groupTemplate or groupComparator is specified
        const groupItemMap = groupTemplate || groupComparator ? new Map() : null;
        const seriesMap = new Map();
        const addGroup = (groupId) => {
            let currentMap = groupMap;
            const symbols = [];
            for (let i = 0; i < groupId?.length; i++) {
                const gid = groupId[i];
                let group = currentMap.get(gid);
                if (!group) {
                    // gid isn't necessarily globally unique, but still helpful for debugging
                    group = { value: Symbol(gid) };
                    if (i !== groupId?.length - 1) {
                        group.groups = new Map();
                    }
                    currentMap.set(gid, group);
                }
                if (group.value)
                    symbols.push(group.value);
                if (group.groups)
                    currentMap = group.groups;
            }
            return symbols;
        };
        const addItemIfUnique = (seriesId, groupSymbols, itemIndex) => {
            let itemMap = seriesMap.get(seriesId);
            if (!itemMap) {
                itemMap = new Map();
                seriesMap.set(seriesId, itemMap);
            }
            const leafSymbol = groupSymbols[groupSymbols?.length - 1];
            if (itemMap.get(leafSymbol) === undefined) {
                itemMap.set(leafSymbol, itemIndex);
                // add the itemIndex to all groups if the groupItemMap was passed
                if (groupItemMap) {
                    groupSymbols.forEach((groupSymbol) => {
                        let groupItems = groupItemMap.get(groupSymbol);
                        if (!groupItems) {
                            groupItems = [];
                            groupItemMap.set(groupSymbol, groupItems);
                        }
                        groupItems.push(itemIndex);
                    });
                }
            }
        };
        const processItems = () => {
            items.forEach((item, index) => {
                const groupSymbols = addGroup(item['groupId']);
                addItemIfUnique(item['seriesId'], groupSymbols, index);
            });
        };
        const createGroupContext = (groupSymbol, groupIds, index) => {
            const context = {
                ids: groupIds,
                depth: groupIds?.length,
                index: index
            };
            Object.defineProperty(context, 'items', {
                get: () => {
                    return groupItemMap?.get(groupSymbol).map((itemIndex) => {
                        const item = items[itemIndex];
                        return {
                            data: item._itemData,
                            key: item.id,
                            index: itemIndex
                        };
                    });
                }
            });
            return context;
        };
        const createGroupLevel = (mapLevel, prefix) => {
            const gids = [...mapLevel.keys()];
            const groupContexts = new Map();
            const groups = gids.map((gid, index) => {
                let group;
                const value = mapLevel.get(gid);
                const groupSymbol = value?.value;
                const subGroups = value?.groups;
                let groupContext;
                if ((groupTemplate || groupComparator) && groupSymbol) {
                    groupContext = createGroupContext(groupSymbol, [...prefix, gid], index);
                    groupContexts.set(gid, groupContext);
                }
                if (groupTemplate && groupElementName) {
                    group = (0, TemplateHandler_1.processNodeTemplate)({ key: groupSymbol }, groupTemplate, groupContext, groupElementName);
                }
                else {
                    group = {};
                }
                group['id'] = gid;
                group['name'] = group['name'] == null ? gid : group['name'];
                if (subGroups) {
                    group['groups'] = createGroupLevel(subGroups, [...prefix, gid]);
                }
                else {
                    group = (0, lineAreaUtils_1.transformGroup)(group);
                    Object.defineProperty(group, 'symbol', {
                        value: groupSymbol,
                        enumerable: false
                    });
                }
                return group;
            });
            if (groupComparator) {
                groups.sort((a, b) => groupComparator(groupContexts.get(a['id']), groupContexts.get(b['id'])));
            }
            return groups;
        };
        const createGroups = () => {
            try {
                return createGroupLevel(groupMap, []);
            }
            catch (error) {
                Logger.error(error);
                return [];
            }
        };
        const createSeriesContext = (seriesId, index, groupSymbols, itemMap) => {
            const context = {
                id: seriesId,
                index: index
            };
            Object.defineProperty(context, 'items', {
                get: () => {
                    const itemContexts = [];
                    groupSymbols.forEach((symbol) => {
                        const itemIndex = itemMap.get(symbol);
                        if (itemIndex != null) {
                            const item = items[itemIndex];
                            itemContexts.push({
                                data: item._itemData,
                                key: item.id,
                                index: itemIndex
                            });
                        }
                        return undefined;
                    });
                    return itemContexts;
                }
            });
            return context;
        };
        const getGroupSymbols = (groups) => {
            const symbols = [];
            groups.forEach((group) => {
                if (group.groups) {
                    symbols.push(...getGroupSymbols(group.groups));
                }
                else if (group.symbol) {
                    symbols.push(group.symbol);
                }
            });
            return symbols;
        };
        const createSeries = (groups) => {
            let arSeries;
            try {
                const seriesContexts = new Map();
                const groupSymbols = getGroupSymbols(groups);
                const sids = [...seriesMap.keys()];
                arSeries = sids.map((sid, index) => {
                    const itemMap = seriesMap.get(sid);
                    let seriesContext;
                    if ((seriesTemplate || seriesComparator) && itemMap) {
                        seriesContext = createSeriesContext(sid, index, groupSymbols, itemMap);
                        seriesContexts.set(sid, seriesContext);
                    }
                    let series;
                    if (seriesTemplate && seriesContext && seriesElementName) {
                        series = (0, TemplateHandler_1.processNodeTemplate)({ key: sid }, seriesTemplate, seriesContext, seriesElementName);
                    }
                    else {
                        series = { id: sid };
                    }
                    series['name'] = series['name'] == null ? String(sid) : series['name'];
                    series['items'] = groupSymbols.map((symbol) => {
                        let item = null;
                        if (itemMap) {
                            const itemIndex = itemMap.get(symbol);
                            if (itemIndex != null) {
                                item = items[itemIndex];
                            }
                        }
                        return item;
                    });
                    return series;
                });
                // first sort before transforming the series and items.
                if (seriesComparator) {
                    arSeries.sort((a, b) => seriesComparator(seriesContexts.get(a['id']), seriesContexts.get(b['id'])));
                }
                // apply default color if needed in the sorted series.
                return arSeries.map((series, index) => {
                    series['items'] = series['items'].map((item) => {
                        return (0, lineAreaUtils_1.transformItem)(item, series);
                    });
                    return (0, lineAreaUtils_1.transformSeries)(series, index);
                });
            }
            catch (error) {
                Logger.error(error);
                arSeries = [];
            }
            return arSeries;
        };
        processItems();
        const groups = createGroups();
        const series = createSeries(groups);
        return { groups, series, createGroupContext };
    };
    exports.createGroupsAndSeries = createGroupsAndSeries;
});

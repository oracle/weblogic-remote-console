define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_ListItemLayout", "@oracle/oraclejet-preact/UNSAFE_Inset", "@oracle/oraclejet-preact/hooks/UNSAFE_useCollectionInteractionContext", "ojs/ojvcomponent", "css!oj-c/list-item-layout/list-item-layout-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_ListItemLayout_1, UNSAFE_Inset_1, UNSAFE_useCollectionInteractionContext_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListItemLayout = void 0;
    exports.ListItemLayout = (0, ojvcomponent_1.registerCustomElement)('oj-c-list-item-layout', 
    /**
     * @classdesc
     * <h3 id="listItemLayoutOverview-section">
     *   JET List Item Layout
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#listItemLayoutOverview-section"></a>
     * </h3>
     * The oj-c-list-item-layout helps application teams to easily layout their content into different slots.
     *
     * <pre class="prettyprint"><code>//ListItemLayout with text
     * &lt;oj-list-view id="listview1" aria-label="list layout within list view" data="[[dataProvider]]" style="width: 450px;"
     *                  selected="{{selectorSelectedItems}}" selection-mode="multiple">
     *    &lt;template slot="itemTemplate" data-oj-as="item">
     *       &lt;li>
     *          &lt;oj-c-list-item-layout>
     *             &lt;oj-selector slot='selector' selected-keys='{{selectorSelectedItems}}' key='[[item.data.id]]'>
     *             &lt;/oj-selector>
     *             &lt;div>
     *                &lt;oj-bind-text value="default">&lt;/oj-bind-text>
     *             &lt;/div>
     *          &lt;/oj-c-list-item-layout>
     *       &lt;/li>
     *    &lt;/template>
     * &lt;/oj-list-view>
     * </code>
     *
     * @ojmetadata description "A List Item Layout represents layout used for list view item elements."
     * @ojmetadata displayName "List Item Layout"
     * @ojmetadata main "oj-c/list-item-layout"
     * @ojmetadata help "oj-c.ListItemLayout.html"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "14.0.0",
     *     "value": ["oj-list-item-layout"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Collections"
     *   },
     *   "oracle": {
     *     "uxSpecs": ["list-item-layout"],
     *     "icon": "oj-ux-ico-list-item-layout"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/list-item-layout",
     *     "defaultColumns": 12,
     *     "minColumns": 2
     *   }
     * }
     * @ojmetadata since "14.0.0"
     *
     * @ojmetadata extension {
     *   "webelement": {
     *     "exceptionStatus": [
     *       {
     *         "type": "deprecated",
     *         "since": "16.0.0",
     *         "description": "Not accessible to WebDriverJS."
     *       }
     *     ]
     *   }
     * }
     */
    ({ children, ...otherProps }) => {
        const primary = children;
        const actionSlot = otherProps.action ? ((0, jsx_runtime_1.jsx)("div", { "data-oj-clickthrough": "disabled", children: otherProps.action })) : undefined;
        const navSlot = otherProps.navigation ? ((0, jsx_runtime_1.jsx)("div", { "data-oj-clickthrough": "disabled", children: otherProps.navigation })) : undefined;
        const layout = otherProps.inset === 'none' ? ((0, jsx_runtime_1.jsx)(UNSAFE_ListItemLayout_1.ListItemLayout, { verticalAlignment: otherProps.verticalAlignment, primary: primary, overline: otherProps.overline, selector: otherProps.selector, leading: otherProps.leading, secondary: otherProps.secondary, tertiary: otherProps.tertiary, metadata: otherProps.metadata, trailing: otherProps.trailing, action: actionSlot, quaternary: otherProps.quaternary, navigation: navSlot })) : ((0, jsx_runtime_1.jsx)(UNSAFE_Inset_1.Inset, { variant: "listview", children: (0, jsx_runtime_1.jsx)(UNSAFE_ListItemLayout_1.ListItemLayout, { verticalAlignment: otherProps.verticalAlignment, primary: primary, overline: otherProps.overline, selector: otherProps.selector, leading: otherProps.leading, secondary: otherProps.secondary, tertiary: otherProps.tertiary, metadata: otherProps.metadata, trailing: otherProps.trailing, action: actionSlot, quaternary: otherProps.quaternary, navigation: navSlot }) }));
        return (0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: layout });
    }, "ListItemLayout", { "slots": { "": {}, "overline": {}, "selector": {}, "leading": {}, "secondary": {}, "tertiary": {}, "metadata": {}, "trailing": {}, "action": {}, "quaternary": {}, "navigation": {} }, "properties": { "inset": { "type": "string", "enumValues": ["none", "listInset"] }, "verticalAlignment": { "type": "string", "enumValues": ["top", "middle"] } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-label"] } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useCollectionInteractionContext_1.CollectionInteractionContext] });
});

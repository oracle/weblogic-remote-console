define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_Skeleton", "ojs/ojvcomponent"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_Skeleton_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Skeleton = void 0;
    /**
     * @classdesc
     * <h3 id="skeletonOverview-section">
     *   JET Skeleton
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#skeletonOverview-section"></a>
     * </h3>
     * <p>Description: A skeleton gives a visual representation that content is loading. </p>
     * <p>The oj-c-skeleton is a component that may be placed within the skeletonTemplate of oj-c-card-view.
     *
     * <pre class="prettyprint">
     * <code>
     &lt;oj-c-card-view
     *    id="cardview"
                class="demo-card-view"
                aria-label="cardview with custom skeleton"
                data=[[dataProvider]]>
            &lt;template slot="skeletonTemplate" data-oj-as="context">
              &lt;div class="oj-panel oj-sm-padding-0
               :style="[[context.loadingStatus === 'initial' ? { width: '300px', height: '240px' } : { width: context.width, height: context.height } ]]">
                  &lt;oj-c-skeleton height ="100%">
                  &lt;/oj-c-skeleton>
              &lt;/div>
            &lt;/template>
            &lt;template data-oj-as="item" slot="itemTemplate">
              &lt;div class="oj-panel">
                &lt;demo-profile-card-layout
                  name="[[item.data.name]]"
                  initials="[[item.data.initials]]"
                >
                &lt;/demo-profile-card-layout>
              &lt;/div>
            &lt;/template>
     * &lt;/oj-c-card-view>
     * </code></pre>
     *
     * @ojmetadata description "The skeleton component allows the appropriate skeleton to be rendered based on the property values"
     * @ojmetadata displayName "Skeleton"
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Collections"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/skeleton"
     *   }
     * }
     * @ojmetadata help "oj-c.Skeleton.html"
     * @ojmetadata since "18.0.0"
     * @ojmetadata status [
     *   {
     *    type: "production",
     *    since: "19.0.0"
     *   }
     * ]
     */
    const SkeletonImpl = ({ height, width, borderRadius }) => {
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_Skeleton_1.Skeleton, { height: height, width: width, borderRadius: borderRadius }) }));
    };
    exports.Skeleton = (0, ojvcomponent_1.registerCustomElement)('oj-c-skeleton', SkeletonImpl, "Skeleton", { "properties": { "height": { "type": "number|string" }, "width": { "type": "number|string" }, "borderRadius": { "type": "number|string" } } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

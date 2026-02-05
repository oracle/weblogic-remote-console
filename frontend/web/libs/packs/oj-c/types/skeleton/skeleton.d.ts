/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { ExtendGlobalProps } from 'ojs/ojvcomponent';
import { ComponentProps, ComponentType } from 'preact';
type Props = {
    /**
     * @ojmetadata description "Specifies the height of the skeleton"
     * @ojmetadata help "#height"
     */
    height: Size;
    /**
     * @ojmetadata description "Specifies the width of the skeleton"
     * @ojmetadata help "#width"
     */
    width?: Size;
    /**
     * @ojmetadata description "Specifies the border radius of the skeleton"
     * @ojmetadata help "#BorderRadiusProps"
     */
    borderRadius?: Size;
};
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
declare const SkeletonImpl: ({ height, width, borderRadius }: Props) => import("preact").JSX.Element;
/**
 * This export corresponds to the Skeleton Preact component. For the oj-c-skeleton custom element, import CSkeletonElement instead.
 */
export declare const Skeleton: ComponentType<ExtendGlobalProps<ComponentProps<typeof SkeletonImpl>>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-skeleton custom element. For the Skeleton Preact component, import Skeleton instead.
 */
export interface CSkeletonElement extends JetElement<CSkeletonElementSettableProperties>, CSkeletonElementSettableProperties {
    addEventListener<T extends keyof CSkeletonElementEventMap>(type: T, listener: (this: HTMLElement, ev: CSkeletonElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CSkeletonElementSettableProperties>(property: T): CSkeletonElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CSkeletonElementSettableProperties>(property: T, value: CSkeletonElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CSkeletonElementSettableProperties>): void;
    setProperties(properties: CSkeletonElementSettablePropertiesLenient): void;
}
export namespace CSkeletonElement {
    type borderRadiusChanged = JetElementCustomEventStrict<CSkeletonElement['borderRadius']>;
    type heightChanged = JetElementCustomEventStrict<CSkeletonElement['height']>;
    type widthChanged = JetElementCustomEventStrict<CSkeletonElement['width']>;
}
export interface CSkeletonElementEventMap extends HTMLElementEventMap {
    'borderRadiusChanged': JetElementCustomEventStrict<CSkeletonElement['borderRadius']>;
    'heightChanged': JetElementCustomEventStrict<CSkeletonElement['height']>;
    'widthChanged': JetElementCustomEventStrict<CSkeletonElement['width']>;
}
export interface CSkeletonElementSettableProperties extends JetSettableProperties {
    borderRadius?: Props['borderRadius'];
    height: Props['height'];
    width?: Props['width'];
}
export interface CSkeletonElementSettablePropertiesLenient extends Partial<CSkeletonElementSettableProperties> {
    [key: string]: any;
}
export interface SkeletonIntrinsicProps extends Partial<Readonly<CSkeletonElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onborderRadiusChanged?: (value: CSkeletonElementEventMap['borderRadiusChanged']) => void;
    onheightChanged?: (value: CSkeletonElementEventMap['heightChanged']) => void;
    onwidthChanged?: (value: CSkeletonElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-skeleton': SkeletonIntrinsicProps;
        }
    }
}

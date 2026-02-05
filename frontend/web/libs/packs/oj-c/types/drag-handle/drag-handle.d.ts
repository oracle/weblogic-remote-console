import { ExtendGlobalProps } from 'ojs/ojvcomponent';
import { ComponentProps, ComponentType } from 'preact';
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
declare const DragHandleImpl: () => import("preact").JSX.Element;
/**
 * This export corresponds to the DragHandle Preact component. For the oj-c-drag-handle custom element, import CDragHandleElement instead.
 */
export declare const DragHandle: ComponentType<ExtendGlobalProps<ComponentProps<typeof DragHandleImpl>>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-drag-handle custom element. For the DragHandle Preact component, import DragHandle instead.
 */
export interface CDragHandleElement extends JetElement<CDragHandleElementSettableProperties>, CDragHandleElementSettableProperties {
    addEventListener<T extends keyof CDragHandleElementEventMap>(type: T, listener: (this: HTMLElement, ev: CDragHandleElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CDragHandleElementSettableProperties>(property: T): CDragHandleElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CDragHandleElementSettableProperties>(property: T, value: CDragHandleElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CDragHandleElementSettableProperties>): void;
    setProperties(properties: CDragHandleElementSettablePropertiesLenient): void;
}
export interface CDragHandleElementEventMap extends HTMLElementEventMap {
}
export interface CDragHandleElementSettableProperties extends JetSettableProperties {
}
export interface CDragHandleElementSettablePropertiesLenient extends Partial<CDragHandleElementSettableProperties> {
    [key: string]: any;
}
export interface DragHandleIntrinsicProps extends Partial<Readonly<CDragHandleElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-drag-handle': DragHandleIntrinsicProps;
        }
    }
}

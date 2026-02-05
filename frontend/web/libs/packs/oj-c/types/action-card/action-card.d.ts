import { ComponentChildren, Component } from 'preact';
import { Action, Bubbles, ExtendGlobalProps } from 'ojs/ojvcomponent';
import 'css!oj-c/action-card/action-card-styles.css';
type Props = {
    /**
     * @ojmetadata description "The default slot is the content of the card."
     * @ojmetadata displayName "Default"
     * @ojmetadata help "#default"
     */
    children?: ComponentChildren;
    /**
     * @ojmetadata description "Triggered when a card is clicked, whether by keyboard, mouse,
     *    or touch events. To meet accessibility requirements, the only supported way to react
     *    to the click is to listen for this event."
     * @ojmetadata eventGroup "common"
     * @ojmetadata displayName "onOjAction"
     * @ojmetadata help "#event:action"
     */
    onOjAction: Action & Bubbles;
};
/**
 * @classdesc
 * <h3 id="ActionCardOverview-section">
 *   JET Action
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#CardOverview-section"></a>
 * </h3>
 * <p>Description: Themeable, WAI-ARIA-compliant element that represents a card.</p>
 * <p>Action Card provides a styled rectangular area with hover/focus/active state rendering,
 * along with an ojAction event.
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-c-action-card onAction="[[actionHandler]]">
 *   Sample Text
 * &lt;/oj-c-action-card>
 *
 * </code></pre>
 *
 * <h3 id="diff-section">
 *   Differences between Cards in JET
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#diff-section"></a>
 * </h3>
 *
 * <p>
 * There are several different options for creating cards in JET applications.
 * </p>
 * <ul>
 * <li><strong>oj-c-action-card:</strong> ActionCard fires action events and is supported for use stand alone or in oj-c-card-view. For accessibility reasons nothing interactive (for example links or buttons) can be put in an action card.</li>
 * <li><strong>oj-c-selection-card:</strong> SelectionCard is supported for use in oj-c-card-view, with single or multiple selection.</li>
 * <li><strong>oj-panel CSS class:</strong> For simple cases with no associated action or selection. Panel is supported for use in standalone or in oj-c-card-view.</li>
 * </ul>
 *
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>A clarification in a11y rules states that any element with role of ActionCard should not have interactive elements inside: https://www.w3.org/TR/html-aria/#allowed-descendants-of-aria-roles </p>
 *
 * @ojmetadata description "An Action Card is an actionable container rendering related information"
 * @ojmetadata displayName "Action Card"
 * @ojmetadata help "oj-c.ActionCard.html"
 * @ojmetadata main "oj-c/action-card"
 * @ojmetadata status [
 *   {
 *     type: "candidate",
 *     since: "17.0.0"
 *   }
 * ]
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Layout & Nav"
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-object-card",
 *     "uxSpecs": ["card"]
 *   },
 *   "vbdt": {
 *     "module": "oj-c/action-card",
 *     "defaultColumns": 1,
 *     "minColumns": 1
 *   }
 * }
 * @ojmetadata since "16.0.0"
 */
/**
 * This export corresponds to the ActionCard Preact component. For the oj-c-action-card custom element, import CActionCardElement instead.
 */
export declare class ActionCard extends Component<ExtendGlobalProps<Props>> {
    private actionCardRef;
    render({ children, onOjAction }: ExtendGlobalProps<Props>): import("preact").JSX.Element;
    /**
     * blurs the card
     * @ignore
     */
    click(): void;
    /**
     * blurs the card
     * @ignore
     */
    blur(): void;
    /**
     * focuses the card
     * @ignore
     */
    focus(): void;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-action-card custom element. For the ActionCard Preact component, import ActionCard instead.
 */
export interface CActionCardElement extends JetElement<CActionCardElementSettableProperties>, CActionCardElementSettableProperties {
    addEventListener<T extends keyof CActionCardElementEventMap>(type: T, listener: (this: HTMLElement, ev: CActionCardElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CActionCardElementSettableProperties>(property: T): CActionCardElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CActionCardElementSettableProperties>(property: T, value: CActionCardElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CActionCardElementSettableProperties>): void;
    setProperties(properties: CActionCardElementSettablePropertiesLenient): void;
    /**
     * blurs the card
     */
    blur: ActionCard['blur'];
    /**
     * blurs the card
     */
    click: ActionCard['click'];
    /**
     * focuses the card
     */
    focus: ActionCard['focus'];
}
export namespace CActionCardElement {
    interface ojAction extends CustomEvent<{}> {
    }
}
export interface CActionCardElementEventMap extends HTMLElementEventMap {
    'ojAction': CActionCardElement.ojAction;
}
export interface CActionCardElementSettableProperties extends JetSettableProperties {
}
export interface CActionCardElementSettablePropertiesLenient extends Partial<CActionCardElementSettableProperties> {
    [key: string]: any;
}
export interface ActionCardIntrinsicProps extends Partial<Readonly<CActionCardElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onojAction?: (value: CActionCardElementEventMap['ojAction']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-action-card': ActionCardIntrinsicProps;
        }
    }
}

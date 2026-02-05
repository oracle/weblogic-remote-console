var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_ActionCard", "preact", "ojs/ojvcomponent", "preact/compat", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "css!oj-c/action-card/action-card-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_ActionCard_1, preact_1, ojvcomponent_1, compat_1, hooks_1, UNSAFE_useTabbableMode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActionCard = void 0;
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
    let ActionCard = class ActionCard extends preact_1.Component {
        constructor() {
            super(...arguments);
            this.actionCardRef = (0, preact_1.createRef)();
        }
        render({ children, onOjAction }) {
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(FunctionalActionCard, { ref: this.actionCardRef, onAction: onOjAction, width: "100%", height: "100%", children: children }) }));
        }
        /**
         * blurs the card
         * @ignore
         */
        click() {
            this.actionCardRef.current?.click();
        }
        /**
         * blurs the card
         * @ignore
         */
        blur() {
            this.actionCardRef.current?.blur();
        }
        /**
         * focuses the card
         * @ignore
         */
        focus() {
            this.actionCardRef.current?.focus();
        }
    };
    exports.ActionCard = ActionCard;
    ActionCard._metadata = { "slots": { "": {} }, "events": { "ojAction": { "bubbles": true } }, "methods": { "click": {}, "blur": {}, "focus": {} } };
    ActionCard._translationBundleMap = {
        '@oracle/oraclejet-preact': translationBundle_1.default
    };
    ActionCard._consumedContexts = [UNSAFE_useTabbableMode_1.TabbableModeContext];
    exports.ActionCard = ActionCard = __decorate([
        (0, ojvcomponent_1.customElement)('oj-c-action-card')
    ], ActionCard);
    const FunctionalActionCard = (0, compat_1.forwardRef)((props, ref) => {
        const actionCardRef = (0, hooks_1.useRef)();
        // We need to support methods on the custom-element layer which can only
        // be done using a class-based component. So, we will wrap this
        // functionality-packed functional component in a class-based component.
        // But, the class-based component will still need a way to pass through
        // method calls, so we will be using useImperativeHandle to add these
        // methods to this functional component's ref which can then be called
        // by the wrapping class-based component.
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            focus: () => actionCardRef.current?.focus(),
            blur: () => actionCardRef.current?.blur(),
            click: () => actionCardRef.current?.click()
        }), []);
        return (0, jsx_runtime_1.jsx)(UNSAFE_ActionCard_1.ActionCard, { ref: actionCardRef, ...props });
    });
});

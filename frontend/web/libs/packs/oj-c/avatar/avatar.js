define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_Avatar", "ojs/ojvcomponent", "css!oj-c/avatar/avatar-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_Avatar_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Avatar = void 0;
    exports.Avatar = (0, ojvcomponent_1.registerCustomElement)('oj-c-avatar', 
    /**
     * @classdesc
     * <h3 id="avatarOverview-section">
     *   JET Avatar
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#avatarOverview-section"></a>
     * </h3>
     * <p>Description: Themeable, WAI-ARIA-compliant element that often represents a person.</p>
     * <p>An oj-c-avatar is an icon capable of displaying
     * a custom image, or initials, or a placeholder image.  The order of precedence for
     * what is displayed, in order from highest to lowest, is:</p>
     * <ol>
     *  <li>Icon specified through the "icon-class" attribute</li>
     *  <li>Custom image specified through the "src" attribute</li>
     *  <li>Initials specified through the "initials" attribute</li>
     *  <li>Default placeholder image</li>
     * </ol>
     * <pre class="prettyprint">
     * <code>//Avatar with initials
     * &lt;oj-c-avatar initials="AB">
     * &lt;/oj-c-avatar>
     *</code></pre>
     *  <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     *  </h3>
     *
     * <p>If any associated information (e.g. the name of the person represented by the oj-c-avatar) is already available to assistive technologies, for example by rendering the name in addition to the avatar as part of the page content, then setting the aria-label is optional.
     * Otherwise setting the aria-label is required by passing a descriptive text to the aria-label attribute. The component will then internally set role='img' if the aria-label is set.
     *
     * <p>JET Avatar does not have
     * any interaction with the application, therefore it is not keyboard navigable by default.
     * The aria-label will be picked up by the tabbable/focusable parent unless it is
     * overriden by the application.
     * The parent of the avatar is responsible for providing aria-* props and tooltip support if the avatar is informational or in
     * an actionable element
     *
     *
     * <p>In order to meet <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum">accessibility requirements</a> for text, color contrast ratio
     * between the background color and text must be
     * greater than 4.5 for the two smallest avatars and 3.1 for the five larger avatars.
     * Avatar's default background satisfies the 4.5 color contrast ratio.  If colors are customized through theming, the
     * application is responsible for specifying colors that satisfy the contrast ratio requirements.
     *
     * <h3 id="image-section">
     *   Image
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#image-section"></a>
     *  </h3>
     *
     * <p>The avatar will display an icon if the iconClass is populated.  If it is not, then the avatar will display the image provided
     * from the src attribute if the src
     * attribute is populated.  If the src attribute is not provided and the initials have been,
     * the initials will be displayed.  If neither iconClass, src nor initials attributes are populated,
     * a single person placeholder image is shown.
     * Examples displaying each type of avatar:
     * <pre class="prettyprint">
     * <code>//Individual Placeholder
     * &lt;oj-c-avatar>
     *  &lt;/oj-c-avatar>
     * //Icon
     * &lt;oj-c-avatar icon-class="oj-ux-ico-contact-group">
     *  &lt;/oj-c-avatar>
     * //Initials
     *&lt;oj-c-avatar initials="AB">
     * &lt;/oj-c-avatar>
     * //Image
     *&lt;oj-c-avatar initials="AB" src="image.jpg">
     * &lt;/oj-c-avatar>
     *</code></pre>
     *
     *
     * @ojmetadata description "An avatar represents a person or entity as initials or an image."
     * @ojmetadata displayName "Avatar"
     * @ojmetadata help "oj-c.Avatar.html"
     * @ojmetadata main "oj-c/avatar"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "15.0.0",
     *     "value": ["oj-avatar"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/avatar"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-avatar",
     *     "uxSpecs": [
     *       "avatar"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "size",
     *       "background"
     *     ]
     *   }
     * ]
     * @ojmetadata since "13.0.0"
     */
    ({ src, iconClass, initials, shape = 'square', background = 'neutral', size = 'md', ...otherProps }) => {
        const icon = iconClass ? (0, jsx_runtime_1.jsx)("span", { class: iconClass }) : null;
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_Avatar_1.Avatar, { src: src ?? undefined, background: background, size: size, initials: initials ?? undefined, shape: shape, "aria-label": otherProps['aria-label'], children: icon }) }));
    }, "Avatar", { "properties": { "background": { "type": "string", "enumValues": ["blue", "gray", "green", "orange", "pink", "purple", "teal", "neutral", "slate", "lilac"] }, "initials": { "type": "string|null" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg", "xs", "2xs", "xl", "2xl"] }, "src": { "type": "string|null" }, "iconClass": { "type": "string" }, "shape": { "type": "string", "enumValues": ["square", "circle"] } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-label"] } }, { "shape": "square", "background": "neutral", "size": "md" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

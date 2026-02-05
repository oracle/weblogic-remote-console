/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "preact/compat"], function (require, exports, compat_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.processTemplate = exports.processNodeTemplate = void 0;
    const PRIVATE_VALUE_KEY = '__oj_private_do_not_use_value';
    const PRIVATE_CHECKED_KEY = '__oj_private_do_not_use_checked';
    /**
     * Utility method used by resolveVDomTemplateProps() on TemplateEngine to resolve
     * properties for DVT component templates. The method converts both name and value
     * of private props ('value' and 'checked') into its original form.
     * @param prop
     * @param value
     * @returns
     */
    const convertPrivatePropFromPreact = (prop, value) => {
        // TODO: clean up as part of JET-67994
        if (prop === PRIVATE_VALUE_KEY) {
            return { prop: 'value', value: typeof value !== 'symbol' ? value : undefined }; // if a symbol do undefined.
            // check if in preact we are are getting symbol for null values
        }
        if (prop === PRIVATE_CHECKED_KEY) {
            return { prop: 'checked', value: typeof value !== 'symbol' ? value : undefined };
        }
        return { prop, value };
    };
    /**
     * Convert the prop key to camel case.
     * @param prop The prop of the resolved template.
     * Could be in following formats : BORDER-COLOR, DRILLING, borderColor, drilling
     * @returns
     */
    const getValidProp = (prop) => {
        return prop[0].toLowerCase() !== prop[0]
            ? prop.toLowerCase().replace(/-./g, (c) => c[1].toUpperCase())
            : prop;
    };
    /**
     * Resolve the props of the vnode.
     * @param props
     * @returns
     */
    const resolveProps = (props) => {
        return Object.keys(props).reduce((resolvedProps, origProp) => {
            if (origProp === 'children')
                return resolvedProps;
            const { prop, value } = convertPrivatePropFromPreact(origProp, props[origProp]); // TODO: clean up as part of JET-67994
            resolvedProps[getValidProp(prop)] = value;
            return resolvedProps;
        }, {});
    };
    /**
     * @param datum The datum from data provider.
     * @param template The template slot.
     * @param getContext The function that returns template context.
     * @param templateName The name of the template element.
     * @returns
     */
    const processNodeTemplate = (datum, template, context, templateName) => {
        const children = template(context);
        const node = compat_1.Children.toArray(children).find((child) => {
            if (!child || !child.props) {
                return;
            }
            return (child.props?.children?.type || child.type) === templateName;
        });
        // The computed template node structure varies between cookbook and storybook. We are handling
        // both case here.  TODO: consult with framework team about separate node structure as it feels
        // like we should always get same nodes structure.
        const props = node?.type === templateName ? node.props : (node?.props?.children).props;
        const key = datum.key || datum.metadata?.key; // TODO: we should probably move this logic to processTemplate so this function just does node processing
        return props
            ? { ...resolveProps(props), key, id: key, _itemData: datum.data }
            : { key, id: key, _itemData: datum.data };
    };
    exports.processNodeTemplate = processNodeTemplate;
    /**
     * @param data The array of data from data provider.
     * @param template The template slot.
     * @param getContext The function that returns template context.
     * @param templateName The name of the template element.
     * @returns
     */
    const processTemplate = (data, template, getContext, templateName) => {
        return data.map((datum, index) => (0, exports.processNodeTemplate)(datum, template, getContext(datum, index), templateName));
    };
    exports.processTemplate = processTemplate;
});

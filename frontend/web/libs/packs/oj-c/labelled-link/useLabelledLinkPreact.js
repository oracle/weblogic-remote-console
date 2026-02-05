define(["require", "exports", "preact/hooks"], function (require, exports, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useLabelledLinkPreact = useLabelledLinkPreact;
    /**
     * A custom hook for determining the correct props for the preact
     * LabelledLink component based on the props of the core-pack
     * oj-c-labelled-link component.
     * @param props The props for the hook
     * @returns The props for the preact LabelledLink component
     */
    function useLabelledLinkPreact({ 'aria-describedby': ariaDescribedBy, href, labelEdge, labelHint, labelStartWidth, target, text, textAlign, userAssistanceDensity, onOjAction }) {
        const onClickHandler = (0, hooks_1.useCallback)((event) => {
            // If the href is not provided then it is a custom action.
            // And if this is a custom action, the prevent the default browser
            // action that opens the link
            if (href === undefined) {
                event.preventDefault();
                // trigger the custom action
                onOjAction?.();
            }
        }, [href, onOjAction]);
        return {
            'aria-describedby': ariaDescribedBy,
            children: text,
            href: href ?? '#',
            label: labelHint,
            labelEdge: labelEdge,
            labelStartWidth: labelStartWidth,
            target: target,
            textAlign: textAlign,
            userAssistanceDensity: userAssistanceDensity,
            onClick: onClickHandler
        };
    }
});

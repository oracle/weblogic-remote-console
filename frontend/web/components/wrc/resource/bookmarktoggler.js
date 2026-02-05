define(["require", "exports", "preact/jsx-runtime", "ojL10n!wrc/shared/resources/nls/frontend", "preact/hooks", "wrc/shared/model/transport", "./resource", "oj-c/button"], function (require, exports, jsx_runtime_1, t, hooks_1, transport_1, resource_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BookmarkToggler;
    function BookmarkToggler(props) {
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const { disabled, id, class: className } = props;
        (0, hooks_1.useEffect)(() => {
            const databus = ctx === null || ctx === void 0 ? void 0 : ctx.databus;
            if (databus) {
                const signal = databus.subscribe((event) => {
                    var _a;
                    const main = (_a = event === null || event === void 0 ? void 0 : event.contexts) === null || _a === void 0 ? void 0 : _a.main;
                    setIsBookmarked((main === null || main === void 0 ? void 0 : main.isBookmarked) || false);
                });
                return () => signal.detach();
            }
        }, []);
        const tooltipOn = t["wrc-pages-bookmark"].menus.bookmark.add.label;
        const tooltipOff = t["wrc-pages-bookmark"].menus.bookmark.remove.label;
        const ariaLabelOn = tooltipOn;
        const ariaLabelOff = tooltipOff;
        const [isBookmarked, setIsBookmarked] = (0, hooks_1.useState)(false);
        const iconClass = isBookmarked
            ? "oj-ux-ico-star-full wrc-hightlighted-bookmark"
            : "oj-ux-ico-star";
        const tooltip = isBookmarked ? tooltipOff : tooltipOn;
        const ariaLabel = isBookmarked ? ariaLabelOff : ariaLabelOn;
        const handleToggle = () => {
            const body = {
                resourceData: props.model.rdj.self.resourceData,
                label: props.pageTitle,
            };
            const next = !isBookmarked;
            const command = next ? 'add' : 'delete';
            (0, transport_1._post)(`/api/bookmarks/${command}`, JSON.stringify(body)).then(() => {
                (0, transport_1.getData)(props.model.rdjUrl, undefined, 'main');
            });
        };
        const buttonProps = (0, hooks_1.useMemo)(() => ({
            chroming: "borderless",
            disabled: !!disabled,
            display: "icons",
            tooltip,
            label: ariaLabel,
            "aria-pressed": isBookmarked ? "true" : "false",
        }), [disabled, tooltip, ariaLabel, isBookmarked]);
        return ((0, jsx_runtime_1.jsx)("div", { id: id, class: ["wrc-bookmark-toggler", className].filter(Boolean).join(" "), children: (0, jsx_runtime_1.jsx)("oj-c-button", Object.assign({}, buttonProps, { onojAction: handleToggle, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: iconClass }) })) }));
    }
});
//# sourceMappingURL=bookmarktoggler.js.map
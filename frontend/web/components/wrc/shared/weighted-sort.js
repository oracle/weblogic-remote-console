define(["require", "exports", "preact/jsx-runtime", "preact"], function (require, exports, jsx_runtime_1, preact_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WeightedSort = void 0;
    const WeightedSort = ({ children }) => {
        const compare = (a, b) => {
            var _a, _b;
            if (typeof a !== 'object' || typeof b !== 'object') {
                return 0;
            }
            let a1 = walkNode(a);
            let b1 = walkNode(b);
            const weight1 = ((_a = a1 === null || a1 === void 0 ? void 0 : a1.props) === null || _a === void 0 ? void 0 : _a['data-weight']) || 0;
            const weight2 = ((_b = b1 === null || b1 === void 0 ? void 0 : b1.props) === null || _b === void 0 ? void 0 : _b['data-weight']) || 0;
            return Number(weight1) - Number(weight2);
            function walkNode(node) {
                let vNode = node;
                while (typeof vNode.type === 'function' && vNode.props.children) {
                    if (Array.isArray(vNode.props.children) && vNode.props.children.length <= 0)
                        return null;
                    if (Array.isArray(vNode.props.children) && vNode.props.children.length > 0)
                        vNode = vNode.props.children[0];
                    else if (typeof vNode.props.children === 'object')
                        vNode = vNode.props.children;
                }
                return vNode;
            }
        };
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, preact_1.toChildArray)(children).sort(compare) }));
    };
    exports.WeightedSort = WeightedSort;
});
//# sourceMappingURL=weighted-sort.js.map
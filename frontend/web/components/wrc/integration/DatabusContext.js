define(["require", "exports", "preact/jsx-runtime", "preact", "preact/hooks"], function (require, exports, jsx_runtime_1, preact_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DatabusProvider = exports.DatabusContext = void 0;
    exports.useDatabus = useDatabus;
    exports.DatabusContext = (0, preact_1.createContext)(null);
    const DatabusProvider = ({ databus, children }) => {
        return ((0, jsx_runtime_1.jsx)(exports.DatabusContext.Provider, { value: databus, children: children }));
    };
    exports.DatabusProvider = DatabusProvider;
    function useDatabus() {
        const ctx = (0, hooks_1.useContext)(exports.DatabusContext);
        if (!ctx) {
            throw new Error('DatabusContext not found. Wrap your tree with <DatabusProvider databus={...}>');
        }
        return ctx;
    }
});
//# sourceMappingURL=DatabusContext.js.map
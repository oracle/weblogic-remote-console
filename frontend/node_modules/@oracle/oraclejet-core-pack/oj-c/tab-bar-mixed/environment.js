define(["require", "exports", "preact/jsx-runtime", "@oracle/oraclejet-preact/resources/nls/bundle", "@oracle/oraclejet-preact/UNSAFE_Environment"], function (require, exports, jsx_runtime_1, bundle_1, UNSAFE_Environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Environment = Environment;
    const defaultEnvironment = {
        translations: { '@oracle/oraclejet-preact': bundle_1.default }
    };
    function Environment(props) {
        const { children } = props;
        return ((0, jsx_runtime_1.jsx)(UNSAFE_Environment_1.RootEnvironmentProvider, { environment: { ...defaultEnvironment }, children: children }));
    }
});

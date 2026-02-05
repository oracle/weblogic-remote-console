define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "@oracle/oraclejet-preact/UNSAFE_LiveRegion", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle"], function (require, exports, jsx_runtime_1, hooks_1, UNSAFE_LiveRegion_1, UNSAFE_useTranslationBundle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataFetchLiveRegion = void 0;
    const MSG_DELAY = 50;
    const DataFetchLiveRegion = (props) => {
        const [isFetchingMsgRendered, setFetchingMsgRendered] = (0, hooks_1.useState)(false);
        (0, hooks_1.useEffect)(() => {
            let timeoutId;
            if (props.isFetching) {
                timeoutId = setTimeout(() => {
                    // check if we are still fetching after the delay
                    // if it is then we should render the data finish fetching
                    // message when isFetching becomes false
                    if (props.isFetching) {
                        setFetchingMsgRendered(true);
                    }
                }, MSG_DELAY);
            }
            return () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        }, [props.isFetching]);
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        if (props.isFetching) {
            return (0, jsx_runtime_1.jsx)(UNSAFE_LiveRegion_1.LiveRegion, { timeout: MSG_DELAY, children: translations.list_msgFetchingData() });
        }
        return isFetchingMsgRendered ? ((0, jsx_runtime_1.jsx)(UNSAFE_LiveRegion_1.LiveRegion, { timeout: 0, children: translations.list_msgFetchCompleted() })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
    };
    exports.DataFetchLiveRegion = DataFetchLiveRegion;
});

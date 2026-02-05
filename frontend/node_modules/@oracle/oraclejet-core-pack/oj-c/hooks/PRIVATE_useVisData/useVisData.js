/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "preact/hooks", "../UNSAFE_useDataProvider/useDataProvider"], function (require, exports, hooks_1, useDataProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useVisData = useVisData;
    const STATE_GRAPH = {
        initial: {
            setDP: 'fetching',
            setNoDP: 'fetched'
        },
        fetching: {
            setDP: 'fetching',
            setData: 'fetched',
            setNoDP: 'fetched'
        },
        fetched: {
            setDP: 'fetching',
            setNoDP: 'fetched'
        }
    };
    const reducer = (state, action) => {
        const nextState = STATE_GRAPH[state][action];
        return nextState || state;
    };
    function useVisData({ addBusyState, dataProvider }) {
        const [state, send] = (0, hooks_1.useReducer)(reducer, 'initial');
        const { data } = (0, useDataProvider_1.useDataProvider)({
            data: dataProvider,
            addBusyState
        });
        (0, hooks_1.useEffect)(() => {
            if (state === 'initial')
                return;
            send('setData');
        }, [data]);
        (0, hooks_1.useEffect)(() => {
            send(dataProvider ? 'setDP' : 'setNoDP');
        }, [dataProvider]);
        return {
            data,
            isLoading: state !== 'fetched'
        };
    }
});

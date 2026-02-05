/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');

const rankedSeverities = ['error', 'warning', 'confirmation', 'info', 'none'];
function useMessageSeverity(messages) {
    return hooks.useMemo(() => {
        return messages === undefined
            ? undefined
            : messages.reduce((accSeverity, currMessage) => {
                const currSeverity = currMessage.severity || 'error';
                return rankedSeverities.indexOf(accSeverity) < rankedSeverities.indexOf(currSeverity)
                    ? accSeverity
                    : currSeverity;
            }, 'none');
    }, [messages]);
}

exports.useMessageSeverity = useMessageSeverity;
//# sourceMappingURL=useMessageSeverity-cfc4ae9d.js.map

/* @oracle/oraclejet-preact: undefined */
import { useMemo } from 'preact/hooks';

const rankedSeverities = ['error', 'warning', 'confirmation', 'info', 'none'];
function useMessageSeverity(messages) {
    return useMemo(() => {
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

export { useMessageSeverity as u };
//# sourceMappingURL=useMessageSeverity-65295e8f.js.map

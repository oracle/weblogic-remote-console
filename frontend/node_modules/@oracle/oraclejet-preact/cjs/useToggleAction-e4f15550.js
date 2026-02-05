/* @oracle/oraclejet-preact: undefined */
'use strict';

/**
 * Use to provide support for toggles
 *
 * @returns
 */
function useToggleAction({ isDisabled, onToggle }) {
    const triggerProps = isDisabled
        ? {}
        : {
            onAction: onToggle
        };
    return {
        triggerProps: triggerProps
    };
}

exports.useToggleAction = useToggleAction;
//# sourceMappingURL=useToggleAction-e4f15550.js.map

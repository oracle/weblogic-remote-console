/* @oracle/oraclejet-preact: undefined */
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

export { useToggleAction as u };
//# sourceMappingURL=useToggleAction-fc0f5399.js.map

define(["require", "exports", "preact/hooks"], function (require, exports, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useAssistiveText = useAssistiveText;
    /**
     * Determines which user assistance text should be shown
     *
     * @param help The help object
     * @param validatorHint The first validator hint
     * @param helpHints The helpHints object
     * @param converterHint The converter hint
     * @param displayOptions The display options for auxiliary content
     * @param userAssistanceDensity The user assistance density
     * @returns The help text that needs to be shown based on the order of precedence
     */
    function determineAssistiveText(help, validatorHint, helpHints, converterHint, displayOptions, userAssistanceDensity) {
        // In the Redwood theme for clarity only one user assistance text shows to the user,
        // even if multiple user assistance text properties are on the component. The order of
        // precedence from highest to lowest is below:
        // - help.instruction
        // - validator hint
        // - help-hints.definition
        // - converter hint
        // For compact user assistance density, the help hints definition will be treated like
        // help hints source text, not like regular assistive text.
        const helpHintsDef = userAssistanceDensity !== 'compact' ? helpHints?.definition : undefined;
        return (help?.instruction ||
            (displayOptions?.validatorHint === 'none' ? undefined : validatorHint) ||
            helpHintsDef ||
            (displayOptions?.converterHint === 'none' ? undefined : converterHint));
    }
    /**
     * Fetches the hint strings from the validator array
     *
     * @param validators The current validators
     * @returns The joined hint string
     */
    function determineSyncValidatorHints(validators) {
        if (!validators.length) {
            return undefined;
        }
        const syncHints = validators
            .map((validator) => 
        // getHint function determines sync validators
        typeof validator.getHint === 'function'
            ? validator.getHint()
            : undefined)
            .filter(Boolean);
        return syncHints.join('\n');
    }
    /**
     * A custom hook to determine which assistive text should be shown.
     */
    function useAssistiveText({ addBusyState, converter, displayOptions, help, helpHints, userAssistanceDensity, validators }) {
        const [validatorHint, setValidatorHint] = (0, hooks_1.useState)(!validators || !validators.length ? undefined : determineSyncValidatorHints(validators));
        const staleIdentity = (0, hooks_1.useRef)();
        // Get the validator hint
        (0, hooks_1.useEffect)(() => {
            // clear state when there are no validators
            if (!validators || !validators.length) {
                setValidatorHint(undefined);
                return;
            }
            // set the hints from the sync validators first and then
            // resolve and append the validator hints from async validators
            setValidatorHint(determineSyncValidatorHints(validators));
            const asyncHints = validators
                .map((validator) => 
            // hint property determines sync validators
            validator.hint)
                .filter(Boolean);
            // If an update to the validators occurs while fetching the async validators'
            // hint, the initial fetch could become stale. We need an identity for each fetches
            // to determine the latest one. Only the latest hint will be set as a state.
            // We will be using a symbol for each batch of async hints fetch.
            const localStaleIdentity = (staleIdentity.current = Symbol());
            const resolver = addBusyState?.('resolving the async validator hints');
            Promise.allSettled(asyncHints).then((hints) => {
                setValidatorHint((currentHints) => {
                    const treatedHints = hints
                        .map((result) => (result.status === 'fulfilled' ? result.value : undefined))
                        .filter(Boolean);
                    // Do not update the state if this has gone stale or
                    // if there are no resolved hints
                    if (localStaleIdentity !== staleIdentity.current || !treatedHints.length) {
                        return currentHints;
                    }
                    // if there are resolved hints, append them to the existing hints
                    // Note that it is ok to append to the existing state. This is because,
                    // when the validators change, the setValidatorHint call before this one
                    // sets the state with the sync validators' hint. This overwrites the previous
                    // state and appending here is just a continuation of the previous state update.
                    return [currentHints, ...treatedHints].join('\n');
                });
                resolver?.();
            });
        }, [validators]);
        // In the Redwood theme for clarity only one user assistance text shows to the user,
        // even if multiple user assistance text properties are on the component. The order of
        // precedence from highest to lowest is below:
        // - help.instruction
        // - validator hint
        // - help-hints.definition
        // - converter hint
        // For compact user assistance density, the help hints definition should override the
        // help hints source text.
        const helpSourceText = userAssistanceDensity !== 'compact'
            ? helpHints?.sourceText
            : helpHints?.definition || helpHints?.sourceText;
        return {
            assistiveText: determineAssistiveText(help, validatorHint, helpHints, converter?.getHint?.() ?? undefined, displayOptions, userAssistanceDensity),
            helpSourceLink: helpHints?.source,
            helpSourceText
        };
    }
});

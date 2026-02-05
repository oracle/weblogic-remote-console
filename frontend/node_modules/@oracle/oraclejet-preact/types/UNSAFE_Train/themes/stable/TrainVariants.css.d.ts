declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    readonly stepDisabled: {
        readonly isDisabled: "";
        readonly notDisabled: "";
    };
    readonly stepActive: {
        readonly isActive: "";
        readonly notActive: "";
    };
    readonly connectorConnected: {
        readonly isConnected: string;
        readonly notConnected: string;
    };
    readonly stepLabelCurrent: {
        readonly isCurrent: "";
        readonly notCurrent: "";
    };
    readonly stepLabelVisited: {
        readonly isVisited: "";
        readonly notVisited: "";
    };
    readonly stepLabelDisabled: {
        readonly isDisabled: string;
        readonly notDisabled: "";
    };
    readonly stepIconDisabled: {
        readonly isDisabled: string;
        readonly notDisabled: "";
    };
    readonly stepIconCurrent: {
        readonly isCurrent: "";
        readonly notCurrent: "";
    };
    readonly stepIconActive: {
        readonly isActive: "";
        readonly notActive: "";
    };
    readonly stepIconVisited: {
        readonly isVisited: "";
        readonly notVisited: "";
    };
    readonly messageType: {
        readonly confirmation: "";
        readonly error: "";
        readonly fatal: "";
        readonly info: "";
        readonly warning: "";
    };
    readonly needsEventsHover: {
        readonly isNeedsEventsHover: {
            selectors: {
                '&:not(:active)': object;
            };
        };
        readonly notNeedsEventsHover: "";
    };
    readonly pseudoHover: {
        readonly isPseudoHover: {
            '@media': {
                '(hover: hover)': {
                    selectors: {
                        '&:hover:not(:active)': object;
                    };
                };
            };
        };
        readonly notPseudoHover: "";
    };
    readonly stepIconNeedsEventsHover: {
        readonly isNeedsEventsHover: {
            selectors: {
                '&:not(:active)': object;
            };
        };
        readonly notNeedsEventsHover: "";
    };
    readonly stepIconPseudoHover: {
        readonly isPseudoHover: {
            '@media': {
                '(hover: hover)': {
                    selectors: {
                        '&:hover:not(:active)': object;
                    };
                };
            };
        };
        readonly notPseudoHover: "";
    };
    readonly stepLabelNeedsEventsHover: {
        readonly isNeedsEventsHover: {
            selectors: {
                '&:not(:active)': object;
            };
        };
        readonly notNeedsEventsHover: "";
    };
    readonly stepLabelPseudoHover: {
        readonly isPseudoHover: {
            '@media': {
                '(hover: hover)': {
                    selectors: {
                        '&:hover:not(:active)': object;
                    };
                };
            };
        };
        readonly notPseudoHover: "";
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };

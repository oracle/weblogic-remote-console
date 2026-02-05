import { ComponentThemeType, CompoundVariantStyles, VariantOptions } from '../../UNSAFE_Theme';
type TrainVariants = typeof variants;
type TrainStyles = typeof styles;
type TrainVariantOptions = VariantOptions<TrainVariants>;
type TrainTheme = ComponentThemeType<TrainVariants, TrainStyles>;
/*******************
 * Component Styles
 *******************/
declare const baseStyle: string;
declare const styles: {
    baseListStyle: string;
    stepContainerStyle: string;
    stepBaseStyle: string;
    stepLabelWrapperStyle: string;
    stepLabelBaseStyle: string;
    stepIconContainerStyle: string;
    stepIconBaseStyle: string;
    stepIconDisabledStyle: string;
    stepIconCurrentStyle: string;
    stepIconVisitedStyle: string;
    connectorBaseStyle: string;
    connectorConnectedStyle: string;
    connectorDisconnectedStyle: string;
    messageTypeIconBaseStyle: string;
};
/*******************
 * Style Variants
 *******************/
declare const variants: {
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
};
declare const compoundVariants: CompoundVariantStyles<TrainVariantOptions>;
export type { TrainVariantOptions, TrainStyles, TrainTheme };
export { baseStyle, variants, compoundVariants, styles };

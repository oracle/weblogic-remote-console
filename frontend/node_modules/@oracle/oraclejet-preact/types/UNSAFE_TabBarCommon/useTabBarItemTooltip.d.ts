import { ComponentChild } from 'preact';
type Props = {
    label: string;
    isDisabled: boolean;
};
export declare const useTabBarItemTooltip: ({ label, isDisabled }: Props) => {
    tooltipContent: ComponentChild;
    tooltipEventHandlerProps: Record<string, any>;
    onLogicalFocus: (elem: HTMLElement) => void;
    onLogicalBlur: () => void;
};
export {};

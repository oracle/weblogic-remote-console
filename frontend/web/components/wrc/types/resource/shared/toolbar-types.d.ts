import type { CButtonElement } from "oj-c/button";
export type ToolbarActionEvent = CButtonElement.ojAction;
export type ToolbarButtonConfig = {
    accesskey?: string;
    isEnabled: () => boolean;
    action: (event: ToolbarActionEvent) => void;
    isVisible: () => boolean;
    weight?: number;
    label?: string;
    iconClass?: string;
    iconFile?: string;
    className?: string;
    ref?: any;
};

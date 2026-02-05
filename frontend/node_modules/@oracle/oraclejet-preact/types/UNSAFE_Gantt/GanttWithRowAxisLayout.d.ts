/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
type Props = {
    rowAxisTopGap?: string;
    rowAxisBottomGap?: string;
    resolvedRowAxisWidth: {
        value: number;
        suffix?: 'px' | '%';
    };
    resolvedRowAxisMaxWidth: {
        value: number;
        suffix?: 'px' | '%';
    };
    rowAxis: (resolvedWidth: number, resolvedMaxWidth: number) => ComponentChildren;
    ganttView: ComponentChildren;
};
export declare function GanttWithRowAxisLayout({ rowAxisTopGap, rowAxisBottomGap, resolvedRowAxisWidth, resolvedRowAxisMaxWidth, rowAxis, ganttView }: Props): import("preact").JSX.Element;
export {};

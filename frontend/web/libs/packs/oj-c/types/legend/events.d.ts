/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
export declare const getLegendEventsHandler: (isHideShowOn: boolean, isHighlightOn: boolean, updateHidden: (id: string) => void, updateHighlighted: (id?: string) => void, getDrillDetail: (arr: number[]) => any, drilling: "on" | "off" | undefined, getItemDrilling: (itemIdx: number, sectionIdx: number) => "on" | "off" | "inherit", onOjDrill?: (detail: {
    id: any;
}) => void) => {
    itemActionHandler: (detail: {
        itemId: string;
    }) => void;
    inputHandler: (detail: {
        itemId?: string;
    }) => void;
};

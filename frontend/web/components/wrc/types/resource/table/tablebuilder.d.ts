import { KeySetImpl } from "ojs/ojkeyset";
import "ojs/ojtable";
import { Builder } from "../../shared/controller/builder";
import { TableContentModel } from "../../shared/model/tablecontentmodel";
import "ojs/ojmenu";
import "ojs/ojnavigationlist";
import "ojs/ojselector";
import { JSX } from "preact";
export declare class TableBuilder extends Builder {
    readonly type = "table";
    tableContent: TableContentModel | undefined;
    pageContext?: string;
    bare?: boolean;
    onSelectionChanged?: (keys: KeySetImpl<string>) => void;
    getHTML(): JSX.Element;
    constructor(tableContent: TableContentModel | undefined, pageContext?: string, bare?: boolean, onSelectionChanged?: (keys: KeySetImpl<string>) => void);
    getPageTitle(): string | undefined;
}

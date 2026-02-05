import "oj-c/button";
import { Dispatch } from "preact/hooks";
import { TableContentModel } from "../../shared/model/tablecontentmodel";
type Props = Readonly<{
    tableContent: TableContentModel;
    setTableContent: Dispatch<TableContentModel>;
    showHelp: boolean;
    onHelpClick: () => void;
    pageContext?: string;
    pageLoading?: boolean;
    onPageRefresh?: () => void;
}>;
export declare enum BUTTONS {
    New = "new",
    Write = "write",
    Dashboard = "dashboard"
}
declare const TableToolbar: ({ tableContent, setTableContent, showHelp, onHelpClick, pageContext, pageLoading, onPageRefresh }: Props) => import("preact").JSX.Element;
export default TableToolbar;

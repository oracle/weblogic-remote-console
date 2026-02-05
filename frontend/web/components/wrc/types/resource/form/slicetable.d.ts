import { h } from 'preact';
import { TableContentModel } from 'wrc/shared/model/tablecontentmodel';
import { KeySetImpl } from "ojs/ojkeyset";
type Props = {
    tableModel: TableContentModel;
    pageContext?: string;
    onSelectionChanged?: (keys: KeySetImpl<string>) => void;
};
declare const SliceTable: ({ tableModel, pageContext, onSelectionChanged }: Props) => h.JSX.Element;
export default SliceTable;

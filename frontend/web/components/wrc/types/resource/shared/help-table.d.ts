import { HelpData } from "wrc/shared/typedefs/common";
import { HelpTopic } from "wrc/shared/typedefs/pdj";
type TableRow = HelpData;
type TableColumn = {
    header: string;
};
export type TableDef = {
    columns: TableColumn[];
    rows: TableRow[];
    helpTopics: HelpTopic[];
};
type Props = {
    tableDefinition: TableDef;
};
export declare const HelpTable: ({ tableDefinition }: Props) => import("preact").JSX.Element;
export {};

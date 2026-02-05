import { Action, Column } from "../typedefs/pdj";
import { HelpData } from "../typedefs/common";
import { Datum, PropertyValue, PropertyValueArrayMember, Reference } from '../typedefs/rdj';
import { Model } from "./common";
import { UnresolvedReference } from "./formcontentmodel";
export declare enum SORT_ORDER {
    ASCENDING = "ascending",
    DESCENDING = "descending"
}
export declare class TableContentModel extends Model {
    selectedColumnsForDisplay: Column[] | undefined;
    canCreate(): boolean;
    getCreateForm(): Reference;
    canCreateDashboard(): boolean;
    getDashboardCreateForm(): Reference | undefined;
    sortOrder: SORT_ORDER;
    sortProperty: string | undefined;
    isServerSorted(): boolean;
    getRows(): Datum[];
    getDisplayedColumns(): Column[] | undefined;
    getHiddenColumns(): Column[] | undefined;
    selectColumnsForDisplay(columns: Column[]): void;
    resetColumnsForDisplay(): void;
    hasColumnDisplayCustomizations(): boolean;
    getColumnsCustomizedForDisplay(): {
        displayed: Column[] | undefined;
        hidden: Column[] | undefined;
    };
    getSlices(): import("../typedefs/pdj").Slice[] | undefined;
    showAdvanced: boolean;
    static _clone(object: any): any;
    getActions(): Action[];
    getHelpTopics(): import("../typedefs/pdj").HelpTopic[];
    getDetailedHelp(): HelpData[];
    getIntroductionHTML(): string;
    getRowSelectionProperty(): string | undefined;
    getPreSelectedRows(): string[] | undefined;
    refresh(): Promise<void>;
    clone(): any;
}
export declare function cellCompare(value1: string | number | boolean | Reference | UnresolvedReference | PropertyValueArrayMember | PropertyValue[] | File | null, value2: string | number | boolean | Reference | PropertyValueArrayMember | PropertyValue[] | File | null): number;

import { PDJ } from "../typedefs/pdj";
import { ListDatum, RDJ } from "../typedefs/rdj";
import { Model } from "./common";
export declare class ListContentModel extends Model {
    constructor(rdj: RDJ, pdj: PDJ);
    canSaveToCart: boolean;
    canSaveNow: boolean;
    canDownload: boolean;
    canSupportTokens: boolean;
    getItems(): ListDatum[];
    getHelpTopics(): import("../typedefs/pdj").HelpTopic[];
    getPageTitle(): string | undefined;
    clone(): ListContentModel;
}

import { RDJ } from "../typedefs/rdj";
import { FormContentModel } from './formcontentmodel';
import { TableContentModel } from "./tablecontentmodel";
import { ListContentModel } from "./listcontentmodel";
export declare class ContentModelFactory {
    rdjData: RDJ | undefined;
    baseUrl: string | undefined;
    rdj: string | undefined;
    pdj: string | undefined;
    constructor(rdj?: string, pdj?: string);
    build(slice: string | undefined, context?: string): Promise<TableContentModel | FormContentModel | ListContentModel | undefined>;
}

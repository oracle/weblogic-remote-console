import { JSX } from "preact";
import { Builder } from "../../shared/controller/builder";
import { ListContentModel } from "../../shared/model/listcontentmodel";
import "oj-c/card-view";
import "oj-c/action-card";
import 'ojs/ojdefer';
export declare class ListBuilder extends Builder {
    readonly type = "list";
    listContent: ListContentModel | undefined;
    pageContext?: string;
    constructor(listContent: ListContentModel | undefined, pageContext?: string);
    getPageTitle(): string | undefined;
    getHTML(): JSX.Element;
}

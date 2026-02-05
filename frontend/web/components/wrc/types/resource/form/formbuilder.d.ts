import "ojs/ojcheckboxset";
import "ojs/ojdatetimepicker";
import "ojs/ojdialog";
import "ojs/ojformlayout";
import "ojs/ojinputtext";
import "ojs/ojlabel";
import "ojs/ojselectsingle";
import "ojs/ojswitch";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { TableContentModel } from "../../shared/model/tablecontentmodel";
import "oj-c/button";
import "oj-c/input-text";
import { Builder } from "../../shared/controller/builder";
import { ResourceContext } from "../../integration/resource-context";
export declare class FormBuilder extends Builder {
    type: string;
    perspectiveId: string;
    toolbar: undefined;
    contentModel: FormContentModel | TableContentModel;
    context: ResourceContext | undefined;
    pageContext: string | undefined;
    setModel?: (model: FormContentModel | TableContentModel) => void;
    constructor(contentModel: FormContentModel | TableContentModel, context: ResourceContext | undefined, pageContext: string | undefined);
    getPageTitle(): string | undefined;
    getHTML(): import("preact").JSX.Element;
}

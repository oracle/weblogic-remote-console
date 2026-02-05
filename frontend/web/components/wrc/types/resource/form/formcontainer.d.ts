import { FormContentModel } from "../../shared/model/formcontentmodel";
import { TableContentModel } from "../../shared/model/tablecontentmodel";
type Props = {
    model: FormContentModel | TableContentModel;
    pageContext?: string;
};
export declare const FormContainer: ({ model, pageContext }: Props) => import("preact").JSX.Element;
export {};

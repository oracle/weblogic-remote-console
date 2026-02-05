import "ojs/ojcollapsible";
import { Dispatch } from "preact/hooks";
import { FormContentModel } from "../../shared/model/formcontentmodel";
type Props = {
    formModel: FormContentModel;
    setModel?: Dispatch<FormContentModel>;
};
export declare const FormIntro: ({ formModel, setModel }: Props) => import("preact").JSX.Element;
export {};

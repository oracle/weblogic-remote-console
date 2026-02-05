import { h } from "preact";
import { Dispatch } from "preact/hooks";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import "oj-c/collapsible";
type Props = {
    formModel: FormContentModel;
    setModel?: Dispatch<FormContentModel>;
};
declare const Form: ({ formModel, setModel }: Props) => h.JSX.Element;
export default Form;

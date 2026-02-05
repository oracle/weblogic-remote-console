import { Dispatch } from "preact/hooks";
import { ojInputText } from "ojs/ojinputtext";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { Property } from "../../shared/typedefs/pdj";
import "oj-c/button";
import "ojs/ojselectsingle";
import "ojs/ojformlayout";
import "ojs/ojlabel";
import "ojs/ojtable";
type Props = {
    fieldDescription: Property;
    formModel: FormContentModel;
    valueChangedHandler: (event: ojInputText.valueChanged) => void;
    setModel?: Dispatch<FormContentModel>;
};
declare const PolicyExpression: ({ fieldDescription, formModel, valueChangedHandler }: Props) => import("preact").JSX.Element;
export default PolicyExpression;

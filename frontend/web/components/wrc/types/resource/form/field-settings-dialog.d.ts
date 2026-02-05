import { h } from "preact";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { Property } from "../../shared/typedefs/pdj";
import "oj-c/input-password";
import "ojs/ojselectsingle";
import "oj-c/button";
import "oj-c/input-text";
import "ojs/ojradioset";
type Props = {
    open: boolean;
    formModel: FormContentModel;
    fieldDescription?: Property;
    onClose: () => void;
    onApply: () => void;
};
export default function FieldSettingsDialog({ open, formModel, fieldDescription, onClose, onApply, }: Props): h.JSX.Element;
export {};

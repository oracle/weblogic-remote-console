import { Dispatch, StateUpdater } from "preact/hooks";
import { FormContentModel } from "../../shared/model/formcontentmodel";
type Props = {
    formModel: FormContentModel;
    setModel: Dispatch<StateUpdater<FormContentModel>>;
    showHelp: boolean;
    onHelpClick: () => void;
    pageContext?: string;
    pageLoading?: boolean;
    onPageRefresh?: () => void;
};
export declare enum BUTTONS {
    Cancel = "cancel",
    New = "new",
    Save = "save",
    __DELETE = "__DELETE",
    Write = "write",
    SaveNow = "savenow",
    Dashboard = "dashboard"
}
declare const FormToolbar: ({ formModel, setModel, showHelp, onHelpClick, pageContext, pageLoading, onPageRefresh }: Props) => import("preact").JSX.Element;
export default FormToolbar;

import { Dispatch } from "preact/hooks";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { Action } from "../../shared/typedefs/pdj";
import "oj-c/button";
type Props = {
    formModel?: FormContentModel;
    setModel?: Dispatch<FormContentModel>;
    callback?: () => void;
    completed?: () => void;
    action?: Action;
};
export declare const ActionInputForm: ({ formModel, setModel, callback, completed, action }: Props) => import("preact").JSX.Element;
export {};

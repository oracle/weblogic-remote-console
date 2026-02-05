import "oj-c/button";
import "ojs/ojcheckboxset";
import "oj-c/checkboxset";
import "css!wrc/multiselect.css";
import { Reference } from './shared/typedefs/rdj';
export type SelectOption = {
    label: string;
    key?: string | Reference;
};
export type ChangeEvent = {
    available: SelectOption[];
    chosen: SelectOption[];
};
type Props = {
    available: SelectOption[];
    chosen: SelectOption[];
    changeHandler: (event: ChangeEvent) => void;
    readonly?: boolean;
};
declare const MultiSelect: ({ available, chosen, changeHandler, readonly }: Props) => import("preact").JSX.Element;
export default MultiSelect;

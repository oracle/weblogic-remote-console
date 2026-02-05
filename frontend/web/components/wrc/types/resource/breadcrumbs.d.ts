import { JSX } from "preact";
import { FormContentModel } from "../shared/model/formcontentmodel";
import { TableContentModel } from "../shared/model/tablecontentmodel";
import { ListContentModel } from "../shared/model/listcontentmodel";
import "ojs/ojmenu";
import "ojs/ojoption";
import 'oj-c/conveyor-belt';
type Props = {
    model: FormContentModel | TableContentModel | ListContentModel;
};
export default function Breadcrumbs({ model }: Props): JSX.Element;
export {};

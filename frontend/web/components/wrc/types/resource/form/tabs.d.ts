import "preact";
import 'oj-c/tab-bar';
import 'oj-c/conveyor-belt';
import { ComponentChildren, h } from 'preact';
import { Dispatch, StateUpdater } from 'preact/hooks';
import { FormContentModel } from '../../shared/model/formcontentmodel';
import { TableContentModel } from "wrc/shared/model/tablecontentmodel";
import { ListContentModel } from "wrc/shared/model/listcontentmodel";
type ModelWithSlices = FormContentModel | TableContentModel;
type Props = {
    children: ComponentChildren;
    model: ModelWithSlices;
    setModel: Dispatch<StateUpdater<FormContentModel | TableContentModel | ListContentModel>>;
    setLoading: Dispatch<boolean>;
    pageContext?: string;
};
declare const Tabs: ({ children, model, setModel, setLoading, pageContext }: Props) => h.JSX.Element;
export default Tabs;

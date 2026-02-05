/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { h } from 'preact';
import { FormContentModel } from 'wrc/shared/model/formcontentmodel';
import { TableContentModel } from 'wrc/shared/model/tablecontentmodel';
import { TableBuilder } from 'wrc/resource/table/tablebuilder';
import { KeySetImpl } from "ojs/ojkeyset";

type Props = {
    tableModel: TableContentModel;
    pageContext?: string;
    onSelectionChanged?: (keys: KeySetImpl<string>) => void;
}

const SliceTable = ({ tableModel, pageContext, onSelectionChanged }: Props) => {
    if (tableModel) {
        const tableBuilder = new TableBuilder(tableModel, pageContext, true, onSelectionChanged);
        return tableBuilder.getHTML();
    }

    return (<></>);
 }

// @ts-ignore
const _UNUSED = h;

export default SliceTable;

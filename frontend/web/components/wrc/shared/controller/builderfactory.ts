/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { TableBuilder } from "../../resource/table/tablebuilder";
import { FormBuilder } from "../../resource/form/formbuilder";
import { FormContentModel } from "../model/formcontentmodel";
import { ContentModelFactory } from "../model/contentmodelfactory";
import { TableContentModel } from "../model/tablecontentmodel";
import { ListContentModel } from "../model/listcontentmodel";
import { PDJ } from "../typedefs/pdj";
import { RDJ } from "../typedefs/rdj";
import { Builder } from "./builder";
import { ResourceContext } from "wrc/integration/resource-context";


export let seed = Date.now();

export class BuilderFactory {
    rdj: string;
    pdj: string | undefined;
    resourceContext: ResourceContext | undefined;
    context: string | undefined;

    constructor( rdj: string, pdj: string|undefined, resourceContext: ResourceContext|undefined, context: string|undefined) {
        this.rdj = rdj;
        this.pdj = pdj;
        this.resourceContext = resourceContext;
        this.context = context;
    }

    async build(): Promise<Builder|undefined> {
        const content = await new ContentModelFactory(this.rdj, this.pdj).build(undefined, this.context);

        let builder: Builder;
        if (content) {
            if (content instanceof TableContentModel) {
                // Use FormBuilder for sliceTable (tables with slices) to enable tab navigation
                if (content.getSlices() && content.getSlices()!.length > 0) {
                    builder = new FormBuilder(content as TableContentModel, this.resourceContext, this.context);
                } else {
                    builder = new TableBuilder(content as TableContentModel, this.context);
                }
            } else if (content instanceof ListContentModel) {
                const { ListBuilder } = await import("../../resource/list/listbuilder");
                builder = new ListBuilder(content as ListContentModel, this.context);
            } else {
                builder = new FormBuilder(content as FormContentModel, this.resourceContext, this.context);
            }
            builder.identifier = ++seed;

            return builder;
        }

        return undefined;
    }
}

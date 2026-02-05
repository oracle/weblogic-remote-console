/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import "ojs/ojcheckboxset";
import "ojs/ojdatetimepicker";
import "ojs/ojdialog";
import "ojs/ojformlayout";
import "ojs/ojinputtext";
import "ojs/ojlabel";
import "ojs/ojselectsingle";
import "ojs/ojswitch";

import { FormContentModel } from "../../shared/model/formcontentmodel";
import { TableContentModel } from "../../shared/model/tablecontentmodel";

import "oj-c/button";
import "oj-c/input-text";
import { Builder } from "../../shared/controller/builder";
import { ResourceContext } from "../../integration/resource-context";
import { FormContainer } from "./formcontainer";
import MutableArrayDataProvider = require("ojs/ojmutablearraydataprovider");
import translations = require("ojL10n!wrc/shared/resources/nls/frontend");

/**
 * Class responsible for rendering a form representing a WebLogic bean
 */
export class FormBuilder extends Builder {
  type = "form";

  perspectiveId = "";
  toolbar: undefined;
  contentModel: FormContentModel | TableContentModel;
  context: ResourceContext | undefined;
  pageContext: string | undefined;

  setModel?: (model: FormContentModel | TableContentModel) => void;

  /**
   *
   * @param contentModel
   * @param renderCB
   */
  constructor(contentModel: FormContentModel | TableContentModel, context: ResourceContext|undefined, pageContext: string | undefined) {
    super();

    this.contentModel = contentModel;
    this.context = context;
    this.pageContext = pageContext;
  }

  public getPageTitle(): string | undefined {
    return this.contentModel?.getPageTitle?.();
  }

  public getHTML() {
    return <FormContainer model={this.contentModel} pageContext={this.pageContext}></FormContainer>;
  }
}

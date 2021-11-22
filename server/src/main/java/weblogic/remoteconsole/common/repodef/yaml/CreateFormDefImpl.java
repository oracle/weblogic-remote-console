// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.CreateFormDef;
import weblogic.remoteconsole.common.repodef.CreateFormPresentationDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.schema.CreateFormDefSource;

/**
 * yaml-based implementation of the CreateFormDef interface.
 */
public class CreateFormDefImpl extends FormDefImpl implements CreateFormDef {

  private CreateFormPresentationDefImpl presentationDefImpl;

  public CreateFormDefImpl(
    PageRepoDefImpl pageRepoDefImpl,
    PagePath pagePath,
    CreateFormDefSource source
  ) {
    super(pageRepoDefImpl, pagePath, source);
    this.presentationDefImpl = new CreateFormPresentationDefImpl(this, source.getPresentation());
    createUsedIfDefImpls();
    initializeHelpPageTitle();
  }

  CreateFormPresentationDefImpl getPresentationDefImpl() {
    return presentationDefImpl;
  }

  @Override
  public CreateFormPresentationDef getPresentationDef() {
    return getPresentationDefImpl();
  }
  
  @Override
  protected String getEnglishHelpPageTitle(String typeInstanceName) {
    return "New " + typeInstanceName;
  }

  @Override
  protected String getPageKey() {
    return "create";
  }
}

// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.ActionInputFormDef;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageActionParamDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.schema.ActionInputFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanActionParamDefCustomizerSource;

/**
 * yaml-based implementation of the ActionInputFormDef interface.
 */
class ActionInputFormDefImpl extends PageDefImpl implements ActionInputFormDef {
  private PageActionDefImpl actionDefImpl;
  private List<PageActionParamDefImpl> paramDefImpls = new ArrayList<>();
  private List<PageActionParamDef> paramDefs;

  ActionInputFormDefImpl(PageActionDefImpl actionDefImpl) {
    super(
      actionDefImpl.getPageDefImpl().getPageRepoDefImpl(),
      PagePath.newActionInputFormPagePath(
        actionDefImpl.getPageDefImpl().getPagePath(),
        actionDefImpl.getActionName()
      ),
      actionDefImpl.getCustomizerSource().getInputForm(),
      actionDefImpl.getPageDefImpl().getPageKey() + ".actions." + actionDefImpl.getActionName() + ".inputForm"
    );
    this.actionDefImpl = actionDefImpl;
    finishPropertyBasedInitialization();
    createParamDefImpls(actionDefImpl.getCustomizerSource().getInputForm());
    paramDefs = Collections.unmodifiableList(getParamDefImpls());
  }

  List<PageActionParamDefImpl> getParamDefImpls() {
    return paramDefImpls;
  }

  PageActionDefImpl getActionDefImpl() {
    return actionDefImpl;
  }

  // @Override
  public PageActionDef getActionDef() {
    return getActionDefImpl();
  }

  @Override
  public List<PageActionParamDef> getParamDefs() {
    return paramDefs;
  }

  private void createParamDefImpls(ActionInputFormDefSource inputFormSource) {
    for (BeanActionParamDefCustomizerSource pageParamCustomizerSource : inputFormSource.getParameters()) {
      getParamDefImpls().add(PageActionParamDefImpl.create(this, pageParamCustomizerSource));
    }
  }

  @Override
  protected String getEnglishHelpPageTitle(String typeInstanceName) {
    return typeInstanceName + ": " + actionDefImpl.getHelpLabel().getEnglishText();
  }

  @Override
  public String toString() {
    return getActionDefImpl() + "inputForm";
  }
}

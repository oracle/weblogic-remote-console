// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import weblogic.console.schema.beaninfo.BeanActionDefSource;
import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.ActionInputFormDef;
import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageActionExternalHelpDef;
import weblogic.remoteconsole.common.repodef.PageActionPollingDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.schema.BeanActionDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanActionPollingDefSource;
import weblogic.remoteconsole.common.repodef.schema.MBeanOperationDefSource;
import weblogic.remoteconsole.common.repodef.schema.PageActionDefSource;
import weblogic.remoteconsole.common.utils.WebLogicRoles;

/**
 * yaml-based implementation of the PageActionDef interface.
 */
class PageActionDefImpl extends BeanActionDefImpl implements PageActionDef {
  private PageDefImpl pageDefImpl;
  private PageActionDefSource pageActionDefSource;
  private LocalizableString helpSummaryHTML;
  private LocalizableString detailedHelpHTML;
  private LocalizableString label;
  private LocalizableString helpLabel;
  private LocalizableString successMessage;
  private LocalizableString failureMessage;
  private ActionInputFormDefImpl inputFormDefImpl;
  private PageActionExternalHelpDefImpl externalHelpDefImpl;
  private List<PageActionDefImpl> actionDefImpls = new ArrayList<>();
  private List<PageActionDef> actionDefs;
  private PageActionPollingDefImpl pollingDefImpl;

  static PageActionDefImpl create(PageDefImpl pageDefImpl, PageActionDefSource pageActionDefSource) {
    boolean supported =
      pageDefImpl.getPageRepoDefImpl().getBeanRepoDefImpl().supportsCapabilities(
        pageActionDefSource.getRequiredCapabilities()
      );
    if (!supported) {
      return null;
    }
    if (!pageActionDefSource.getActions().isEmpty()) {
      // This is just a group of actions.  We have a label, but no underlying bean action.
      // Make sure the type doesn't have an action that matches the group name
      // (otherwise the developer could think that the group level node could be used
      // to invoke the action too).
      if (pageDefImpl.getTypeDefImpl().hasActionDef(new Path(pageActionDefSource.getName()))) {
        throw new AssertionError(
          "Action group name matches a bean action name:" 
          + " " + pageActionDefSource.getName()
          + " " + pageDefImpl.getTypeDefImpl()
        );
      }
      // Create a dummy action def source so that we can just reuse BeanActionDefImpl.
      BeanActionDefSource dummySource = new BeanActionDefSource();
      dummySource.setName(pageActionDefSource.getName());
      dummySource.setType("void");
      BeanActionDefCustomizerSource dummyCustomizerSource = new BeanActionDefCustomizerSource();
      dummyCustomizerSource.setDefinition(dummySource);
      dummyCustomizerSource.setName(dummySource.getName());
      PageActionDefImpl actionDefImpl =
        new PageActionDefImpl(
          pageDefImpl,
          pageDefImpl.getTypeDefImpl(),
          new Path(),
          dummySource,
          dummyCustomizerSource,
          pageActionDefSource
        );
      if (actionDefImpl.getActionDefs().isEmpty()) {
        // The user isn't allowed to access any of the actions in this group so nix the group.
        return null;
      }
      return actionDefImpl;
    } else {
      // Find the action on the type
      BeanActionDefImpl beanActionDefImpl =
        pageDefImpl.getTypeDefImpl().getActionDefImpl(new Path(pageActionDefSource.getName()));
      if (beanActionDefImpl == null) {
        return null;
      }
      // Make a copy of the action and overlay any page-specific customizations
      return
        new PageActionDefImpl(
          pageDefImpl,
          beanActionDefImpl.getTypeDefImpl(),
          beanActionDefImpl.getParentPath(),
          beanActionDefImpl.getSource(),
          beanActionDefImpl.getCustomizerSource(),
          pageActionDefSource
        );
    }
  }

  private PageActionDefImpl(
    PageDefImpl pageDefImpl,
    BaseBeanTypeDefImpl typeDefImpl,
    Path parentPath,
    BeanActionDefSource beanActionDefSource,
    BeanActionDefCustomizerSource beanActionDefCustomizerSource,
    PageActionDefSource pageActionDefSource
  ) {
    super(typeDefImpl, parentPath, beanActionDefSource, beanActionDefCustomizerSource);
    this.pageActionDefSource = pageActionDefSource;
    this.pageDefImpl = pageDefImpl;
    createActionDefImpls();
    this.actionDefs = Collections.unmodifiableList(getActionDefImpls());
    initializePollingDef();
    // Initialize the label after the actions since the i18n key depends
    // on whether this action contains actions or not.
    initializeMessagesAndLabels();
    initializeHelp();
    createInputFormDefImpl();
  }

  private void createInputFormDefImpl() {
    if (getCustomizerSource().getInputForm() != null) {
      inputFormDefImpl = new ActionInputFormDefImpl(this);
    }
  }

  private void createActionDefImpls() {
    for (PageActionDefSource childPageActionDefSource : pageActionDefSource.getActions()) {
      PageActionDefImpl actionDefImpl = create(pageDefImpl, childPageActionDefSource);
      if (actionDefImpl != null) {
        actionDefImpls.add(actionDefImpl);
      }
    }
  }

  PageDefImpl getPageDefImpl() {
    return pageDefImpl;
  }

  @Override
  public PageDef getPageDef() {
    return getPageDefImpl();
  }

  @Override
  public LocalizableString getLabel() {
    return this.label;
  }

  @Override
  public LocalizableString getSuccessMessage() {
    return this.successMessage;
  }

  @Override
  public LocalizableString getFailureMessage() {
    return this.failureMessage;
  }

  @Override
  public LocalizableString getHelpLabel() {
    return this.helpLabel;
  }

  PageActionExternalHelpDefImpl getExternalHelpDefImpl() {
    return externalHelpDefImpl;
  }

  @Override
  public PageActionExternalHelpDef getExternalHelpDef() {
    return getExternalHelpDefImpl();
  }

  @Override
  public LocalizableString getHelpSummaryHTML() {
    return helpSummaryHTML;
  }

  @Override
  public LocalizableString getDetailedHelpHTML() {
    return detailedHelpHTML;
  }

  @Override
  public String getActionMethod() {
    return getCustomizerSource().getActionMethod();
  }

  List<PageActionDefImpl> getActionDefImpls() {
    return actionDefImpls;
  }

  @Override
  public List<PageActionDef> getActionDefs() {
    return actionDefs;
  }

  @Override
  public String getRows() {
    return pageActionDefSource.getRows().toString();
  }

  @Override
  public Set<String> getInvokeRoles() {
    if (isInvokable()) {
      // This is an invokable action
      return WebLogicRoles.ALL;
    } else {
      // This is just a group of actions.  Anyone is allowed to access it.
      return WebLogicRoles.ALL;
    }
  }

  ActionInputFormDefImpl getInputFormDefImpl() {
    return inputFormDefImpl;
  }

  @Override
  public ActionInputFormDef getInputFormDef() {
    return getInputFormDefImpl();
  }

  PageActionPollingDefImpl getPollingDefImpl() {
    return pollingDefImpl;
  }

  @Override
  public PageActionPollingDef getPollingDef() {
    return getPollingDefImpl();
  }

  private void initializePollingDef() {
    BeanActionPollingDefSource polling = getCustomizerSource().getPolling();
    this.pollingDefImpl = (polling != null) ? new PageActionPollingDefImpl(this, polling) : null;
  }

  private void initializeHelp() {
    initializeHelpSummaryHTML();
    initializeDetailedHelpHTML();
    initializePageActionExternalHelpDef();
  }

  private void initializeHelpSummaryHTML() {
    this.helpSummaryHTML =
      new LocalizableString(getHelpSummaryHTMLLocalizationKey(), getEnglishHelpSummaryHTML());
  }

  private void initializeDetailedHelpHTML() {
    this.detailedHelpHTML =
      new LocalizableString(getDetailedHelpHTMLLocalizationKey(), getEnglishDetailedHelpHTML());
  }

  private String getEnglishHelpSummaryHTML() {
    return
      HelpHTMLUtils.getEnglishHelpSummaryHTML(
        getSource().getDescriptionHTML(),
        getCustomizerSource().getHelpHTML(),
        getCustomizerSource().getHelpSummaryHTML(),
        getCustomizerSource().getHelpDetailsHTML()
      );
  }

  private String getEnglishDetailedHelpHTML() {
    return
      HelpHTMLUtils.getEnglishDetailedHelpHTML(
        getSource().getDescriptionHTML(),
        getCustomizerSource().getHelpHTML(),
        getCustomizerSource().getHelpSummaryHTML(),
        getCustomizerSource().getHelpDetailsHTML()
      );
  }

  private void initializePageActionExternalHelpDef() {
    BeanActionDef mbeanOperationActionDef = getMBeanOperationActionDef();
    if (mbeanOperationActionDef == null) {
      // No external help for this property
      return;
    }
    externalHelpDefImpl = new PageActionExternalHelpDefImpl(this, mbeanOperationActionDef);
  }

  private BeanActionDef getMBeanOperationActionDef() {
    if (getPageDefImpl().getPageRepoDefImpl().getBeanRepoDefImpl().getMBeansVersion().getWebLogicVersion() == null) {
      // This property's page repo doesn't support WebLogic mbeans.
      return null;
    }
    MBeanOperationDefSource source = getCustomizerSource().getMbeanOperation();
    String operationName = source.getOperation();
    if (StringUtils.isEmpty(operationName) && isPageLevelAction()) {
      // This action is a custom action defined on the page
      // i.e. not one backed by an mbean.
      // So, there is no external mbean javadoc available for it.
      return null;
    }
    String typeName = source.getType();
    BaseBeanTypeDefImpl typeDefImpl =
      StringUtils.isEmpty(typeName)
        ? getPageDefImpl().getTypeDefImpl()
        : getPageDefImpl().getTypeDefImpl().getBeanRepoDefImpl().getTypeDefImpl(typeName);
    boolean searchSubTypes = true;
    if (StringUtils.isEmpty(operationName)) {
      operationName = getActionName();
    }
    BeanActionDefImpl actionDefImpl =
      typeDefImpl.getActionDefImpl(new Path(operationName), searchSubTypes);
    Path parentPath = actionDefImpl.getParentPath();
    if (!parentPath.isEmpty()) {
      // The action lives in a child bean of the bean for the page.
      // Find the corresponding action on the child bean.
      actionDefImpl =
        typeDefImpl
          .getChildDefImpl(parentPath, searchSubTypes)
          .getChildTypeDefImpl()
          .getActionDefImpl(
            new Path(actionDefImpl.getActionName()),
            searchSubTypes
          );
    } else {
      // The property lives directly on the bean for the page
    }

    if (actionDefImpl.getCustomizerSource().isDisableMBeanJavadoc()
          || actionDefImpl.getTypeDefImpl().isDisableMBeanJavadoc()) {
      // This property's mbean type doesn't have external mbean javadoc available for it.
      return null;
    }

    return actionDefImpl;
  }

  private void initializeMessagesAndLabels() {
    this.label =
      new LocalizableString(getLabelLocalizationKey(), computeEnglishLabel());
    this.helpLabel =
      new LocalizableString(getHelpLabelLocalizationKey(), computeEnglishHelpLabel());
    {
      String message = getCustomizerSource().getSuccessMessage();
      if (!StringUtils.isEmpty(message)) {
        this.successMessage = new LocalizableString(getSuccessMessageLocalizationKey(), message);
      }
    }
    {
      String message = getCustomizerSource().getFailureMessage();
      if (!StringUtils.isEmpty(message)) {
        this.failureMessage = new LocalizableString(getFailureMessageLocalizationKey(), message);
      }
    }
  }

  private String computeEnglishLabel() {
    // If the label was specified at the page level, use it.
    // Otherwise use the label from the bean level.
    String englishLabel = pageActionDefSource.getLabel();
    if (StringUtils.isEmpty(englishLabel)) {
      englishLabel = computeEnglishBeanActionLabel();
    }
    return englishLabel;    
  }

  private String computeEnglishHelpLabel() {
    // If the help label was specified at the bean level, use it.
    // Otherwise use the label from the bean level.
    // Note: we don't support customizing the help label at the page level.
    String englishLabel = getCustomizerSource().getHelpLabel();
    if (StringUtils.isEmpty(englishLabel)) {
      englishLabel = computeEnglishBeanActionLabel();
    }
    return englishLabel;    
  }

  private String computeEnglishBeanActionLabel() {
    // If the label was specified at the bean level, use it.
    // Otherwise derive it from the bean level name.
    String englishLabel = getCustomizerSource().getLabel();
    if (StringUtils.isEmpty(englishLabel)) {
      englishLabel = StringUtils.camelCaseToUpperCaseWords(getCustomizerSource().getName());
    }
    return englishLabel;
  }

  private String getHelpSummaryHTMLLocalizationKey() {
    return getLocalizationKey("helpSummaryHTML");
  }

  private String getDetailedHelpHTMLLocalizationKey() {
    return getLocalizationKey("detailedHelpHTML");
  }

  private String getLabelLocalizationKey() {
    return getLocalizationKey("label");
  }

  private String getHelpLabelLocalizationKey() {
    return getLocalizationKey("helpLabel");
  }

  private String getSuccessMessageLocalizationKey() {
    return getLocalizationKey("successMessage");
  }

  private String getFailureMessageLocalizationKey() {
    return getLocalizationKey("failureMessage");
  }

  @Override
  String getLocalizationKey(String key) {
    return
    getPageDefImpl().getLocalizationKey(
        "actions." + getActionPath().getDotSeparatedPath() + "." + key
      );
  }

  @Override
  public boolean isPageLevelAction() {
    return getCustomizerSource().getDefinition() != null;
  }

  @Override
  public String toString() {
    return getPageDef() + "action=<" + getActionPath() + ">";
  }
}

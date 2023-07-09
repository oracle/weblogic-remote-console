// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.List;

import weblogic.remoteconsole.common.repodef.ActionInputFormDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageActionParamDef;
import weblogic.remoteconsole.common.repodef.PageFieldPresentationDef;
import weblogic.remoteconsole.common.repodef.schema.BeanActionParamDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanActionParamDefSource;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * yaml-based implementation of the PageActionParamDef interface.
 */
class PageActionParamDefImpl extends BeanActionParamDefImpl implements PageActionParamDef {

  private ActionInputFormDefImpl inputFormDefImpl;
  private BeanActionParamDefCustomizerSource pageLevelCustomizerSource;
  private LocalizableString helpSummaryHTML;
  private LocalizableString detailedHelpHTML;
  private LocalizableString label;
  private PageActionParamPresentationDefImpl presentationDefImpl;

  static PageActionParamDefImpl create(
    ActionInputFormDefImpl inputFormDefImpl,
    BeanActionParamDefCustomizerSource pageLevelCustomizerSource
  ) {
    if (pageLevelCustomizerSource.getDefinition() == null) {
      // Find the param on the bean action
      String paramName = pageLevelCustomizerSource.getName();
      BeanActionParamDefImpl beanParamDefImpl =
        inputFormDefImpl.getActionDefImpl().getParamDefImpl(paramName);
      // Make a copy of the param and overlay any page-specific customizations
      BeanActionParamDefCustomizerSource customizerSource = new BeanActionParamDefCustomizerSource();
      customizerSource.merge(beanParamDefImpl.getCustomizerSource(), new Path());
      customizerSource.merge(pageLevelCustomizerSource, new Path());
      customizerSource.setName(paramName);
      return
        new PageActionParamDefImpl(
          inputFormDefImpl,
          beanParamDefImpl.getSource(),
          customizerSource,
          pageLevelCustomizerSource
        );
    } else {
      // The param isn't on the type.  Instead the 'definition' in the PDY
      // gives the rest of the info about the param.
      // Copy over the name so that we don't need to specify it twice in the PDY:
      pageLevelCustomizerSource.getDefinition().setName(pageLevelCustomizerSource.getName());
      return
        new PageActionParamDefImpl(
          inputFormDefImpl,
          pageLevelCustomizerSource.getDefinition(),
          pageLevelCustomizerSource,
          pageLevelCustomizerSource
        );
    }
  }

  private PageActionParamDefImpl(
    ActionInputFormDefImpl inputFormDefImpl,
    BeanActionParamDefSource source,
    BeanActionParamDefCustomizerSource customizerSource,
    BeanActionParamDefCustomizerSource pageLevelCustomizerSource
  ) {
    super(inputFormDefImpl.getActionDefImpl(), source, customizerSource);
    this.inputFormDefImpl = inputFormDefImpl;
    this.pageLevelCustomizerSource = pageLevelCustomizerSource;
    initializeLabel();
    initializeHelp();
    initializePresentationDef();
  }

  ActionInputFormDefImpl getInputFormDefImpl() {
    return inputFormDefImpl;
  }

  @Override
  public ActionInputFormDef getInputFormDef() {
    return getInputFormDefImpl();
  }

  @Override
  public boolean isSupportsOptions() {
    return isReference();
  }

  @Override
  public List<String> getOptionsSources() {
    if (isSupportsOptions()) {
      return getCustomizerSource().getOptionsSources();
    } else {
      return null;
    }
  }

  @Override
  public boolean isAllowNoneOption() {
    return false;
  }

  @Override
  public LocalizableString getLabel() {
    return this.label;
  }

  @Override
  public LocalizableString getHelpSummaryHTML() {
    return helpSummaryHTML;
  }

  @Override
  public LocalizableString getDetailedHelpHTML() {
    return detailedHelpHTML;
  }

  PageActionParamPresentationDefImpl getPresentationDefImpl() {
    return presentationDefImpl;
  }

  @Override
  public PageFieldPresentationDef getPresentationDef() {
    return getPresentationDefImpl();
  }

  @Override
  public boolean isPageLevelField() {
    return pageLevelCustomizerSource.getDefinition() != null;
  }

  private void initializeLabel() {
    String englishLabel = getCustomizerSource().getLabel();
    if (StringUtils.isEmpty(englishLabel)) {
      englishLabel = StringUtils.camelCaseToUpperCaseWords(getCustomizerSource().getName());
    }
    this.label = new LocalizableString(getLocalizationKey("label"), englishLabel);
  }

  private void initializeHelp() {
    this.helpSummaryHTML =
      new LocalizableString(
        getLocalizationKey("helpSummaryHTML"),
        HelpHTMLUtils.getEnglishHelpSummaryHTML(
          getSource().getDescriptionHTML(),
          getCustomizerSource().getHelpHTML(),
          getCustomizerSource().getHelpSummaryHTML(),
          getCustomizerSource().getHelpDetailsHTML()
        )
      );
    this.detailedHelpHTML =
      new LocalizableString(
        getLocalizationKey("detailedHelpHTML"),
        HelpHTMLUtils.getEnglishDetailedHelpHTML(
          getSource().getDescriptionHTML(),
          getCustomizerSource().getHelpHTML(),
          getCustomizerSource().getHelpSummaryHTML(),
          getCustomizerSource().getHelpDetailsHTML()
        )
      );
  }

  private void initializePresentationDef() {
    this.presentationDefImpl =
      new PageActionParamPresentationDefImpl(this, getCustomizerSource().getPresentation());
  }

  String getInlineFieldHelpLocalizationKey() {
    return getLocalizationKey("inlineFieldHelp");
  }

  @Override
  String getLocalizationKey(String key) {
    return getInputFormDefImpl().getLocalizationKey("params." + getParamName() + "." + key);
  }

  @Override
  public String toString() {
    return getInputFormDef() + " param=" + getParamName();
  }
}

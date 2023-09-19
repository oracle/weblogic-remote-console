// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.ActionInputFormDef;
import weblogic.remoteconsole.common.repodef.LegalValueDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageActionParamDef;
import weblogic.remoteconsole.common.repodef.PageFieldPresentationDef;
import weblogic.remoteconsole.common.repodef.schema.BeanActionParamDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanActionParamDefSource;
import weblogic.remoteconsole.common.repodef.schema.LegalValueDefCustomizerSource;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * yaml-based implementation of the PageActionParamDef interface.
 */
class PageActionParamDefImpl extends BeanActionParamDefImpl implements PageActionParamDef {

  private static final Logger LOGGER = Logger.getLogger(PageActionParamDefImpl.class.getName());

  private ActionInputFormDefImpl inputFormDefImpl;
  private BeanActionParamDefCustomizerSource pageLevelCustomizerSource;
  private LocalizableString helpSummaryHTML;
  private LocalizableString detailedHelpHTML;
  private LocalizableString label;
  private PageActionParamPresentationDefImpl presentationDefImpl;
  private List<PageActionParamLegalValueDefImpl> legalValueDefImpls = new ArrayList<>();
  private List<LegalValueDef> legalValueDefs;

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
    initializeLegalValueDefs();
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

  private void initializeLegalValueDefs() {
    mergePageActionParamLegalValueDefImpls(
      createSourceLevelPageActionParamLegalValueDefImpls(),
      createCustomizerSourceLevelPageActionParamLegalValueDefImpls()
    );
    legalValueDefs = Collections.unmodifiableList(getLegalValueDefImpls());
  }

  private void mergePageActionParamLegalValueDefImpls(
    List<PageActionParamLegalValueDefImpl> sourceVals,
    List<PageActionParamLegalValueDefImpl> customizerVals
  ) {
    if (sourceVals.isEmpty()) {
      getLegalValueDefImpls().addAll(customizerVals);
    } else {
      for (PageActionParamLegalValueDefImpl sourceVal : sourceVals) {
        PageActionParamLegalValueDefImpl customizerVal =
          findPageActionParamLegalValueDefImpl(sourceVal, customizerVals);
        if (customizerVal != null) {
          if (customizerVal.isOmit()) {
            // The customizer wants to remove this value from the list of legal values.
            // Skip it.
          } else {
            getLegalValueDefImpls().add(customizerVal);
          }
        } else {
          getLegalValueDefImpls().add(sourceVal);
        }
      }
      for (PageActionParamLegalValueDefImpl customizerVal : customizerVals) {
        if (findPageActionParamLegalValueDefImpl(customizerVal, sourceVals) == null) {
          // The bean doesn't support this legal value
          // That's OK - just omit it.
          // For example, a newer version of WLS added the legal value
          // and we're using yamls from an older version of WLS that doesn't
          // have it.
          LOGGER.finest(
            "Missing legal value"
            + " "
            + getInputFormDefImpl().getPageRepoDefImpl().getBeanRepoDefImpl().getMBeansVersion().getWebLogicVersion()
            + " " + this
            + " " + customizerVal.getValueAsString()
          );
        }
      }
    }
  }

  private List<PageActionParamLegalValueDefImpl> createSourceLevelPageActionParamLegalValueDefImpls() {
    List<PageActionParamLegalValueDefImpl> rtn = new ArrayList<>();
    for (Object legalValue : getSource().getLegalValues()) {
      if (getCustomizerSource().isUseUnlocalizedLegalValuesAsLabels()) {
        // set the english label to null so that the legal value doesn't get localized
        rtn.add(new PageActionParamLegalValueDefImpl(this, legalValue, null));
      } else {
        // don't set the english label so that the value gets used as the engligh label
        rtn.add(new PageActionParamLegalValueDefImpl(this, legalValue));
      }
    }
    return rtn;
  }

  private List<PageActionParamLegalValueDefImpl> createCustomizerSourceLevelPageActionParamLegalValueDefImpls() {
    List<PageActionParamLegalValueDefImpl> rtn = new ArrayList<>();
    for (LegalValueDefCustomizerSource src : getCustomizerSource().getLegalValues()) {
      boolean supported =
        getActionDefImpl()
          .getTypeDefImpl()
          .getBeanRepoDefImpl()
          .supportsCapabilities(src.getRequiredCapabilities()
        );
      if (supported) {
        rtn.add(new PageActionParamLegalValueDefImpl(this, src.getValue(), src.getLabel(), src.isOmit()));
      }
    }
    return rtn;
  }

  private PageActionParamLegalValueDefImpl findPageActionParamLegalValueDefImpl(
    PageActionParamLegalValueDefImpl want,
    List<PageActionParamLegalValueDefImpl> vals
  ) {
    for (PageActionParamLegalValueDefImpl have : vals) {
      if (StringUtils.nonNull(want.getValueAsString()).equals(StringUtils.nonNull(have.getValueAsString()))) {
        return have;
      }
    }
    return null;
  }

  String getInlineFieldHelpLocalizationKey() {
    return getLocalizationKey("inlineFieldHelp");
  }

  String getLegalValueLocalizationKey(String legalValue) {
    return getLocalizationKey("legalValues." + legalValue);
  }

  @Override
  String getLocalizationKey(String key) {
    return getInputFormDefImpl().getLocalizationKey("params." + getParamName() + "." + key);
  }

  List<PageActionParamLegalValueDefImpl> getLegalValueDefImpls() {
    return legalValueDefImpls;
  }

  @Override
  public List<LegalValueDef> getLegalValueDefs() {
    return legalValueDefs;
  }

  @Override
  public String toString() {
    return getInputFormDef() + " param=" + getParamName();
  }
}

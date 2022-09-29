// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.GetPropertyOptionsCustomizerDef;
import weblogic.remoteconsole.common.repodef.GetPropertyValueCustomizerDef;
import weblogic.remoteconsole.common.repodef.LegalValueDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.PagePropertyExternalHelpDef;
import weblogic.remoteconsole.common.repodef.PagePropertyPresentationDef;
import weblogic.remoteconsole.common.repodef.PagePropertyUsedIfDef;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.LegalValueDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.MBeanAttributeDefSource;
import weblogic.remoteconsole.common.repodef.schema.UsedIfDefSource;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.Value;

/**
 * yaml-based implementation of the PagePropertyDef interface.
 *
 * It implements the page-specific features and delegates the rest to a BeanPropertyDefImpl.
 */
class PagePropertyDefImpl implements PagePropertyDef {
  private PageDefImpl pageDefImpl;
  private BeanPropertyDefImpl beanPropertyDefImpl;
  BeanPropertyDefCustomizerSource pageLevelCustomizerSource;
  private LocalizableString helpSummaryHTML;
  private LocalizableString detailedHelpHTML;
  private LocalizableString label;
  private PagePropertyExternalHelpDefImpl externalHelpDefImpl;
  private PagePropertyPresentationDefImpl presentationDefImpl;
  private List<LegalValueDefImpl> legalValueDefImpls = new ArrayList<>();
  private List<LegalValueDef> legalValueDefs;
  private PagePropertyUsedIfDefImpl usedIfDefImpl;
  private static final String PARA_BEGIN = "<p>";
  private static final String PARA_END = "</p>";

  // The page property is backed by a bean property
  PagePropertyDefImpl(
    PageDefImpl pageDefImpl,
    BeanPropertyDefImpl beanPropertyDefImpl,
    BeanPropertyDefCustomizerSource pageLevelCustomizerSource
  ) {
    // Overlay the page-level customizations with the type-level customizations,
    // the use the merged customizations to create a clone of the type-level BeanPropertyDefImpl.
    this.beanPropertyDefImpl =
      beanPropertyDefImpl.clone(
        mergeCustomizerSources(beanPropertyDefImpl.getCustomizerSource(), pageLevelCustomizerSource)
      );
    initialize(pageDefImpl, pageLevelCustomizerSource);
  }

  // The page property is not backed by a bean property (i.e. is a computed property that's only on the page)
  // Instead, it's 'definition' contains the rest of the property's description.
  PagePropertyDefImpl(
    PageDefImpl pageDefImpl,
    BeanPropertyDefCustomizerSource pageLevelCustomizerSource
  ) {
    this.beanPropertyDefImpl =
      pageDefImpl.getTypeDefImpl().asYamlBasedBeanTypeDefImpl().createBeanPropertyDefImpl(
        new Path(), // the property lives at the page level
        pageLevelCustomizerSource.getDefinition(), // the PDY defines the property (v.s. FooBean.yaml)
        pageLevelCustomizerSource // and the PDY customizes the definition (just like for a bean based property)
      );
    initialize(pageDefImpl, pageLevelCustomizerSource);
  }

  private void initialize(
    PageDefImpl pageDefImpl,
    BeanPropertyDefCustomizerSource pageLevelCustomizerSource
  ) {
    this.pageLevelCustomizerSource = pageLevelCustomizerSource;
    this.pageDefImpl = pageDefImpl;
    initializeHelp();
    initializeLabel();
    initializeLegalValueDefs();
    initializePresentationDef();
    // Note - can't create the used if yet since it needs to find the property that it references,
    // but that property might not have been created yet
  }

  // The PageDefImpl will call this after all the properties on the page have been created,
  // making it possible for the used if to find the property that it references.
  void createUsedIfDefImpl() {
    UsedIfDefSource usedIfSource = beanPropertyDefImpl.getCustomizerSource().getUsedIf();
    if (usedIfSource != null) {
      usedIfDefImpl = new PagePropertyUsedIfDefImpl(this, usedIfSource);
    }
  }

  PagePropertyUsedIfDefImpl getUsedIfDefImpl() {
    return usedIfDefImpl;
  }

  @Override
  public PagePropertyUsedIfDef getUsedIfDef() {
    return getUsedIfDefImpl();
  }

  PageDefImpl getPageDefImpl() {
    return pageDefImpl;
  }

  @Override
  public PageDef getPageDef() {
    return getPageDefImpl();
  }

  @Override
  public LocalizableString getHelpSummaryHTML() {
    return helpSummaryHTML;
  }

  @Override
  public LocalizableString getDetailedHelpHTML() {
    return detailedHelpHTML;
  }

  PagePropertyPresentationDefImpl getPresentationDefImpl() {
    return presentationDefImpl;
  }

  @Override
  public PagePropertyPresentationDef getPresentationDef() {
    return presentationDefImpl;
  }

  List<LegalValueDefImpl> getLegalValueDefImpls() {
    return legalValueDefImpls;
  }

  @Override
  public List<LegalValueDef> getLegalValueDefs() {
    return legalValueDefs;
  }

  @Override
  public boolean isSupportsOptions() {
    return isReference();
  }

  @Override
  public List<String> getOptionsSources() {
    if (isSupportsOptions()) {
      return beanPropertyDefImpl.getCustomizerSource().getOptionsSources();
    } else {
      return null;
    }
  }

  @Override
  public boolean isAllowNoneOption() {
    if (!isSupportsOptions()) {
      return false;
    }
    if (isReference()) {
      if (isReferenceAsReferences() || !isArray()) {
        return true;
      }
    }
    return false;
  }

  @Override
  public LocalizableString getLabel() {
    return label;
  }

  PagePropertyExternalHelpDefImpl getExternalHelpDefImpl() {
    return externalHelpDefImpl;
  }

  @Override
  public PagePropertyExternalHelpDef getExternalHelpDef() {
    return getExternalHelpDefImpl();
  }

  @Override public boolean isSupportsModelTokens() {
    if (isPageLevelProperty()) {
      if (!beanPropertyDefImpl.getCustomizerSource().isSupportsModelTokensSpecifiedInYaml()) {
        // Since this property is not backed by an mbean, it cannot be set to a model token.
        return false;
      }
    }
    return beanPropertyDefImpl.isSupportsModelTokens();
  }

  private static BeanPropertyDefCustomizerSource mergeCustomizerSources(
    BeanPropertyDefCustomizerSource typeLevelCustomizerSource,
    BeanPropertyDefCustomizerSource pageLevelCustomizerSource
  ) {
    BeanPropertyDefCustomizerSource rtn = new BeanPropertyDefCustomizerSource();
    rtn.merge(typeLevelCustomizerSource, new Path());
    rtn.merge(pageLevelCustomizerSource, new Path());
    return rtn;
  }

  private void initializeLabel() {
    String englishLabel = computeEnglishLabel();
    if (beanPropertyDefImpl.getCustomizerSource().isUseUnlocalizedNameAsLabel()) {
      this.label = new LocalizableString(englishLabel);
    } else {
      this.label = new LocalizableString(getLabelLocalizationKey(), englishLabel);
    }
  }

  private String computeEnglishLabel() {
    String englishLabel = beanPropertyDefImpl.getCustomizerSource().getLabel();
    if (StringUtils.isEmpty(englishLabel)) {
      englishLabel = StringUtils.camelCaseToUpperCaseWords(getPropertyName());
    }
    return englishLabel;
  }

  private void initializePresentationDef() {
    this.presentationDefImpl =
      new PagePropertyPresentationDefImpl(this, beanPropertyDefImpl.getCustomizerSource().getPresentation());
  }

  private void initializeLegalValueDefs() {
    mergeLegalValueDefImpls(
      createSourceLevelLegalValueDefImpls(),
      createCustomizerSourceLevelLegalValueDefImpls()
    );
    legalValueDefs = Collections.unmodifiableList(getLegalValueDefImpls());
  }

  private void mergeLegalValueDefImpls(List<LegalValueDefImpl> sourceVals, List<LegalValueDefImpl> customizerVals) {
    if (sourceVals.isEmpty()) {
      getLegalValueDefImpls().addAll(customizerVals);
    } else {
      for (LegalValueDefImpl sourceVal : sourceVals) {
        LegalValueDefImpl customizerVal = findLegalValueDefImpl(sourceVal, customizerVals);
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
      for (LegalValueDefImpl customizerVal : customizerVals) {
        if (findLegalValueDefImpl(customizerVal, sourceVals) == null) {
          StringBuilder sb = new StringBuilder();
          sb.append("trying to customize a legal value that doesn't exist: ");
          sb.append(customizerVal.getValueAsString());
          sb.append(". allowed:");
          for (LegalValueDefImpl sourceVal : sourceVals) {
            sb.append(" ");
            sb.append(sourceVal.getValueAsString());
          }
          throw beanPropertyDefImpl.configurationError(sb.toString());
        }
      }
    }
  }

  private List<LegalValueDefImpl> createSourceLevelLegalValueDefImpls() {
    List<LegalValueDefImpl> rtn = new ArrayList<>();
    for (Object legalValue : beanPropertyDefImpl.getSource().getLegalValues()) {
      if (beanPropertyDefImpl.getCustomizerSource().isUseUnlocalizedLegalValuesAsLabels()) {
        // set the english label to null so that the legal value doesn't get localized
        rtn.add(new LegalValueDefImpl(this, legalValue, null));
      } else {
        // don't set the english label so that the value gets used as the engligh label
        rtn.add(new LegalValueDefImpl(this, legalValue));
      }
    }
    return rtn;
  }

  private List<LegalValueDefImpl> createCustomizerSourceLevelLegalValueDefImpls() {
    List<LegalValueDefImpl> rtn = new ArrayList<>();
    for (LegalValueDefCustomizerSource src : beanPropertyDefImpl.getCustomizerSource().getLegalValues()) {
      rtn.add(new LegalValueDefImpl(this, src.getValue(), src.getLabel(), src.isOmit()));
    }
    return rtn;
  }

  private LegalValueDefImpl findLegalValueDefImpl(LegalValueDefImpl want, List<LegalValueDefImpl> vals) {
    for (LegalValueDefImpl have : vals) {
      if (StringUtils.nonNull(want.getValueAsString()).equals(StringUtils.nonNull(have.getValueAsString()))) {
        return have;
      }
    }
    return null;
  }

  private void initializeHelp() {
    validateHelpHTMLProperties();
    initializeHelpSummaryHTML();
    initializeDetailedHelpHTML();
    initializePagePropertyExternalHelpDef();
  }

  private void initializePagePropertyExternalHelpDef() {
    BeanPropertyDef mbeanAttributePropertyDef = getMBeanAttributePropertyDef();
    if (mbeanAttributePropertyDef == null) {
      // No external help for this property
      return;
    }
    externalHelpDefImpl = new PagePropertyExternalHelpDefImpl(this, mbeanAttributePropertyDef);
  }

  private BeanPropertyDef getMBeanAttributePropertyDef() {
    if (getPageDefImpl().getPageRepoDefImpl().getBeanRepoDefImpl().getMBeansVersion().getWebLogicVersion() == null) {
      // This property's page repo doesn't support WebLogic mbeans.
      return null;
    }
    MBeanAttributeDefSource source = beanPropertyDefImpl.getCustomizerSource().getMbeanAttribute();
    String attributeName = source.getAttribute();
    if (StringUtils.isEmpty(attributeName) && isPageLevelProperty()) {
      // This property is a custom property defined on the page
      // i.e. not one backed by an mbean.
      // So, there is no external mbean javadoc available for it.
      return null;
    }
    String typeName = source.getType();
    BaseBeanTypeDefImpl typeDefImpl =
      StringUtils.isEmpty(typeName)
        ? getPageDefImpl().getTypeDefImpl()
        : getPageDefImpl().getTypeDefImpl().getBeanRepoDefImpl().getTypeDefImpl(typeName);

    BeanPropertyDefImpl propertyDefImpl =
      StringUtils.isEmpty(attributeName)
        ? beanPropertyDefImpl
        : typeDefImpl.getPropertyDefImpl(new Path(attributeName));

    Path parentPath = propertyDefImpl.getParentPath();
    if (!parentPath.isEmpty()) {
      // The property lives in a child bean of the bean for the page
      // e.g. SSLMBean's Enabled property on the Server General page.
      // Convert ServerMBean's SSL.Enabled property to SSLMBean's Enabled property.
      boolean searchSubTypes = true;
      propertyDefImpl =
        typeDefImpl // e.g. ServerMBean
          .getChildDefImpl(parentPath, searchSubTypes) // e.g. SSL
          .getChildTypeDefImpl() // e.g. SSLMBean
          .getPropertyDefImpl(
            new Path(propertyDefImpl.getPropertyName()), // e.g. Enabled
            searchSubTypes
          );
    } else {
      // The property lives directly on the bean for the page
      // e.g. ServerMBean's ListenPort property on the Server General page.
    }

    if (propertyDefImpl.getTypeDefImpl().isDisableMBeanJavadoc()) {
      // This property's mbean type doesn't have external mbean javadoc available for it.
      return null;
    }

    return propertyDefImpl;
  }

  private void initializeHelpSummaryHTML() {
    this.helpSummaryHTML =
      new LocalizableString(getHelpSummaryHTMLLocalizationKey(), getEnglishHelpSummaryHTML());
  }

  private void initializeDetailedHelpHTML() {
    this.detailedHelpHTML =
      new LocalizableString(getDetailedHelpHTMLLocalizationKey(), getEnglishDetailedHelpHTML());
  }

  private void validateHelpHTMLProperties() {
    if (StringUtils.notEmpty(beanPropertyDefImpl.getCustomizerSource().getHelpHTML())) {
      if (StringUtils.notEmpty(beanPropertyDefImpl.getCustomizerSource().getHelpSummaryHTML())) {
        throw new AssertionError(
          "Specified HelpHTML and HelpSummaryHTML for"
          + " " + getPropertyPath()
          + " " + getPageDef().getPagePath()
        );
      }
      if (StringUtils.notEmpty(beanPropertyDefImpl.getCustomizerSource().getHelpDetailsHTML())) {
        throw new AssertionError(
          "Specified HelpHTML and HelpDetailsHTML for"
          + " " + getPropertyPath()
          + " " + getPageDef().getPagePath()
        );
      }
    }
  }

  private String getEnglishHelpSummaryHTML() {
    String pdyHelp = beanPropertyDefImpl.getCustomizerSource().getHelpHTML();
    if (StringUtils.notEmpty(pdyHelp)) {
      // The PDY specified HelpHTML.
      // Use it as the summary.
      return pdyHelp;
    }
    String pdySummary = beanPropertyDefImpl.getCustomizerSource().getHelpSummaryHTML();
    if (StringUtils.notEmpty(pdySummary)) {
      // The PDY specified HelpDetailsHTML.
      // Use it as the summary.
      return pdySummary;
    }
    // The PDY didn't specify HelpHTML or HelpDetailsHTML.
    // Use the first sentence of the description harvested from the bean info.
    String harvestedHelp = beanPropertyDefImpl.getSource().getDescriptionHTML();
    return getSummary(harvestedHelp);
  }

  private String getEnglishDetailedHelpHTML() {
    String pdyHelp = beanPropertyDefImpl.getCustomizerSource().getHelpHTML();
    if (StringUtils.notEmpty(pdyHelp)) {
      // The PDY specified HelpHTML.
      // Use it as the full help.
      return pdyHelp;
    }
    String pdySummary = beanPropertyDefImpl.getCustomizerSource().getHelpSummaryHTML();
    String pdyDetails = beanPropertyDefImpl.getCustomizerSource().getHelpDetailsHTML();
    String harvestedHelp = beanPropertyDefImpl.getSource().getDescriptionHTML();
    if (StringUtils.notEmpty(pdySummary)) {
      if (StringUtils.notEmpty(pdyDetails)) {
        // The PDY customized the summary and details.
        // Combine them to get the full help.
        return pdySummary + pdyDetails;
      } else {
        // The PDY customized the summary but not the details.
        // Replace the first sentence of the harested help
        // with the summary from the PDY.
        return replaceSummary(harvestedHelp, pdySummary);
      }
    } else {
      if (StringUtils.isEmpty(pdyDetails)) {
        // The PDY didn't customize the summary or details.
        // Return all the harvested help.
        return harvestedHelp;
      } else {
        // The PDY customized the details but not the summary.
        // This isn't allowed.
        throw new AssertionError(
          getPropertyPath()
          + " specifies helpSummaryHTML but not helpDetailsHTML: "
          + getPageDef().getPagePath()
        );
      }
    }
  }

  private String replaceSummary(String harvestedHelp, String pdySummary) {
    String harvestedSummary = getSummary(harvestedHelp); // strips off <p> stuff
    pdySummary = getFirstParagraph(pdySummary); // strips off <p> stuff
    int idx = harvestedHelp.indexOf(harvestedSummary);
    String harvestedBeforeSummary = harvestedHelp.substring(0, idx);
    String harvestedAfterSummary = harvestedHelp.substring(idx + harvestedSummary.length());
    return harvestedBeforeSummary + pdySummary + harvestedAfterSummary;
  }

  private String getSummary(String html) {
    if (html == null) {
      return null;
    }
    return getFirstSentenceInParagraph(getFirstParagraph(html.trim()));
  }

  private String getFirstSentenceInParagraph(String paragraph) {
    // Look for first dot followed by whitespace.
    // If not found, return the entire paragraph.
    for (int i = 0; i < paragraph.length();) {
      int idx = paragraph.indexOf('.', i);
      if (idx != -1) {
        // Found the next dot.
        // Bump the cursor past the dot.
        i = idx + 1;
        if (i < paragraph.length()) {
          // There's a character following the dot.
          char next = paragraph.charAt(i);
          if (Character.isWhitespace(next)) {
            // The dot is followed by whitespace.
            // Return the characters up to and including the dot.
            return paragraph.substring(0, i);
          } else {
            // The dot is not followed by whitespace.
            // Keep going so we can look for another dot.
            // We've already bumped the cursor past this dot.
          }
        } else {
          // There isn't a character following the dot.
          // Bump the cursor to the end of the paragraph.
          i = paragraph.length();
        }
      } else {
        // Didn't find another dot.
        // Bump the cursor to the end of the paragraph.
        i = paragraph.length();
      }
    }
    // Didn't find a dot followed by whitespace.
    // Return the entire paragraph
    return paragraph;
  }

  private String getFirstParagraph(String trimmedHTML) {
    if (trimmedHTML.startsWith(PARA_BEGIN)) {
      int idx = trimmedHTML.indexOf(PARA_END);
      if (idx != -1) {
        // <p>blah</p> - return blah
        return trimmedHTML.substring(PARA_BEGIN.length(), idx);
      } else {
        // <p>blah - return blah
        return trimmedHTML.substring(PARA_BEGIN.length());
      }
    } else {
      int idx = trimmedHTML.indexOf(PARA_BEGIN);
      if (idx != -1) {
        // blah<p> - return blah
        return trimmedHTML.substring(0, idx);
      } else {
        // blah - return blah
        return trimmedHTML;
      }
    }
  }

  private String getLabelLocalizationKey() {
    boolean pageLevel = StringUtils.notEmpty(pageLevelCustomizerSource.getLabel());
    return getLocalizationKey("label", pageLevel);
  }

  String getLegalValueLocalizationKey(String legalValue) {
    boolean pageLevel = !pageLevelCustomizerSource.getLegalValues().isEmpty();
    return getLocalizationKey("legalValues." + legalValue, pageLevel);
  }

  private String getHelpSummaryHTMLLocalizationKey() {
    boolean pageLevel =
      StringUtils.notEmpty(pageLevelCustomizerSource.getHelpHTML())
      || StringUtils.notEmpty(pageLevelCustomizerSource.getHelpSummaryHTML());
    return getLocalizationKey("helpSummaryHTML", pageLevel);
  }

  private String getDetailedHelpHTMLLocalizationKey() {
    boolean pageLevel =
      StringUtils.notEmpty(pageLevelCustomizerSource.getHelpHTML())
      || StringUtils.notEmpty(pageLevelCustomizerSource.getHelpSummaryHTML())
      || StringUtils.notEmpty(pageLevelCustomizerSource.getHelpDetailsHTML());
    return getLocalizationKey("detailedHelpHTML", pageLevel);
  }

  String getInlineFieldHelpLocalizationKey() {
    boolean pageLevel = StringUtils.notEmpty(pageLevelCustomizerSource.getPresentation().getInlineFieldHelp());
    return getLocalizationKey("inlineFieldHelp", pageLevel);
  }
  
  private String getLocalizationKey(String key, boolean pageLevel) {
    if (pageLevel || isPageLevelProperty()) {
      return
        getPageDefImpl().getLocalizationKey(
          "properties." + getPropertyPath().getDotSeparatedPath() + "." + key
        );
    } else {
      return beanPropertyDefImpl.getLocalizationKey(key); // the type-relative key
    }
  }

  @Override
  public boolean isPageLevelProperty() {
    return pageLevelCustomizerSource.getDefinition() != null;
  }

  // Delegate the BeanPropertyDef methods to the BeanPropertyDefImpl.
  // (v.s. using inheritance so that a repo def can provide its own BeanPropertyDefImpl)
  @Override
  public BeanTypeDef getTypeDef() {
    return beanPropertyDefImpl.getTypeDef();
  }

  @Override
  public String getPropertyName() {
    return beanPropertyDefImpl.getPropertyName();
  }

  @Override
  public String getFormPropertyName() {
    return beanPropertyDefImpl.getFormPropertyName();
  }

  @Override
  public String getOnlinePropertyName() {
    return beanPropertyDefImpl.getOnlinePropertyName();
  }

  @Override
  public String getOfflinePropertyName() {
    return beanPropertyDefImpl.getOfflinePropertyName();
  }

  @Override
  public Path getParentPath() {
    return beanPropertyDefImpl.getParentPath();
  }

  @Override
  public boolean isOrdered() {
    return beanPropertyDefImpl.isOrdered();
  }

  @Override
  public boolean isKey() {
    return beanPropertyDefImpl.isKey();
  }

  @Override
  public boolean isCreateWritable() {
    return beanPropertyDefImpl.isCreateWritable();
  }

  @Override
  public boolean isUpdateWritable() {
    return beanPropertyDefImpl.isUpdateWritable();
  }

  @Override
  public boolean isRequired() {
    return beanPropertyDefImpl.isRequired();
  }

  @Override
  public GetPropertyValueCustomizerDef getGetValueCustomizerDef() {
    return beanPropertyDefImpl.getGetValueCustomizerDef();
  }

  @Override
  public GetPropertyOptionsCustomizerDef getGetOptionsCustomizerDef() {
    return beanPropertyDefImpl.getGetOptionsCustomizerDef();
  }

  @Override
  public boolean isRestartNeeded() {
    return beanPropertyDefImpl.isRestartNeeded();
  }

  @Override
  public boolean isSupportsUnresolvedReferences() {
    if (isPageLevelProperty()) {
      // Since this property is not backed by an mbean, it cannot be set to an unresolved reference.
      return false;
    }
    return beanPropertyDefImpl.isSupportsUnresolvedReferences();
  }

  @Override
  public Value getSecureDefaultValue() {
    return beanPropertyDefImpl.getSecureDefaultValue();
  }

  @Override
  public Value getProductionDefaultValue() {
    return beanPropertyDefImpl.getProductionDefaultValue();
  }

  @Override
  public Value getStandardDefaultValue() {
    return beanPropertyDefImpl.getStandardDefaultValue();
  }

  @Override
  public ValueKind getValueKind() {
    return beanPropertyDefImpl.getValueKind();
  }

  @Override
  public boolean isArray() {
    return beanPropertyDefImpl.isArray();
  }

  @Override
  public BeanTypeDef getReferenceTypeDef() {
    return beanPropertyDefImpl.getReferenceTypeDef();
  }

  @Override
  public boolean isReferenceAsReferences() {
    return beanPropertyDefImpl.isReferenceAsReferences();
  }

  @Override
  public boolean isDateAsLong() {
    return beanPropertyDefImpl.isDateAsLong();
  }

  @Override
  public Set<String> getGetRoles() {
    return beanPropertyDefImpl.getGetRoles();
  }

  @Override
  public Set<String> getSetRoles() {
    return beanPropertyDefImpl.getSetRoles();
  }

  @Override
  public boolean isDontReturnIfHiddenColumn() {
    return beanPropertyDefImpl.getCustomizerSource().isDontReturnIfHiddenColumn();
  }

  @Override
  public String toString() {
    return getPageDef() + " property=" + getPropertyPath();
  }
}

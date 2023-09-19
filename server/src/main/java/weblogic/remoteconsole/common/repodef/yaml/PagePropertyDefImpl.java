// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.GetPropertyOptionsCustomizerDef;
import weblogic.remoteconsole.common.repodef.GetPropertyValueCustomizerDef;
import weblogic.remoteconsole.common.repodef.LegalValueDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PageFieldPresentationDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.PagePropertyExternalHelpDef;
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

  private static final Logger LOGGER = Logger.getLogger(PagePropertyDefImpl.class.getName());

  private static final String HEALTH_STATE_OK = "ok";
  private static final String HEALTH_STATE_WARN = "warn";
  private static final String HEALTH_STATE_CRITICAL = "critical";
  private static final String HEALTH_STATE_FAILED = "failed";
  private static final String HEALTH_STATE_OVERLOADED = "overloaded";
  private static final String HEALTH_STATE_UNKNOWN = "unknown";

  private PageDefImpl pageDefImpl;
  private BeanPropertyDefImpl beanPropertyDefImpl;
  BeanPropertyDefCustomizerSource pageLevelCustomizerSource;
  private LocalizableString helpSummaryHTML;
  private LocalizableString detailedHelpHTML;
  private LocalizableString label;
  private PagePropertyExternalHelpDefImpl externalHelpDefImpl;
  private PagePropertyPresentationDefImpl presentationDefImpl;
  private List<PagePropertyLegalValueDefImpl> legalValueDefImpls = new ArrayList<>();
  private List<LegalValueDef> legalValueDefs;
  private PagePropertyUsedIfDefImpl usedIfDefImpl;

  // The page property is backed by a bean property
  PagePropertyDefImpl(
    PageDefImpl pageDefImpl,
    BeanPropertyDefImpl beanPropertyDefImpl,
    BeanPropertyDefCustomizerSource pageLevelCustomizerSource
  ) {
    // Overlay the page-level customizations with the type-level customizations,
    // then use the merged customizations to create a clone of the type-level BeanPropertyDefImpl.
    this.beanPropertyDefImpl =
      beanPropertyDefImpl.clone(
        mergeCustomizerSources(beanPropertyDefImpl.getCustomizerSource(), pageLevelCustomizerSource)
      );
    initialize(pageDefImpl, pageLevelCustomizerSource);
  }

  // The page property is not backed by a bean property (i.e. is a computed property that's only on the page)
  // Instead, its 'definition' contains the rest of the property's description.
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
  public PageFieldPresentationDef getPresentationDef() {
    return presentationDefImpl;
  }

  List<PagePropertyLegalValueDefImpl> getLegalValueDefImpls() {
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
    if (isPageLevelField()) {
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

    if (isHealthState()) {
      // Bake in health state (v.s. adding it to every yaml that has a property of that type)
      getLegalValueDefImpls().add(new HealthStateLegalValueDefImpl(this, "ok"));
      getLegalValueDefImpls().add(new HealthStateLegalValueDefImpl(this, "warn"));
      getLegalValueDefImpls().add(new HealthStateLegalValueDefImpl(this, "critical"));
      getLegalValueDefImpls().add(new HealthStateLegalValueDefImpl(this, "failed"));
      getLegalValueDefImpls().add(new HealthStateLegalValueDefImpl(this, "overloaded"));
      getLegalValueDefImpls().add(new HealthStateLegalValueDefImpl(this, "unknown"));
    } else {
      mergePagePropertyLegalValueDefImpls(
        createSourceLevelPagePropertyLegalValueDefImpls(),
        createCustomizerSourceLevelPagePropertyLegalValueDefImpls()
      );
    }
    legalValueDefs = Collections.unmodifiableList(getLegalValueDefImpls());
  }

  private void mergePagePropertyLegalValueDefImpls(
    List<PagePropertyLegalValueDefImpl> sourceVals,
    List<PagePropertyLegalValueDefImpl> customizerVals
  ) {
    if (sourceVals.isEmpty()) {
      getLegalValueDefImpls().addAll(customizerVals);
    } else {
      for (PagePropertyLegalValueDefImpl sourceVal : sourceVals) {
        PagePropertyLegalValueDefImpl customizerVal = findPagePropertyLegalValueDefImpl(sourceVal, customizerVals);
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
      for (PagePropertyLegalValueDefImpl customizerVal : customizerVals) {
        if (findPagePropertyLegalValueDefImpl(customizerVal, sourceVals) == null) {
          // The bean doesn't support this legal value
          // That's OK - just omit it.
          // For example, a newer version of WLS added the legal value
          // and we're using yamls from an older version of WLS that doesn't
          // have it.
          LOGGER.finest(
            "Missing legal value"
            + " " + getPageDefImpl().getPageRepoDefImpl().getBeanRepoDefImpl().getMBeansVersion().getWebLogicVersion()
            + " " + this
            + " " + customizerVal.getValueAsString()
          );
        }
      }
    }
  }

  private List<PagePropertyLegalValueDefImpl> createSourceLevelPagePropertyLegalValueDefImpls() {
    List<PagePropertyLegalValueDefImpl> rtn = new ArrayList<>();
    for (Object legalValue : beanPropertyDefImpl.getSource().getLegalValues()) {
      if (beanPropertyDefImpl.getCustomizerSource().isUseUnlocalizedLegalValuesAsLabels()) {
        // set the english label to null so that the legal value doesn't get localized
        rtn.add(new NormalLegalValueDefImpl(this, legalValue, null));
      } else {
        // don't set the english label so that the value gets used as the engligh label
        rtn.add(new NormalLegalValueDefImpl(this, legalValue));
      }
    }
    return rtn;
  }

  private List<PagePropertyLegalValueDefImpl> createCustomizerSourceLevelPagePropertyLegalValueDefImpls() {
    List<PagePropertyLegalValueDefImpl> rtn = new ArrayList<>();
    for (LegalValueDefCustomizerSource src : beanPropertyDefImpl.getCustomizerSource().getLegalValues()) {
      boolean supported =
        beanPropertyDefImpl
          .getTypeDefImpl()
          .getBeanRepoDefImpl()
          .supportsCapabilities(
            src.getRequiredCapabilities()
          );
      if (supported) {
        rtn.add(new NormalLegalValueDefImpl(this, src.getValue(), src.getLabel(), src.isOmit()));
      }
    }
    return rtn;
  }

  private PagePropertyLegalValueDefImpl findPagePropertyLegalValueDefImpl(
    PagePropertyLegalValueDefImpl want,
    List<PagePropertyLegalValueDefImpl> vals
  ) {
    for (PagePropertyLegalValueDefImpl have : vals) {
      if (StringUtils.nonNull(want.getValueAsString()).equals(StringUtils.nonNull(have.getValueAsString()))) {
        return have;
      }
    }
    return null;
  }

  private void initializeHelp() {
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
    if (StringUtils.isEmpty(attributeName) && isPageLevelField()) {
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

    if (propertyDefImpl.getCustomizerSource().isDisableMBeanJavadoc()
         || propertyDefImpl.getTypeDefImpl().isDisableMBeanJavadoc()) {
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

  private String getEnglishHelpSummaryHTML() {
    return
      HelpHTMLUtils.getEnglishHelpSummaryHTML(
        beanPropertyDefImpl.getSource().getDescriptionHTML(),
        beanPropertyDefImpl.getCustomizerSource().getHelpHTML(),
        beanPropertyDefImpl.getCustomizerSource().getHelpSummaryHTML(),
        beanPropertyDefImpl.getCustomizerSource().getHelpDetailsHTML()
      );
  }

  private String getEnglishDetailedHelpHTML() {
    return
      HelpHTMLUtils.getEnglishDetailedHelpHTML(
        beanPropertyDefImpl.getSource().getDescriptionHTML(),
        beanPropertyDefImpl.getCustomizerSource().getHelpHTML(),
        beanPropertyDefImpl.getCustomizerSource().getHelpSummaryHTML(),
        beanPropertyDefImpl.getCustomizerSource().getHelpDetailsHTML()
      );
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
    if (pageLevel || isPageLevelField()) {
      return
        getPageDefImpl().getLocalizationKey(
          "properties." + getPropertyPath().getDotSeparatedPath() + "." + key
        );
    } else {
      return beanPropertyDefImpl.getLocalizationKey(key); // the type-relative key
    }
  }

  @Override
  public boolean isPageLevelField() {
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
  public String getFormFieldName() {
    return beanPropertyDefImpl.getFormFieldName();
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
  public boolean isMultiLineString() {
    return beanPropertyDefImpl.isMultiLineString();
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
    if (isPageLevelField()) {
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

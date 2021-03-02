// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import weblogic.console.backend.driver.FormSection;
import weblogic.console.backend.driver.LegalValue;
import weblogic.console.backend.driver.MBeanInfo;
import weblogic.console.backend.driver.UsedIf;
import weblogic.console.backend.driver.WeblogicPage;
import weblogic.console.backend.driver.WeblogicProperty;
import weblogic.console.backend.driver.WeblogicPropertyPresentation;
import weblogic.console.backend.pagedesc.LocalizationUtils;
import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.console.backend.typedesc.WeblogicVersion;
import weblogic.console.backend.typedesc.WeblogicVersions;
import weblogic.console.backend.utils.StringUtils;

/**
  * Base class with common utils needed to customize a PDJ
  */
/*package*/ class BasePageDefinitionCustomizer {

  private static final Logger LOGGER = Logger.getLogger(BasePageDefinitionCustomizer.class.getName());

  // General purpose constants
  protected static final String TYPE_STRING = "string";
  protected static final String TYPE_BOOLEAN = "boolean";
  protected static final String TYPE_SECRET = "secret";
  protected static final String TYPE_UPLOADED_FILE = "uploadedFile";
  protected static final String TYPE_REFERENCE_DYNAMIC_ENUM = "reference-dynamic-enum";
  protected static final String NOT_FOLDED_PATH = "";

  // The PDJ to customize:
  private WeblogicPage page;

  protected WeblogicPage getPage() {
    return this.page;
  }

  // The corresponding PDY
  private WeblogicPageSource pageSource;

  protected WeblogicPageSource getPageSource() {
    return this.pageSource;
  }

  protected BasePageDefinitionCustomizer(WeblogicPage page, WeblogicPageSource pageSource) {
    this.page = page;
    this.pageSource = pageSource;
  }

  // Create a top level section with a title and intro
  protected FormSection createSection(String sectionKey) {
    return createSection(null, sectionKey);
  }

  // Create a top level section without a title and intro
  protected FormSection createSection() {
    return createSection((FormSection)null);
  }

  // Create a section with a title and intro
  protected FormSection createSection(FormSection parent, String sectionKey) {
    FormSection section = createSection(parent);
    section.setTitle(LocalizationUtils.sectionTitleKey(getPageSource(), sectionKey));
    section.setIntroductionHTML(LocalizationUtils.sectionIntroductionHTMLKey(getPageSource(), sectionKey));
    return section;
  }

  // Create a section without a title and intro
  protected FormSection createSection(FormSection parent) {
    FormSection section = new FormSection();
    if (parent != null) {
      parent.getSections().add(section);
    } else {
      getPage().getCreateForm().getSections().add(section);
    }
    return section;
  }

  // Create a PDJ usedIf
  protected UsedIf createUsedIf(String property, Object value) {
    UsedIf usedIf = new UsedIf();
    usedIf.setProperty(property);
    List<Object> values = new ArrayList<>();
    values.add(value);
    usedIf.setValues(values);
    usedIf.setHide(true);
    return usedIf;
  }

  // Create a list of legal values
  protected List<LegalValue> createLegalValues(LegalValue... legalValues) {
    List<LegalValue> rtn = new ArrayList<>();
    for (LegalValue legalValue : legalValues) {
      rtn.add(legalValue);
    }
    return rtn;
  }

  // Create a PDJ MBeanInfo
  protected MBeanInfo createMBeanInfo(
    String type,
    String mbeanPropertyName,
    String unfoldedPath
  ) throws Exception {
    WeblogicVersion weblogicVersion =
      WeblogicVersions.getWeblogicVersion(
        getPageSource()
          .getPagePath()
          .getPagesPath()
          .getBeanType()
          .getTypes()
          .getWeblogicVersion()
      );
    MBeanInfo mbeanInfo = new MBeanInfo();
    mbeanInfo.setType(type);
    mbeanInfo.setAttribute(mbeanPropertyName);
    mbeanInfo.setPath(unfoldedPath);
    mbeanInfo.setJavadocHref(
      weblogicVersion.getMBeanAttributeJavadocUrl(type, mbeanPropertyName)
    );
    return mbeanInfo;
  }

  // Create a PDJ legal value that maps to an mbean property legal value
  protected LegalValue createMBeanPropertyLegalValue(
    String mbeanPropertyName,
    String unfoldedPath,
    String value
  ) {
    return
      createLegalValue(
        value,
        legalValueLabelKey(mbeanPropertyKey(mbeanPropertyName, unfoldedPath), value)
      );
  }

  // Create a PDJ legal value
  protected LegalValue createLegalValue(String value, String labelKey) {
    LegalValue legalValue = new LegalValue();
    legalValue.setValue(value);
    legalValue.setLabel(labelKey);
    return legalValue;
  }

  // Create a PDJ property that maps to an MBean property
  protected WeblogicProperty createMBeanProperty(
    FormSection section,
    String mbeanPropertyName,
    String mbeanTypeName,
    String unfoldedPath,
    String type
  ) throws Exception {
    String propertyKey = mbeanPropertyKey(mbeanPropertyName, unfoldedPath);
    WeblogicProperty property =
      createProperty(section, mbeanPropertyName, propertyKey, type);
    property.setMBeanInfo(
      createMBeanInfo(mbeanTypeName, mbeanPropertyName, unfoldedPath)
    );
    return property;
  }

  // Construct a property key that maps to a folded mbean property
  protected String mbeanPropertyKey(String mbeanPropertyName, String unfoldedPath) {
    if (StringUtils.isEmpty(unfoldedPath)) {
      return mbeanPropertyName;
    } else {
      return unfoldedPath + "." + mbeanPropertyName;
    }
  }

  // Create a PDJ property and add it to a section.
  protected WeblogicProperty createProperty(FormSection section, String name, String type) {
    return createProperty(section, name, name, type);
  }

  // Create a PDJ property and add it to a section
  protected WeblogicProperty createProperty(FormSection section, String name, String propertyKey, String type) {
    WeblogicProperty property = new WeblogicProperty();
    property.setName(name);
    property.setType(type);
    property.setLabel(propertyLabelKey(propertyKey));
    property.setHelpSummaryHTML(helpSummaryHTMLKey(propertyKey));
    property.setDetailedHelpHTML(detailedHelpHTMLKey(propertyKey));
    property.setRequired(true);
    section.getProperties().add(property);
    return property;
  }

  // Add the inline field help to a property
  protected void addInlineFieldHelp(WeblogicProperty property, String propertyKey) {
    // Create a presentation if there isn't one yet
    WeblogicPropertyPresentation presentation = property.getPresentation();
    if (presentation == null) {
      presentation = new WeblogicPropertyPresentation();
      property.setPresentation(presentation);
    }
    // Add the inline field help to the presentation
    presentation.setInlineFieldHelp(LocalizationUtils.inlineFieldHelpKey(getPageSource(), propertyKey));
  }

  // Get the resource bundle key for a form property's label
  protected String propertyLabelKey(String propertyKey) {
    return LocalizationUtils.propertyLabelKey(getPageSource(), propertyKey, null);
  }

  // Get the resource bundle key for a form property's help summary
  protected String helpSummaryHTMLKey(String propertyKey) {
    return LocalizationUtils.helpSummaryHTMLKey(getPageSource(), propertyKey);
  }

  // Get the resource bundle key for a form property's help details
  protected String detailedHelpHTMLKey(String propertyKey) {
    return LocalizationUtils.detailedHelpHTMLKey(getPageSource(), propertyKey);
  }

  // Get the resource bundle key for a form property's legal value's label
  protected String legalValueLabelKey(String propertyKey, String value) {
    return LocalizationUtils.legalValueLabelKey(getPageSource(), propertyKey, value);
  }

  // Get the resource bundle key for text that should not be localized
  protected String unlocalizedTextKey(String unlocalizableText) {
    return LocalizationUtils.unlocalizedTextKey(unlocalizableText);
  }
}

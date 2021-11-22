// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyPresentationDefSource;
import weblogic.remoteconsole.common.repodef.schema.DefaultValueDefSource;
import weblogic.remoteconsole.common.repodef.schema.FormSectionDefSource;
import weblogic.remoteconsole.common.repodef.schema.LegalValueDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.PageDefSource;
import weblogic.remoteconsole.common.repodef.schema.UsedIfDefSource;
import weblogic.remoteconsole.common.repodef.schema.ValueDefSource;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Base class with common utils needed to customize a PDY
 */
class BasePageDefSourceCustomizer {
  private PagePath pagePath;
  private PageDefSource pageDefSource;

  protected BasePageDefSourceCustomizer(PagePath pagePath, PageDefSource pageDefSource) {
    this.pagePath = pagePath;
    this.pageDefSource = pageDefSource;
  }

  protected PagePath getPagePath() {
    return pagePath;
  }

  protected PageDefSource getPageDefSource() {
    return pageDefSource;
  }

  protected FormSectionDefSource addSectionToForm() {
    FormSectionDefSource section = new FormSectionDefSource();
    getPageDefSource().asFormDefSource().addSection(section);
    return section;
  }

  protected FormSectionDefSource addSectionToSection(FormSectionDefSource parent) {
    FormSectionDefSource section = new FormSectionDefSource();
    parent.addSection(section);
    return section;
  }

  // Create a usedIf
  protected UsedIfDefSource createUsedIf(String property, Object... values) {
    UsedIfDefSource usedIf = new UsedIfDefSource();
    usedIf.setProperty(property);
    List<Object> vals = new ArrayList<>();
    for (Object value : values) {
      vals.add(value);
    }
    usedIf.setValues(vals);
    usedIf.setHide(true);
    return usedIf;
  }

  // Add a legal value to a property
  protected LegalValueDefCustomizerSource addLegalValue(
    BeanPropertyDefCustomizerSource property,
    Object value,
    String label
  ) {
    addLegalValueToDefinition(property, value);
    return addLegalValueToCustomizer(property, value, label);
  }

  // Add a legal value to a property.  The unlocalized value will be used as the label.
  protected LegalValueDefCustomizerSource addLegalValue(
    BeanPropertyDefCustomizerSource property,
    Object value
  ) {
    addLegalValueToDefinition(property, value);
    return addLegalValueToCustomizer(property, value, null);
  }

  private LegalValueDefCustomizerSource addLegalValueToCustomizer(
    BeanPropertyDefCustomizerSource property,
    Object value,
    String label
  ) {
    LegalValueDefCustomizerSource legalValue = new LegalValueDefCustomizerSource();
    property.addLegalValue(legalValue);
    legalValue.setValue(value);
    if (!StringUtils.isEmpty(label)) {
      legalValue.setLabel(label);
    }
    return legalValue;
  }

  private void addLegalValueToDefinition(BeanPropertyDefCustomizerSource property, Object value) {
    BeanPropertyDefSource definition = property.getDefinition();
    if (definition != null) {
      definition.addLegalValue(value);
    }
  }

  // Create an mbean-based property

  protected BeanPropertyDefCustomizerSource addMBeanPropertyToForm(String name) {
    BeanPropertyDefCustomizerSource property = createMBeanProperty(name);
    getPageDefSource().asFormDefSource().addProperty(property);
    return property;
  }

  protected BeanPropertyDefCustomizerSource addMBeanPropertyToSection(
    FormSectionDefSource section,
    String name
  ) {
    BeanPropertyDefCustomizerSource property = createMBeanProperty(name);
    section.addProperty(property);
    return property;
  }

  protected BeanPropertyDefCustomizerSource createMBeanProperty(
    String name
  ) {
    return createPropertyCustomizer(name);
  }

  // Create a non-mbean page-specific string property
  protected BeanPropertyDefCustomizerSource addNonMBeanStringPropertyToSection(
    FormSectionDefSource section,
    String name,
    String label,
    String descriptionHTML
  ) {
    BeanPropertyDefCustomizerSource property =
      createNonMBeanStringProperty(name, label, descriptionHTML);
    section.addProperty(property);
    return property;
  }

  protected BeanPropertyDefCustomizerSource createNonMBeanStringProperty(
    String name,
    String label,
    String descriptionHTML
  ) {
    return createNonMBeanProperty(name, label, descriptionHTML, "java.lang.String");
  }

  // Create a non-mbean page-specific string property
  protected BeanPropertyDefCustomizerSource addNonMBeanBooleanPropertyToSection(
    FormSectionDefSource section,
    String name,
    String label,
    String descriptionHTML
  ) {
    BeanPropertyDefCustomizerSource property =
      createNonMBeanBooleanProperty(name, label, descriptionHTML);
    section.addProperty(property);
    return property;
  }

  protected BeanPropertyDefCustomizerSource createNonMBeanBooleanProperty(
    String name,
    String label,
    String descriptionHTML
  ) {
    return createNonMBeanProperty(name, label, descriptionHTML, "boolean");
  }

  private BeanPropertyDefCustomizerSource createNonMBeanProperty(
    String name,
    String label,
    String descriptionHTML,
    String javaType
  ) {
    BeanPropertyDefCustomizerSource customizer = createPropertyCustomizer(name);
    customizer.setRequired(true);
    customizer.setLabel(label);
    customizer.setDefinition(createPropertyDefinition(name, javaType, descriptionHTML));
    return customizer;
  }

  private BeanPropertyDefCustomizerSource createPropertyCustomizer(
    String name
  ) {
    BeanPropertyDefCustomizerSource customizer = new BeanPropertyDefCustomizerSource();
    customizer.setName(name);
    return customizer;
  }

  private BeanPropertyDefSource createPropertyDefinition(
    String name,
    String javaType,
    String descriptionHTML
  ) {
    BeanPropertyDefSource definition = new BeanPropertyDefSource();
    definition.setName(name);
    definition.setWritable(true);
    definition.setType(javaType);
    if (!StringUtils.isEmpty(descriptionHTML)) {
      definition.setDescriptionHTML(descriptionHTML);
    }
    return definition;
  }

  // Set a property's inline field help
  protected void setInlineFieldHelp(BeanPropertyDefCustomizerSource property, String inlineFieldHelp) {
    // Create a presentation if there isn't one yet
    BeanPropertyPresentationDefSource presentation = property.getPresentation();
    if (presentation == null) {
      presentation = new BeanPropertyPresentationDefSource();
      property.setPresentation(presentation);
    }
    // Add the inline field help to the presentation
    presentation.setInlineFieldHelp(inlineFieldHelp);
  }

  // Set a property's default value
  protected void setDefaultValue(BeanPropertyDefCustomizerSource property, Object value) {
    BeanPropertyDefSource definition = property.getDefinition();
    if (definition == null) {
      throw new AssertionError("Trying to set an mbean-backed property's default value");
    }
    DefaultValueDefSource defaultValueSource = definition.getDefaultValue();
    if (defaultValueSource == null) {
      defaultValueSource = new DefaultValueDefSource();
      definition.setDefaultValue(defaultValueSource);
    }
    ValueDefSource valueSource = defaultValueSource.getValue();
    if (valueSource == null) {
      valueSource = new ValueDefSource();
      defaultValueSource.setValue(valueSource);
    }
    valueSource.setValue(value);
  }
}

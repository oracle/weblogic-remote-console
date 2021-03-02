// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.build.plugins;

import java.util.Properties;
import java.util.logging.Logger;

import weblogic.console.backend.pagedesc.LocalizationUtils;
import weblogic.console.backend.pagedesc.WeblogicPageSource;

/** Utility code for customizing the english resource bundle during the build */
public class BaseEnglishResourceDefinitionsCustomizer {

  private static final Logger LOGGER = Logger.getLogger(BaseEnglishResourceDefinitionsCustomizer.class.getName());

  private WeblogicPageSource pageSource;

  protected WeblogicPageSource getPageSource() {
    return this.pageSource;
  }

  private Properties englishResourceDefinitions;

  protected Properties getEnglishResourceDefinitions() {
    return this.englishResourceDefinitions;
  }

  protected BaseEnglishResourceDefinitionsCustomizer(
    Properties englishResourceDefinitions,
    WeblogicPageSource pageSource
  ) {
    this.englishResourceDefinitions = englishResourceDefinitions;
    this.pageSource = pageSource;
  }

  protected void addSection(String section, String title, String introductionHTML) {
    addResource(
      LocalizationUtils.sectionTitleKey(getPageSource(), section),
      title
    );
    addResource(
      LocalizationUtils.sectionIntroductionHTMLKey(getPageSource(), section),
      introductionHTML
    );
  }

  protected void addProperty(
    String propertyKey,
    String label,
    String helpSummaryHTML
  ) {
    // No help details are available for this property
    addProperty(propertyKey, label, helpSummaryHTML, "");
  }

  protected void addProperty(
    String propertyKey,
    String label,
    String helpSummaryHTML,
    String helpDetailsHTML
  ) {
    addResource(
      LocalizationUtils.propertyLabelKey(getPageSource(), propertyKey, ""),
      label
    );
    addResource(
      LocalizationUtils.helpSummaryHTMLKey(getPageSource(), propertyKey),
      helpSummaryHTML
    );
    addResource(
      LocalizationUtils.detailedHelpHTMLKey(getPageSource(), propertyKey),
      helpSummaryHTML + helpDetailsHTML
    );
  }

  protected void addInlineFieldHelp(String propertyKey, String inlineFieldHelp) {
    addResource(
      LocalizationUtils.inlineFieldHelpKey(getPageSource(), propertyKey),
      inlineFieldHelp
    );
  }

  protected void addLegalValue(String propertyKey, String value, String label) {
    addResource(
      LocalizationUtils.legalValueLabelKey(getPageSource(), propertyKey, value),
      label
    );
  }

  protected void addResource(String key, String value) {
    getEnglishResourceDefinitions().setProperty(key, value);
  }
}

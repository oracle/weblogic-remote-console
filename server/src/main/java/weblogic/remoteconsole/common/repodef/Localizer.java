// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;

import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.common.utils.SupportedLocales;

/**
 * Used to localize strings for a resource bundle name and locale.
 */
public class Localizer {
  private Locale locale;
  private ResourceBundle resourceBundle;

  // Create a localizer for this resource bundle name and the first available language
  // from the client's list of preferred languages
  public Localizer(String resourceBundleName, List<Locale> locales) {
    this(resourceBundleName, SupportedLocales.getFirstSupportedAcceptLocale(locales));
  }

  // Create a localizer for this resource bundle name and the client's preferred language
  public Localizer(String resourceBundleName, Locale locale) {
    if (locale == null) {
      this.locale = Locale.getDefault();
    } else {
      this.locale = locale;
    }
    this.resourceBundle =
      ResourceBundle.getBundle(
        resourceBundleName,
        this.locale,
        Thread.currentThread().getContextClassLoader()
      );
  }

  // Get the locale for this localizer (i.e. the language the client wants to use)
  public Locale getLocale() {
    return this.locale;
  }

  // Get the localized string for a localizable string in this locale.
  public String localizeString(LocalizableString localizableString) {
    if (localizableString == null) {
      return "";
    }
    String englishText = localizableString.getEnglishText();
    if (StringUtils.isEmpty(englishText)) {
      return "";
    }
    if (localizableString.isUnlocalized()) {
      return englishText;
    }
    String translatedText = resourceBundle.getString(localizableString.getResourceBundleKey());
    return translatedText;
  }
}

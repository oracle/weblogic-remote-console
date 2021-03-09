// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;

/** Used to localize strings for a weblogic version and a locale. */
public class Localizer {

  public static final String UNLOCALIZED_PREFIX = "unlocalized:";

  private Locale locale;

  public Locale getLocale() {
    return this.locale;
  }

  private ResourceBundle resourceBundle;

  private ResourceBundle getResourceBundle() {
    return this.resourceBundle;
  }

  // Create a localizer for this weblogic version and the client's preferred language
  public Localizer(String weblogicVersion, Locale locale) {
    if (locale == null) {
      locale = Locale.getDefault();
    }
    this.locale = locale;
    this.resourceBundle =
      ResourceBundle.getBundle(
        LocalizationUtils.getResourceBundleName(weblogicVersion),
        getLocale(),
        Thread.currentThread().getContextClassLoader()
      );
  }

  public Localizer(String weblogicVersion, List<Locale> locales) {
    this(weblogicVersion, (locales != null) && (locales.size() > 0) ? locales.get(0) : null);
  }

  // Get the localized string for a key.
  // If the key starts with "unlocalized:", then it returns the rest of the key.
  // Otherwise if the key is null or the resource bundle doesn't contain the key, returns "".
  // Otherwise returns the corresponding value for the key in the resource bundle.
  public String localizeString(String key) {
    if (key == null) {
      return "";
    }
    if (key.startsWith(UNLOCALIZED_PREFIX)) {
      return key.substring(UNLOCALIZED_PREFIX.length());
    }
    if (getResourceBundle().containsKey(key)) {
      return getResourceBundle().getString(key);
    }
    return "";
  }
}

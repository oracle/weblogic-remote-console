// Copyright (c) 2021, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.text.DateFormat;
import java.text.MessageFormat;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;

import weblogic.console.utils.StringUtils;
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
    if (this.locale.getLanguage().startsWith("en")) {
      this.resourceBundle = null;
    } else {
      this.resourceBundle =
        ResourceBundle.getBundle(
          resourceBundleName,
          this.locale,
          Thread.currentThread().getContextClassLoader()
        );
    }
  }

  // Get the locale for this localizer (i.e. the language the client wants to use)
  public Locale getLocale() {
    return this.locale;
  }

  // Format a date for this locale.
  public String formatDate(Date date) {
    return (date != null) ? getDateFormat().format(date) : "";
  }

  // Parse a date in this locale.
  public Date parseDate(String dateAsString) throws ParseException {
    if (StringUtils.isEmpty(dateAsString)) {
      return null;
    }
    return getDateFormat().parse(dateAsString);
  }

  // Convert a Date to a long that's rounded to the user-visible format
  // (helps with making >=, ... predictable)
  public long getRoundedDateAsLong(Date date) {
    if (date == null) {
      return 0;
    }
    try {
      Date roundedDate = parseDate(formatDate(date));
      return roundedDate.getTime();
    } catch (ParseException e) {
      throw new AssertionError(date.toString(), e);
    }
  }

  // Get the localized string for a localizable string in this locale.
  public String localizeString(LocalizableString localizableString, Object... args) {
    String pattern = getPattern(localizableString);
    if (StringUtils.isEmpty(pattern) || args.length < 1) {
      return pattern;
    }
    return MessageFormat.format(pattern, args);
  }

  // Get the localized HTML string for a localizable string in this locale.
  // The localized pattern itself is trusted HTML. The substituted args are escaped
  // so that user-controlled or externally-sourced values render as text.
  public String localizeHtmlString(LocalizableString localizableString, Object... args) {
    String pattern = getPattern(localizableString);
    if (StringUtils.isEmpty(pattern) || args.length < 1) {
      return pattern;
    }
    Object[] escapedArgs = new Object[args.length];
    for (int i = 0; i < args.length; i++) {
      escapedArgs[i] = escapeHtml(args[i]);
    }
    return MessageFormat.format(pattern, escapedArgs);
  }

  private String escapeHtml(Object value) {
    if (value == null) {
      return "";
    }
    return value.toString()
      .replace("&", "&amp;")
      .replace("<", "&lt;")
      .replace(">", "&gt;")
      .replace("\"", "&quot;")
      .replace("'", "&#39;");
  }

  private String getPattern(LocalizableString localizableString) {
    if (localizableString == null) {
      return "";
    }
    String english = localizableString.getEnglishText();
    if (StringUtils.isEmpty(english)) {
      return "";
    }
    if (localizableString.isUnlocalized() || (resourceBundle == null)) {
      return english;
    }
    String key = localizableString.getResourceBundleKey();
    if (!resourceBundle.containsKey(key)) {
      // the key isn't in the resource bundle.
      // e.g. console extension yamls aren't available
      // when we build the remote console resource bundle.
      // just use the english label for now.
      return english;
    }
    String translated = resourceBundle.getString(key);
    return translated;
  }

  private DateFormat getDateFormat() {
    DateFormat format = DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.LONG, locale);
    format.setLenient(false);
    return format;
  }
}

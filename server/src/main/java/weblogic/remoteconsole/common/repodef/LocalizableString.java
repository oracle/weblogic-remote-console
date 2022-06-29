// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.text.MessageFormat;

import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * This class is used to represent a string that potentially needs to be localized.
 *
 * It contains all of the information that the different parts of the backend
 * needs (e.g. english resource bundle, PDJ, RDJ) needs to localize the string.
 */
public class LocalizableString {
  private String resourceBundleKey;
  private String englishText;

  private static final String UNLOCALIZED_RESOURCE_BUNDLE_KEY_PREFIX = "unlocalized.";
  public static final LocalizableString NULL = new LocalizableString(null, null);

  // Construct a string that should not be localized (i.e. always displayed as-is).
  // For example, the server debug flag names are not localized on the page.
  public LocalizableString(String unlocalizedText) {
    this(UNLOCALIZED_RESOURCE_BUNDLE_KEY_PREFIX + unlocalizedText, unlocalizedText);
  }

  // Constuct a string that should be localized.
  public LocalizableString(String resourceBundleKey, String englishText) {
    this.resourceBundleKey = resourceBundleKey;
    this.englishText = englishText;
  }

  // Returns whether a string should be localized, based on its key.
  public static boolean isUnlocalized(String resourceBundleKey) {
    return resourceBundleKey.startsWith(UNLOCALIZED_RESOURCE_BUNDLE_KEY_PREFIX);
  }

  // Returns whether this localizable string should be localized (v.s. just displayed as-is).
  public boolean isUnlocalized() {
    if (NULL == this) {
      return false;
    } else {
      return isUnlocalized(getResourceBundleKey());
    }
  }

  // Returns the string that identifies this string in the resource bundle.
  public String getResourceBundleKey() {
    return resourceBundleKey;
  }

  // Returns this string's unlocalized (i.e. english) text.
  // If arguments are provided, then they are substituted into the english text.
  // Otherwise, the unsubstituted english text is returned.
  public String getEnglishText(Object... args) {
    if (args.length == 0) {
      return englishText;
    }
    return MessageFormat.format(englishText, args);
  }

  // Returns whether this string is empty.
  public boolean isEmpty() {
    return StringUtils.isEmpty(getEnglishText());
  }

  @Override
  public String toString() {
    return "LocalizableString<key=" + getResourceBundleKey() + ", english=" + getEnglishText() + ">";
  }
}

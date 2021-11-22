// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

public class SupportedLocales {

  // Note that if we change the list of languages we translation to, then this will need to change.  We
  // could automate it to see what languages we have for frontend.properties, and compute this based on
  // the filenames, but the chances we change the set of languages is small, so this is good enough.
  // The language names are case-insensitive, so we represent everything as lowercase for comparisons.
  public static List<String> OUR_LANGUAGES =
    Arrays.asList("en","en_US","de","de_DE","es","fr","it","ja","ko","pt_BR","zh_CN","zh_TW");

  public static String getFirstSupportedAcceptLanguage(List<Locale> locales) {
    Locale selectedLocale = getFirstSupportedAcceptLocale(locales);
    return langAndCountry(selectedLocale);
  }

  /*
   * Given the specified Locale, return lang_country if the variant is non-null, else just lang
   * @param the Locale
   * @return lang[_country]
   */
  public static String langAndCountry(Locale selectedLocale) {
    String country = selectedLocale.getCountry();
    return selectedLocale.getLanguage() + (country.equals("") ? "" : "_" + country);
  }

  public static Locale getFirstSupportedAcceptLocale(List<Locale> locales) {
    // Find the first accept-language Locale that we support
    // Note that this could be fancier so that if a language variant is not supported, we could select the parent
    // language.  For now, if we don't get an exact match, then we go to the next language passed in in Accept-Language
    if (locales == null) {
      // if locales is not set, use the default setting for the JVM
      locales = new ArrayList<Locale>(Arrays.asList(Locale.getDefault()));
    }
    Locale selectedLocale = null;
    for (int i = 0; i < locales.size() && selectedLocale == null; i++) {
      Locale locale = locales.get(i);
      if (listContainsIgnoreCase(OUR_LANGUAGES, langAndCountry(locale))) {
        selectedLocale = locale;
      }
    }
    if (selectedLocale == null) {
      selectedLocale = Locale.ENGLISH;  // if nothing matches, this is the default
    }
    return selectedLocale;
  }

  private static boolean listContainsIgnoreCase(List<String> theList, String theString) {
    for (String element: theList) {
      if (element.equalsIgnoreCase(theString)) {
        return true;
      }
    }
    return false;
  }
}

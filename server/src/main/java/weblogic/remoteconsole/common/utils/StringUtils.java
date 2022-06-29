// Copyright (c) 2020, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.net.URI;
import java.net.URISyntaxException;
import javax.ws.rs.core.UriBuilder;

/**
 * General purpose String utilities needed by the console backend.
 * <p>
 * Note: copied from org.glassfish.admin.rest.utils.StringUtil
 */
public class StringUtils {

  private static final String DUMMY_URL_PREFIX = "http://dummyHost:9999/";

  /** Determines whether two strings are equal. Handles null strings too. */
  public static boolean equals(String str1, String str2) {
    if (str1 == null) {
      return str2 == null;
    } else {
      return str1.equals(str2);
    }
  }

  /** Determines whether two strings are equal, ignoreing case. Handles null strings too. */
  public static boolean equalsIgnoreCase(String str1, String str2) {
    if (str1 == null) {
      return str2 == null;
    } else {
      return str1.equalsIgnoreCase(str2);
    }
  }

  /**
   * Determines if a string is null/empty or not
   *
   * @param string
   * @return true if the string is not null and has a length greater than zero, false otherwise
   */
  public static boolean notEmpty(String string) {
    return !isEmpty(string);
  }

  /**
   * Determines if a string is null/empty or not
   *
   * @param string
   * @return false if the string is not null and has a length greater than zero, true otherwise
   */
  public static boolean isEmpty(String string) {
    return (string == null || string.isEmpty());
  }

  /**
   * Converts a null/empty/non-empty string to null or non-empty
   *
   * @param string
   * @return null if string is null or empty, otherwise returns string
   */
  public static String nonEmpty(String string) {
    return (notEmpty(string)) ? string : null;
  }

  /**
   * Converts a null/empty/non-empty string to empty or non-empty
   *
   * @param string
   * @return an empty string if string is null or empty, otherwise returns string
   */
  public static String nonNull(String string) {
    return (notEmpty(string)) ? string : "";
  }

  /**
   * Converts a plural string to a singular string
   *
   * @param plural
   * @return
   */
  public static String getSingular(String plural) {
    String singular = replaceEnding(plural, "sses", "ss");
    if (singular == null) {
      singular = replaceEnding(plural, "ies", "y");
    }
    if (singular == null) {
      singular = replaceEnding(plural, "s", "");
    }
    if (singular == null) {
      singular = plural;
    }
    return singular;
  }

  /**
   * Determines whether a single letter is a vowel
   *
   * @param letter
   * @return true if letter is a vowel
   */
  private static boolean isVowel(String letter) {
    return "aeiou".contains(letter);
  }

  /**
   * Converts a singular string to a plural string
   *
   * @param singular
   * @return
   */
  public static String getPlural(String singular) {
    if (singular.endsWith("s") && !singular.endsWith("ss")) {
      return singular; // already plural.  Note this is not correct in general, but we know
      // for our specific cases that it is.
    }

    String plural = replaceEnding(singular, "ss", "sses");
    if (plural == null) {
      int len = singular.length();
      // Check whether the letter before a 'y' is a vowel or not
      if (singular.endsWith("y") && !isVowel(singular.substring(len - 2, len - 1))) {
        // not a vowel, so replace 'y' with 'ies'
        plural = replaceEnding(singular, "y", "ies");
      } else if (singular.endsWith("ch")
        || singular.endsWith("sh")
        || singular.endsWith("x")
        || singular.endsWith("z")) {
        plural = singular + "es";
      }
    }
    if (plural == null) {
      // includes case where singular ends in 'y' and preceding letter is a vowel
      plural = singular + "s";
    }
    return plural;
  }

  // Convert camel case (either starting with lower case or upper case)
  // to a set of words whose first character is upper case
  // (acronyms are left upper case)
  public static String camelCaseToUpperCaseWords(String camelCase) {
    return lowerCaseWordsToUpperCaseWords(camelCaseToLowerCaseWords(camelCase));
  }

  // Convert a set of space separated words that start lower case
  // to a set of words whose first character is upper case
  // (acronyms are left upper case)
  public static String lowerCaseWordsToUpperCaseWords(String lowerCaseWords) {
    if (lowerCaseWords == null) {
      return null;
    }
    StringBuilder sb = new StringBuilder();
    boolean inWord = false;
    for (int i = 0; i < lowerCaseWords.length(); i++) {
      char c = lowerCaseWords.charAt(i);
      if (c == ' ') {
        inWord = false;
      } else {
        if (!inWord) {
          // convert the first letter of a word to upper case:
          c = Character.toUpperCase(c);
        }
        inWord = true;
      }
      // append either the space, the first letter as upper case or the n-th letter as-is
      sb.append(c);
    }
    return sb.toString();
  }

  // Convert camel case (either starting with lower case or upper case)
  // to a set of space separated lower case words (acronyms are left upper case)
  public static String camelCaseToLowerCaseWords(String camelCase) {
    if (camelCase == null) {
      return null;
    }
    // Fix some known irregularities that cause issues with translatability
    if (camelCase.contains("SurName")) {
      camelCase = camelCase.replace("SurName", "Surname");
    }
    StringBuilder sb = new StringBuilder();
    int start = 0;
    boolean emitWord = false;
    for (int i = 0; i < camelCase.length(); i++) {
      char c = camelCase.charAt(i);
      if (i == 0) {
        // starting the first word - continue
      } else {
        char lastChar = camelCase.charAt(i - 1);
        char secondToLastChar = (i >= 2 ? camelCase.charAt(i - 2) : 0);
        boolean isLetter = Character.isLetter(c);
        boolean isUpperCase = Character.isUpperCase(c);
        boolean wasLetter = Character.isLetter(lastChar);
        boolean wasUpperCase = Character.isUpperCase(lastChar);
        boolean wasA = lastChar == 'A';  // treat specially, as in AWebService -> a web service
        boolean secondToLastIsUpper = Character.isUpperCase(secondToLastChar);
        char nextChar = ((i + 1) < camelCase.length() ? camelCase.charAt(i + 1) :  0);
        boolean nextIsUpper = Character.isUpperCase(nextChar);
        if (isUpperCase) {
          // N.B. these acronym tests are hand-tailored to our existing content.  They may not work in general for all
          // special cases.  Future harvesting may result in new acronyms that require special handling.
          if (wasUpperCase && !(wasA && !secondToLastIsUpper)) {
            // in an acronym - continue
            // e.g. ...AB...
          } else if (wasA && secondToLastIsUpper) {
            // in an acronym - continue
          } else if (wasA && nextIsUpper) {
            // also an acronym
          } else if (wasA && nextChar == 's') {
            // a plural acronym, like APs
          } else if (wasLetter) {
            // we're starting a new word
            // e.g. ...aB... -> ...a B...
            emitWord(sb, camelCase, start, i);
            start = i;
          } else {
            // in an acronym - continue
            // e.g. ...1B..., ...#B...
          }
        } else if (isLetter) {
          if (wasUpperCase) {
            // e.g. ...Ab...
            int length = i - start;
            if (length == 0) {
              throw
                new AssertionError(
                  "Only the first word can start with a lower case letter: "
                  + camelCase
                  + " "
                  + start
                );
            } else if (length == 1) {
              // we're in a word that starts with an upper case letter - continue
              // e.g. Ab...
            } else if (length == 2) {
              // we're in a word like 'MBean' (and we just hit the 'e')
              // which should not get converted to 'M Bean' - continue
              // i.e. it's not OK to have acronyms that are just one character long
              // e.g. ABc...
            } else {
              // we're ending an acronym (that has at least two letters)
              // the last upper case character really is the start of this word
              // e.g. ABCd... -> AB Cd...
              emitWord(sb, camelCase, start, i - 1);
              start = i - 1;
            }
          } else if (wasLetter) {
            // in a normal word - continue
            // e.g. ...ab...
          } else {
            // in a normal word - continue
            // e.g. ...1b..., ...#b...
          }
        } else {
          if (wasUpperCase) {
            // in an acronym - continue
            // e.g. ...A1..., ...A#...
          } else if (wasLetter) {
            // in a normal word - continue
            // e.g. ...a1..., ...a#...
          } else {
            // in an acronym or normal word - continue
            // e.g. ...11..., ...#1..., ...##..., ...1#...
          }
        }
      }
    }
    emitWord(sb, camelCase, start, camelCase.length());
    return sb.toString();
  }


  public static String toCamelCase(String s) {
    return toCamelCase(s, "_");
  }

  /**
   * @param s
   * @param delim
   * @return
   */
  public static String toCamelCase(String s, String delim) {
    String[] parts = new String[] {s};
    if (!isEmpty(delim)) {
      parts = s.split("[" + delim + "]");
    }
    String camelCaseString = "";
    for (String part : parts) {
      camelCaseString += toProperCase(part);
    }
    return camelCaseString;
  }

  public static String toProperCase(String s) {
    return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
  }

  public static String getBeanName(String restName) {
    if (isEmpty(restName)) {
      return restName;
    }
    // convert the 1st character to upper case
    // e.g. servers -> Servers, JDBC -> JCBC
    return restName.substring(0,1).toUpperCase() + restName.substring(1);
  }

  public static String getRestName(String beanName) {
    if (beanName == null) {
      return beanName;
    }
    // find the first set of upper case letters
    int count = 0;
    for (; count < beanName.length(); count++) {
      if (!Character.isUpperCase(beanName.charAt(count))) {
        break;
      }
    }
    if (count == beanName.length()) {
      // all upper case - leave it alone
      return beanName;
    }
    if (count == 0) {
      // doesn't start upper case - leave it alone
      return beanName;
    }
    if (count == 1) {
      // just the first letter is upper case - convert it to lower case
      return beanName.substring(0, count).toLowerCase() + beanName.substring(count);
    }
    // starts with an acronym - leave it alone
    // BeanType.debug("getRestName starts with acronym " + beanName);
    return beanName;
  }

  public static String getSimpleTypeName(String className) {
    return removeSuffix(getLeafClassName(className), "MBean", "Bean");
  }

  public static String getLeafClassName(String className) {
    className = nonNull(className);
    return className.substring(className.lastIndexOf(".") + 1);
  }

  public static String removeSuffix(String str, String... suffixes) {
    for (String suffix : suffixes) {
      if (str.endsWith(suffix)) {
        return str.substring(0, str.length() - suffix.length());
      }
    }
    return str;
  }

  public static String urlEncode(String str) {
    String encodedUri = UriBuilder.fromPath(DUMMY_URL_PREFIX).segment(str).build().toString();
    return encodedUri.substring(DUMMY_URL_PREFIX.length());
  }

  public static String urlDecode(String str) {
    try {
      String encodedUri = DUMMY_URL_PREFIX + str;
      // strip off the beginning "/" from the string that getPath() returns
      return new URI(encodedUri).getPath().substring(1);
    } catch (URISyntaxException e) {
      throw new AssertionError(e); // The CFE should only have sent in valid urls
    }
  }

  public static boolean isInteger(String str) {
    if (StringUtils.isEmpty(str)) {
      return false;
    }
    try {
      Integer.parseInt(str);
      return true;
    } catch (NumberFormatException e) {
      return false;
    }
  }

  private static void emitWord(StringBuilder sb, String s, int start, int end) {
    if (start > end) {
      throw new AssertionError("Start greater than end: " + s + " " + start + " " + end);
    }
    if (start == end) {
      // no word
      return;
    }
    String word = s.substring(start, end);
    boolean isAcronym = false;
    int length = word.length();
    if (length > 1) {
      // multiple characters - see if second character is lower caser
      if (Character.isLowerCase(word.charAt(1))) {
        // the second character is lower case
        // this isn't an acronym
        isAcronym = false;
      } else {
        // the second character is upper case, a number or a special character
        // this is an acronym
        isAcronym = true;
      }
    } else {
      // only 1 character - acronyms need at least 2 characters
      isAcronym = false;
    }
    if (!isAcronym) {
      word = fixSpelling(word.toLowerCase()); // in case the 1st char is upper case
    }
    boolean firstWord = (start == 0);
    if (!firstWord) {
      sb.append(" ");
    }
    sb.append(word);
  }

  /**
   * We know there are some misspelled words as part of bean names that we can't change.  However, we can
   * fix them here so as to not have miss-spelled words in the remote console or have issues with translating them.
   * @param word to check
   * @return correctly spelled word
   */
  private static String fixSpelling(String word) {
    switch (word) {
      case "submited": return "submitted";
      case "joinpoint": return "join point";
      default: return word;
    }
  }

  private static String replaceEnding(String plural, String pluralEnding, String singularEnding) {
    if (plural.endsWith(pluralEnding)) {
      return plural.substring(0, plural.length() - pluralEnding.length()) + singularEnding;
    }
    return null;
  }

  /**
  * Changes every non-alphanumeric character into a space.
  */
  public static String cleanStringForLogging(Object string) {
    if (string == null) {
      return null;
    }
    return string.toString().replaceAll("[^A-Za-z0-9_]", " ");
  }
}

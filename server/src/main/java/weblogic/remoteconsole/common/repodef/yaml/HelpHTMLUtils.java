// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Utilities to help compute a property or action's help summary and detailed help.
 */
class HelpHTMLUtils {

  private static final String PARA_BEGIN = "<p>";
  private static final String PARA_END = "</p>";

  private HelpHTMLUtils() {
  }

  static String getEnglishHelpSummaryHTML(
    String harvestedHelp,
    String pdyHelp,
    String pdySummary,
    String pdyDetails
  ) {
    validateHelpHTMLProperties(pdyHelp, pdySummary, pdyDetails);
    if (StringUtils.notEmpty(pdyHelp)) {
      // The PDY specified helpHTML.
      // Use it as the summary.
      return pdyHelp;
    }
    if (StringUtils.notEmpty(pdySummary)) {
      // The PDY specified helpDetailsHTML.
      // Use it as the summary.
      return pdySummary;
    }
    // The PDY didn't specify helpHTML or helpDetailsHTML.
    // Use the first sentence of the description harvested from the bean info.
    return getSummary(harvestedHelp);
  }

  static String getEnglishDetailedHelpHTML(
    String harvestedHelp,
    String pdyHelp,
    String pdySummary,
    String pdyDetails
  ) {
    validateHelpHTMLProperties(pdyHelp, pdySummary, pdyDetails);
    if (StringUtils.notEmpty(pdyHelp)) {
      // The PDY specified helpHTML.
      // Use it as the full help.
      return pdyHelp;
    }
    if (StringUtils.notEmpty(pdySummary)) {
      if (StringUtils.notEmpty(pdyDetails)) {
        // The PDY customized the summary and details.
        // Combine them to get the full help.
        return pdySummary + pdyDetails;
      } else {
        // The PDY customized the summary but not the details.
        // Replace the first sentence of the harested help
        // with the summary from the PDY.
        return replaceSummary(harvestedHelp, pdySummary);
      }
    } else {
      if (StringUtils.isEmpty(pdyDetails)) {
        // The PDY didn't customize the summary or details.
        // Return all the harvested help.
        return harvestedHelp;
      } else {
        // The PDY customized the details but not the summary.
        // This isn't allowed.
        throw new AssertionError(
          "Specified helpDetailsHTML but not helpSummaryHTML: '" + pdySummary + "'"
        );
      }
    }
  }

  private static void validateHelpHTMLProperties(
    String pdyHelp,
    String pdySummary,
    String pdyDetails
  ) {
    if (StringUtils.notEmpty(pdyHelp)) {
      if (StringUtils.notEmpty(pdySummary)) {
        throw new AssertionError(
          "Specified helpHTML and helpSummaryHTML: '" + pdyHelp + "', '" + pdySummary + "'"
        );
      }
      if (StringUtils.notEmpty(pdyDetails)) {
        throw new AssertionError(
          "Specified helpHTML and helpDetailsHTML: '" + pdyHelp + "', '" + pdyDetails + "'"
        );
      }
    }
  }

  private static String replaceSummary(String harvestedHelp, String pdySummary) {
    String harvestedSummary = getSummary(harvestedHelp); // strips off <p> stuff
    pdySummary = getFirstParagraph(pdySummary); // strips off <p> stuff
    int idx = harvestedHelp.indexOf(harvestedSummary);
    String harvestedBeforeSummary = harvestedHelp.substring(0, idx);
    String harvestedAfterSummary = harvestedHelp.substring(idx + harvestedSummary.length());
    return harvestedBeforeSummary + pdySummary + harvestedAfterSummary;
  }

  private static String getSummary(String html) {
    if (html == null) {
      return null;
    }
    return getFirstSentenceInParagraph(getFirstParagraph(html.trim()));
  }

  private static String getFirstSentenceInParagraph(String paragraph) {
    // Look for first dot followed by whitespace.
    // If not found, return the entire paragraph.
    for (int i = 0; i < paragraph.length();) {
      int idx = paragraph.indexOf('.', i);
      if (idx != -1) {
        // Found the next dot.
        // Bump the cursor past the dot.
        i = idx + 1;
        if (i < paragraph.length()) {
          // There's a character following the dot.
          char next = paragraph.charAt(i);
          if (Character.isWhitespace(next)) {
            // The dot is followed by whitespace.
            // Return the characters up to and including the dot.
            return paragraph.substring(0, i);
          } else {
            // The dot is not followed by whitespace.
            // Keep going so we can look for another dot.
            // We've already bumped the cursor past this dot.
          }
        } else {
          // There isn't a character following the dot.
          // Bump the cursor to the end of the paragraph.
          i = paragraph.length();
        }
      } else {
        // Didn't find another dot.
        // Bump the cursor to the end of the paragraph.
        i = paragraph.length();
      }
    }
    // Didn't find a dot followed by whitespace.
    // Return the entire paragraph
    return paragraph;
  }

  private static String getFirstParagraph(String trimmedHTML) {
    if (trimmedHTML.startsWith(PARA_BEGIN)) {
      int idx = trimmedHTML.indexOf(PARA_END);
      if (idx != -1) {
        // <p>blah</p> - return blah
        return trimmedHTML.substring(PARA_BEGIN.length(), idx);
      } else {
        // <p>blah - return blah
        return trimmedHTML.substring(PARA_BEGIN.length());
      }
    } else {
      int idx = trimmedHTML.indexOf(PARA_BEGIN);
      if (idx != -1) {
        // blah<p> - return blah
        return trimmedHTML.substring(0, idx);
      } else {
        // blah - return blah
        return trimmedHTML;
      }
    }
  }
}

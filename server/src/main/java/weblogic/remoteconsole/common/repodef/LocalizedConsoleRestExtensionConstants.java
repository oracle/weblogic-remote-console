// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * This class contains a list of localized constants that are used by the
 * console REST extension that need to be displayed to the user.
 * 
 * The console REST extension sets the returned text in the response to
 * "<messageKey> <messageArgs as a JSON array>", e.g.
 *   consoleRestExtension.alreadyExists ["r1"]
 * (all the message keys start with "consoleRestExtension.")
 * 
 * The CBE notices that the text uses this pattern, finds the corresponding
 * message, gets its localized text based on the user's locale, inserts
 * the args, and displays it to the user.
 * 
 * Note: this class must be kept in sync with
 *   weblogic.console.wls.rest.extension.utils.LocalizationUtils
 */
public class LocalizedConsoleRestExtensionConstants {

  public static final String KEY_PREFIX = "consoleRestExtension.";

  private LocalizedConsoleRestExtensionConstants() {
  }

  private static Map<String, LocalizableString> allConstants = new HashMap<>();

  static {

    addConstant(
      "requiredPropertyNotSpecified",
      "Required property not specified: {0}"
    );

    addConstant(
      "alreadyExists",
      "Already exists: {0}"
    );

    addConstant(
      "userPasswordCredentialNotFound",
      "There is no credential configured for the remote user {0}."
    );

    addConstant(
      "userPasswordCredentialNotDeletableBecauseUsed",
      "This credential cannot be removed because it is used by {0}."
    );

    addConstant(
      "userPasswordResourceNotDeletableBecauseMultipleMappings",
      "This resource cannot be removed because it contains more than one credential mapping."
    );

    // {0} is the localized predicate name
    // {1} is the localized argument name
    // {2} is the bad argument value
    // {3} is the error from the underying predicate argument
    // {3} typically contains {2}, so just display {3} for now.
    addConstant(
      "invalidPredicateArgumentValue",
      "Predicate: ''{0}'', Argument: ''{1}'', Error : ''{3}''"
    );

    // {0} is the application name
    addConstant(
      "applicationHasPlan",
      "The application ''{0}'' already has a deployment plan."
    );

    addConstant(
        "applicationHasNoPlan",
        "The application ''{0}'' does not have a deployment plan."
    );

    // {0} is the plan path
    addConstant(
      "planPathNotXml",
      "The plan path ''{0}'' must end in ''.xml''."
    );

    // {0} is the configured staging mode.
    addConstant(
        "stageModeNotSupported",
        "This deployment cannot be redeployed because its staging mode is ''{0}''.  Remove and add it instead."
    );

    addConstant(
        "libraryRedeployNotSupported",
        "The library ''{0}'' cannot be redeployed because its source is not under "
            + "the administration server's upload directory.  Remove and add it instead."
    );

    // {0} is the bean name
    addConstant(
        "descriptorBeanNotRemovable",
        "''{0}'' cannot be removed because it is defined in the application''s deployment descriptors."
    );

  }

  // Find the LocalizableString for a key.
  // Returns null if the constant doesn't exist.
  public static LocalizableString findConstant(String constantKey) {
    return allConstants.get(constantKey);
  }

  // Returns all of the constants (used when the resource bundles are generated at build time)
  public static Collection<LocalizableString> getAllConstants() {
    return allConstants.values();
  }

  private static void addConstant(String relativeConstantKey, String englishText) {
    LocalizableString ls =
      new LocalizableString(KEY_PREFIX + relativeConstantKey, englishText);
    allConstants.put(ls.getResourceBundleKey(), ls);
  }
}

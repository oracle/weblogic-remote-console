// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

/**
 * Utility class for finding the resource bundle for a WebLogic version
 * that has all of the strings for that version's page and type definitions.
 * 
 * For example. the resource bundle for WebLogic 14.1.1.0.0 is
 * console_resource_bundle_14_1_1_0_0
 */
public class WebLogicLocalizationUtils {

  private static final String BUNDLE_NAME = "console_backend_resource_bundle";

  private WebLogicLocalizationUtils() {
  }

  public static String getResourceBundleName(String weblogicVersion) {
    // Note: can't have dots in resource bundle names
    return
      BUNDLE_NAME
      + "_"
      + weblogicVersion.replace('.', '_');
  }
}

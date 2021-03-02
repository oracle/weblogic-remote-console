// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.wls.rest.extension;

/**
 * General purpose String utilities needed by the console weblogic REST extension.
 */
public class StringUtils {

  public static String removeSuffix(String str, String... suffixes) {
    for (String suffix : suffixes) {
      if (str.endsWith(suffix)) {
        return str.substring(0, str.length() - suffix.length());
      }
    }
    return str;
  }
}

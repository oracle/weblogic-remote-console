// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * This class lets the caller know whether a weblogic bean property name is one of the ones on the
 * base weblogic bean types, e.g. name/type/notes.
 * <p>
 * When singleton beans are merged into their parents, these properties are ignored.
 */
public class BaseProperties {

  private static final Set BASE_PROPERTIES =
    new HashSet<>(
      Arrays.asList(
        new String[] {
          "identity",
          "CachingDisabled",
          "DynamicallyCreated",
          "Id",
          "Name",
          "Notes",
          "ObjectName",
          "Registered",
          "Tags",
          "Type"
        }
      )
    );

  public static boolean isBaseProperty(String property) {
    return BASE_PROPERTIES.contains(property);
  }
}

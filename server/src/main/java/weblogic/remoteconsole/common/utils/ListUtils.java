// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.ArrayList;
import java.util.List;

/** General purpose List utilities needed by the console backend. */
public class ListUtils {

  /**
   * Returns the list if it isn't null, otherwise an empty list,
   * so that the caller doesn't need to check for null.
   */
  public static <T> List<T> nonNull(List<T> list) {
    return (list != null) ? list : new ArrayList<>();
  }

  /**
   * Returns true if the list if the list is null
   * or empty, false otherwise. Makes it simpler to check
   * whether a list that might be null is empty or not.
   */
  public static <T> boolean isEmpty(List<T> list) {
    return nonNull(list).isEmpty();
  }
}

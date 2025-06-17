// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.utils;

import java.util.HashMap;
import java.util.Map;

public class Deduplicator<T extends Deduplicatable> {

  private String type;
  private Map<String,T> deduplicated = new HashMap<>();
  private long undeduplicatedCount = 0;
  private long deduplicatedCount = 0;

  public Deduplicator(String type) {
    this.type = type;
  }

  public T deduplicate(T unduplicated) {
    String key = unduplicated.getDeduplicationKey();
    if (key == null) {
      // this instance cannot be deduplicated
      return unduplicated;
    }
    T rtn = deduplicated.get(key);
    if (rtn == null) {
      rtn = unduplicated;
      deduplicated.put(key, rtn);
      deduplicatedCount++;
    }
    undeduplicatedCount++;
    /*
    if (undeduplicatedCount % 10000 == 0) {
      System.out.println(
        "DEBUG deduplicate"
        + " " + type
        + " " + undeduplicatedCount
        + " " + deduplicatedCount
        + " " + deduplicated.size()
      );
    }
    */
    return rtn;
  }
}

// Copyright (c) 2025, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.utils;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.LongAdder;

public class Deduplicator<T extends Deduplicatable> {

  private final String type;
  private final ConcurrentMap<String,T> deduplicated = new ConcurrentHashMap<>();
  private final LongAdder undeduplicatedCount = new LongAdder();
  private final LongAdder deduplicatedCount = new LongAdder();

  public Deduplicator(String type) {
    this.type = type;
  }

  public T deduplicate(T unduplicated) {
    String key = unduplicated.getDeduplicationKey();
    if (key == null) {
      // this instance cannot be deduplicated
      return unduplicated;
    }
    T rtn = deduplicated.putIfAbsent(key, unduplicated);
    if (rtn == null) {
      rtn = unduplicated;
      deduplicatedCount.increment();
    }
    undeduplicatedCount.increment();
    /*
    if (undeduplicatedCount.longValue() % 10000 == 0) {
      System.out.println(
        "DEBUG deduplicate"
        + " " + type
        + " " + undeduplicatedCount.longValue()
        + " " + deduplicatedCount.longValue()
        + " " + deduplicated.size()
      );
    }
    */
    return rtn;
  }
}

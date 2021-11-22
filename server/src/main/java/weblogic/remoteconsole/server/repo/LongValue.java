// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds a long value.
 */
public class LongValue extends Value {

  private long value;

  public LongValue(long value) {
    this.value = value;
  }

  public long getValue() {
    return this.value;
  }

  @Override
  public String toString() {
    return "LongValue<" + getValue() + ">";
  }
}

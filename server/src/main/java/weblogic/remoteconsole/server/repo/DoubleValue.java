// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds a double value.
 */
public class DoubleValue extends Value {

  private double value;

  public DoubleValue(double value) {
    this.value = value;
  }

  public double getValue() {
    return this.value;
  }

  @Override
  public String toString() {
    return "DoubleValue<" + getValue() + ">";
  }
}

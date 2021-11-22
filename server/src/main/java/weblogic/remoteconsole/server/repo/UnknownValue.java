// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds an unknown value.
 *
 * It indicates that the value is not known (e.g. for a derived default
 * on a create form, or a property with a derived default that is not
 * specified in a WDT model).
 */
public class UnknownValue extends Value {
  public static UnknownValue INSTANCE = new UnknownValue();

  private UnknownValue() {
  }

  @Override
  public String toString() {
    return "UnknownValue<>";
  }
}

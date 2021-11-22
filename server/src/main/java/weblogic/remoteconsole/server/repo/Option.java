// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;

/**
 * This class holds the value of an option of a property on a form.
 */
public class Option {
  private String label;
  private Value value;

  public Option(InvocationContext ic, Value value) {
    this(computeLabel(ic, value), value);
  }

  public Option(String label, Value value) {
    this.label = label;
    this.value = value;
  }

  private static String computeLabel(InvocationContext ic, Value value) {
    if (value.isNullReference()) {
      return ic.getLocalizer().localizeString(LocalizedConstants.NULL_REFERENCE);
    }
    if (value.isBeanTreePath()) {
      return value.asBeanTreePath().getLastSegment().getKey();
    }
    throw new AssertionError("Non-reference options are not supported yet: " + value);
  }

  // Returns the localixzed label to display for this option
  public String getLabel() {
    return label;
  }

  // Returns the value for this option (e.g. a BeanTreePath of a bean that a
  // reference property can be set to)
  public Value getValue() {
    return value;
  }

  @Override
  public String toString() {
    return "Option<" + getLabel() + ", " + getValue() + ">";
  }
}

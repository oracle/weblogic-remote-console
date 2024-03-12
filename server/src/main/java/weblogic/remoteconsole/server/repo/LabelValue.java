// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds the info needed for an href that contains just a label
 */
public class LabelValue extends Value {

  private String label;

  public LabelValue(String label) {
    this.label = label;
  }

  public String getLabel() {
    return label;
  }

  @Override
  public String toString() {
    return "LabelValue<" + getLabel() + ">";
  }
}

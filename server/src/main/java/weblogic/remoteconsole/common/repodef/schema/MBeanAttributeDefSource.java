// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This POJO mirrors the yaml source file format for specifying which mbean attribute a property is related to
 */
public class MBeanAttributeDefSource {
  private StringValue type = new StringValue();
  private StringValue attribute = new StringValue();

  // Returns the name of the mbean type, e.g. EJBRuntimeMBean
  public String getType() {
    return type.getValue();
  }

  public void setType(String val) {
    type.setValue(val);
  }

  // Returns the name of the mbean attribute on that type (or one of its singleton children),
  // e.g. TransactionRuntime.TransactionsCommittedTotalCount
  public String getAttribute() {
    return attribute.getValue();
  }

  public void setAttribute(String val) {
    attribute.setValue(val);
  }

  public String toString() {
    return "type:\"" + getType() + "\", attribute:" + getAttribute();
  }
}

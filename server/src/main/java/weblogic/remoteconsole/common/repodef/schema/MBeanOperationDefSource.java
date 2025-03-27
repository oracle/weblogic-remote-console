// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import weblogic.console.schema.StringValue;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for specifying which mbean operation an action is related to
 */
public class MBeanOperationDefSource extends YamlSource {
  private StringValue type = new StringValue();
  private StringValue operation = new StringValue();

  // Returns the name of the mbean type, e.g. EJBRuntimeMBean
  public String getType() {
    return type.getValue();
  }

  public void setType(String val) {
    type.setValue(val);
  }

  // Returns the name of the mbean operation on that type (or one of its singleton children),
  // e.g. forceShutdown
  public String getOperation() {
    return operation.getValue();
  }

  public void setOperation(String val) {
    operation.setValue(val);
  }

  public String toString() {
    return "type:\"" + getType() + "\", operation:" + getOperation();
  }
}

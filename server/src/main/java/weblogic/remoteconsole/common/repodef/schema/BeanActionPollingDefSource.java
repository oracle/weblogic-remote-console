// Copyright (c) 2023, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This POJO mirrors the yaml source file format for configuring polling
 * information about an action
 */
public class BeanActionPollingDefSource extends YamlSource {

  private IntValue reloadSeconds = new IntValue();
  private IntValue maxAttempts = new IntValue();

  // Returns the polling interval in seconds:
  public int getReloadSeconds() {
    return reloadSeconds.getValue();
  }

  public void setReloadSeconds(int val) {
    reloadSeconds.setValue(val);
  }

  // Returns the maximum number of times poll:
  public int getMaxAttempts() {
    return maxAttempts.getValue();
  }

  public void setMaxAttempts(int val) {
    maxAttempts.setValue(val);
  }

  public String toString() {
    return
      "reloadSeconds:\"" + getReloadSeconds() + "\""
      + ", maxAttempts:" + getMaxAttempts() + "\"";
  }
}

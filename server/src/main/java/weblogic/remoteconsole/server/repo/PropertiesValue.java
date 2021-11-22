// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Properties;

/**
 * This class holds a Properties value (i.e. a list of name/value pairs)
 */
public class PropertiesValue extends Value {
  private Properties value;

  public PropertiesValue(Properties value) {
    this.value = value;
  }

  public Properties getValue() {
    return this.value;
  }

  @Override
  public String toString() {
    return "PropertiesValue<" + getValue() + ">";
  }
}

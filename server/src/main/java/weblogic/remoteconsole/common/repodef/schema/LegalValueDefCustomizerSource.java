// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.BooleanValue;
import weblogic.console.schema.ListValue;
import weblogic.console.schema.ScalarValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for customizing information about
 * a legal value of a property.
 */
public class LegalValueDefCustomizerSource extends YamlSource {
  private ScalarValue value = ScalarValue.create();
  private StringValue label = StringValue.create();
  private BooleanValue omit = BooleanValue.create();
  private ListValue<String> requiredCapabilities = ListValue.create();

  // The legal value to be customized.
  // It's type must match the property's type.

  public Object getValue() {
    return value.getValue();
  }

  public void setValue(Object val) {
    value = value.setValue(val);
  }

  // The custom english label to display for 'value'.

  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String val) {
    label = label.setValue(val);
  }

  // Omit this legal value.
  // This is used to trim out legal values from a page.
  // For example this is used to prevent a user from creating
  // a new PROXY JDBCSystemResource, even though we support
  // editing them if they already exist in the configuration.

  public boolean isOmit() {
    return omit.getValue();
  }

  public void setOmit(boolean val) {
    omit = omit.setValue(val);
  }

  // The bean repo capabilities that are required for this legal value to be present
  public List<String> getRequiredCapabilities() {
    return requiredCapabilities.getValue();
  }
  
  public void setRequiredCapabilities(List<String> val) {
    requiredCapabilities = requiredCapabilities.setValue(val);
  }
}

// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This POJO mirrors the yaml source file format for customizing information about
 * a legal value of a property.
 */
public class LegalValueDefCustomizerSource {
  private ScalarValue value = new ScalarValue();
  private StringValue label = new StringValue();
  private BooleanValue omit = new BooleanValue();

  // The legal value to be customized.
  // It's type must match the property's type.

  public Object getValue() {
    return value.getValue();
  }

  public void setValue(Object val) {
    value.setValue(val);
  }

  // The custom english label to display for 'value'.

  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String val) {
    label.setValue(val);
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
    omit.setValue(val);
  }
}

// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import weblogic.console.schema.BooleanValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.Value;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for configuring presentation
 * information about a field
 */
public class BeanFieldPresentationDefSource extends YamlSource {

  public enum Width {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl
  }

  private StringValue inlineFieldHelp = StringValue.create();
  private BooleanValue displayAsHex = BooleanValue.create();
  private Value<Width> width = Value.create();

  // Returns the inline field help, for example "e.g. jdbc/myDS"
  // By default, properties don't have inline field help.
  public String getInlineFieldHelp() {
    return inlineFieldHelp.getValue();
  }

  public void setInlineFieldHelp(String val) {
    inlineFieldHelp = inlineFieldHelp.setValue(val);
  }

  // Returns whether to display this field as hex (v.s. decimal)
  // Only for int and long properties.
  // The default is to display numbers in decimal.
  public boolean isDisplayAsHex() {
    return displayAsHex.getValue();
  }

  public void setDisplayAsHex(boolean val) {
    displayAsHex = displayAsHex.setValue(val);
  }

  // This field's width
  public Width getWidth() {
    return width.getValue();
  }

  public void setWidth(Width value) {
    width = width.setValue(value);
  }

  public String toString() {
    return
      "help:\"" + getInlineFieldHelp() + "\""
      + ", hex:" + isDisplayAsHex() + "\""
      + ", width: \"" + getWidth() + "\"";
  }
}

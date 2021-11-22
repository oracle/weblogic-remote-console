// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This POJO mirrors the yaml source file format for configuring presentation
 * information about a property
 */
public class BeanPropertyPresentationDefSource {
  private StringValue inlineFieldHelp = new StringValue();
  private BooleanValue displayAsHex = new BooleanValue();

  // Returns the inline field help, for example "e.g. jdbc/myDS"
  // By default, properties don't have inline field help.
  public String getInlineFieldHelp() {
    return inlineFieldHelp.getValue();
  }

  public void setInlineFieldHelp(String val) {
    inlineFieldHelp.setValue(val);
  }

  // Returns whether to display this property as hex (v.s. decimal)
  // Only for int and long properties.
  // The default is to display numbers in decimal.
  public boolean isDisplayAsHex() {
    return displayAsHex.getValue();
  }

  public void setDisplayAsHex(boolean val) {
    displayAsHex.setValue(val);
  }

  public String toString() {
    return "help:\"" + getInlineFieldHelp() + "\", hex:" + isDisplayAsHex();
  }
}

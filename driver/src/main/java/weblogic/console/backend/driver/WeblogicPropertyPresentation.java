// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

/**
 * This POJO contains presentation information that the UI needs about
 * a form property on a weblogic bean page.
 */
public class WeblogicPropertyPresentation {
  private String inlineFieldHelp;

  public String getInlineFieldHelp() {
    return this.inlineFieldHelp;
  }

  public void setInlineFieldHelp(String inlineFieldHelp) {
    this.inlineFieldHelp = inlineFieldHelp;
  }

  private boolean displayAsHex;

  public boolean isDisplayAsHex() {
    return this.displayAsHex;
  }

  public void setDisplayAsHex(boolean displayAsHex) {
    this.displayAsHex = displayAsHex;
  }
}

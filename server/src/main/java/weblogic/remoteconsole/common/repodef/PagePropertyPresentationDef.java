// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes how to customize the presentation of property on a page.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface PagePropertyPresentationDef {

  // Returns the correponding property
  public PagePropertyDef getPropertyDef();

  // Returns the inline field help, for example "e.g. jdbc/myDS"
  // By default, properties don't have inline field help.
  public LocalizableString getInlineFieldHelp();

  // Returns whether to display this property as hex (v.s. decimal)
  // Only for int and long properties.
  // The default is to display numbers in decimal.
  public boolean isDisplayAsHex();
}

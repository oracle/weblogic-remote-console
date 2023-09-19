// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes a property on a form or table page.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface PagePropertyDef extends PageFieldDef, BeanPropertyDef {

  // Get the corresponding page def
  public PageDef getPageDef();

  // When this property should displayed to the user.
  // If null, then it should always be displayed.
  public PagePropertyUsedIfDef getUsedIfDef();

  // Info about linking to external documentation about this property
  // (e.g. links to mbean javadoc about this property).
  // Returns null if there is no external documentation available.
  public PagePropertyExternalHelpDef getExternalHelpDef();

  // Whether to return this property if it's in a hidden column on the page.
  // Normally, all of the columns are fetched (since it isn't expensive)
  // so that the CFE doesn't need to do another round trip when the user
  // changes which columns are displayed.
  // However, some properties, like the ServerLifeCycleRuntimeMBean's State
  // property, are very expensive to compute, and slow the table down.
  // So, it's better to not fetch them until the user wants to see them.
  public boolean isDontReturnIfHiddenColumn();
}

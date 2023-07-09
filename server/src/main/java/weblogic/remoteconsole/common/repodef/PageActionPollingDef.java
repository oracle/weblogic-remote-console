// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes how to the CFE should configure auto reload
 * after invoking this action.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface PageActionPollingDef {

  // Returns the correponding action
  public PageActionDef getActionDef();

  // Returns the auto refresh interval in seconds.
  public int getReloadSeconds();

  // Returns the maximum number of times to auto refresh the table.
  public int getMaxAttempts();
}

// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This interface returns the requested beans/properties from a search request plus
 * the change manager's status
 */
public interface ChangeManagerBeanRepoSearchResults extends BeanReaderRepoSearchResults {

  // Returns the change manager's status (i.e. edit session status).
  // Returns null if addChangeManagerStatus wasn't called on the search builder.
  public ChangeManagerStatus getChangeManagerStatus();

  // Returns the list of changes (i.e. added, modified, deleted beans).
  // Returns null if addChanges wasn't called on the search builder or if
  // the remote console REST extension is not installed on the admin server.
  public Changes getChanges();
}

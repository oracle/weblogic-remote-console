// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This interface lets the caller specify which beans and properties in the bean repo
 * a search request should return.  It also lets the caller tell the bean repo to
 * return information about the current edit session.
 */
public interface ChangeManagerBeanRepoSearchBuilder extends BeanReaderRepoSearchBuilder {

  // Asks the bean repo to return the status of the current edit session in
  // the search response (see the ChangeManagerStatus interface).
  //
  // The status also returns whether or not the bean repo supports
  // returning the list of changes (i.e. shopping cart contents)
  public void addChangeManagerStatus();

  // Asks the bean repo to return the list of added / modified / deleted beans
  // (i.e. shopping cart contents) in the search response.
  //
  // The changes will only be returned if the remote console REST extension has been
  // installed on the admin server.
  public void addChanges();
}

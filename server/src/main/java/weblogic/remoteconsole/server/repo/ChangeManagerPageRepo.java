// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.PageRepoDef;

/**
 * This class manages the admin server's edit tree's configuration mbeans' pages.
 */
public class ChangeManagerPageRepo extends PageEditorRepo {

  protected ChangeManagerPageRepo(PageRepoDef pageRepoDef, BeanRepo beanRepo) {
    super(pageRepoDef, beanRepo);
  }

  // Get the change manager status. 
  //
  // This makes a REST call to the admin server.
  // If the user needs other information too, the user
  // should consider creating a search request that fetches
  // both so that it can be done with one REST call. 
  public Response<ChangeManagerStatus> getChangeManagerStatus(InvocationContext ic) {
    Response<ChangeManagerStatus> response = new Response<>();
    boolean includeIsSet = false;
    BeanReaderRepoSearchBuilder builder =
      getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, includeIsSet);
    builder.asChangeManagerBeanRepoSearchBuilder().addChangeManagerStatus();
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    return response.setSuccess(
      searchResponse.getResults().asChangeManagerBeanRepoSearchResults().getChangeManagerStatus()
    );
  }

  // Get the list of changes (i.e. shopping cart contents).
  //
  // This makes a REST call to the admin server.
  // If the user needs other information too, the user
  // should consider creating a search request that fetches
  // both so that it can be done with one REST call.
  public Response<Changes> getChanges(InvocationContext ic) {
    Response<Changes> response = new Response<>();
    boolean includeIsSet = true; // so we can find out whether old/new values have been set
    BeanReaderRepoSearchBuilder builder =
      getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, includeIsSet);
    builder.asChangeManagerBeanRepoSearchBuilder().addChanges();
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    return response.setSuccess(
      searchResponse.getResults().asChangeManagerBeanRepoSearchResults().getChanges()
    );
  }

  // Commit any pending configuration changes in the current edit session.
  public Response<Void> commitChanges(InvocationContext ic) {
    return getBeanRepo().asChangeManagerBeanRepo().commitChanges(ic);
  }

  // Discard any pending configuration changes in the current edit session.
  public Response<Void> discardChanges(InvocationContext ic) {
    return getBeanRepo().asChangeManagerBeanRepo().discardChanges(ic);
  }
}

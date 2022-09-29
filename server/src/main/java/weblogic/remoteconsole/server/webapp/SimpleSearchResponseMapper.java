// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.Json;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.providers.Root;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Used to return a link to the resource that actually performs the simple search.
 */
public class SimpleSearchResponseMapper extends ResponseMapper<String> {

  public static javax.ws.rs.core.Response toResponse(
    InvocationContext ic,
    Response<String> response
  ) {
    return new SimpleSearchResponseMapper(ic, response).toResponse();
  }

  private SimpleSearchResponseMapper(
    InvocationContext ic,
    Response<String> response
  ) {
    super(ic, response);
  }

  @Override
  protected void addResults() {
    String searchName = getResponse().getResults();
    Path simpleSearchResultsPath =
      new Path()
        .childPath(getRecentSearchesParent())
        .childPath("RecentSearches")
        .childPath(searchName);
    String queryParams = ""; // no query params
    getEntityBuilder().add(
      "resourceData",
      Json.createObjectBuilder()
        .add("label", searchName)
        .add("resourceData", getBackendRelativeUri(simpleSearchResultsPath, queryParams))
    );
  }

  private String getRecentSearchesParent() {
    String root = getInvocationContext().getPageRepo().getPageRepoDef().getName();
    if (Root.DOMAIN_RUNTIME_NAME.equals(root)) {
      return "DomainRuntime";
    }
    if (Root.EDIT_NAME.equals(root)
         || Root.SERVER_CONFIGURATION_NAME.equals(root)
         || Root.COMPOSITE_CONFIGURATION_NAME.equals(root)
         || Root.SECURITY_DATA_NAME.equals(root)
    ) {
      return "Domain";
    }
    throw new AssertionError("Root doesn't support search: " + root);
  }
}

// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import java.util.logging.Logger;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SearchBeanFinder;
import weblogic.remoteconsole.server.repo.SearchBeanResults;
import weblogic.remoteconsole.server.repo.SearchCriteria;

/**
 * Perform a general search
 */
public class SearchResource extends BaseResource {

  private static final Logger LOGGER = Logger.getLogger(SearchResource.class.getName());

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public javax.ws.rs.core.Response search(JsonObject requestBody) {
    return SearchResponseMapper.toResponse(getInvocationContext(), getResponse(requestBody));
  }

  private Response<List<SearchBeanResults>> getResponse(JsonObject requestBody) {
    Response<List<SearchBeanResults>> response = new Response<>();
    // Convert the request body into a SearchCriteria
    Response<SearchCriteria> criteriaResponse =
      SearchRequestBodyMapper.fromRequestBody(getInvocationContext(), requestBody);
    if (!criteriaResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(criteriaResponse);
    }
    SearchCriteria criteria = criteriaResponse.getResults();
    // Perform the search and return the results
    SearchBeanFinder finder =
      new SearchBeanFinder(getInvocationContext(), criteria);
    BeanReaderRepoSearchBuilder searchBuilder =
      getInvocationContext()
        .getPageRepo()
        .getBeanRepo()
        .asBeanReaderRepo()
        .createSearchBuilder(getInvocationContext(), false);
    finder.addToSearchBuilder(searchBuilder);
    Response<BeanReaderRepoSearchResults> searchResponse = searchBuilder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanReaderRepoSearchResults searchResults = searchResponse.getResults();
    List<SearchBeanResults>  beansResults = finder.getResults(searchResults);
    return response.setSuccess(beansResults);
  }
}

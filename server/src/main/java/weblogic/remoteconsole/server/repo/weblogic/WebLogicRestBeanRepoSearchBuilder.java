// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.HashMap;
import java.util.Map;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.ConsoleBackendRuntimeConfig;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BeanTreePathSegment;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Builds a search request for a WebLogic REST-based bean repo.
 */
public class WebLogicRestBeanRepoSearchBuilder implements BeanReaderRepoSearchBuilder {
  private WebLogicRestBeanRepo beanRepo;
  private InvocationContext invocationContext;
  // Whether the caller who initiated the search wants the results
  // to include whether properties have been set
  private boolean includeIsSet;
  private Map<String, WebLogicRestSearchQueryBuilder> rootBeanNameToQueryBuilderMap = new HashMap<>();
  private Map<String, JsonObject> rootBeanNameToQueryMap = new HashMap<>();
  private Map<String, JsonObject> rootBeanNameToRawResultsMap = new HashMap<>();

  protected WebLogicRestBeanRepoSearchBuilder(
    WebLogicRestBeanRepo beanRepo,
    InvocationContext invocationContext,
    boolean includeIsSet
  ) {
    this.beanRepo = beanRepo;
    this.invocationContext = invocationContext;
    this.includeIsSet = includeIsSet;
    for (String rootBeanName : getBeanRepo().getRootBeanNames()) {
      BeanChildDef beanChildDef = getBeanRepo()
          .getBeanRepoDef()
          .getRootTypeDef()
          .getChildDef(new Path(rootBeanName));
      if (beanChildDef == null) {
        continue;
      }
      BeanTypeDef rootTypeDef =
        getBeanRepo()
          .getBeanRepoDef()
          .getRootTypeDef()
          .getChildDef(new Path(rootBeanName))
          .getChildTypeDef();

      // Check if the root bean requires fixup of the server runtime mbeans' identities
      boolean fixIdentities = ("DomainRuntime".equals(rootBeanName)) ? true : false;

      // Create the query builder for the root bean
      getRootBeanNameToQueryBuilderMap().put(
        rootBeanName,
        new WebLogicRestSearchQueryBuilder(this, rootTypeDef, fixIdentities)
      );
    }
  }

  protected WebLogicRestBeanRepo getBeanRepo() {
    return this.beanRepo;
  }

  protected InvocationContext getInvocationContext() {
    return this.invocationContext;
  }

  boolean isIncludeIsSet() {
    return includeIsSet;
  }

  Map<String, WebLogicRestSearchQueryBuilder> getRootBeanNameToQueryBuilderMap() {
    return this.rootBeanNameToQueryBuilderMap;
  }

  @Override
  public void addProperty(BeanTreePath beanTreePath, BeanPropertyDef propertyDef) {
    WebLogicBeanTypeSearchHelper.getHelper(beanTreePath).addProperty(this, beanTreePath, propertyDef);
  }

  void defaultAddProperty(BeanTreePath beanTreePath, BeanPropertyDef propertyDef) {
    WebLogicRestSearchQueryBuilder builder = getWebLogicRestSearchQueryBuilder(beanTreePath);
    BeanTypeDef typeDef = beanTreePath.getTypeDef();
    for (String component : propertyDef.getParentPath().getComponents()) {
      BeanChildDef childDef = typeDef.getChildDef(new Path(component), true);
      builder = builder.getOrCreateChild(childDef);
      typeDef = childDef.getChildTypeDef();
    }
    builder.addProperty(propertyDef);
  }

  @Override
  public Response<BeanReaderRepoSearchResults> search() {
    Response<BeanReaderRepoSearchResults> response = new Response<>();
    Map<String,JsonObject> searchResults = new HashMap<String,JsonObject>();
    for (String rootBeanName : getBeanRepo().getRootBeanNames()) {
      WebLogicRestSearchQueryBuilder queryBuilder = getRootBeanNameToQueryBuilderMap().get(rootBeanName);
      if (queryBuilder == null) {
        continue;
      }
      JsonObjectBuilder builder = queryBuilder.getJsonObjectBuilder();
      if (builder != null) {
        // we've been asked to search this tree.  do it.
        JsonObject query = builder.build();
        rootBeanNameToQueryMap.put(rootBeanName, query);
        Response<JsonObject> searchResponse =
          doQuery(
            queryBuilder,
            getBeanRepo().getWebLogicRestTreeName(rootBeanName),
            query
          );
        if (!searchResponse.isSuccess()) {
          // something went wrong in this search.  don't do any further searches.
          return response.copyUnsuccessfulResponse(searchResponse);
        }
        JsonObject rootBeanSearchResults = searchResponse.getResults();
        rootBeanNameToRawResultsMap.put(rootBeanName, rootBeanSearchResults);
        // Check if the query builder is adding context in order to fix identities
        // and provide the fixed search response to the BeanReaderRepoSearchResults
        if (queryBuilder.isFixIdentities()) {
          rootBeanSearchResults =
            WebLogicRestSearchResultsFixer.fixServerRuntimes(rootBeanSearchResults, queryBuilder.getBeanTypeDef());
        }
        searchResults.put(rootBeanName, rootBeanSearchResults);
      } else {
        // we haven't been asked for anything in this tree. skip it.
      }
    }
    return response.setSuccess(createSearchResults(searchResults));
  }

  protected BeanReaderRepoSearchResults createSearchResults(Map<String,JsonObject> searchResults) {
    return new WebLogicRestBeanRepoSearchResults(this, searchResults);
  }

  private Response<JsonObject> doQuery(
    WebLogicRestSearchQueryBuilder queryBuilder,
    String weblogicRestTreeName,
    JsonObject query
  ) {
    // if the caller wants to know whether properties are set and
    // if all the types in the query builder are settable,
    // then turn on the 'expandedValues' switch that tells WLS REST to
    // return whether properties are set.
    boolean returnExpandedValues = queryBuilder.isReturnExpandedValues();
    return
      WebLogicRestInvoker.post(
        getInvocationContext(),
        (new Path(weblogicRestTreeName)).childPath("search"),
        query,
        returnExpandedValues,
        false, // saveChanges
        false, // asynchronous
        WebLogicRestInvoker.builder().queryParam("requestMaxWaitMillis", getWlsToWlsReadTimeoutMillis())
      );
  }

  // By default, when the CBE makes a search request to the admin server that needs to fanout to
  // the managed servers, the admin server will wait up to 3 minutes for each managed server to respond.
  // Then it will return the results of all the managed servers that responded fast enough.
  // In the meantime, by default, the CBE waits for up to 20 seconds for the search request to finish.
  // So, if there are any slow/stuck servers, the CBE will timeout and not display any search results.
  //
  // The WLS REST api lets the caller specify a 'requestMaxWaitMillis' query param that
  // configures how long the admin server waits for each managed server to respond.
  // By setting it to a value that's a bit less than how long the CBE waits for the search
  // request to finish, it's much more likely that the WLS REST api will give up waiting
  // for slow/stuck servers and return the data from the healthy servers before the CBE
  // times out waiting for the search to complete.
  private long getWlsToWlsReadTimeoutMillis() {
    // TBD - should there be a separate WRC configuration parameter for this timeout
    // v.s. computing it based on the CBE -> WLS read timeout?
    //
    // Long term, the CBE will do the fanout to the managed servers (by making a
    // separate REST request to the admin server for each managed server) so
    // the appropriate timeout is a little less than the CBE -> WLS read timeout.
    // This means there will be no need for the customer to configure it.
    //
    // Currently the CBE makes one REST request to the admin server asking for
    // all the managed servers' data. If there are more managed servers than
    // the WLS REST work manager can handle simultaneously, the appropriate
    // timeout might need to be smaller, and it might make sense for the customer
    // to configure it separately.
    //
    // For now, we'll just compute it.  The customer can always increase the
    // CBE -> WLS timeout to indirectly control it.
    long cbeToWlsReadTimeoutMillis = ConsoleBackendRuntimeConfig.getReadTimeout(); // defaults to 20 seconds
    long desiredTimeoutMillis = cbeToWlsReadTimeoutMillis - 3000; // three seconds less than the CBE -> WLS timeout
    long minTimeoutMillis = 3000; // never let the WLS -> WLS timeout be less than 3 seconds
    return Math.max(desiredTimeoutMillis, minTimeoutMillis);
  }

  private WebLogicRestSearchQueryBuilder getWebLogicRestSearchQueryBuilder(BeanTreePath beanTreePath) {
    // Use the first segment to figure out which WLS REST bean tree
    // to add the query to (since we need to make separate WLS REST
    // queries for each root bean).
    getBeanRepo().verifySupportsBean(beanTreePath);
    String rootBean = getBeanRepo().getRootBeanName(beanTreePath);
    WebLogicRestSearchQueryBuilder rtn = getRootBeanNameToQueryBuilderMap().get(rootBean);
  
    // Add all the segments to that bean tree's query except for the 1st segment
    // (which identifies the WLS REST tree)
    for (int i = 1; i < beanTreePath.getSegments().size(); i++) {
      BeanTreePathSegment segment = beanTreePath.getSegments().get(i);
      BeanChildDef childDef = segment.getChildDef();
      rtn = rtn.getOrCreateChild(childDef);
      if (childDef.isCollection()) {
        if (segment.isKeySet()) {
          // return specific collection children
          rtn.addKey(segment.getKey());
        } else {
          // return all of the collection's children
          rtn.setAllKeys();
        }
      }
    }
    return rtn;
  }
}

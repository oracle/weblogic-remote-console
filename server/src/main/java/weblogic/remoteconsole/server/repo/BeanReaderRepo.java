// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.UrlUtils;

/**
 * This interface supports reading reading beans in a bean repo
 * and invoking operations on them.
 */
public interface BeanReaderRepo extends BeanRepo {

  // Create a search builder which will be used to fetch information
  // about a set of beans from the bean repo.
  //
  // For admin server connections, there is one REST request to
  // the admin server for each search.  Because of this, it's best practice
  // use as few searches as possible/practical, each asking for info about
  // a number of beans (v.s. making many small searches)
  public BeanReaderRepoSearchBuilder createSearchBuilder(InvocationContext ic, boolean includeIsSet);

  // Invoke an operation on a bean in the repo.
  public default Response<Value> invokeAction(
    InvocationContext ic,
    BeanTreePath beanPath,
    BeanActionDef actionDef,
    List<BeanActionArg> args
  ) {
    throw new AssertionError("unsupported action: " + actionDef);
  }

  // Invoke an operation on the bean referenced by the invocation context.
  public default Response<Value> invokeAction(
    InvocationContext ic,
    BeanActionDef actionDef,
    List<BeanActionArg> args
  ) {
    return invokeAction(ic, ic.getBeanTreePath(), actionDef, args);
  }

  // Verify that a bean exists in the repo.
  // Returns a not found response if the bean does not exist.
  // This should be called before updating or deleting a bean in the repo.
  public default Response<Void> verifyExists(InvocationContext ic, BeanTreePath beanPath) {
    Response<Void> response = new Response<>();
    Response<Boolean> existsResponse = exists(ic, beanPath);
    if (!existsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(existsResponse);
    }
    boolean exists = existsResponse.getResults();
    if (!exists) {
      return response.setNotFound();
    }
    return response;
  }

  // Verify that a bean does not exist in the repo.
  // Returns a bad request response if the bean exist.
  // This should be called before creating a bean in the repo.
  public default Response<Void> verifyDoesntExist(InvocationContext ic, BeanTreePath beanPath) {
    Response<Void> response = new Response<>();
    Response<Boolean> existsResponse = exists(ic, beanPath);
    if (!existsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(existsResponse);
    }
    boolean exists = existsResponse.getResults();
    if (exists) {
      response.addFailureMessage(
        ic.getLocalizer().localizeString(
          LocalizedConstants.BEAN_ALREADY_EXISTS,
          UrlUtils.pathToRelativeUri(beanPath.getPath())
        )
      );
      return response.setUserBadRequest();
    }
    return response;
  }

  // Returns whether a bean exists in the repo.
  public default Response<Boolean> exists(InvocationContext ic, BeanTreePath beanPath) {
    if (beanPath.isCollection()) {
      // Switch from the collection to its parent
      beanPath = BeanTreePath.create(beanPath.getBeanRepo(), beanPath.getPath().getParent());
    }
    Response<Boolean> response = new Response<>();
    BeanReaderRepoSearchBuilder builder = createSearchBuilder(ic, false);
    builder.addProperty(beanPath, beanPath.getTypeDef().getIdentityPropertyDef());
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    boolean exists = searchResponse.getResults().getBean(beanPath) != null;
    return response.setSuccess(Boolean.valueOf(exists));
  }

  // Convenience method for fetching a list of properties from a bean and its singleton child beans.
  // The property names are scoped (e.g. for a ServerMBean, SSL.Enabled)
  // Returns a map from the scoped property names to their corresponding values.
  // If a property isn't found, it's omitted from the map.
  // Returns a not found response if the top level bean doesn't exist.
  public default Response<Map<String,Value>> getBeanProperties(
    InvocationContext ic,
    List<String> propertyNames, // TBD - indicate whether each property must be available
    boolean includeIsSet
  ) {
    Response<Map<String,Value>> response = new Response<>();
    Map<String,BeanPropertyDef> propToPropDef = new HashMap<>();
    Map<String,Value> propToValue = new HashMap<>();
    BeanReaderRepoSearchBuilder builder = createSearchBuilder(ic, includeIsSet);
    BeanTreePath btp = ic.getBeanTreePath();
    for (String propertyName : propertyNames) {
      Path propertyPath = new Path(propertyName);
      BeanPropertyDef propDef = btp.getTypeDef().getPropertyDef(propertyPath, true);
      if (propDef != null) {
        propToPropDef.put(propertyName, propDef);
        builder.addProperty(btp, propDef);
      }
    }
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults beanResults = searchResponse.getResults().getBean(btp);
    if (beanResults == null) {
      return response.setNotFound();
    }
    BeanReaderRepoSearchResults searchResults = searchResponse.getResults();
    for (String propertyName : propertyNames) {
      BeanPropertyDef propDef = propToPropDef.get(propertyName);
      if (propDef != null) {
        if (beanResults != null) {
          Value value = beanResults.getValue(propDef);
          if (value != null) {
            propToValue.put(propertyName, value);
          }
        }
      }
    }
    return response.setSuccess(propToValue);
  }
}

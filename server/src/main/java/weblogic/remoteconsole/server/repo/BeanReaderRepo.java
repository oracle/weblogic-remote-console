// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;

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
          beanPath.getPath().getRelativeUri()
        )
      );
      return response.setUserBadRequest();
    }
    return response;
  }

  // Returns whether a bean exists in the repo.
  public default Response<Boolean> exists(InvocationContext ic, BeanTreePath beanPath) {
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
}

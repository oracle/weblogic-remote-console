// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import javax.json.JsonObject;

import weblogic.console.backend.utils.Path;

/**
 * Interface for managing a Weblogic domain's runtimes beans.
 * <p>
 * It isolates the console back end from interacting with the beans directly so that we can swap
 * in different implementations (e.g. online WLS REST, testing mock beans).
 * <p>
 * It uses the Weblogic REST api terms for managing the beans and does not fold the beans.
 * Unlike the WLS REST api, it does not return links.
 * <p>
 * All operations can throw an Exception if something unusual occurs.
 * The caller should turn these into a 500 response.
 */
public interface WeblogicRuntimeSPI {

  /**
   * This mirrors the WLS REST latest/domainRuntime/search api.
   *
   * @param invocationContext the invocation context for this request
   *
   * @param query specifies the 'slice' of the edit bean tree that this operation should return.
   *   It uses the same format as latest/domainRuntime/search, minus the 'links' property.
   *
   * @throws BadRequestException if there's something wrong in the query
   * 
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   *
   * @return a json object containing the search results
   */
  public JsonObject getBeanTreeSlice(
    InvocationContext invocationContext,
    JsonObject query
  ) throws BadRequestException, Exception;

  /**
   * This mirrors the WLS REST latest/domainConfig/search api.
   *
   * @param invocationContext the invocation context for this request
   *
   * @param query specifies the 'slice' of the edit bean tree that this operation should return.
   *   It uses the same format as latest/domainConfig/search, minus the 'links' property.
   *
   * @throws BadRequestException if there's something wrong in the query
   * 
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   *
   * @return a json object containing the search results
   */
  public JsonObject getConfigBeanTreeSlice(
    InvocationContext invocationContext,
    JsonObject query
  ) throws BadRequestException, Exception;

  /**
   * This mirrors the WLS REST for POSTing to invoke an action.
   *
   * If the action is synchronous, it calls it, waits for it to complete,
   * then returns the response from WLS.
   *
   * If the action is asynchronous, it calls it synchronously with a brief
   * timeout (so that if there are any problems in the arguments, it can
   * return a 400 promptly).  If it times out (because the operation didn't
   * complete soon enough) then it returns the underlying response 202 from WLS.
   *
   * @param invocationContext the invocation context for this request
   *
   * @param bean the bean to invoke the operation on.
   *
   * @param action the name of the action to invoke.
   *
   * @param arguments the action arguments to pass to the action.
   *
   * @param asynchronous whether the action is asynchronous
   *
   * @return a json object containing the return value of the action
   *
   * @throws BadRequestException if there's something wrong in the bean, action, arguments
   *   or if the bean doesn't support that action at this momemnt (e.g. trying to
   *   shut down a server that isn't running).
   *
   * @throws NoDataFoundException if the bean and/or action does not exist.
   * 
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   */
  public JsonObject invokeAction(
    InvocationContext invocationContext,
    Path bean,
    String action,
    boolean asynchronous,
    JsonObject arguments
  ) throws BadRequestException, NoDataFoundException, Exception;
}

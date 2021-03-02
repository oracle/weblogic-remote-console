// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.wlsrest;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;
import javax.ws.rs.core.Response;

import weblogic.console.backend.driver.AbstractWeblogicRuntime;
import weblogic.console.backend.driver.BadRequestException;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.NoDataFoundException;
import weblogic.console.backend.driver.WeblogicRuntimeSPI;
import weblogic.console.backend.integration.WebLogicRestClient;
import weblogic.console.backend.integration.WebLogicRestRequest;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;
import weblogic.console.backend.utils.Path;

/**
 * WLS REST based Implementation of the WeblogicRuntimeSPI interface.
 * <p>
 * It calls the WLS REST api (and a corresponding console REST extension) to get the job done.
 * <p>
 * It isolates the console back end from interacting with the mbeans directly so that we can swap
 * in different implementations (e.g. online WLS REST, testing mock mbeans).
 * <p>
 * TBD - can/should we share any code with WeblogicRestConfiguration? Should they share a common
 * reading interface so that we can have a shared mapper that converts the WLS REST response to an
 * RDJ response? Maybe not, especially if that mapper needs to be expanded values aware for
 * configuration but not for runtime.
 * <p>
 * Note:
 * <p>
 * At the WLS bean tree level, each server has its own tree of server runtime mbeans, and the
 * admin server has a separate tree of domain runtime mbean that doesn't include any server runtime
 * mbeans.
 * <p>
 * In the WLS REST api, identities identify a bean in a bean tree (think of them as a path) are
 * always relative to the root of the tree, so, [] in the domain runtime tree identifies the domain
 * runtime mbean, and [] in a server runtime tree identifies that server's server runtime mbean.
 * <p>
 * Also, the WLS REST api adds a synthetic serverRuntimes property under the domain runtime tree.
 * It delegates calls under the covers to the individual managed servers. i.e. it makes it look like
 * the server runtime mbeans live under the domain runtime mbean.
 * <p>
 * Unfortunately, the WLS REST api doesn't update the server runtime mbeans' identities to show
 * that they're under the domain runtime tree.
 * <p>
 * For example, if you create a query that returns the domain runtime mbean's identity and all
 * the server runtime mbean's identities and names, you'll get (using yaml because it's shorter):
 * <p>
 * <pre>
 * identity: [] # domain runtime mbean's identity
 *   children: serverRuntimes:
 *   items:
 *   - name: "server1"
 *     # server1's server runtime mbean identity is relative to its runtime bean tree,
 *     # not the domain runtime mbean's bean tree
 *     identity: []
 *   - name: "server2"
 *     identity: []
 * </pre>
 * <p>
 * The rest of the console needs all the identities to be relative to the domain runtime tree so
 * that it can use them to compute RDJ urls, i.e.:
 * <p>
 * <pre>
 * # domain runtime mbean properties:
 * name: mydomain
 * identity: []
 * children: serverRuntimes:
 *   items:
 *   - name: "server1"
 *     identity: [ "serverRuntimes", "server1"]
 *   - name: "server2"
 *     identity: [ "serverRuntimes", "server2"]
 * </pre>
 * <p>
 * Much of the code in this class deals with this conversion.
 */
public class WeblogicRestRuntime extends AbstractWeblogicRuntime implements WeblogicRuntimeSPI {

  private static final Logger LOGGER = Logger.getLogger(WeblogicRestRuntime.class.getName());

  public WeblogicRestRuntime(WeblogicBeanTypes weblogicBeanTypes) {
    super(weblogicBeanTypes);
  }

  @Override
  public JsonObject getBeanTreeSlice(InvocationContext invocationContext, JsonObject query) throws Exception {
    return do_getBeanTreeSlice(invocationContext, true, query);
  }

  @Override
  public JsonObject getConfigBeanTreeSlice(InvocationContext invocationContext, JsonObject query) throws Exception {
    return do_getBeanTreeSlice(invocationContext, false, query);
  }

  @Override
  public JsonObject invokeAction(
    InvocationContext invocationContext,
    Path bean,
    String action,
    boolean asynchronous,
    JsonObject arguments
  ) throws BadRequestException, NoDataFoundException, Exception {
    LOGGER.fine(
      "invokeAction"
      + " bean=" + bean
      + " action=" + action
      + " asynchronous=" + asynchronous
      + " arguments=" + arguments
    );
    JsonObject response =
      invokeWeblogicRestPost(
        invocationContext,
        true, // domainRuntime tree
        bean.childPath(action),
        asynchronous,
        arguments
      );
    // FortifyIssueSuppression Log Forging
    // WebLogic is a trusted source
    LOGGER.fine("invokeAction returned " + response);
    if (isOK(response) || (asynchronous && isAccepted(response))) {
      return response;
    }
    throwIfNotFound(response);
    throwIfBadRequest(response);
    throw asUnexpectedResponse(response);
  }

  private JsonObject do_getBeanTreeSlice(
    InvocationContext invocationContext,
    boolean isRuntime,
    JsonObject query
  ) throws Exception {
    LOGGER.fine("getConfigBeanTreeSlice isRuntime=" + isRuntime + " query=" + query);
    if (isRuntime) {
      query = addIdentityWorkAroundPropertiesQuery(query);
    }
    JsonObject response =
      invokeWeblogicRestPost(
        invocationContext,
        isRuntime,
        new Path("search"),
        false, // synchronous
        query
      );
    if (isOK(response)) {
      if (response.containsKey("messages")) {
        throw asUnexpectedResponse(response);
      }
      JsonObject body = response.getJsonObject("body");
      if (isRuntime) {
        body = fixServerRuntimes(body);
      }
      return body;
    }
    throw asUnexpectedResponse(response);
  }

  private JsonObject invokeWeblogicRestPost(
    InvocationContext invocationContext,
    boolean isRuntime,
    Path path,
    boolean asynchronous,
    JsonObject weblogicRestRequestBody
  ) throws Exception {
    if (weblogicRestRequestBody == null) {
      throw new BadRequestException("Weblogic REST request body is null");
    }
    // TBD - special handling for 202? (i.e. the action hasn't completed yet)
    return
      createWeblogicRestResponse(
        WebLogicRestClient.post(
          WebLogicRestRequest
            .builder()
            .connection(invocationContext.getConnection())
            .path(getTreeRelativePath(path, isRuntime))
            .asynchronous(asynchronous)
            .expandedValues(!isRuntime)
            .build(),
          weblogicRestRequestBody
        )
      );
  }

  private String getFields(String... properties) {
    if (properties == null || properties.length < 1) {
      return null;
    }
    return String.join(",", properties);
  }

  private JsonObject createWeblogicRestResponse(Response response) {
    JsonObjectBuilder respBldr = Json.createObjectBuilder();
    addStatusCode(respBldr, response);
    JsonObject weblogicResponse = getWeblogicResponse(response);
    addMessages(respBldr, weblogicResponse);
    addBody(respBldr, weblogicResponse);
    JsonObject weblogicRestResponse = respBldr.build();
    // FortifyIssueSuppression Log Forging
    // WebLogic is a trusted source
    LOGGER.fine("weblogicRestResponse " + weblogicRestResponse);
    return weblogicRestResponse;
  }

  private JsonObject getWeblogicResponse(Response response) {
    try {
      return response.readEntity(JsonObject.class);
    } catch (IllegalStateException ise) {
      // response is the org.glassfish.jersey.message.internal.OutboundJaxrsResponse,
      // that was returned from the INSTANCE.get() call. Use response.getEntity()
      // to retrieve the "messages" Json object from the response, and assign it to
      // weblogicResponse.
      return (JsonObject) response.getEntity();
    }
  }

  private void addStatusCode(JsonObjectBuilder respBldr, Response response) {
    int statusCode = response.getStatus();
    respBldr.add("statusCode", statusCode);
  }

  private void addMessages(JsonObjectBuilder respBldr, JsonObject weblogicResponse) {
    JsonArray messages = weblogicResponse.getJsonArray("messages");
    if (messages != null) {
      respBldr.add("messages", messages);
    }
  }

  private void addBody(JsonObjectBuilder respBldr, JsonObject weblogicResponse) {
    JsonObjectBuilder bodyBldr = Json.createObjectBuilder();
    for (Map.Entry<String, JsonValue> entry : weblogicResponse.entrySet()) {
      String key = entry.getKey();
      if (!"messages".equals(key)) {
        bodyBldr.add(key, entry.getValue());
      }
    }
    respBldr.add("body", bodyBldr);
  }

  private void throwAsUnexpectedResponseIfHaveMessages(JsonObject response) throws Exception {
    if (response.containsKey("messages")) {
      throw asUnexpectedResponse(response);
    }
  }

  private void throwIfNotFound(JsonObject response) throws NoDataFoundException {
    if (isNotFound(response)) {
      throw new NoDataFoundException(getMessages(response));
    }
  }

  private void throwIfBadRequest(JsonObject response) throws BadRequestException {
    if (isBadRequest(response)) {
      throw new BadRequestException(getMessages(response));
    }
  }

  private Exception asUnexpectedResponse(JsonObject response) {
    return new Exception(response.toString());
  }

  private JsonArray getMessages(JsonObject response) {
    return response.getJsonArray("messages");
  }

  private List<String> getTreeRelativePath(Path path, boolean isRuntime) throws Exception {
    String tree = (isRuntime) ? "domainRuntime" : "domainConfig";
    return ((new Path(tree)).childPath(path)).getComponents();
  }

  private boolean isOK(JsonObject response) {
    return isStatus(response, Response.Status.OK.getStatusCode());
  }

  private boolean isAccepted(JsonObject response) {
    return isStatus(response, Response.Status.ACCEPTED.getStatusCode());
  }

  private boolean isCreated(JsonObject response) {
    return isStatus(response, Response.Status.CREATED.getStatusCode());
  }

  private boolean isNotFound(JsonObject response) {
    return isStatus(response, Response.Status.NOT_FOUND.getStatusCode());
  }

  private boolean isBadRequest(JsonObject response) {
    return isStatus(response, Response.Status.BAD_REQUEST.getStatusCode());
  }

  private boolean isStatus(JsonObject response, int status) {
    return status == response.getInt("statusCode");
  }

  /**
   * Ensure that the search query returns all beans' types, keys and identities so that we can work
   * around the WLS REST identity bugs by computing them ourself and reporting when the WLS REST
   * identity doesn't match the expected identity.
   * <p>
   * Note: currently all of the runtime mbeans use the name property as the key, so, instead of
   * walking the mbean types to find the name of the key property, just hard code it as name. Ditto
   * for the type property.
   */
  private JsonObject addIdentityWorkAroundPropertiesQuery(JsonObject query) {
    return addIdentityWorkAroundPropertiesToObjectQuery(query);
  }

  /**
   * Convert a query for an object and its children to return the type, name and identity properties
   * (at every level).
   */
  private JsonObject addIdentityWorkAroundPropertiesToObjectQuery(JsonObject objectQuery) {
    JsonObjectBuilder bldr = Json.createObjectBuilder(objectQuery);

    JsonArray fields = objectQuery.getJsonArray(PROP_FIELDS);
    if (fields != null) {
      // the query asked for specific fields.  add name and identity to the list.
      bldr.remove(PROP_FIELDS).add(PROP_FIELDS, addIdentityWorkAroundPropertiesToFields(fields));
    } else {
      // the original query didn't specify any fields, so it wants all the fields.
    }

    JsonObject children = objectQuery.getJsonObject(PROP_CHILDREN);
    if (children != null) {
      // the query asked for some children. add type, name and identity to their queries.
      bldr.remove(PROP_CHILDREN)
          .add(PROP_CHILDREN, addIdentityWorkAroundPropertiesToChildrenQueries(children));
    } else {
      // the original queyr didn't specify any children.
    }
    return bldr.build();
  }

  /** Add the type, name and identity properties to a list of fields */
  private JsonArray addIdentityWorkAroundPropertiesToFields(JsonArray fields) {
    boolean haveType = false;
    boolean haveName = false;
    boolean haveIdentity = false;
    for (int i = 0; i < fields.size() && !(haveType && haveName && haveIdentity); i++) {
      String field = fields.getString(i);
      if (PROP_TYPE.equals(field)) {
        haveType = true;
      }
      if (PROP_NAME.equals(field)) {
        haveName = true;
      }
      if (PROP_IDENTITY.equals(field)) {
        haveIdentity = true;
      }
    }
    if (haveType && haveName && haveIdentity) {
      // fields already included type, name and identity.
      return fields;
    }

    // fields is missing type, name and/or identity.
    JsonArrayBuilder bldr = Json.createArrayBuilder(fields);
    if (!haveType) {
      // fields is missing type. add it.
      bldr.add(PROP_TYPE);
    }
    if (!haveName) {
      // fields is missing name. add it.
      bldr.add(PROP_NAME);
    }
    if (!haveIdentity) {
      // fields is missing identity. add it.
      bldr.add(PROP_IDENTITY);
    }
    return bldr.build();
  }

  /** Add the type, name and identity properties to the children's queries */
  private JsonObjectBuilder addIdentityWorkAroundPropertiesToChildrenQueries(JsonObject children) {
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    for (Map.Entry<String, JsonValue> e : children.entrySet()) {
      bldr.add(
          e.getKey(), addIdentityWorkAroundPropertiesToObjectQuery(e.getValue().asJsonObject()));
    }
    return bldr;
  }
}

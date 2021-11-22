// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.ws.rs.core.Response.Status;

import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import weblogic.remoteconsole.common.utils.Message;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.utils.ResponseHelper;
import weblogic.remoteconsole.server.utils.WebLogicRestClient;
import weblogic.remoteconsole.server.utils.WebLogicRestClientException;
import weblogic.remoteconsole.server.utils.WebLogicRestRequest;

/**
 * Utility class to call the WebLogic REST api for the WebLogic REST-based repos.
 */
public class WebLogicRestInvoker {

  private WebLogicRestInvoker() {
  }

  private static final Logger LOGGER = Logger.getLogger(WebLogicRestInvoker.class.getName());

  public static Response<JsonObject> post(
    InvocationContext ic,
    Path path,
    JsonObject requestBody,
    boolean expandedValues,
    boolean saveChanges,
    boolean asynchronous
  ) {
    WebLogicRestRequest.Builder builder = WebLogicRestRequest.builder();
    builder.root(WebLogicRestRequest.CURRENT_WEBLOGIC_REST_API_ROOT);
    return post(ic, path, requestBody, expandedValues, saveChanges, asynchronous, builder);
  }

  public static Response<JsonObject> post(
    InvocationContext ic,
    Path path,
    JsonObject requestBody,
    boolean expandedValues,
    boolean saveChanges,
    boolean asynchronous,
    WebLogicRestRequest.Builder builder
  ) {
    Response<JsonObject> response = new Response<>();
    try {
      javax.ws.rs.core.Response restResponse =
        WebLogicRestClient.post(
          builder
            .connection(ic.getConnection())
            .path(path.getComponents())
            .saveChanges(saveChanges)
            .expandedValues(expandedValues)
            .asynchronous(asynchronous)
            // returns properties tagged @restInternal,
            // e.g. some deprecated ServerRuntimeMBean properties the remote console uses:
            .internal(true)
            .build(),
          requestBody
        );
      boolean allowCreated = true;
      return restResponseToResponse(restResponse, allowCreated, asynchronous);
    } catch (WebLogicRestClientException e) {
      LOGGER.log(Level.WARNING, "Unexpected WebLogic Rest exception", e);
      return response.setServiceNotAvailable();
    }
  }

  public static Response<JsonObject> post(
    InvocationContext ic,
    Path path,
    FormDataMultiPart parts,
    boolean expandedValues,
    boolean saveChanges,
    boolean asynchronous
  ) {
    try {
      javax.ws.rs.core.Response restResponse =
        WebLogicRestClient.post(
          WebLogicRestRequest.builder()
            .connection(ic.getConnection())
            .path(path.getComponents())
            .saveChanges(saveChanges)
            .expandedValues(expandedValues)
            .asynchronous(asynchronous)
            // returns properties tagged @restInternal,
            // e.g. some deprecated ServerRuntimeMBean properties the remote console uses:
            .internal(true)
            .build(),
          parts
        );
      boolean allowCreated = true;
      return restResponseToResponse(restResponse, allowCreated, asynchronous);
    } catch (WebLogicRestClientException e) {
      LOGGER.log(Level.WARNING, "Unexpected WebLogic Rest exception", e);
      return (new Response<JsonObject>()).setServiceNotAvailable();
    }
  }

  public static Response<JsonObject> delete(
    InvocationContext ic,
    Path path,
    boolean saveChanges,
    boolean asynchronous
  ) {
    try {
      javax.ws.rs.core.Response restResponse =
        WebLogicRestClient.delete(
          WebLogicRestRequest.builder()
            .connection(ic.getConnection())
            .path(path.getComponents())
            .saveChanges(saveChanges)
            .asynchronous(asynchronous)
            .build()
        );
      boolean allowCreated = false;
      return restResponseToResponse(restResponse, allowCreated, asynchronous);
    } catch (WebLogicRestClientException e) {
      LOGGER.log(Level.WARNING, "Unexpected WebLogic Rest exception", e);
      return (new Response<JsonObject>()).setServiceNotAvailable();
    }
  }

  private static Response<JsonObject> restResponseToResponse(
    javax.ws.rs.core.Response restResponse,
    boolean allowCreated,
    boolean asynchronous
  ) {
    Response<JsonObject> response = new Response<>();
    JsonObject entity = ResponseHelper.getEntityAsJson(restResponse);
    JsonObject entityWithoutMessages = moveMessagesToResponse(response, entity);
    int status = restResponse.getStatus();
    if (Status.OK.getStatusCode() == status
        || (Status.CREATED.getStatusCode() == status && allowCreated)
        || (Status.ACCEPTED.getStatusCode() == status && asynchronous)
    ) {
      return response.setSuccess(entityWithoutMessages);
    }
    if (Status.NOT_FOUND.getStatusCode() == status) {
      return response.setNotFound();
    }
    if (Status.BAD_REQUEST.getStatusCode() == status) {
      return response.setUserBadRequest();
    }
    LOGGER.warning("Unexpected WebLogic Rest Response status " + status);
    return response.setServiceNotAvailable();
  }

  private static JsonObject moveMessagesToResponse(Response<JsonObject> response, JsonObject entityJson) {
    if (entityJson == null || !entityJson.containsKey("messages")) {
      return entityJson;
    }
    JsonArray messagesJson = entityJson.getJsonArray("messages");
    for (int i = 0; i < messagesJson.size(); i++) {
      JsonObject messageJson = messagesJson.getJsonObject(i);
      response.addMessage(
        new Message(
          messageJson.getString("severity"),
          messageJson.getString("field", null),
          messageJson.getString("message")
        )
      );
    }
    return Json.createObjectBuilder(entityJson).remove("messages").build();
  }
}

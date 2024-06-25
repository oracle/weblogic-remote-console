// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.ws.rs.core.Response.Status;

import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConsoleRestExtensionConstants;
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

  public static Response<JsonObject> get(
    InvocationContext ic,
    Path path,
    boolean expandedValues
  ) {
    WebLogicRestRequest.Builder builder = WebLogicRestRequest.builder();
    builder.root(WebLogicRestRequest.CURRENT_WEBLOGIC_REST_API_ROOT);
    return get(ic, path, expandedValues, builder);
  }

  public static Response<JsonObject> get(
    InvocationContext ic,
    Path path,
    boolean expandedValues,
    WebLogicRestRequest.Builder builder
  ) {
    Response<JsonObject> response = new Response<>();
    WebLogicRestRequest request =
      builder
        .connection(ic.getConnection())
        .path(path.getRelativeUri())
        .expandedValues(expandedValues)
        // returns properties tagged @restInternal,
        // e.g. some deprecated ServerRuntimeMBean properties the remote console uses:
        .internal(true)
        .build();

    try (javax.ws.rs.core.Response restResponse = WebLogicRestClient.get(request)) {
      boolean allowCreated = false;
      boolean asynchronous = false;
      return restResponseToResponse(ic, restResponse, allowCreated, asynchronous);
    } catch (WebLogicRestClientException e) {
      LOGGER.log(Level.WARNING, "Unexpected WebLogic Rest exception", e);
      return response.setServiceNotAvailable();
    }
  }

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
    WebLogicRestRequest request =
      builder
        .connection(ic.getConnection())
        .path(path.getRelativeUri())
        .saveChanges(saveChanges)
        .expandedValues(expandedValues)
        .asynchronous(asynchronous)
        // returns properties tagged @restInternal,
        // e.g. some deprecated ServerRuntimeMBean properties the remote console uses:
        .internal(true)
        .build();

    try (javax.ws.rs.core.Response restResponse = WebLogicRestClient.post(request, requestBody)) {
      boolean allowCreated = true;
      return restResponseToResponse(ic, restResponse, allowCreated, asynchronous);
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
    WebLogicRestRequest request =
      WebLogicRestRequest.builder()
      .connection(ic.getConnection())
      .path(path.getRelativeUri())
      .saveChanges(saveChanges)
      .expandedValues(expandedValues)
      .asynchronous(asynchronous)
      // returns properties tagged @restInternal,
      // e.g. some deprecated ServerRuntimeMBean properties the remote console uses:
      .internal(true)
      .build();
    try (javax.ws.rs.core.Response restResponse = WebLogicRestClient.post(request, parts)) {
      boolean allowCreated = true;
      return restResponseToResponse(ic, restResponse, allowCreated, asynchronous);
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
    WebLogicRestRequest request =
      WebLogicRestRequest.builder()
      .connection(ic.getConnection())
      .path(path.getRelativeUri())
      .saveChanges(saveChanges)
      .asynchronous(asynchronous)
      .build();

    try (javax.ws.rs.core.Response restResponse = WebLogicRestClient.delete(request)) {
      boolean allowCreated = false;
      return restResponseToResponse(ic, restResponse, allowCreated, asynchronous);
    } catch (WebLogicRestClientException e) {
      LOGGER.log(Level.WARNING, "Unexpected WebLogic Rest exception", e);
      return (new Response<JsonObject>()).setServiceNotAvailable();
    }
  }

  private static Response<JsonObject> restResponseToResponse(
    InvocationContext ic,
    javax.ws.rs.core.Response restResponse,
    boolean allowCreated,
    boolean asynchronous
  ) {
    Response<JsonObject> response = new Response<>();
    JsonObject entity = ResponseHelper.getEntityAsJson(restResponse);
    JsonObject entityWithoutMessages = moveMessagesToResponse(ic, response, entity);
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
    if (Status.GATEWAY_TIMEOUT.getStatusCode() == status) {
      return response.setTimeout();
    }
    LOGGER.warning("Unexpected WebLogic Rest Response status " + status);
    return response.setServiceNotAvailable();
  }

  private static JsonObject moveMessagesToResponse(
    InvocationContext ic,
    Response<JsonObject> response,
    JsonObject entityJson
  ) {
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
          localizeWebLogicRestMessage(ic, messageJson.getString("message"))
        )
      );
    }
    return Json.createObjectBuilder(entityJson).remove("messages").build();
  }

  private static String localizeWebLogicRestMessage(InvocationContext ic, String message) {
    if (message.startsWith(LocalizedConsoleRestExtensionConstants.KEY_PREFIX)) {
      String constantKey = message.split(" ")[0];
      LocalizableString ls = LocalizedConsoleRestExtensionConstants.findConstant(constantKey);
      if (ls != null) {
        Object[] args = getArgsFromUnlocalizedMessage(message, constantKey);
        return ic.getLocalizer().localizeString(ls, args);
      }
    }
    // The message doesn't require localization
    return message;
  }

  private static Object[] getArgsFromUnlocalizedMessage(String message, String constantKey) {
    List<Object> args = new ArrayList<>();
    int startOfArgs = constantKey.length() + 1; // i.e. the character after the space after the key
    if (message.length() > startOfArgs) {
      // The message has a list of args (as a json array in string form)
      String argsAsJsonArray = message.substring(startOfArgs);
      try (StringReader reader = new StringReader(argsAsJsonArray)) {
        JsonArray ja = Json.createReader(reader).readArray();
        for (int i = 0; i < ja.size(); i++) {
          args.add(ja.getString(i)); // only support string args
        }
      }
    }
    return args.toArray();
  }
}

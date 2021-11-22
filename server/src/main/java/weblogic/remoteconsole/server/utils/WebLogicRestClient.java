// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.utils;

import java.net.ConnectException;
import java.util.Map;
import java.util.logging.Logger;
import javax.json.JsonObject;
import javax.ws.rs.ProcessingException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.client.ClientProperties;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.glassfish.jersey.media.sse.EventSource;
import weblogic.remoteconsole.server.ConsoleBackendRuntime;
import weblogic.remoteconsole.server.ConsoleBackendRuntime.State;
import weblogic.remoteconsole.server.connection.Connection;

/**
 * WebLogicRestClient uses state from the WebLogicRestRequest and ConsoleBackendRuntime to use
 * JAX-RS APIs and interact with a WebLogic RESTful Management endpoint.
 */
public class WebLogicRestClient {
  private static final Logger LOGGER = Logger.getLogger(WebLogicRestClient.class.getName());

  public static EventSource getEventSource(
    WebLogicRestRequest request,
    String name
  ) throws Exception {
    WebTarget webTarget = getWebTarget(request);
    return EventSource.target(webTarget).named(name).build();
  }

  /**
   * Invoke GET on a WLS REST endpoint.
   *
   * @param request
   *
   * @return
   *
   * @throws WebLogicRestClientException
   */
  public static Response get(WebLogicRestRequest request) throws WebLogicRestClientException {
    WebTarget webTarget = getWebTarget(request);
    MultivaluedMap<String, Object> headers = WebLogicRestClientHelper.createHeaders(request);
    Response response = null;
    try {
      response = webTarget.request().headers(headers).accept(MediaType.APPLICATION_JSON).get();

      if (WebLogicRestClientHelper.isErrorResponse("GET", response.getStatus())) {
        response = WebLogicRestClientHelper.getWebLogicRestErrorMessages(response);
      }
    } catch (ProcessingException pe) {
      if (response != null) {
        response.close();
      }
      response = handleProcessingException(pe);
    } catch (Exception e) {
      if (response != null) {
        response.close();
      }
      e.printStackTrace();
      response = ResponseHelper.createExceptionResponse(e);
    }

    return response;
  }

  /**
   * Invoke POST on a WLS REST endpoint.
   *
   * @param request
   *
   * @param entity
   *
   * @return
   *
   * @throws WebLogicRestClientException
   */
  public static Response post(WebLogicRestRequest request, Entity<Object> entity) throws WebLogicRestClientException {
    WebTarget webTarget = getWebTarget(request);
    MultivaluedMap<String, Object> headers = WebLogicRestClientHelper.createHeaders(request);
    Response response = null;
    try {
      response =
        webTarget.request()
          .headers(headers)
          .accept(MediaType.APPLICATION_JSON)
          .post(entity, Response.class);

      if (WebLogicRestClientHelper.isErrorResponse("POST", response.getStatus())) {
        response = WebLogicRestClientHelper.getWebLogicRestErrorMessages(response);
      }
    } catch (ProcessingException pe) {
      if (response != null) {
        response.close();
      }
      response = handleProcessingException(pe);
    } catch (Exception e) {
      if (response != null) {
        response.close();
      }
      e.printStackTrace();
      response = ResponseHelper.createExceptionResponse(e);
    }
    return response;
  }

  public static Response post(WebLogicRestRequest request, JsonObject data) throws WebLogicRestClientException {
    LOGGER.finest("data=" + data);
    return post(request, Entity.entity(data, MediaType.APPLICATION_JSON));
  }

  public static Response post(WebLogicRestRequest request, FormDataMultiPart parts) throws WebLogicRestClientException {
    return post(request, Entity.entity(parts, MediaType.MULTIPART_FORM_DATA));
  }

  /**
   * Invoke DELETE on a WLS REST endpoint.
   *
   * @param request
   *
   * @return
   *
   * @throws WebLogicRestClientException
   */
  public static Response delete(WebLogicRestRequest request) throws WebLogicRestClientException {
    WebTarget webTarget = getWebTarget(request);
    MultivaluedMap<String, Object> headers = WebLogicRestClientHelper.createHeaders(request);
    Response response = null;

    try {
      response =
        webTarget.request()
          .headers(headers)
          .accept(MediaType.APPLICATION_JSON)
          .delete(Response.class);
      if (WebLogicRestClientHelper.isErrorResponse("DELETE", response.getStatus())) {
        response = WebLogicRestClientHelper.getWebLogicRestErrorMessages(response);
      }
    } catch (ProcessingException pe) {
      if (response != null) {
        response.close();
      }
      response = handleProcessingException(pe);
    } catch (Exception e) {
      if (response != null) {
        response.close();
      }
      e.printStackTrace();
      response = ResponseHelper.createExceptionResponse(e);
    }

    return response;
  }

  private static WebTarget getWebTarget(
    WebLogicRestRequest request
  ) throws WebLogicRestClientException {
    String targetUri = calculateTargetUri(request);
    if (targetUri == null) {
      throw
        new WebLogicRestClientException(
          "Unable to determine console backend connection endpoint."
        );
    }
    Client client = getClient(request);
    if (client == null) {
      throw new WebLogicRestClientException("Unable to obtain target of backend connection.");
    }
    WebTarget target = client.target(targetUri);
    for (String pathSegment : request.path()) {
      target = target.path(pathSegment);
    }
    for (Map.Entry<String, Object> e : request.queryParams().entrySet()) {
      target = target.queryParam(e.getKey(), e.getValue());
    }
    if (request.readTimeoutCustomized()) {
      target = target.property(ClientProperties.READ_TIMEOUT, request.readTimeout());
    }
    if (request.connectTimeoutCustomized()) {
      target = target.property(ClientProperties.CONNECT_TIMEOUT, request.connectTimeout());
    }
    return target.queryParam("enableConsoleRestExtension", true);
  }

  private static Client getClient(WebLogicRestRequest request) {
    Client client = null;
    if (request.client() != null) {
      client = request.client();
      LOGGER.finest("Client from WebLogicRestRequest");
    } else if (request.connection() != null) {
      client = request.connection().getClient();
      LOGGER.finest("Client from WebLogicRestRequest Connection");
    } else if (State.CONNECTED == ConsoleBackendRuntime.INSTANCE.getState()) {
      Connection connection = ConsoleBackendRuntime.INSTANCE.getConnection();
      if (connection != null) {
        client = connection.getClient();
        LOGGER.finest("Client from ConsoleBackendRuntime Connection");
      }
    }
    return client;
  }

  private static String calculateTargetUri(WebLogicRestRequest request) {
    String root = request.root();
    String calculatedTargetUri = null;
    if (request.serverUrl() != null) {
      calculatedTargetUri = request.serverUrl() + root;
      LOGGER.finest("Request Server URL calculatedTargetUri=" + calculatedTargetUri);
    } else if (request.connection() != null) {
      calculatedTargetUri =
        request.connection().getDomainUrl() + root;
      LOGGER.finest("Request Connection URL calculatedTargetUri=" + calculatedTargetUri);
    } else if (State.CONNECTED == ConsoleBackendRuntime.INSTANCE.getState()) {
      Connection connection = ConsoleBackendRuntime.INSTANCE.getConnection();
      if (connection != null) {
        calculatedTargetUri = connection.getDomainUrl() + root;
        LOGGER.finest(
          "ConsoleBackendRuntime Connection URL calculatedTargetUri=" + calculatedTargetUri
        );
      }
    }
    return calculatedTargetUri;
  }

  private static Response handleProcessingException(
    ProcessingException pe
  ) throws WebLogicRestClientException {
    Throwable t = pe.getCause();
    if (t instanceof ConnectException) {
      return ResponseHelper.createExceptionResponse(t, "Unable to connect to the WebLogic Domain.");
    } else {
      throw new WebLogicRestClientException(t);
    }
  }
}

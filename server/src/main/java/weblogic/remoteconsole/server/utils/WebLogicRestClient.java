// Copyright (c) 2020, 2024, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.utils;

import java.io.InputStream;
import java.net.ConnectException;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.util.Map;
import java.util.logging.Logger;
import javax.json.JsonObject;
import javax.net.ssl.SSLException;
import javax.ws.rs.ProcessingException;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.client.ClientProperties;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;
// import org.glassfish.jersey.media.sse.EventSource;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;

/**
 * WebLogicRestClient uses state from the WebLogicRestRequest to use
 * JAX-RS APIs and interact with a WebLogic RESTful Management endpoint.
 */
public class WebLogicRestClient {
  private static final Logger LOGGER = Logger.getLogger(WebLogicRestClient.class.getName());

  /*
  ** Seems to be dead code
  public static EventSource getEventSource(
    WebLogicRestRequest request,
    String name
  ) throws Exception {
    WebTarget webTarget = getWebTarget(request);
    return EventSource.target(webTarget).named(name).build();
  }
  */

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
   * @param acceptType
   * @return
   *
   * @throws WebLogicRestClientException
   */
  public static Response post(
    WebLogicRestRequest request,
    Entity<Object> entity,
    String acceptType
  ) throws WebLogicRestClientException {
    WebTarget webTarget = getWebTarget(request);
    MultivaluedMap<String, Object> headers = WebLogicRestClientHelper.createHeaders(request);
    Response response = null;
    try {
      response =
        webTarget.request()
          .headers(headers)
          .accept(acceptType)
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

  public static Response post(WebLogicRestRequest request, Entity<Object> entity) throws WebLogicRestClientException {
    return post(request, entity, MediaType.APPLICATION_JSON);
  }

  public static Response post(WebLogicRestRequest request, JsonObject data) throws WebLogicRestClientException {
    LOGGER.finest("data=" + data);
    return post(request, Entity.entity(data, MediaType.APPLICATION_JSON));
  }

  public static Response post(WebLogicRestRequest request, FormDataMultiPart parts) throws WebLogicRestClientException {
    return post(request, Entity.entity(parts, MediaType.MULTIPART_FORM_DATA));
  }

  public static Response downloadAsInputStream(WebLogicRestRequest request, JsonObject data, String acceptType) {
    try {
      Response response =
        post(
          request,
          Entity.entity(data, MediaType.APPLICATION_JSON),
          acceptType
        );
      if (WebLogicRestClientHelper.isErrorResponse("POST", response.getStatus())) {
        return response;
      }
      return Response.ok(response.readEntity(InputStream.class)).build();
    } catch (WebLogicRestClientException e) {
      // LOGGER.log(Level.WARNING, "Unexpected WebLogic Rest exception", e);
      return Response.status(Response.Status.SERVICE_UNAVAILABLE).build();
    }
  }

  public static InputStream getAsInputStream(WebLogicRestRequest request, String acceptType) {
    Response response = null;
    boolean succeeded = false;
    WebApplicationException we = null;
    try {
      WebTarget webTarget = getWebTarget(request);
      MultivaluedMap<String, Object> headers = WebLogicRestClientHelper.createHeaders(request);
      response = webTarget.request().headers(headers).accept(acceptType).get();
      if (WebLogicRestClientHelper.isErrorResponse("GET", response.getStatus())) {
        we = new WebApplicationException(WebLogicRestClientHelper.getWebLogicRestErrorMessages(response));
      } else {
        succeeded = true;
        return response.readEntity(InputStream.class);
      }
    } catch (ProcessingException pe) {
      try {
        we = new WebApplicationException(handleProcessingException(pe));
      } catch (Exception ce) {
        we = new WebApplicationException(ResponseHelper.createExceptionResponse(ce));
      }
    } catch (Exception e) {
      e.printStackTrace();
      we = new WebApplicationException(ResponseHelper.createExceptionResponse(e));
    } finally {
      if (!succeeded && response != null) {
        response.close();
      }
    }
    throw we;
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

  public static WebTarget getWebTarget(
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
    }
    return calculatedTargetUri;
  }

  // Recursively look for an exception that we understand.
  // If we understand the exception, make a good message for it.
  // Otherwise, just give a generic "exception" message
  public static Response handleProcessingException(Throwable t) throws WebLogicRestClientException {
    Throwable cause = t.getCause();
    if (cause instanceof SSLException) {
      // Bad Request is kind of the wrong term for this, since it
      // is us (the client) that is saying the server is "bad", rather
      // than the server saying the client is bad but this is a limitation of
      // being, logically, a "proxy".  We are a server and need to respond as a
      // server, but we are also a client.  Luckily, the message will explain
      // better.
      return ResponseHelper.createExceptionResponse(
        Response.Status.BAD_REQUEST, cause, cause.getMessage());
    }
    if (cause instanceof ConnectException) {
      return ResponseHelper.createExceptionResponse(
        Response.Status.NOT_FOUND, cause, cause.getMessage());
    }
    if (cause instanceof SocketTimeoutException) {
      String message = LocalizedConstants.WEBLOGIC_REST_REQUEST_TIMED_OUT.getEnglishText();
      return ResponseHelper.createExceptionResponse(Response.Status.GATEWAY_TIMEOUT, null, message);
    }
    if (cause instanceof SocketException) {
      // Something seems to have gone wrong - shouldn't happen
      return ResponseHelper.createExceptionResponse(
        Response.Status.INTERNAL_SERVER_ERROR, cause, cause.getMessage());
    }
    if (cause != null) {
      return handleProcessingException(cause);
    }
    throw new WebLogicRestClientException(t);
  }
}

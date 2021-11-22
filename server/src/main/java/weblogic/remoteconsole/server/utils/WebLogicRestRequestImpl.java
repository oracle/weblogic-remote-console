// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.utils;

import java.util.List;
import java.util.Map;
import javax.ws.rs.client.Client;

import weblogic.remoteconsole.server.connection.Connection;

/**
 * WebLogicRestRequestImpl is used to hold the "per-request" attributes sent to a WebLogic RESTful
 * Management endpoint.
 * <p>
 * {@link WebLogicRestRequest.Builder} creates an instance of this class using the build() method.
 *
 * @see WebLogicRestRequest
 * @see WebLogicRestClient
 */
public class WebLogicRestRequestImpl implements WebLogicRestRequest {
  private final Connection connection;
  private final Client client;
  private final String serverUrl;
  private final String root;
  private final List<String> path;
  private final Map<String, Object> headers;
  private final Map<String, Object> queryParams;
  private final boolean readTimeoutCustomized;
  private final int readTimeout;
  private final boolean connectTimeoutCustomized;
  private final int connectTimeout;

  WebLogicRestRequestImpl(Builder builder) {
    this.connection = builder.connection();
    this.client = builder.client();
    this.serverUrl = builder.serverUrl();
    this.root = builder.root();
    this.path = builder.path();
    this.headers = builder.headers();
    this.queryParams = builder.queryParams();
    this.readTimeoutCustomized = builder.readTimeoutCustomized();
    this.readTimeout = builder.readTimeout();
    this.connectTimeoutCustomized = builder.connectTimeoutCustomized();
    this.connectTimeout = builder.connectTimeout();
  }

  /**
   * The connection information of the WebLogic Domain.
   *
   * @return Console Backend Connection
   */
  @Override
  public Connection connection() {
    return this.connection;
  }

  /**
   * The client that has been setup with timeouts and other client context for the connections.
   *
   * @return JAX-RS Client
   */
  @Override
  public Client client() {
    return this.client;
  }

  /**
   * Get server URL for the connection to a WebLogic RESTful endpoint.
   *
   * @return The WebLogic Domain URL
   */
  @Override
  public String serverUrl() {
    return this.serverUrl;
  }


  /**
   * Get root WebLogic REST api following {@code <scheme>://<host>:<port>} in
   * the URL sent to the WebLogic RESTful endpoint.
   *
   * @return root WebLogic REST api following {@code <scheme>://<host>:<port>/}
   *     in the URL sent to the WebLogic RESTful endpoint.
   */
  @Override
  public String root() {
    return this.root;
  }

  /**
   * Get path segment following {@code <scheme>://<host>:<port>/<root>} in
   * the URL sent to the WebLogic RESTful endpoint.
   *
   * @return path segment following {@code <scheme>://<host>:<port>/<root>}
   *     in the URL sent to the WebLogic RESTful endpoint.
   */
  @Override
  public List<String> path() {
    return this.path;
  }

  /**
   * Get value assigned to a given {@code key} header.
   *
   * @return value assigned to {@code key} header, or {@code null} if there is no such header
   */
  @Override
  public Object header(String key) {
    return this.headers.get(key);
  }

  /**
   * Get all the headers associated with the request, as a {@code Map<String,Object>}.
   *
   * @return all the headers associated with the request
   */
  @Override
  public Map<String, Object> headers() {
    return this.headers;
  }

  /**
   * Get value assigned to a given {@code key} query param.
   *
   * @return value assigned to {@code key} query param, or {@code null} if there is no such query
   *     param
   */
  @Override
  public Object queryParam(String key) {
    return this.queryParams.get(key);
  }

  /**
   * Get all the query params associated with the request, as a {@code Map<String,Object>}.
   *
   * @return all the query params associated with the request
   */
  @Override
  public Map<String, Object> queryParams() {
    return this.queryParams;
  }

  /**
   * Get whether the read timeout has been customized for this request.
   * @return
   */
  @Override
  public boolean readTimeoutCustomized() {
    return this.readTimeoutCustomized;
  }

  /**
   * Get the custom read timeout, in milliseconds, for this request.
   * Must only be called if readTimeoutCustomized() returns true.
   * @return
   */
  @Override
  public int readTimeout() {
    if (!this.readTimeoutCustomized) {
      throw new AssertionError("Read timeout not customized");
    }
    return this.readTimeout;
  }

  /**
   * Get whether the connect timeout has been customized for this request.
   * @return
   */
  @Override
  public boolean connectTimeoutCustomized() {
    return this.connectTimeoutCustomized;
  }

  /**
   * Get the custom connect timeout, in milliseconds, for this request.
   * Must only be called if connectTimeoutCustomized() returns true.
   * @return
   */
  @Override
  public int connectTimeout() {
    if (!this.connectTimeoutCustomized) {
      throw new AssertionError("Connect timeout not customized");
    }
    return this.connectTimeout;
  }
}

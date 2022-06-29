// Copyright (c) 2020, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Logger;
import javax.ws.rs.client.Client;

import io.helidon.common.context.Context;
import io.helidon.common.context.Contexts;
import weblogic.remoteconsole.server.connection.Connection;

/**
 * WebLogicRestRequest interface used by WebLogicRestClient to invoke REST API requests on WebLogic
 * Domain
 */
public interface WebLogicRestRequest {

  // Use the earliest bean-info-based WebLogic REST api so that we get all the properties, whether deprecated or not:
  public static final String CURRENT_WEBLOGIC_REST_API_ROOT = "/management/weblogic/12.2.1.0.0";
  public static final String LEGACY_WEBLOGIC_REST_API_ROOT = "/management/wls/latest";

  public Connection connection();

  public Client client();

  public String serverUrl();

  public String root();

  public List<String> path();

  public Object header(String key);

  public Map<String, Object> headers();

  public Object queryParam(String key);

  public Map<String, Object> queryParams();

  public boolean readTimeoutCustomized();

  public int readTimeout();

  public boolean connectTimeoutCustomized();

  public int connectTimeout();

  /**
   * Builder to customize WebLogicRestRequest instance.
   *
   * @return builder instance
   */
  static Builder builder() {
    return new Builder();
  }

  /* Builder to build {@link WebLogicRestRequest} instance. */
  final class Builder {
    private static final Logger LOGGER = Logger.getLogger(Builder.class.getName());
    private static final AtomicInteger WRR_COUNTER = new AtomicInteger(1);
    private Connection connection;
    private Client client;
    private String serverUrl;
    private String root = CURRENT_WEBLOGIC_REST_API_ROOT;
    private List<String> path;
    private Map<String, Object> headers = new HashMap<>();
    private Map<String, Object> queryParams = new HashMap<>();
    private boolean readTimeoutCustomized = false;
    private int readTimeout;
    private boolean connectTimeoutCustomized = false;
    private int connectTimeout;
  
    // Only use with WebLogicRestRequest.builder()!
    private Builder() {
    }

    /**
     * Build a REST request based on this builder.
     *
     * @return WebLogicRestRequest instance to be returned
     * @throws WebLogicRestRequestException if the REST request cannot be built
     */
    public WebLogicRestRequest build() {
      Context requestContext = Context.builder().id("wrr-" + WRR_COUNTER.getAndIncrement()).build();

      // now run the build within context already
      return Contexts.runInContext(requestContext, this::doBuild);
    }

    /**
     * Configure header.
     * <p>
     * The header gets passed on to a {@link javax.ws.rs.client.WebTarget}.
     *
     * @param key
     * @param value
     * @return modified builder
     */
    public Builder header(String key, Object value) {
      if (key != null) {
        this.headers.put(key, value);
      }
      return this;
    }

    /**
     * Indicates whether the underlying WLS REST should wait up to two
     * seconds for the work to complete, and if not done by then,
     * return a 202.
     * <p>
     * Only WLS REST endpoints that support asynchronous requests
     * will honor this.  Other endpoints will ignore it and
     * do the work synchronously.
     *
     * @return modified builder
     */
    public Builder asynchronous(boolean asynchronous) {
      if (asynchronous) {
        return header("Prefer", "respond-async");
      } else {
        this.headers.remove("Prefer");
        return this;
      }
    }

    /**
     * Indicates whether this request is using expanded values.
     *
     * @param expandedValues
     *
     * @return modified builder
     */
    public Builder expandedValues(boolean expandedValues) {
      return queryParam("expandedValues", expandedValues);
    }

    /**
     * Indicates whether this request should return mbean properties tagged @restInternal.
     *
     * @param internal
     *
     * @return modified builder
     */
    public Builder internal(boolean internal) {
      return queryParam("internal", internal);
    }

    /**
     * Indicates whether this request should save (v.s. activate) any configuration changes.
     *
     * @param saveChanges
     *
     * @return modified builder
     */
    public Builder saveChanges(boolean saveChanges) {
      return queryParam("saveChanges", saveChanges);
    }

    /**
     * Configure query parameter.
     * <p>
     * The query parameter gets passed on to a {@link javax.ws.rs.client.WebTarget}.
     *
     * @param key
     * @param value
     * @return modified builder
     */
    public Builder queryParam(String key, Object value) {
      if (key != null) {
        this.queryParams.put(key, value);
      }
      return this;
    }

    Connection connection() {
      return connection;
    }

    /**
     * Configure the connection information of the WebLogic Domain.
     *
     * @param connection
     * @return modified builder
     */
    public Builder connection(Connection connection) {
      this.connection = connection;
      return this;
    }

    Client client() {
      return client;
    }

    /**
     * Configure JAX-RS Client that has been setup with timeouts and other client context for the
     * connections.
     *
     * @param client
     * @return modified builder
     */
    public Builder client(Client client) {
      this.client = client;
      return this;
    }

    String serverUrl() {
      return serverUrl;
    }

    /**
     * Configure serverUrl.
     * <p>
     * The server URL for the connection to a WebLogic RESTful endpoint.
     *
     * @param serverUrl
     * @return modified builder
     */
    public Builder serverUrl(String serverUrl) {
      this.serverUrl = serverUrl;
      return this;
    }

    String root() {
      return root;
    }
  
    /**
     * Configure WebLogic Rest API root.
     * <p>
     * The root of the WebLogic REST api to be invoked following {@code <scheme>://<host>:<port>}
     * <p>
     * If not explicitly set, it defaults to CURRENT_WEBLOGIC_REST_API_ROOT
     * 
     * @param root
     * @return modified builder
     */
    public Builder root(String root) {
      this.root = root;
      return this;
    }

    List<String> path() {
      return path;
    }

    /**
     * Configure path.
     * <p>
     * The path segment following {@code <scheme>://<host>:<port>/<root>}
     * in the URL sent to the WebLogic RESTful endpoint.
     * <p>
     * Each string contains one path segment, e.g. "servers", "ManagedServer2 (migratable)".
     * This method must be used if any of the path segments need to be url encoded.
     * The segments must not be url encoded.
     * 
     * @param path
     * @return modified builder
     */
    public Builder path(List<String> path) {
      this.path = path;
      return this;
    }

    /**
     * Configure path.
     * <p>
     * The path segment following {@code <scheme>://<host>:<port>/<root>}
     * in the URL sent to the WebLogic RESTful endpoint.
     * <p>
     * This method can be used when the path doesn't have any strings that need to be url encoded.
     * It may include multiple segments, e.g. changeManager/cancelEdit
     *
     * @param path
     * @return modified builder
     */

    public Builder path(String path) {
      this.path = new ArrayList<>();
      this.path.add(path);
      return this;
    }

    // Getters used by the WebLogicRestRequestImpl
    Map<String, Object> headers() {
      return headers;
    }

    /**
     * Configure headers. Replaces any exiting headers...
     *
     * @param headers
     * @return modified builder
     */
    public Builder headers(Map<String, Object> headers) {
      this.headers = headers;
      return this;
    }

    Map<String, Object> queryParams() {
      return queryParams;
    }

    /**
     * Configure query params. Replaces any exiting query params...
     *
     * @param queryParams
     * @return modified builder
     */
    public Builder queryParams(Map<String, Object> queryParams) {
      this.queryParams = queryParams;
      return this;
    }

    public boolean readTimeoutCustomized() {
      return readTimeoutCustomized;
    }

    public int readTimeout() {
      return readTimeout;
    }

    /**
     * Customize the read timeout.
     * 
     * @param readTimeout in millis
     * @return modified builder
     */
    public Builder readTimeout(int readTimeout) {
      this.readTimeoutCustomized = true;
      this.readTimeout = readTimeout;
      return this;
    }

    public boolean connectTimeoutCustomized() {
      return connectTimeoutCustomized;
    }

    public int connectTimeout() {
      return connectTimeout;
    }

    /**
     * Customize the connect timeout.
     * 
     * @param connectTimeout in millis
     * @return modified builder
     */
    public Builder connectTimeout(int connectTimeout) {
      this.connectTimeoutCustomized = true;
      this.connectTimeout = connectTimeout;
      return this;
    }

    /** Create the WebLogicRestRequest instance */
    private WebLogicRestRequest doBuild() throws WebLogicRestRequestException {
      LOGGER.entering(Builder.class.getName(), "build");

      // path is a required builder item
      if (path == null) {
        throw new WebLogicRestRequestException("path is a required builder item!");
      }

      return new WebLogicRestRequestImpl(this);
    }
  }
}

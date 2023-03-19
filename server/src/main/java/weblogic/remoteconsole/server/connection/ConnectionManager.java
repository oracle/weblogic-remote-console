// Copyright (c) 2020, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.connection;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import io.helidon.config.Config;
import org.glassfish.jersey.client.authentication.HttpAuthenticationFeature;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersions;
import weblogic.remoteconsole.common.utils.WebLogicRoles;
import weblogic.remoteconsole.common.utils.WebLogicVersion;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.filter.ClientAuthFeature;
import weblogic.remoteconsole.server.utils.ResponseHelper;
import weblogic.remoteconsole.server.utils.WebLogicRestClient;
import weblogic.remoteconsole.server.utils.WebLogicRestRequest;

/** The ConnectionManager handles the state of the backend connections to a Weblogic Domain */
public class ConnectionManager {
  private static final Logger LOGGER = Logger.getLogger(ConnectionManager.class.getName());

  // String constants for handling WebLogic REST response mapping
  private static final String NAME = "name";
  private static final String DOMAINNAME = "domainName";
  private static final String DOMAINVER = "domainVersion";
  private static final String RETURN = "return";
  private static final String CONSOLE_BACKEND = "consoleBackend";
  private static final String CONSOLE_EXTENSION_VERSION = "version";
  private static final String CONSOLE_EXTENSION_CAPABILITIES = "capabilities";
  private static final String CONSOLE_EXTENSION_V1 = "1";

  // Placeholder when username is not known from authorization
  public static final String DEFAULT_USERNAME_UNKNOWN = "<unknown>";

  // Default connection timeouts - should match application.yaml
  public static final long DEFAULT_CONNECT_TIMEOUT_MILLIS = 10000L;
  public static final long DEFAULT_READ_TIMEOUT_MILLIS = 20000L;

  // Current timeout settings in milliseconds
  private long connectTimeout;
  private long readTimeout;

  // SameSite Cookie Settings
  private boolean isSameSiteCookieEnabled = false;
  private String valueSameSiteCookie = null;

  // Collection of connections
  private ConcurrentHashMap<String, Connection> connections =
    new ConcurrentHashMap<String, Connection>();

  /** Create the Connection Manager */
  public ConnectionManager(Config config) {
    // Setup connection timeouts
    connectTimeout =
      config
        .get("connectTimeoutMillis")
        .asLong()
        .orElse(DEFAULT_CONNECT_TIMEOUT_MILLIS);
    readTimeout =
      config
        .get("readTimeoutMillis")
        .asLong()
        .orElse(DEFAULT_READ_TIMEOUT_MILLIS);
    // Check for SameSite Cookie attribute settings
    isSameSiteCookieEnabled =
      config
        .get("enableSameSiteCookieValue")
        .asBoolean()
        .orElse(false);
    valueSameSiteCookie =
      config
        .get("valueSameSiteCookie")
        .asString()
        .orElse(null);

    if (isSameSiteCookieEnabled) {
      LOGGER.info("SameSite Cookie attribute is enabled using value: " + valueSameSiteCookie);
    }

    // Check and disable HNV for the CBE with all connections
    boolean disableHostnameVerification =
      config
        .get("disableHostnameVerification")
        .asBoolean()
        .orElse(false);

    if (disableHostnameVerification) {
      disableHNV();
      LOGGER.info("Hostname verification for SSL/TLS connections has been disabled!");
    }
  }

  /** Disable host name verification for outbound connections*/
  private static void disableHNV() {
    javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier(
      new javax.net.ssl.HostnameVerifier() {
        public boolean verify(String hostname, javax.net.ssl.SSLSession sslSession) {
          return true;
        }
      });
  }

  /** Get a UUID using a secure random number generator */
  private static String getUUID() {
    return UUID.randomUUID().toString();
  }

  /** Determine if the SameSite Cookie attribute is to be added to a new Cookie */
  public boolean isSameSiteCookieEnabled() {
    return isSameSiteCookieEnabled;
  }

  /** Obtain the value of the SameSite Cookie attribute when enabled */
  public String getSameSiteCookieValue() {
    return valueSameSiteCookie;
  }

  /** Create a new connection by the Connection Manager */
  Connection newConnection(
    String domainUrl,
    String domainName,
    WebLogicVersion weblogicVersion,
    String consoleExtensionVersion,
    Set<String> capabilities,
    String username,
    Client client
  ) {
    Connection result = null;

    // Use UUID for Connection ID
    String id = getUUID();

    // Create the connection instance and add to the list of connections...
    result =
      new ConnectionImpl(
        id,
        domainUrl,
        domainName,
        weblogicVersion,
        consoleExtensionVersion,
        capabilities,
        username,
        client
      );
    connections.put(id, result);

    // Done.
    return result;
  }

  /**
   * Make a connection by passing the credentials and the WebLogic Domain URL.
   *
   * @return The connection that was established or <code>null</code> when the connection fails
   */
  public Connection makeConnection(String domainUrl, String username, String password) {
    Connection result = null;

    // Try to make the connection and check to see if the response was successful
    ConnectionResponse response = tryConnection(domainUrl, username, password);
    if (response.isSuccess()) {
      result = getConnection(response.getConnectionId());
    }

    // Done.
    return result;
  }

  /**
   * Try a connection to the WebLogic Domain and return a response status of the connection attempt
   * using the supplied HTTP Authorization header.
   *
   * @param domainUrl The WebLogic Domain URL
   * @param authorization The HTTP Authorization Header Value
   * @param locales The locales used to obtain a message
   * @return The connection response
   */
  public ConnectionResponse tryConnection(String domainUrl, String authorization, List<Locale> locales) {

    // Create the JAX-RS client for use with the connection using the suppplied credentials
    Client client =
      ClientBuilder.newBuilder()
        .connectTimeout(connectTimeout, TimeUnit.MILLISECONDS)
        .readTimeout(readTimeout, TimeUnit.MILLISECONDS)
        .register(JacksonJsonProvider.class)
        .register(MultiPartFeature.class)
        .register(ClientAuthFeature.authorization(authorization))
        .build();

    // Obtain the username from the authorization header
    String username = getUsernameFromHeader(authorization);
    if (username == null) {
      username = DEFAULT_USERNAME_UNKNOWN;
    }

    // Try to get WebLogic version from RESTful Management endpoint
    return connect(domainUrl, username, client, locales);
  }

  // FortifyIssueSuppression Password Management: Password in Comment
  // The password parameter does not actually reveal a password

  /**
   * Try a connection to the WebLogic Domain and return a response status of the connection attempt
   * using the supplied HTTP BASIC credentials.
   *
   * @param domainUrl The WebLogic Domain URL
   * @param username The username
   * @param password The password
   * @return The connection response
   */
  public ConnectionResponse tryConnection(String domainUrl, String username, String password) {

    // Create the JAX-RS client for use with the connection using the suppplied credentials
    Client client =
      ClientBuilder.newBuilder()
        .connectTimeout(connectTimeout, TimeUnit.MILLISECONDS)
        .readTimeout(readTimeout, TimeUnit.MILLISECONDS)
        .register(JacksonJsonProvider.class)
        .register(MultiPartFeature.class)
        .register(HttpAuthenticationFeature.basic(username, password))
        .build();

    // Try to get WebLogic version from RESTful Management endpoint
    return connect(domainUrl, username, client, null);
  }

  /**
   * Returns the user's view of the weblogic mbeans on this connection.
   * 
   * Returns null if there was a problem figuring out the version
   * (e.g. a WLS REST call to find out if the user is an Admin fails)
   */
  public WebLogicMBeansVersion getWebLogicMBeansVersion(Connection connection) {
    Set<String> roles = getConnectionUserRoles(connection);
    if (roles != null) {
      return
        WebLogicMBeansVersions.getVersion(
          connection.getWebLogicVersion(),
          roles,
          connection.getCapabilities()
        );
    }
    return null;
  }

  /**
   * Determines which of the standard roles (Admin, Deployer, Operator, Monitor)
   * the connection user is in.
   * 
   * @param connection The connection for the WebLogic Domain
   * @return A Set containing the list of roles or <code>null</code> if any of the underlying
   * WLS REST calls failed.
   */
  private Set<String> getConnectionUserRoles(Connection connection) {
    Set<String> result = new TreeSet<>(); // Sorted
    // See if the user is an Admin.  If so, that's good enough since
    // an Admin can access anything.  i.e. it doesn't matter if the
    // user is in any other roles.
    {
      Boolean inRole = isConnectionUserInRole(connection, WebLogicRoles.ADMIN);
      if (inRole == null) {
        // Something went wrong calling the WLS REST api.
        // The problem has been logged.
        // Don't return any roles since we couldn't find out.
        return null;
      }
      if (inRole) {
        return WebLogicRoles.ADMIN_ROLES;
      }
    }
    // The user isn't an Admin.  Return all the other standard roles the user is in.
    for (String roleName : WebLogicRoles.ALL) {
      if (!WebLogicRoles.ADMIN.equals(roleName)) {
        Boolean inRole = isConnectionUserInRole(connection, roleName);
        if (inRole == null) {
          // Something went wrong calling the WLS REST api.
          // The problem has been logged.
          // Don't return any roles since we couldn't find out.
          return null;
        }
        if (inRole) {
          result.add(roleName);
        }
      } else {
        // We already checked that the user isn't an Admin.
      }
    }
    return result;
  }

  /**
   * Determines whether the connection user is an a role.
   * Uses the WLS REST api to determine whether the user is an a role.
   * If there the REST call fails, it logs the problem and returns null.
   * 
   * @param connection The connection for the WebLogic Domain
   * @param roleName The name of the role
   * @return A Boolean indicating whether the user is in the role
   * or <code>null</code> if the WLS REST call failed.
   */
  private Boolean isConnectionUserInRole(Connection connection, String roleName) {
    Boolean result = null;

    // Create the request to check the user role
    WebLogicRestRequest webLogicRestRequest =
      WebLogicRestRequest.builder()
        .connection(connection)
        .path("/serverRuntime/serverSecurityRuntime/checkRole")
        .build();

    // Create the post data which asks if user is is in the role
    JsonObject postData = Json.createObjectBuilder().add("roleName", roleName).build();

    // Now ask WebLogic if the connection user  is in th role...
    try (Response response = WebLogicRestClient.post(webLogicRestRequest, postData)) {
      // FortifyIssueSuppression Log Forging
      // This response is from a trusted source - WebLogic - and is,
      // therefore, not a forging risk
      LOGGER.finest("Response from checking role: " + response.toString());
      if (Status.OK.getStatusCode() == response.getStatus()) {
        JsonObject entity = ResponseHelper.getEntityAsJson(response);
        if ((entity != null) && entity.containsKey(RETURN)) {
          // FortifyIssueSuppression Log Forging
          // This data is from a trusted source - WebLogic - and is,
          // therefore, not a forging risk
          LOGGER.fine(
            "Check role result for"
            + " role '" + roleName + "'"
            + " and user '" + connection.getUsername() + "'"
            + " is: " + entity.toString()
          );
          result = entity.getBoolean(RETURN, true);
        }
      }
    } catch (Exception exc) {
      // Log the exception and proceed without a result
      LOGGER.finest("Unable to check role using '" + connection.getDomainUrl() + "' because " + exc.toString());
      LOGGER.log(Level.FINEST, "Failure when checking role: " + exc.toString(), exc);
    }

    // Done.
    return result;
  }

  /**
   * Try a connection to the WebLogic Domain and return a response status of the connection attempt.
   *
   * @param domainUrl The WebLogic Domain URL
   * @param username The username
   * @param client The JAX-RS client
   * @param locales The locales used to obtain a message
   * @return The connection response; The connection id is available when status is successful
   */
  private ConnectionResponse connect(String domainUrl, String username, Client client, List<Locale> locales) {

    // Try to get WebLogic version from RESTful Management endpoint
    // It returns a failure response if there was one
    ConnectionResponse response = doConnect(domainUrl, client);
    if (response.getEntity() == null) {
      return response;
    }

    JsonObject entity = response.getEntity();

    // Check response data for the required connection information
    String domainVersion = entity.getString(DOMAINVER, null);
    String domainName = entity.getString(NAME, null);
    if ((domainVersion == null) || (domainName == null)) {
      LOGGER.info("Unexpected response from WebLogic Domain: No name or version information found!");
      return newConnectionResponse(Status.INTERNAL_SERVER_ERROR, client, "Missing version");
    }

    // Check that the WebLogic domain's version is one the console supports
    if (!WebLogicVersions.isSupportedVersion(domainVersion)) {
      LocalizableString message = LocalizedConstants.UNSUPPORTED_DOMAIN_VERSION;
      // FortifyIssueSuppression Log Forging
      // domainVersion is from a trusted source - WebLogic - and is,
      // therefore, not a forging risk
      LOGGER.info(message.getEnglishText());
      // Fix this localization
      return newConnectionResponse(Status.NOT_IMPLEMENTED, client, message.getEnglishText());
    }

    WebLogicVersion weblogicVersion = WebLogicVersions.getVersion(domainVersion);

    String consoleExtensionVersion = getConsoleExtensionVersion(entity);
    Set<String> capabilities = getCapabilities(domainUrl, client, entity);
    if (consoleExtensionVersion != null) {
      LOGGER.info(
        "The domain has version '" + consoleExtensionVersion + "' of the WebLogic Remote Console Extension installed."
      );
    } else {
      LOGGER.info("The domain does not have the WebLogic Remote Console Extension installed.");
    }

    // FortifyIssueSuppression Log Forging
    // domainVersion is from a trusted source - WebLogic - and is,
    // therefore, not a forging risk

    // Let the world know what the WebLogic domain that was connected
    StringBuilder sb = new StringBuilder();
    sb
      .append(">>>> Connected to the WebLogic Domain '")
      .append(domainName)
      .append("' with version '")
      .append(weblogicVersion)
      .append("' <<<<");
    LOGGER.info(sb.toString());

    // Create the connection and return the response
    return
      newConnectionResponse(
        newConnection(
          domainUrl,
          domainName,
          weblogicVersion,
          consoleExtensionVersion,
          capabilities,
          username,
          client
        )
      );
  }

  private JsonObject getConsoleBackend(JsonObject entity) {
    return entity.getJsonObject(CONSOLE_BACKEND);
  }

  private String getConsoleExtensionVersion(JsonObject entity) {
    JsonObject consoleBackend = getConsoleBackend(entity);
    String version = (consoleBackend != null) ? consoleBackend.getString(CONSOLE_EXTENSION_VERSION, null) : null;
    if ("CBE_WLS_REST_EXTENSION_V1".equals(version)) {
      // The newer versions are numeric, i.e. 2, 3, 4, ...
      // Make the oldest version follow the same pattern.
      version = CONSOLE_EXTENSION_V1;
    }
    return version;
  }

  private Set<String> getCapabilities(String domainUrl, Client client, JsonObject entity) {
    Set<String> consoleExtensionCapabilities = getConsoleExtensionCapabilities(entity);
    Set<String> beanCapabilities = getBeanCapabilities(domainUrl, client, consoleExtensionCapabilities);
    Set<String> capabilities = new HashSet<>(consoleExtensionCapabilities);
    capabilities.addAll(beanCapabilities);
    return capabilities;
  }

  // Find the capabilities depend on whether the domain has the required mbeans
  private Set<String> getBeanCapabilities(String domainUrl, Client client, Set<String> consoleExtensionCapabilities) {
    if (consoleExtensionCapabilities.contains("BeansSupport")) {
      WebLogicRestRequest webLogicRestRequest =
        WebLogicRestRequest.builder()
          .path("/domainConfig/consoleBackend/beansSupport")
          .serverUrl(domainUrl)
          .client(client)
          .build();
      JsonObject capabilityToBeanFeature = getCapabilityToBeanFeature();
      try (Response response = WebLogicRestClient.post(webLogicRestRequest, capabilityToBeanFeature)) {
        // FortifyIssueSuppression Log Forging
        // This response is from a trusted source - WebLogic - and is,
        // therefore, not a forging risk
        LOGGER.finest("Response from beansSupport: " + response.toString());
        if (Status.OK.getStatusCode() == response.getStatus()) {
          JsonObject entity = ResponseHelper.getEntityAsJson(response);
          if (entity != null) {
            LOGGER.finest("Entity from beansSupport: " + entity);
            Set<String> beanCapabilities = new HashSet<>();
            for (String beanCapability : capabilityToBeanFeature.keySet()) {
              if (entity.getBoolean(beanCapability, false)) {
                beanCapabilities.add(beanCapability);
              }
            }
            return beanCapabilities;
          }
        }
      } catch (Exception exc) {
        // Log the exception and proceed without a result
        LOGGER.finest("Unable to determine bean capabilities '" + domainUrl + "' because " + exc.toString());
        LOGGER.log(Level.FINEST, "Failure when getting bean capabilities: " + exc.toString(), exc);
      }
    }
    return Set.of();
  }

  // Probably should move this into its own class
  private JsonObject getCapabilityToBeanFeature() {
    return
      Json.createObjectBuilder()
        .add(
          "JMSMessages",
          Json.createObjectBuilder()
            .add("type", "weblogic.management.runtime.JMSMessageManagementRuntimeMBean")
            .add("action", "getJMSMessages")
            .add(
              "params",
              Json.createArrayBuilder().add("selector").add("max").add("sortOn").add("ascending")
            )
        )
        .add(
          "JTATransactions",
          Json.createObjectBuilder()
            .add("type", "weblogic.management.runtime.JTARuntimeMBean")
            .add("action", "currentTransactions")
        )
        .build();
  }

  // Find the capabilities that depend on the console extension's version
  private Set<String> getConsoleExtensionCapabilities(JsonObject entity) {
    String version = getConsoleExtensionVersion(entity);
    if (version == null) {
      // The extension isn't installed.  We can't use any extended capabilities.
      return Set.of();
    }
    JsonArray capabilities = getConsoleBackend(entity).getJsonArray(CONSOLE_EXTENSION_CAPABILITIES);
    if (capabilities != null) {
      // The console REST extension returned its capabilities.  Use them.
      Set<String> rtn = new HashSet<>();
      for (int i = 0; i < capabilities.size(); i++) {
        rtn.add(capabilities.getString(i)); // Don't bother checking that the array only contains strings
      }
      return rtn;
    }
    if (CONSOLE_EXTENSION_V1.equals(version)) {
      // The first version of the console REST extension didn't declare its capabilities.
      // Hard-code them here:
      return Set.of("ConfigurationChanges", "SecurityProviderType");
    }
    // We should never get here.
    // The domain has an extension newer than the first version.
    // It should have returned a list of its capabilities.
    LOGGER.warning(
      "Version '" + version + "' of the WebLogic Remote Console Extension is installed the domain"
      + " but did not return a list of its capabilities."
      + " The WebLogic Remote Console will not support any extended capabilities."
    );
    return Set.of();
  }

  /**
   * Make a connection to the WebLogic Domain URL and return a response
   *
   * @return The connection Response and the results populated with the values returned from WebLogic
   *     REST call
   */
  private ConnectionResponse doConnect(String domainUrl, Client client) {
    // Build request that will check the credentials and the connection...
    WebLogicRestRequest webLogicRestRequest =
      WebLogicRestRequest.builder()
        .path("/domainConfig/search")
        .serverUrl(domainUrl)
        .client(client)
        .build();

    // Attempt to connect to the WebLogic Domain URL...
    try (Response response = WebLogicRestClient.post(webLogicRestRequest, getDomainFieldsQuery())) {
      // FortifyIssueSuppression Log Forging
      // This response is from a trusted source - WebLogic - and is,
      // therefore, not a forging risk
      LOGGER.info("Connection response from WebLogic Domain: " + response.toString());
      Status respStatus = response.getStatusInfo().toEnum();

      // The status returned is from WebLogic, however a ConnectionException
      // is mapped to Status 500 internally, thus use 404 as connection response here!
      if (respStatus == Status.INTERNAL_SERVER_ERROR) {
        return newConnectionResponse(Status.NOT_FOUND, client, "Not able to connect");
      } else if (respStatus != Status.OK) {
        return newConnectionResponse(respStatus, client, response.getStatusInfo().getReasonPhrase());
      }

      // Populate the results from the JSON response which are found only when the invoke was
      // successful!

      JsonObject entity = ResponseHelper.getEntityAsJson(response);
      return new ConnectionResponse(entity);
    } catch (Exception exc) {
      // Handle any exception to WebLogic as Resoponse.Status.NOT_FOUND as the exception
      // maybe thrown for serveral reasons including unknown host, read timeout, etc.
      LOGGER.info(
        "Unable to contact WebLogic Domain '"
          + domainUrl
          + "' because "
          + exc.toString()
      );
      LOGGER.log(Level.FINE, "Connection attempt failed with exception: " + exc.toString(), exc);
      return newConnectionResponse(Status.NOT_FOUND, client, "Not able to connect");
    }
  }

  /**
   * Creates the WebLogic REST domainConfig query for returning the domain
   * info needed to determine the domain's name and version.
   */
  private JsonObject getDomainFieldsQuery() {
    BeanQueryBuilder builder = new BeanQueryBuilder();
    builder.addField(NAME);
    builder.addField(DOMAINVER);
    BeanQueryBuilder consoleBackendBuilder = builder.getChild(CONSOLE_BACKEND);
    consoleBackendBuilder.addField(CONSOLE_EXTENSION_VERSION);
    consoleBackendBuilder.addField(CONSOLE_EXTENSION_CAPABILITIES);
    JsonObject query = builder.toJson().build();
    return query;
  }

  /**
   * A helper class used for building the WLS REST query used
   * to return the domain's name and version.
   */
  private static class BeanQueryBuilder {
    private Set<String> fields = new HashSet<>();
    private Map<String,BeanQueryBuilder> children = new HashMap<>();

    private void addField(String field) {
      fields.add(field);
    }

    private BeanQueryBuilder getChild(String name) {
      return children.computeIfAbsent(name, k -> new BeanQueryBuilder());
    }

    private JsonObjectBuilder toJson() {
      JsonObjectBuilder builder = Json.createObjectBuilder();
      builder.add("links", Json.createArrayBuilder()); // no links ever
      JsonArrayBuilder fieldsBuilder = Json.createArrayBuilder();
      for (String field : fields) {
        fieldsBuilder.add(field);
      }
      builder.add("fields", fieldsBuilder);
      if (!children.isEmpty()) {
        JsonObjectBuilder childrenBuilder = Json.createObjectBuilder();
        for (Map.Entry<String,BeanQueryBuilder> childEntry : children.entrySet()) {
          childrenBuilder.add(childEntry.getKey(), childEntry.getValue().toJson());
        }
        builder.add("children", childrenBuilder);
      }
      return builder;
    }
  }

  /**
   * Check if the Connection ID is valid
   *
   * @return true of connection exists
   */
  public boolean isValidConnection(String id) {
    if (StringUtils.isEmpty(id)) {
      return false;
    }

    return connections.containsKey(id);
  }

  /**
   * Obtain the Connection from the Connection ID
   *
   * @return The connection or <code>null</code> is the connection does not exist
   */
  public Connection getConnection(String id) {
    if (StringUtils.isEmpty(id)) {
      return null;
    }

    return connections.get(id);
  }

  /** Remove the Connection based on the Connection ID */
  public void removeConnection(String id) {
    if (!StringUtils.isEmpty(id)) {
      Connection connection = connections.remove(id);
      if (connection != null) {
        connection.close();
      }
    }
  }

  /** Obtain the username from an HTTP BASIC authorization header */
  private String getUsernameFromHeader(String authorization) {
    String result = null;
    String header = authorization.trim();
    if (!StringUtils.isEmpty(header)) {
      int hidx = header.indexOf(' ');
      if (hidx != -1) {
        String scheme = header.substring(0, hidx).trim();
        String token = header.substring(hidx + 1).trim();
        if (!StringUtils.isEmpty(token) && "Basic".equalsIgnoreCase(scheme)) {
          String decoded =
            new String(Base64.getDecoder().decode(token), StandardCharsets.ISO_8859_1);
          int didx = decoded.indexOf(':');
          if (didx != -1) {
            result = decoded.substring(0, didx);
          }
        }
      }
    }
    return result;
  }

  /** Obtain a connection response */
  private ConnectionResponse newConnectionResponse(Connection connection) {
    String id = ((connection != null) ? connection.getId() : null);
    return new ConnectionResponse(id);
  }

  /** Obtain a failed connection response with message */
  private ConnectionResponse newConnectionResponse(Status status, Client client, String message) {
    if (client != null) {
      client.close();
    }
    return new ConnectionResponse(status, message);
  }

  /**
   * The ConnectionResponse holds the results of the Connection Manager connection.
   * <p>
   * Note, the Console Backend connection endpoint will translate the connection attempt status
   * in the response for use by the WebLogic Console Frontend.
   */
  public class ConnectionResponse {
    private Status status = Status.OK;
    private String connectionId;
    private String message;
    private JsonObject entity;

    // Successful connection to a domain whose version we support:
    ConnectionResponse(String connectionId) {
      this.connectionId = connectionId;
    }

    // Unsuccessful connection:
    ConnectionResponse(Status status, String message) {
      this.status = status;
      this.message = message;
    }

    // Intermediate successful connection
    // (connected to the domain, still need to see if we support the version)
    ConnectionResponse(JsonObject entity) {
      this.entity = entity;
    }

    public boolean isSuccess() {
      return ((status != null) ? (status.getFamily() == Status.Family.SUCCESSFUL) : false);
    }

    public Status getStatus() {
      return status;
    }

    public String getConnectionId() {
      return connectionId;
    }

    public String getMessage() {
      return message;
    }

    JsonObject getEntity() {
      return entity;
    }

    public String toString() {
      StringBuilder buffer = new StringBuilder();
      buffer.append("Status = " + ((status != null) ? status.toString() : "NULL"));
      if (connectionId != null) {
        buffer.append("; Connection ID = " + connectionId);
      }
      if (message != null) {
        buffer.append("; Message = " + message);
      }
      return buffer.toString();
    }
  }
}

// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
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
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
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
import weblogic.remoteconsole.common.utils.WebLogicRoles;
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
    String domainVersion,
    String username,
    Client client
  ) {
    Connection result = null;

    // Use UUID for Connection ID
    String id = getUUID();

    // Create the connection instance and add to the list of connections...
    result = new ConnectionImpl(id, domainUrl, domainName, domainVersion, username, client);
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
   * Determines which of the standard roles (Admin, Deployer, Operator, Monitor)
   * the connection user is in.
   * 
   * @param connection The connection for the WebLogic Domain
   * @return A Set containing the list of roles or <code>null</code> if any of the underlying
   * WLS REST calls failed.
   */
  public Set<String> getConnectionUserRoles(Connection connection) {
    Set<String> result = new HashSet<>();
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
    Map<String, String> domainFieldsMap = new HashMap<>();

    // Try to get WebLogic version from RESTful Management endpoint
    // It returns a failure response if there was one
    ConnectionResponse response = doConnect(domainUrl, client, domainFieldsMap);
    if (response != null) {
      return response;
    }

    // Check response data for the required connection information
    String domainVersion = domainFieldsMap.get(DOMAINVER);
    String domainName = domainFieldsMap.get(DOMAINNAME);
    if ((domainVersion == null) || (domainName == null)) {
      LOGGER.info("Unexpected response from WebLogic Domain: No name or version information found!");
      client.close();
      return new ConnectionResponse(Status.INTERNAL_SERVER_ERROR, null, "Missing version");
    }

    // Check that the WebLogic domain's version is one the console supports
    if (!WebLogicVersions.isSupportedVersion(domainVersion)) {
      LocalizableString message = LocalizedConstants.UNSUPPORTED_DOMAIN_VERSION;
      // FortifyIssueSuppression Log Forging
      // domainVersion is from a trusted source - WebLogic - and is,
      // therefore, not a forging risk
      LOGGER.info(message.getEnglishText());
      client.close();
      // Fix this localization
      return new ConnectionResponse(Status.NOT_IMPLEMENTED, null, message.getEnglishText());
    }

    // FortifyIssueSuppression Log Forging
    // domainVersion is from a trusted source - WebLogic - and is,
    // therefore, not a forging risk

    // Let the world know what the WebLogic domain that was connected
    LOGGER.info(
      ">>>> Connected to the WebLogic Domain '"
      + domainName
      + "' with version '"
      + domainVersion
      + "' <<<<"
    );

    // Create the connection and return the response
    return
      newConnectionResponse(
        Status.OK,
        newConnection(domainUrl, domainName, domainVersion, username, client)
      );
  }

  /**
   * Make a connection to the WebLogic Domain URL and return a response
   *
   * @return The connection Response and the results populated with the values returned from WebLogic
   *     REST call
   */
  private ConnectionResponse doConnect(String domainUrl, Client client, Map<String, String> results) {
    ConnectionResponse ret = null;
    // Build request that will check the credentials and the connection...
    WebLogicRestRequest webLogicRestRequest =
      WebLogicRestRequest.builder()
        .path("/domainConfig")
        .queryParam("links", "none")
        .queryParam("fields", "name,domainVersion")
        .serverUrl(domainUrl)
        .client(client)
        .build();

    // Attempt to connect to the WebLogic Domain URL...
    try (Response response = WebLogicRestClient.get(webLogicRestRequest)) {
      // FortifyIssueSuppression Log Forging
      // This response is from a trusted source - WebLogic - and is,
      // therefore, not a forging risk
      LOGGER.info("Connection response from WebLogic Domain: " + response.toString());
      Status respStatus = response.getStatusInfo().toEnum();

      // The status returned is from WebLogic, however a ConnectionException
      // is mapped to Status 500 internally, thus use 404 as connection response here!
      if (respStatus == Status.INTERNAL_SERVER_ERROR) {
        ret = newConnectionResponse(
          Status.NOT_FOUND, client, "Not able to connect");
      } else if (respStatus != Status.OK) {
        ret = newConnectionResponse(respStatus, client, response.getStatusInfo().getReasonPhrase());
      }

      // Populate the results from the JSON response which are found only when the invoke was
      // successful!
      JsonObject entity = ResponseHelper.getEntityAsJson(response);
      if ((entity != null) && entity.containsKey(NAME) && entity.containsKey(DOMAINVER)) {
        results.put(DOMAINVER, entity.getString(DOMAINVER));
        results.put(DOMAINNAME, entity.getString(NAME));
      }
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
      ret = newConnectionResponse(Status.NOT_FOUND, client, "Not able to connect");
    }

    // Done.
    return ret;
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
  private ConnectionResponse newConnectionResponse(Status status, Connection connection) {
    String id = ((connection != null) ? connection.getId() : null);
    return new ConnectionResponse(status, id, null);
  }

  /** Obtain a failed connection response with message */
  private ConnectionResponse newConnectionResponse(Status status, Client client, String message) {
    if (client != null) {
      client.close();
    }
    return new ConnectionResponse(status, null, message);
  }

  /**
   * The ConnectionResponse holds the results of the Connection Manager connection.
   * <p>
   * Note, the Console Backend connection endpoint will translate the connection attempt status
   * in the response for use by the WebLogic Console Frontend.
   */
  public class ConnectionResponse {
    private Status status;
    private String connectionId;
    private String message;

    ConnectionResponse(Status status, String connectionId, String message) {
      this.status = status;
      this.connectionId = connectionId;
      this.message = message;
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

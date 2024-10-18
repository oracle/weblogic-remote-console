// Copyright (c) 2020, 2024, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.net.URI;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import java.util.TreeSet;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.common.utils.WebLogicRoles;
import weblogic.remoteconsole.server.ConsoleBackendRuntime;
import weblogic.remoteconsole.server.ConsoleBackendRuntimeConfig;
import weblogic.remoteconsole.server.connection.Connection;
import weblogic.remoteconsole.server.connection.ConnectionManager;
import weblogic.remoteconsole.server.filter.ClientAuthHeader;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestDomainRuntimePageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestEditPageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestSecurityDataPageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestServerConfigPageRepo;
import weblogic.remoteconsole.server.utils.ResponseHelper;
import weblogic.remoteconsole.server.utils.WebLogicRestClient;
import weblogic.remoteconsole.server.utils.WebLogicRestRequest;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.ProviderResource;
import weblogic.remoteconsole.server.webapp.UriUtils;

/**
 * The implementation of the provider for Admin Server connections.  It relies
 * on the ConnectionManager class to do most of its work.
*/
public class AdminServerDataProviderImpl implements AdminServerDataProvider {
  public static final String TYPE_NAME = "AdminServerConnection";
  private static final ConnectionManager CONNECTION_MANAGER =
    ConsoleBackendRuntime.INSTANCE.getConnectionManager();
  private static final Logger LOGGER =
    Logger.getLogger(AdminServerDataProviderImpl.class.getName());

  private String connectionId;
  private String name;
  private String label;
  private String url;
  private String urlOrigin = null;
  private String ssoDomainLoginUri = null;
  private String ssoTokenId;
  private String authorizationHeader;
  private boolean local;
  private long ssoTokenExpires;
  private boolean isDisabledHostnameVerification = false;
  private boolean isInsecureConnection = false;
  private String proxyOverride = null;
  private WebLogicMBeansVersion mbeansVersion;
  private String connectionWarning;
  private String lastMessage;
  private boolean isLastConnectionAttemptSuccessful;
  private boolean isAnyConnectionAttemptSuccessful;
  private Map<String, Root> roots = new HashMap<>();
  private Root editRoot;
  private Root viewRoot;
  private Root monitoringRoot;
  private Root securityDataRoot;
  private Timer localConnectionTimer = null;
  private volatile ClientAuthHeader clientAuthHeader = null;
  private static LocalConnectionInfoFetcher localConnectionInfoFetcher;

  public AdminServerDataProviderImpl(
    String name,
    String label,
    String url,
    String authorizationHeader,
    boolean local
  ) {
    this.name = name;
    this.label = label;
    this.url = url;
    this.authorizationHeader = authorizationHeader;
    this.local = local;
    editRoot = new Root(
      this,
      Root.EDIT_NAME,
      Root.CONFIGURATION_ROOT,
      Root.EDIT_LABEL,
      false, // it is not read only
      Root.NAV_TREE_RESOURCE,
      Root.SIMPLE_SEARCH_RESOURCE,
      Root.CHANGE_MANAGER_RESOURCE
    );
    viewRoot = new Root(
      this,
      Root.SERVER_CONFIGURATION_NAME,
      Root.CONFIGURATION_ROOT,
      Root.CONFIGURATION_LABEL,
      true, // it is read only
      Root.NAV_TREE_RESOURCE,
      Root.SIMPLE_SEARCH_RESOURCE
    );
    monitoringRoot = new Root(
      this,
      Root.DOMAIN_RUNTIME_NAME,
      Root.MONITORING_ROOT,
      Root.MONITORING_LABEL,
      true, // it is read only
      Root.NAV_TREE_RESOURCE,
      Root.SIMPLE_SEARCH_RESOURCE
    );
    securityDataRoot = new Root(
      this,
      Root.SECURITY_DATA_NAME,
      Root.SECURITY_DATA_ROOT,
      Root.SECURITY_DATA_LABEL,
      false, // it is not read only
      Root.NAV_TREE_RESOURCE,
      Root.SIMPLE_SEARCH_RESOURCE
    );
  }

  public static void setLocalConnectionInfoFetcher(LocalConnectionInfoFetcher localConnectionInfoFetcher) {
    AdminServerDataProviderImpl.localConnectionInfoFetcher = localConnectionInfoFetcher;
  }

  @Override
  public String getType() {
    return TYPE_NAME;
  }

  public boolean isLocal() {
    return local;
  }

  private static JsonObject makeHelpClause(
    InvocationContext ic,
    LocalizableString summary,
    LocalizableString detail
  ) {
    JsonObjectBuilder ret = Json.createObjectBuilder();
    ret.add("helpSummaryHTML", ic.getLocalizer().localizeString(summary));
    ret.add("helpDetailHTML", ic.getLocalizer().localizeString(detail));
    return ret.build();
  }

  public static JsonObject getHelp(InvocationContext ic) {
    JsonObjectBuilder ret = Json.createObjectBuilder();
    ret.add("name",
      makeHelpClause(
        ic,
        LocalizedConstants.DATA_PROVIDER_HELP_NAME_SUMMARY,
        LocalizedConstants.DATA_PROVIDER_HELP_NAME_DETAIL
    ));
    ret.add("url",
      makeHelpClause(
        ic,
        LocalizedConstants.ADMIN_SERVER_HELP_URL_SUMMARY,
        LocalizedConstants.ADMIN_SERVER_HELP_URL_DETAIL
    ));
    ret.add("settings.proxyOverride",
      makeHelpClause(
        ic,
        LocalizedConstants.ADMIN_SERVER_HELP_PROXY_SUMMARY,
        LocalizedConstants.ADMIN_SERVER_HELP_PROXY_DETAIL
    ));
    ret.add("username",
      makeHelpClause(
        ic,
        LocalizedConstants.ADMIN_SERVER_HELP_USERNAME_SUMMARY,
        LocalizedConstants.ADMIN_SERVER_HELP_USERNAME_DETAIL
    ));
    ret.add("password",
      makeHelpClause(
        ic,
        LocalizedConstants.ADMIN_SERVER_HELP_PASSWORD_SUMMARY,
        LocalizedConstants.ADMIN_SERVER_HELP_PASSWORD_DETAIL
    ));
    ret.add("settings.insecure",
      makeHelpClause(
        ic,
        LocalizedConstants.ADMIN_SERVER_HELP_INSECURE_SUMMARY,
        LocalizedConstants.ADMIN_SERVER_HELP_INSECURE_DETAIL
    ));
    ret.add("settings.sso",
      makeHelpClause(
        ic,
        LocalizedConstants.ADMIN_SERVER_HELP_SSO_SUMMARY,
        LocalizedConstants.ADMIN_SERVER_HELP_SSO_DETAIL
    ));
    return ret.build();
  }

  @Override
  public String getURL() {
    return url;
  }

  @Override
  public synchronized String getURLOrigin() {
    if (urlOrigin == null) {
      try {
        URL origin = new URI(url).toURL();
        urlOrigin = new URI(origin.getProtocol(), origin.getAuthority(), null, null, null).toString();
      } catch (Exception e) {
        urlOrigin = url;
      }
    }
    return urlOrigin;
  }

  @Override
  public boolean isSsoTokenAvailable() {
    return (ssoTokenId != null) && (authorizationHeader != null);
  }

  @Override
  public long getSsoTokenExpires() {
    return ssoTokenExpires;
  }

  @Override
  public void setSsoTokenId(String value) {
    ssoTokenId = value;

    // Change the default domain login endpoint IFF setting is customized
    ssoDomainLoginUri = ConsoleBackendRuntimeConfig.getSsoDomainLoginUri();
  }

  @Override
  public String getSsoTokenId() {
    return ssoTokenId;
  }

  @Override
  public boolean setSsoToken(String token, String domain, long expires) {
    if (getURLOrigin().equalsIgnoreCase(domain)) {
      authorizationHeader = (token != null) ? ("Bearer " + token) : null;
      ssoTokenExpires = (expires > 0) ? expires : 0L;
    }
    return (authorizationHeader != null);
  }

  @Override
  public String getSsoDomainLoginUri() {
    return ssoDomainLoginUri;
  }

  @Override
  public long getConnectTimeout() {
    Connection connection = CONNECTION_MANAGER.getConnection(connectionId);
    if (connection != null) {
      return connection.getConnectTimeout();
    }
    return -1;
  }

  @Override
  public long getReadTimeout() {
    Connection connection = CONNECTION_MANAGER.getConnection(connectionId);
    if (connection != null) {
      return connection.getReadTimeout();
    }
    return -1;
  }

  @Override
  public boolean isDisabledHostnameVerification() {
    return (isInsecureConnection ? true : isDisabledHostnameVerification);
  }

  @Override
  public void setInsecureConnection(boolean value) {
    isInsecureConnection = value;
  }

  @Override
  public boolean isInsecureConnection() {
    return isInsecureConnection;
  }

  @Override
  public void setProxyOverride(String value) {
    proxyOverride = value;
  }

  @Override
  public String getProxyOverride() {
    if ((proxyOverride != null) && (proxyOverride.length() != 0)) {
      return proxyOverride;
    }
    return ConsoleBackendRuntimeConfig.getProxy();
  }

  @Override
  public String getLabel() {
    return label;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public boolean isLastConnectionAttemptSuccessful() {
    return isLastConnectionAttemptSuccessful;
  }

  @Override
  public boolean isAnyConnectionAttemptSuccessful() {
    return isAnyConnectionAttemptSuccessful;
  }

  @Override
  public boolean isConnected() {
    return (connectionId != null);
  }

  @Override
  public void test(InvocationContext ic) {
    start(ic);
  }

  @Override
  public synchronized boolean start(InvocationContext ic) {
    ic.setProvider(this);
    Connection connection = null;
    if (connectionId == null) {
      // Ensure that a provider used for SSO has the token available!
      if (isLocal() && (localConnectionInfoFetcher != null)) {
        url = localConnectionInfoFetcher.fetchURL();
        String token = localConnectionInfoFetcher.fetchToken();
        if ((token == null) || token.isBlank()) {
          throw new FailedRequestException(Response.Status.UNAUTHORIZED.getStatusCode(), getTokenUnavailable(ic));
        }
        authorizationHeader = "Bearer " + token;
      }
      if ((getSsoTokenId() != null) && !isSsoTokenAvailable()) {
        throw new FailedRequestException(Response.Status.UNAUTHORIZED.getStatusCode(), getTokenUnavailable(ic));
      }
      ClientAuthHeader authHeader = new ClientAuthHeader(authorizationHeader);
      ConnectionManager.ConnectionResponse result =
        CONNECTION_MANAGER.tryConnection(
          url,
          authHeader,
          ic.getLocales(),
          isInsecureConnection,
          getProxyOverride()
        );
      if (result.isSuccess()) {
        // Save the auth header and when needed start local connection timer
        clientAuthHeader = authHeader;
        if (isLocal()) {
          startLocalConnectionTimer();
        }
        // Setup the connection
        isLastConnectionAttemptSuccessful = true;
        isAnyConnectionAttemptSuccessful = true;
        connectionId = result.getConnectionId();
        connection = CONNECTION_MANAGER.getConnection(connectionId);
        mbeansVersion = CONNECTION_MANAGER.getWebLogicMBeansVersion(connection);
        editRoot.setPageRepo(new WebLogicRestEditPageRepo(mbeansVersion));
        viewRoot.setPageRepo(new WebLogicRestServerConfigPageRepo(mbeansVersion));
        monitoringRoot.setPageRepo(new WebLogicRestDomainRuntimePageRepo(mbeansVersion));
        roots.clear();
        roots.put(viewRoot.getName(), viewRoot);
        roots.put(monitoringRoot.getName(), monitoringRoot);
        if (mbeansVersion.isAccessAllowed(Set.of(WebLogicRoles.ADMIN, WebLogicRoles.DEPLOYER))) {
          // Admins and deployers are allowed to edit the configuration
          roots.put(editRoot.getName(), editRoot);
        } else {
          // Other users are not allowed to edit the configuration
        }
        // See if the domain has a version of the remote console rest extension installed that supports security data.
        if (connection.getCapabilities().contains("RealmsSecurityData")) {
          // Only admins are allowed to manage the security data.
          if (mbeansVersion.isAccessAllowed(Set.of(WebLogicRoles.ADMIN))) {
            securityDataRoot.setPageRepo(new WebLogicRestSecurityDataPageRepo(mbeansVersion));
            roots.put(securityDataRoot.getName(), securityDataRoot);
          }
        }
        lastMessage = null;
      } else {
        isLastConnectionAttemptSuccessful = false;
        lastMessage = result.getMessage();
        ic.setConnection(null);
        throw new FailedRequestException(
          result.getStatus().getStatusCode(), toJSON(ic));
      }
    } else {
      connection = CONNECTION_MANAGER.getConnection(connectionId);
    }
    ic.setConnection(connection);
    return true;
  }

  @Override
  public void terminate() {
    if (connectionId != null) {
      CONNECTION_MANAGER.removeConnection(connectionId);
      connectionId = null;
    }
    clientAuthHeader = null;
    if (isLocal()) {
      cancelLocalConnectionTimer();
    }
  }

  // Get the response message when no token is available for the provider
  private JsonObject getTokenUnavailable(InvocationContext ic) {
    isLastConnectionAttemptSuccessful = false;
    lastMessage = ic.getLocalizer().localizeString(LocalizedConstants.SSO_TOKEN_UNAVAILABLE);
    return toJSON(ic);
  }

  @Override
  public Map<String, Root> getRoots() {
    return roots;
  }

  @Override
  public JsonObject toJSON(InvocationContext ic) {
    JsonObjectBuilder ret = Json.createObjectBuilder();
    ret.add("name", getName());
    if ((getLabel() != null) && !getName().equals(getLabel())) {
      ret.add("label", getLabel());
    }
    ret.add(ProviderResource.PROVIDER_TYPE, getType());
    ret.add(ProviderResource.DOMAIN_URL, getURL());
    if (isInsecureConnection()) {
      ret.add("insecure", true);
    }
    if (proxyOverride != null) {
      ret.add("proxyOverride", proxyOverride);
    }
    if (getSsoTokenId() != null) {
      ret.add("sso", true);
      if (authorizationHeader == null) {
        ret.add("ssoid", getSsoTokenId());
      }
      if (getSsoDomainLoginUri() != null) {
        ret.add("ssologin", getSsoDomainLoginUri());
      }
    }
    ret.add("mode", "standalone");
    if (isLocal()) {
      ret.add("local", true);
    }
    ret.add("anyConnectionAttemptSuccessful", isAnyConnectionAttemptSuccessful());
    ret.add("lastConnectionAttemptSuccessful", isLastConnectionAttemptSuccessful());
    Connection connection = null;
    if (isLastConnectionAttemptSuccessful()) {
      ret.add("state", "connected");
      connection = CONNECTION_MANAGER.getConnection(connectionId);
      ret.add("connectTimeout", getConnectTimeout());
      ret.add("readTimeout", getReadTimeout());
      ret.add("domainVersion", connection.getWebLogicVersion().getDomainVersion());
      ret.add("domainName", connection.getDomainName());
      JsonArrayBuilder capabilities = Json.createArrayBuilder();
      for (String capability : new TreeSet<>(connection.getCapabilities())) {
        capabilities.add(capability);
      }
      ret.add("capabilities", capabilities);
      if (connectionWarning != null) {
        ret.add("connectionWarning", connectionWarning);
      }
      String consoleExtensionVersion = connection.getConsoleExtensionVersion();
      if (StringUtils.isEmpty(consoleExtensionVersion)) {
        consoleExtensionVersion =
          ic.getLocalizer().localizeString(LocalizedConstants.CONSOLE_REST_EXTENSION_NOT_INSTALLED);
      }
      ret.add("consoleExtensionVersion", consoleExtensionVersion);
    } else {
      ret.add("state", "disconnected");
      if (lastMessage != null) {
        ret.add("messages", createMessages(lastMessage));
      }
    }
    addStatusToJSON(ret);
    addRootsToJSON(ret, connection, ic);
    addRolesToJSON(ret);
    return ret.build();
  }

  private void addRootsToJSON(JsonObjectBuilder jsonBuilder, Connection connection, InvocationContext ic) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    if (connection != null) {
      // We've successfully connected to the wls domain. Send back the roots.
      for (Root root : getRoots().values()) {
        builder.add(root.toJSON(ic));
      }
    }
    jsonBuilder.add("roots", builder);
  }

  private void addRolesToJSON(JsonObjectBuilder jsonBuilder) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    if (mbeansVersion != null) {
      // We've know the user's roles.  Send them back.
      for (String role : mbeansVersion.getRoles()) {
        builder.add(role);
      }
    }
    jsonBuilder.add("roles", builder);
  }

  private void addStatusToJSON(JsonObjectBuilder jsonBuilder) {
    JsonObjectBuilder statusBuilder = Json.createObjectBuilder();
    String resourceData = "/" + UriUtils.API_URI + "/" + StringUtils.urlEncode(getName()) + "/domainStatus";
    statusBuilder.add("resourceData", resourceData);
    statusBuilder.add("refreshSeconds", 15);
    jsonBuilder.add("domainStatus", statusBuilder);
  }

  @Override
  public JsonObject getStatus(InvocationContext ic) {
    Connection connection =
      isLastConnectionAttemptSuccessful() ? CONNECTION_MANAGER.getConnection(connectionId) : null;
    return (new DomainStatusGetter(connection, ic)).getDomainStatus();
  }

  @Override
  public boolean isValidPath(String path) {
    return true;
  }

  private boolean refreshLocalConnectionToken() {
    ClientAuthHeader localAuthHeader = clientAuthHeader;
    if (isLocal() && (localConnectionInfoFetcher != null) && (localAuthHeader != null)) {
      String token = localConnectionInfoFetcher.fetchToken();
      if ((token == null) || token.isBlank()) {
        LOGGER.fine("Unable to refreshed local connection token - unavailable!");
        return false;
      }
      authorizationHeader = "Bearer " + token;
      localAuthHeader.setAuthHeader(authorizationHeader);
      LOGGER.fine("Refreshed local connection token!");
      return true;
    }
    return false;
  }

  private synchronized void startLocalConnectionTimer() {
    if (isLocal() && (localConnectionInfoFetcher != null)) {
      int timeoutMins = localConnectionInfoFetcher.fetchTokenTimeoutMins();
      long timeoutMillis = ((timeoutMins < 5) ? timeoutMins : (timeoutMins - 3)) * 60000L;
      cancelLocalConnectionTimer();
      localConnectionTimer = new Timer("WRCLocalConnectionTimer", true);
      localConnectionTimer.schedule(new LocalConnectionTimer(), timeoutMillis);
      LOGGER.fine("Started local connection timer with interval millis: " + timeoutMillis);
    }
  }

  private synchronized void cancelLocalConnectionTimer() {
    if (isLocal() && (localConnectionTimer != null)) {
      localConnectionTimer.cancel();
      localConnectionTimer = null;
      LOGGER.fine("Canceled local connection timer!");
    }
  }

  // Refresh the token used by a local connection
  private class LocalConnectionTimer extends TimerTask {
    public void run() {
      LOGGER.fine("LocalConnectionTimer executing...");
      if (refreshLocalConnectionToken()) {
        startLocalConnectionTimer();
        LOGGER.fine("LocalConnectionTimer complete!");
      }
    }
  }

  private class DomainStatusGetter {
    private JsonObjectBuilder builder = Json.createObjectBuilder();
    private Connection connection;
    private InvocationContext ic;
    private boolean connectFailed;
    private LocalizableString messageLabel;
    private String severity;
    private LocalizableString linkLabel;
    private String linkHref;
    private String linkResourceData;
    private LocalizableString detailsLabel;
    private String detailsMessage;

    private DomainStatusGetter(Connection connection, InvocationContext ic) {
      this.connection = connection;
      this.ic = ic;
    }

    private JsonObject getDomainStatus() {
      testWebLogicRestDelegation();
      getNeedServerRestart();
      getSecurityWarnings();
      if (connectFailed) {
        messageLabel = LocalizedConstants.CANT_CONNECT_TO_ADMIN_SERVER;
        linkLabel = null;
        severity = "warning";
      }
      if (messageLabel != null) {
        builder.add("messageHTML", ic.getLocalizer().localizeString(messageLabel));
        builder.add("severity", severity);
        if (linkLabel != null) {
          JsonObjectBuilder linkBuilder =
            Json.createObjectBuilder().add("label", ic.getLocalizer().localizeString(linkLabel));
          if (linkHref != null) {
            linkBuilder.add("href", linkHref);
          } else {
            linkBuilder.add("resourceData", linkResourceData);
          }
          builder.add("link", linkBuilder);
        }
        if ((detailsLabel != null) && (detailsMessage != null)) {
          JsonObjectBuilder detailsBuilder =
            Json.createObjectBuilder().add("label", ic.getLocalizer().localizeString(detailsLabel));
          detailsBuilder.add("message", detailsMessage);
          builder.add("messageDetails", detailsBuilder);
        }
      }
      return builder.build();
    }

    private void testWebLogicRestDelegation() {
      // Determines whether the admin server can make WLS REST calls to WLS servers.
      // If it can't, it's probably because either OWSM or the DefaultIdentityAsserter isn't
      // properly configured to allow weblogic-jwt-tokens.
      // To do the test, first get the admin server's name from the domain config tree
      // then try get to the admin server's runtime mbean through the domain runtime mbean.
      if (connectFailed || messageLabel != null) {
        return;
      }
      testWebLogicRestDelegation(getAdminServerName());
    }

    private void testWebLogicRestDelegation(String adminServerName) {
      if (connectFailed || messageLabel != null) {
        return;
      }
      WebLogicRestRequest request =
        WebLogicRestRequest.builder()
          .connection(connection)
          .path("/domainRuntime/serverRuntimes/" + adminServerName)
          .queryParam("links", "none")
          .queryParam("fields", "name")
          .build();
      try (Response response = WebLogicRestClient.get(request)) {
        if (response.getStatus() == Response.Status.OK.getStatusCode()) {
          // WebLogic REST delegation works
          return;
        }
        // WebLogic REST delegation does not work
        // e.g. because the DefaultIdentityAsserter's ActiveTypes doesn't include weblogic-jwt-token
        JsonObject entityAsJson = ResponseHelper.getEntityAsJson(response);
        LOGGER.finest(
          "testWebLogicRestDelegation failed:"
          + " " + response.getStatus()
          + " " + ((entityAsJson != null) ? entityAsJson.toString() : ResponseHelper.getEntityAsString(response))
        );
        severity = "error";
        messageLabel = LocalizedConstants.WEBLOGIC_REST_DELEGATION_NOT_WORKING_MESSAGE;
        setExternalLink(
          LocalizedConstants.WEBLOGIC_REST_DELEGATION_NOT_WORKING_LINK,
          ConsoleBackendRuntimeConfig.getDocumentationSite() + "/reference/troubleshoot/#rest-communication"
        );
        setMessageDetails(
          LocalizedConstants.WEBLOGIC_REST_DELEGATION_NOT_WORKING_DETAILS_LABEL,
          entityAsJson
        );
        detailsMessage = "<ul><li>"
            + detailsMessage
            + "</li><li>"
            + ic.getLocalizer().localizeString(LocalizedConstants.SUGGEST_RESTART_SERVER_MESSAGE)
            + "</li></ul>";
        return;
      } catch (Exception exc) {
        LOGGER.log(Level.FINEST, "testWebLogicRestDelegation failed: " + exc.toString(), exc);
      }
      connectFailed = true;
    }

    private String getAdminServerName() {
      if (connectFailed || messageLabel != null) {
        return null;
      }
      WebLogicRestRequest request =
        WebLogicRestRequest.builder()
          .connection(connection)
          .path("/domainConfig")
          .queryParam("links", "none")
          .queryParam("fields", "adminServerName")
          .build();
      try (Response response = WebLogicRestClient.get(request)) {
        if (response.getStatus() == Response.Status.OK.getStatusCode()) {
          return ResponseHelper.getEntityAsJson(response).getString("adminServerName");
        } else {
          LOGGER.finest(
            "getAdminServerName failed:"
            + " " + response.getStatus()
            + " " + ResponseHelper.getEntityAsString(response)
          );
        }
      } catch (Exception exc) {
        LOGGER.log(Level.FINEST, "getAdminServerName failed: " + exc.toString(), exc);
      }
      connectFailed = true;
      return null;
    }

    private void getNeedServerRestart() {
      if (connectFailed || messageLabel != null) {
        return;
      }
      WebLogicRestRequest request =
        WebLogicRestRequest.builder()
          .connection(connection)
          .path("/domainRuntime/serverRuntimes")
          .queryParam("links", "none")
          .queryParam("fields", "restartRequired")
          .build();
      try (Response response = WebLogicRestClient.get(request)) {
        if (response.getStatus() == Response.Status.OK.getStatusCode()) {
          boolean needRestart = false;
          JsonArray items = ResponseHelper.getEntityAsJson(response).getJsonArray("items");
          for (int i = 0; !needRestart && i < items.size(); i++) {
            boolean serverNeedsRestart = items.getJsonObject(i).getBoolean("restartRequired", false);
            if (serverNeedsRestart) {
              needRestart = true;
            }
          }
          if (needRestart) {
            messageLabel = LocalizedConstants.NEED_SERVER_RESTART_LABEL;
            severity = "warning";
            setPageLink(
              LocalizedConstants.SERVER_RESTART_LINK_LABEL,
              Root.DOMAIN_RUNTIME_NAME + "/data/DomainRuntime/CombinedServerRuntimes"
            );
          }
          return;
        } else {
          LOGGER.finest(
            "getNeedServerRestart failed:"
            + " " + response.getStatus()
            + " " + ResponseHelper.getEntityAsString(response)
          );
        }
      } catch (Exception exc) {
        LOGGER.log(Level.FINEST, "getNeedServerRestart failed: " + exc.toString(), exc);
      }
      // Note: computing whether any servers need to be restarted causes the
      // admin server to send a REST request to each managed server.
      // Sometimes this takes a long time (e.g. if the communication between
      // the admin and managed servers is very slow or problematic) which causes
      // the CBE's request to the admin server to time out.
      // That is, the remote console can communicate fine with the admin server
      // but not necessarily the managed servers.
      //
      // We've already checked that the remote console can talk to the admin server
      // when we requested the security warnings.  So, if we get a problem here,
      // it's pretty likely that it's a problem with the admin server talking
      // to managed servers.
      //
      // This means that the edit and domain config trees in the remote console work
      // fine but the monitoring tree is slow and times out.
      //
      // Just swallow this problem (v.s. saying that the remote console can't talk to
      // the admin server at all).
      connectFailed = false;
    }

    private void getSecurityWarnings() {
      if (connectFailed || messageLabel != null) {
        return;
      }
      WebLogicRestRequest request =
        WebLogicRestRequest.builder()
          .connection(connection)
          .path("/domainRuntime/domainSecurityRuntime/hasSecurityValidationWarnings")
          .build();
      JsonObject requestBody = Json.createObjectBuilder().build();
      try (Response response = WebLogicRestClient.post(request, requestBody)) {
        if (response.getStatus() == Response.Status.OK.getStatusCode()) {
          setPageLink(
            LocalizedConstants.SECURITY_VALIDATION_WARNINGS_LINK_LABEL,
            Root.DOMAIN_RUNTIME_NAME + "/data/DomainRuntime/DomainSecurityRuntime?slice=SecurityWarnings"
          );
          boolean hasWarnings = ResponseHelper.getEntityAsJson(response).getBoolean("return");
          messageLabel =
            hasWarnings
              ? LocalizedConstants.HAVE_SECURITY_VALIDATION_WARNINGS_LABEL
              : LocalizedConstants.NO_SECURITY_VALIDATION_WARNINGS_LABEL;
          severity = hasWarnings ? "error" : "info";
          return;
        } else if (response.getStatus() == Response.Status.NOT_FOUND.getStatusCode()) {
          // The domain doesn't support security validation warnings.
          return;
        } else if (response.getStatus() == Response.Status.FORBIDDEN.getStatusCode()) {
          // This user doesn't have permission to view the security validation warnings.
          return;
        } else {
          LOGGER.finest(
            "getSecurityWarnings failed:"
            + " " + response.getStatus()
            + " " + ResponseHelper.getEntityAsString(response)
          );
        }
      } catch (Exception exc) {
        LOGGER.log(Level.FINEST, "getSecurityWarnings failed: " + exc.toString(), exc);
      }
      connectFailed = true;
    }

    private void setPageLink(LocalizableString label, String path) {
      linkLabel = label;
      linkResourceData = "/" + UriUtils.API_URI + "/" + StringUtils.urlEncode(getName()) + "/" + path;
      linkHref = null;
    }

    private void setExternalLink(LocalizableString label, String href) {
      linkLabel = label;
      linkHref = href;
      linkResourceData = null;
    }

    private void setMessageDetails(LocalizableString label, JsonObject entityAsJson) {
      if ((entityAsJson != null) && entityAsJson.containsKey("messages")) {
        JsonArray messagesJson = entityAsJson.getJsonArray("messages");
        if (messagesJson != null) {
          String details = "";
          boolean firstMessage = true;
          for (int i = 0; i < messagesJson.size(); i++) {
            JsonObject messageJson = messagesJson.getJsonObject(i);
            if ((messageJson != null) && messageJson.containsKey("message")) {
              String message = messageJson.getString("message");
              if ((message != null) && !message.isBlank()) {
                if (!firstMessage) {
                  details += " - ";
                } else {
                  firstMessage = false;
                }
                details += message;
              }
            }
          }
          if (!details.isEmpty()) {
            detailsLabel = label;
            detailsMessage = details;
          }
        }
      }
    }
  }

  public static interface LocalConnectionInfoFetcher {
    int fetchTokenTimeoutMins();

    String fetchToken();

    String fetchURL();
  }
}

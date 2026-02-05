// Copyright (c) 2020, 2026, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.net.URI;
import java.net.URL;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.core.Response;

import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
//import weblogic.remoteconsole.common.utils.RemoteConsoleExtension;
import weblogic.remoteconsole.common.utils.UrlUtils;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersions;
import weblogic.remoteconsole.common.utils.WebLogicRoles;
import weblogic.remoteconsole.server.ConsoleBackendRuntime;
import weblogic.remoteconsole.server.ConsoleBackendRuntimeConfig;
import weblogic.remoteconsole.server.StdoutRedirector;
import weblogic.remoteconsole.server.connection.Connection;
import weblogic.remoteconsole.server.connection.ConnectionManager;
import weblogic.remoteconsole.server.filter.ClientAuthHeader;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestDomainRuntimePageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestEditPageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestSecurityDataPageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestServerConfigPageRepo;
import weblogic.remoteconsole.server.utils.ResponseHelper;
import weblogic.remoteconsole.server.utils.WebLogicRestClient;
import weblogic.remoteconsole.server.utils.WebLogicRestRequest;
import weblogic.remoteconsole.server.webapp.ChangeManagerResource;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
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
  // Keep the repos of the 3 most recently stale admin providers in memory:
  private static final int MAX_STALE_PROVIDERS = 3;

  private JsonArray messages;
  private boolean isShoppingCartEmpty = true; // empty until made otherwise
  private String connectionId;
  private String name;
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
  private String connectionWarning;
  private boolean isLastConnectionAttemptSuccessful;
  private boolean isAnyConnectionAttemptSuccessful;
  private Map<String, Root> roots = new LinkedHashMap<>();
  private Root editRoot;
  private Root viewRoot;
  private Root monitoringRoot;
  private Root securityDataRoot;
  private Timer localConnectionTimer = null;
  private volatile ClientAuthHeader clientAuthHeader = null;
  private Map<String,Object> cache = new ConcurrentHashMap<>();
  // Share the lock across all providers so we're consistent when cleaning up stale ones:
  private static Object reposInitializationLock = new Object();
  private boolean reposInitialized = false;
  private static long lastTimeDiscardedStaleRepos = System.currentTimeMillis();
  private static long DISCARD_STALE_REPO_INTERVAL = 10 * 1000; // milliseconds
  private long lastUsed;
  private String lastRootUsed;
  private static LocalConnectionInfoFetcher localConnectionInfoFetcher;

  public AdminServerDataProviderImpl() {
    makeRoots();
  }

  private void makeRoots() {
    editRoot = new Root(
      this,
      Root.EDIT_NAME,
      Root.CONFIGURATION_ROOT,
      Root.EDIT_LABEL,
      LocalizedConstants.EDIT_DESCRIPTION,
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
      LocalizedConstants.CONFIGURATION_DESCRIPTION,
      true, // it is read only
      Root.NAV_TREE_RESOURCE,
      Root.SIMPLE_SEARCH_RESOURCE
    );
    monitoringRoot = new Root(
      this,
      Root.DOMAIN_RUNTIME_NAME,
      Root.MONITORING_ROOT,
      Root.MONITORING_LABEL,
      LocalizedConstants.MONITORING_DESCRIPTION,
      true, // it is read only
      Root.NAV_TREE_RESOURCE,
      Root.SIMPLE_SEARCH_RESOURCE
    );
    securityDataRoot = new Root(
      this,
      Root.SECURITY_DATA_NAME,
      Root.SECURITY_DATA_ROOT,
      Root.SECURITY_DATA_LABEL,
      LocalizedConstants.SECURITY_DATA_DESCRIPTION,
      false, // it is not read only
      Root.NAV_TREE_RESOURCE,
      Root.SIMPLE_SEARCH_RESOURCE
    );
  }

  public AdminServerDataProviderImpl(
    String name,
    String url,
    String authorizationHeader,
    boolean local
  ) {
    this.name = name;
    this.url = url;
    this.authorizationHeader = authorizationHeader;
    this.local = local;
    updateLastRootUsed(null);
    makeRoots();
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

  // Notice that this isn't synchronized, since it is not doing any global
  // maintenance.  It is just waiting for the token, if necessary
  @Override
  public boolean start(InvocationContext ic) {
    if (connectionId == null) {
      // Ensure that a provider used for SSO has the token available
      if (!isLocal() && (getSsoTokenId() != null)) {
        if (!isSsoTokenAvailable()) {
          StdoutRedirector.println("URL: " + getURL() + "/console/login?"
            + "ssoid=" + getSsoTokenId()
            + "&port=" + System.getProperty("server.port"));
        }
        // Let's give it 30 seconds for now.  We need to do better at handling
        // long running operations in the CBE, but not specifically for this
        // one and not today
        long iterations = 300;
        for (int i = 0; (i < iterations) && !isSsoTokenAvailable(); i++) {
          try {
            Thread.sleep(100);
          } catch (InterruptedException e) {
            // Just loop around again either way
          }
        }
        if (!isSsoTokenAvailable()) {
          throw new FailedRequestException(
            Response.Status.REQUEST_TIMEOUT.getStatusCode(), getTokenUnavailable(ic));
        }
      }
    }
    return startNowThatWeAreReady(ic);
  }

  private synchronized boolean startNowThatWeAreReady(InvocationContext ic) {
    boolean newlyCreatedConnection = false;
    ic.setProvider(this);
    Connection connection = null;
    if (connectionId == null) {
      newlyCreatedConnection = true;
      if (isLocal() && (localConnectionInfoFetcher != null)) {
        url = localConnectionInfoFetcher.fetchURL();
        String token = localConnectionInfoFetcher.fetchToken();
        if ((token == null) || token.isBlank()) {
          throw new FailedRequestException(Response.Status.UNAUTHORIZED.getStatusCode(), getTokenUnavailable(ic));
        }
        authorizationHeader = "Bearer " + token;
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
        CONNECTION_MANAGER.initializeConnectionUserRoles(connection);
        roots.clear();
        Set<String> roles = connection.getRoles();
        if (WebLogicMBeansVersion.isAccessAllowed(roles, Set.of(WebLogicRoles.ADMIN, WebLogicRoles.DEPLOYER))) {
          // Admins and deployers are allowed to edit the configuration
          roots.put(editRoot.getName(), editRoot);
        } else {
          // Other users are not allowed to edit the configuration
        }
        roots.put(viewRoot.getName(), viewRoot);
        roots.put(monitoringRoot.getName(), monitoringRoot);
        // See if the domain has a version of the remote console rest extension installed that supports security data.
        if (connection.getCapabilities().contains("RealmsSecurityData")) {
          // Only admins are allowed to manage the security data.
          if (WebLogicMBeansVersion.isAccessAllowed(roles, Set.of(WebLogicRoles.ADMIN))) {
            roots.put(securityDataRoot.getName(), securityDataRoot);
          }
        }
      } else {
        isLastConnectionAttemptSuccessful = false;
        ic.setConnection(null);
        throw new FailedRequestException(
          result.getStatus().getStatusCode(), result.getMessage());
      }
    } else {
      connection = CONNECTION_MANAGER.getConnection(connectionId);
    }
    initializeRepos(connection);
    ic.setConnection(connection);
    discardStaleRepos(ic);
    if (newlyCreatedConnection && roots.containsKey(Root.EDIT_NAME)) {
      ic.setPageRepoByName(Root.EDIT_NAME);
      ChangeManagerResource.setHasChanges(ic);
    }
    return true;
  }

  private boolean isReposInitialized() {
    return reposInitialized;
  }

  private synchronized void initializeRepos(Connection connection) {
    synchronized (reposInitializationLock) {
      if (reposInitialized) {
        return;
      }
      LOGGER.finest("Initialize repos " + getName());
      WebLogicMBeansVersion mbeansVersion = WebLogicMBeansVersions.getVersion(connection);
      editRoot.setPageRepo(new WebLogicRestEditPageRepo(mbeansVersion));
      viewRoot.setPageRepo(new WebLogicRestServerConfigPageRepo(mbeansVersion));
      monitoringRoot.setPageRepo(new WebLogicRestDomainRuntimePageRepo(mbeansVersion));
      if (connection.getCapabilities().contains("RealmsSecurityData")) {
        // Only admins are allowed to manage the security data.
        if (mbeansVersion.isAccessAllowed(Set.of(WebLogicRoles.ADMIN))) {
          securityDataRoot.setPageRepo(new WebLogicRestSecurityDataPageRepo(mbeansVersion));
        }
      }
      reposInitialized = true;
    }
  }

  // This provider is starting, which means that none of the other providers are being used.
  // Discard their repos (except for the few most recently used providers) so we don't use too much memory.
  // Keep a few around so that switching back and forth between a few providers is fast.
  private void discardStaleRepos(InvocationContext ic) {
    if (System.currentTimeMillis() < lastTimeDiscardedStaleRepos + DISCARD_STALE_REPO_INTERVAL) {
      // too soon
      return;
    }
    synchronized (reposInitializationLock) {
      if (System.currentTimeMillis() < lastTimeDiscardedStaleRepos + DISCARD_STALE_REPO_INTERVAL) {
        // too soon
        return;
      }
      Map<Long,AdminServerDataProviderImpl> sortedLastUsedToStaleProvider = new TreeMap<>();
      ProjectManager projectManager = ic.getFrontend().getProjectManager();
      for (Provider provider : projectManager.getAllLiveProviders()) {
        if (provider != this && provider instanceof AdminServerDataProviderImpl) {
          AdminServerDataProviderImpl adminProvider = (AdminServerDataProviderImpl)provider;
          if (adminProvider.isReposInitialized()) {
            sortedLastUsedToStaleProvider.put(adminProvider.getLastUsed(), adminProvider);
          }
        }
      }
      List<AdminServerDataProviderImpl> candidateStaleProviders =
        new ArrayList<>(sortedLastUsedToStaleProvider.values());
      for (int i = 0; i < candidateStaleProviders.size() - MAX_STALE_PROVIDERS; i++) {
        candidateStaleProviders.get(i).discardRepos(ic);
      }
      lastTimeDiscardedStaleRepos = System.currentTimeMillis();
    }
  }

  private void discardRepos(InvocationContext ic) {
    synchronized (reposInitializationLock) {
      if (!reposInitialized) {
        return;
      }
      LOGGER.finest("Discard repos " + getName());
      discardRepos(ic, editRoot);
      discardRepos(ic, viewRoot);
      discardRepos(ic, monitoringRoot);
      discardRepos(ic, securityDataRoot);
      reposInitialized = false;
    }
  }

  private void discardRepos(InvocationContext ic, Root root) {
    // Always called from the synchronized start method, so no need for further synchronization
    PageRepo pageRepo = root.getPageRepo();
    if (pageRepo != null) {
      pageRepo.prepareForRemoval(ic);
      root.setPageRepo(null);
    }
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
  private String getTokenUnavailable(InvocationContext ic) {
    isLastConnectionAttemptSuccessful = false;
    return ic.getLocalizer().localizeString(LocalizedConstants.SSO_TOKEN_UNAVAILABLE);
  }

  @Override
  public Map<String, Root> getRoots() {
    return roots;
  }

  @Override
  public JsonObject toJSON(InvocationContext ic) {
    JsonObjectBuilder ret = Json.createObjectBuilder();
    ret.add("name", getName());
    ret.add("providerType", getType());
    ret.add("domainUrl", getURL());
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
      if (messages != null) {
        ret.add("messages", messages);
      }
      String consoleExtensionVersion = connection.getConsoleExtensionVersion();
      if (StringUtils.isEmpty(consoleExtensionVersion)) {
        consoleExtensionVersion =
          ic.getLocalizer().localizeString(LocalizedConstants.CONSOLE_REST_EXTENSION_NOT_INSTALLED);
      }
      ret.add("consoleExtensionVersion", consoleExtensionVersion);
    } else {
      ret.add("state", "disconnected");
    }
    if (lastRootUsed != null) {
      ret.add("lastRootUsed", lastRootUsed);
    }
    addStatusToJSON(ret);
    addRootsToJSON(ret, connection, ic);
    addRolesToJSON(ret, connection);
    return ret.build();
  }

  @Override
  public boolean isConnectionOriented() {
    return true;
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

  private void addRolesToJSON(JsonObjectBuilder jsonBuilder, Connection connection) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    if (connection != null && connection.getRoles() != null) {
      // We've know the user's roles.  Send them back.
      for (String role : connection.getRoles()) {
        builder.add(role);
      }
    }
    jsonBuilder.add("roles", builder);
  }

  private void addStatusToJSON(JsonObjectBuilder jsonBuilder) {
    JsonObjectBuilder statusBuilder = Json.createObjectBuilder();
    String resourceData = "/" + UriUtils.API_URI + "/" + UrlUtils.urlEncode(getName()) + "/domainStatus";
    statusBuilder.add("resourceData", resourceData);
    if (System.getenv("CBE_DOMAIN_STATUS_REFRESH") != null) {
      statusBuilder.add("refreshSeconds", Integer.parseInt(
        System.getenv("CBE_DOMAIN_STATUS_REFRESH")));
    } else {
      statusBuilder.add("refreshSeconds", 15);
    }
    jsonBuilder.add("domainStatus", statusBuilder);
  }

  @Override
  public void updateStatus(InvocationContext ic) {
    Connection connection =
      isLastConnectionAttemptSuccessful() ? CONNECTION_MANAGER.getConnection(connectionId) : null;
    new DomainStatusGetter(connection, ic).getDomainStatus();
  }

  @Override
  public boolean isValidPath(String path) {
    return true;
  }

  @Override
  public Map<String,Object> getCache() {
    return cache;
  }

  @Override
  public void updateLastRootUsed(String root) {
    lastUsed = System.currentTimeMillis();
    lastRootUsed = root;
  }

  @Override
  public String getLastRootUsed() {
    return lastRootUsed;
  }

  @Override
  public long getLastUsed() {
    return lastUsed;
  }

  @Override
  public boolean supportsShoppingCart() {
    return true;
  }

  @Override
  public boolean isShoppingCartEmpty() {
    return isShoppingCartEmpty;
  }

  @Override
  public void setIsShoppingCartEmpty(boolean isEmpty) {
    isShoppingCartEmpty = isEmpty;
  }

  @Override
  public LinkedHashMap<String, String> getStatusMap(InvocationContext ic) {
    LinkedHashMap<String, String> ret = new LinkedHashMap<>();
    ret.put("introductionHTML", ic.getLocalizer().localizeString(
      LocalizedConstants.ADMIN_SERVER_STATUS_INTRODUCTION, getName()));
    ret.put("Name", getName());
    ret.put("Provider Type", getType());
    ret.put("Domain URL", getURL());
    if (isInsecureConnection()) {
      ret.put("Insecure Connection", "True");
    }
    if (proxyOverride != null) {
      ret.put("Proxy Override", proxyOverride);
    }
    if (getSsoTokenId() != null) {
      ret.put("Web Authentication", "True");
    }
    if (isLocal()) {
      ret.put("Local Connection", "true");
    }
    Connection connection = null;
    if (isLastConnectionAttemptSuccessful()) {
      ret.put("State", "Connected");
      connection = CONNECTION_MANAGER.getConnection(connectionId);
      ret.put("Connection Timeout", "" + getConnectTimeout());
      ret.put("Read Timeout", "" + getReadTimeout());
      ret.put("Domain Version", connection.getWebLogicVersion().getDomainVersion());
      ret.put("Domain Name", connection.getDomainName());
      String consoleExtensionVersion = connection.getConsoleExtensionVersion();
      if (StringUtils.isEmpty(consoleExtensionVersion)) {
        consoleExtensionVersion =
          ic.getLocalizer().localizeString(LocalizedConstants.CONSOLE_REST_EXTENSION_NOT_INSTALLED);
      }
      ret.put("Console Extension Version", consoleExtensionVersion);
      if (connection.getUsername() != null) {
        ret.put("User Name", connection.getUsername());
      }
      if (connection.getRoles() != null) {
        StringBuffer roles = new StringBuffer();
        for (String role : connection.getRoles()) {
          if (roles.length() > 0) {
            roles.append(", ");
          }
          roles.append(role);
        }
        ret.put("Roles", roles.toString());
      }
    } else {
      ret.put("State", "Disconnected");
    }
    return ret;
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
    private Connection connection;
    private InvocationContext ic;
    private boolean connectFailed;
    private JsonArrayBuilder messagesBuilder;

    private DomainStatusGetter(Connection connection, InvocationContext ic) {
      this.connection = connection;
      this.ic = ic;
    }

    private void getDomainStatus() {
      testWebLogicRestDelegation(getAdminServerName());
      getNeedServerRestart();
      getSecurityWarnings();
      if (connectFailed) {
        messagesBuilder = Json.createArrayBuilder();
        messagesBuilder.add(Json.createObjectBuilder()
          .add("messageSummary", ic.getLocalizer().localizeString(
            LocalizedConstants.CANT_CONNECT_TO_ADMIN_SERVER))
          .add("severity", "warning"));
      }
      if (messagesBuilder == null) {
        messagesBuilder = Json.createArrayBuilder();
        messagesBuilder.add(Json.createObjectBuilder()
          .add("severity", "info")
          .add("messageSummary", ic.getLocalizer().localizeString(
              LocalizedConstants.NO_SECURITY_VALIDATION_WARNINGS_LABEL))
          .add("link", Json.createObjectBuilder()
            .add("label", ic.getLocalizer().localizeString(
              LocalizedConstants.SECURITY_VALIDATION_WARNINGS_LINK_LABEL))
            .add("resourceData", "/api/-current-/" + Root.DOMAIN_RUNTIME_NAME
              + "/data/DomainRuntime/DomainSecurityRuntime?slice=SecurityWarnings")));
      }
      messages = messagesBuilder.build();
    }

    private void testWebLogicRestDelegation(String adminServerName) {
      if (adminServerName == null) {
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
        if (messagesBuilder == null) {
          messagesBuilder = Json.createArrayBuilder();
        }
        messagesBuilder.add(Json.createObjectBuilder()
          .add("severity", "error")
          .add("messageSummary", ic.getLocalizer().localizeString(
            LocalizedConstants.WEBLOGIC_REST_DELEGATION_NOT_WORKING_MESSAGE))
          .add("messageDetails", ic.getLocalizer().localizeString(
              LocalizedConstants.SUGGEST_RESTART_SERVER_MESSAGE))
          .add("link", Json.createObjectBuilder()
            .add("label", ic.getLocalizer().localizeString(
              LocalizedConstants.WEBLOGIC_REST_DELEGATION_NOT_WORKING_LINK)))
            .add("externalLink", ConsoleBackendRuntimeConfig.getDocumentationSite()
              + "/troubleshoot-weblogic-remote-console/#GUID-2EF5267E-FE34-4D74-BF2F-3F318E47062A"));
        return;
      } catch (Exception exc) {
        LOGGER.log(Level.FINEST, "testWebLogicRestDelegation failed: " + exc.toString(), exc);
      }
      connectFailed = true;
    }

    private String getAdminServerName() {
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
      if (connectFailed) {
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
          JsonArray items = ResponseHelper.getEntityAsJson(response).getJsonArray("items");
          int numberNeedingRestart = 0;
          for (int i = 0; i < items.size(); i++) {
            boolean serverNeedsRestart = items.getJsonObject(i).getBoolean("restartRequired", false);
            if (serverNeedsRestart) {
              numberNeedingRestart++;
            }
          }
          if (numberNeedingRestart > 0) {
            if (messagesBuilder == null) {
              messagesBuilder = Json.createArrayBuilder();
            }
            messagesBuilder.add(Json.createObjectBuilder()
              .add("severity", "warning")
              .add("messageSummary", ic.getLocalizer().localizeString(
                LocalizedConstants.NEED_SERVER_RESTART_LABEL))
              .add("link", Json.createObjectBuilder()
                .add("label", ic.getLocalizer().localizeString(
                  LocalizedConstants.SERVER_RESTART_LINK_LABEL))
                .add("resourceData", "/api/-current-/" + Root.DOMAIN_RUNTIME_NAME
                  + "/data/DomainRuntime/CombinedServerRuntimes")));
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
      if (connectFailed) {
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
          if (ResponseHelper.getEntityAsJson(response).getBoolean("return")) {
            // There are security warnings
            messagesBuilder.add(Json.createObjectBuilder()
              .add("severity", "error")
              .add("messageSummary", ic.getLocalizer().localizeString(
                LocalizedConstants.HAVE_SECURITY_VALIDATION_WARNINGS_LABEL))
              .add("link", Json.createObjectBuilder()
                .add("label", ic.getLocalizer().localizeString(
                  LocalizedConstants.SECURITY_VALIDATION_WARNINGS_LINK_LABEL))
                .add("resourceData", "/api/-current-/" + Root.DOMAIN_RUNTIME_NAME
                  + "/data/DomainRuntime/DomainSecurityRuntime?slice=SecurityWarnings")));
          }
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
  }

  public static interface LocalConnectionInfoFetcher {
    int fetchTokenTimeoutMins();

    String fetchToken();

    String fetchURL();
  }
}

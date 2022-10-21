// Copyright (c) 2020, 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.common.utils.WebLogicRoles;
import weblogic.remoteconsole.server.ConsoleBackendRuntime;
import weblogic.remoteconsole.server.ConsoleBackendRuntimeConfig;
import weblogic.remoteconsole.server.connection.Connection;
import weblogic.remoteconsole.server.connection.ConnectionManager;
import weblogic.remoteconsole.server.repo.BeanRepo;
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
  private static final long CONNECT_TIMEOUT =
    ConsoleBackendRuntimeConfig.getConnectionTimeout();
  private static final long READ_TIMEOUT =
    ConsoleBackendRuntimeConfig.getReadTimeout();
  private static final boolean DISABLE_HOSTNAME_VERIFICATION =
    ConsoleBackendRuntimeConfig.isHostnameVerificationDisabled();
  private static final Logger LOGGER =
    Logger.getLogger(AdminServerDataProviderImpl.class.getName());

  private String connectionId;
  private String name;
  private String url;
  private String authorizationHeader;
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

  public AdminServerDataProviderImpl(
    String name,
    String url,
    String authorizationHeader
  ) {
    this.name = name;
    this.url = url;
    this.authorizationHeader = authorizationHeader;
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

  @Override
  public String getType() {
    return TYPE_NAME;
  }

  @Override
  public String getURL() {
    return url;
  }

  @Override
  public String getAuthorizationHeader() {
    return authorizationHeader;
  }

  @Override
  public long getConnectTimeout() {
    return CONNECT_TIMEOUT;
  }

  @Override
  public long getReadTimeout() {
    return READ_TIMEOUT;
  }

  @Override
  public boolean isDisableHostnameVerification() {
    return DISABLE_HOSTNAME_VERIFICATION;
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
  public void test(InvocationContext ic) {
    start(ic);
  }

  @Override
  public synchronized boolean start(InvocationContext ic) {
    ic.setProvider(this);
    Connection connection = null;
    if (connectionId == null) {
      ConnectionManager.ConnectionResponse result =
        CONNECTION_MANAGER.tryConnection(url, authorizationHeader, ic.getLocales());
      if (result.isSuccess()) {
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
        Set<String> roles = mbeansVersion.getRoles();
        if (roles.contains(WebLogicRoles.ADMIN) || roles.contains(WebLogicRoles.DEPLOYER)) {
          // Admins and deployers are allowed to edit the configuration
          roots.put(editRoot.getName(), editRoot);
        } else {
          // Other users are not allowed to edit the configuration
        }
        // See if the domain has a version of the remote console rest extension installed that supports security data.
        if (connection.getConsoleExtensionCapabilities().contains("RealmsSecurityData")) {
          // Only admins are allowed to manage the security data.
          if (roles.contains(WebLogicRoles.ADMIN)) {
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
  }

  @Override
  public Map<String, Root> getRoots() {
    return roots;
  }

  @Override
  public JsonObject toJSON(InvocationContext ic) {
    JsonObjectBuilder ret = Json.createObjectBuilder();
    ret.add("name", getName());
    ret.add(ProviderResource.PROVIDER_TYPE, getType());
    ret.add(ProviderResource.DOMAIN_URL, getURL());
    ret.add("connectTimeout", getConnectTimeout());
    ret.add("readTimeout", getReadTimeout());
    ret.add("mode", "standalone");
    ret.add("anyConnectionAttemptSuccessful", isAnyConnectionAttemptSuccessful());
    ret.add("lastConnectionAttemptSuccessful", isLastConnectionAttemptSuccessful());
    Connection connection = null;
    if (isLastConnectionAttemptSuccessful()) {
      ret.add("state", "connected");
      connection = CONNECTION_MANAGER.getConnection(connectionId);
      ret.add("domainVersion", connection.getWebLogicVersion().getDomainVersion());
      ret.add("domainName", connection.getDomainName());
      if (connectionWarning != null) {
        ret.add("connectionWarning", connectionWarning);
      }
    } else {
      ret.add("state", "disconnected");
      if (lastMessage != null) {
        ret.add("messages", createMessages(lastMessage));
      }
    }
    addRootsToJSON(ret, connection, ic);
    addRolesToJSON(ret);
    addLinksToJSON(ret, connection, ic);
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

  private void addLinksToJSON(JsonObjectBuilder jsonBuilder, Connection connection, InvocationContext ic) {
    if (!supportsSecurityValidationWarnings(connection)) {
      return;
    }
    String resourceData =
      "/" + UriUtils.API_URI
      + "/" + StringUtils.urlEncode(getName())
      + "/" + Root.DOMAIN_RUNTIME_NAME
      + "/data/DomainRuntime/DomainSecurityRuntime?slice=SecurityWarnings";
    LocalizableString ls =
      hasSecurityValidationWarnings(connection)
        ? LocalizedConstants.SECURITY_VALIDATION_WARNINGS_WARNING_LINK_LABEL
        : LocalizedConstants.SECURITY_VALIDATION_WARNINGS_INFO_LINK_LABEL;
    String label = ic.getLocalizer().localizeString(ls);
    jsonBuilder.add(
      "links",
      Json.createArrayBuilder().add(
        Json.createObjectBuilder()
          .add("label", label)
          .add("resourceData", resourceData)
      )
    );
  }

  private boolean supportsSecurityValidationWarnings(Connection connection) {
    if (connection == null) {
      return false; // We're not connected yet so can't tell if the domain supports warnings.
    }
    BeanRepo beanRepo = viewRoot.getPageRepo().getBeanRepo();
    BeanTypeDef typeDef = beanRepo.getBeanRepoDef().getTypeDef("DomainSecurityRuntimeMBean");
    if (typeDef == null) {
      return false; // The domain doesn't support security validation warnings.
    }
    Path actionPath = new Path("hasSecurityValidationWarnings");
    if (!typeDef.hasActionDef(actionPath)) {
      return false; // The user isn't allowed to view the warnings.
    }
    return true;
  }

  private boolean hasSecurityValidationWarnings(Connection connection) {
    if (!supportsSecurityValidationWarnings(connection)) {
      return false;
    }
    WebLogicRestRequest request =
      WebLogicRestRequest.builder()
        .connection(connection)
        .path("/domainRuntime/domainSecurityRuntime/hasSecurityValidationWarnings")
        .build();
    JsonObject postData = Json.createObjectBuilder().build();
    try (Response response = WebLogicRestClient.post(request, postData)) {
      if (response.getStatus() == Response.Status.OK.getStatusCode()) {
        return ResponseHelper.getEntityAsJson(response).getBoolean("return");
      } else {
        LOGGER.finest(
          "hasSecurityValidationWarnings failed:"
          + " " + response.getStatus()
          + " " + ResponseHelper.getEntityAsString(response)
        );
      }
    } catch (Exception exc) {
      LOGGER.log(Level.FINEST, "hasSecurityValidationWarnings failed: " + exc.toString(), exc);
    }
    return false;
  }

  @Override
  public boolean isValidPath(String path) {
    return true;
  }
}

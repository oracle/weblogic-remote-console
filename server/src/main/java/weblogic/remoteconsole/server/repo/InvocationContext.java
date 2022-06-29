// Copyright (c) 2020, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.UriInfo;

import weblogic.remoteconsole.common.repodef.Localizer;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.weblogic.WebLogicLocalizationUtils;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.ConsoleBackendRuntime;
import weblogic.remoteconsole.server.connection.Connection;
import weblogic.remoteconsole.server.connection.ConnectionManager;
import weblogic.remoteconsole.server.providers.Provider;
import weblogic.remoteconsole.server.providers.Root;

/**
 * This class holds info needed to process the current REST request
 * <ul>
 *   <li>the connection</li>
 *   <li>the perspective</li>
 *   <li>the client's preferred locale (for i18n)</li>
 * </ul>
 */
public class InvocationContext {
  /** The property name for the Console Backend session id in the ContainerRequestContext */
  public static final String CONSOLE_BACKEND_SESSION_ID = "wls.console.backend.session";

  // the connection to a weblogic domain
  // null if not connected to a domain
  private Connection connection;

  // The client's list of preferred locals (from the request's HTTP headers)
  private List<Locale> locales;

  // manages the pages for this perspective & connection.
  // null if not connected to a domain or the connection doesn't support this perspective
  private PageRepo pageRepo;

  private Provider provider;

  // localizes strings based on the page repo def's resource bundle
  // and the client's preferred language.
  // null if not connected to a domain.
  private Localizer localizer;

  // identifies a bean or a collection of beans
  // used by per-perspective pages that manage beans (e.g. api/configuration/Domain/...)
  // null if not connected to a domain or not a resource that manages beans
  private BeanTreePath beanTreePath;

  // Lists the form/table properties that a GET operation should return.
  // If null, all of the form/table properties are returned.
  // If not, only properties that are on the form/table AND in
  // this list are returned.
  private HashSet<String> properties;

  // Whether a GET needs to refetch the info from the page repo (true)
  // or whether it can use cached results (false)
  private boolean reload;

  // The info about the URI that the caller invoked this request on
  private UriInfo uriInfo;

  private PagePath pagePath;

  public InvocationContext() {
    // Use the default language until we find out what the client wants.
    setLocales(new ArrayList<Locale>());
  }

  public InvocationContext(
    ResourceContext resourceContext,
    HttpHeaders httpHeaders,
    UriInfo uriInfo
  ) {
    setLocales(getLocales(httpHeaders));
    setConnection(getConnection(resourceContext));
    setUriInfo(uriInfo);
    this.uriInfo = uriInfo;
  }

  public InvocationContext(InvocationContext toClone) {
    this.connection = toClone.connection;
    this.locales = toClone.locales;
    this.pageRepo = toClone.pageRepo;
    this.provider = toClone.provider;
    this.localizer = toClone.localizer;
    this.beanTreePath = toClone.beanTreePath;
    this.properties = toClone.properties;
    this.reload = toClone.reload;
    this.uriInfo = toClone.uriInfo;
    this.pagePath = toClone.pagePath;
  }

  public PageRepo getPageRepo() {
    return pageRepo;
  }

  public void setPageRepo(PageRepo pageRepo) {
    this.pageRepo = pageRepo;
    localizer = new Localizer(pageRepo.getPageRepoDef().getResourceBundleName(), locales);
  }

  public boolean setPageRepoByName(String rootName) {
    Root root = provider.getRoots().get(rootName);
    if (root == null) {
      return false;
    }
    setPageRepo(root.getPageRepo());
    return true;
  }

  public Provider getProvider() {
    return provider;
  }

  public void setProvider(Provider provider) {
    this.provider = provider;
  }

  public Localizer getLocalizer() {
    return localizer;
  }

  public BeanTreePath getBeanTreePath() {
    return beanTreePath;
  }

  public void setIdentity(BeanTreePath beanTreePath) {
    this.beanTreePath = beanTreePath;
  }

  public PagePath getPagePath() {
    return pagePath;
  }

  public void setPagePath(PagePath pagePath) {
    this.pagePath = pagePath;
  }

  public boolean filtersProperties() {
    return this.properties != null;
  }

  public boolean includeProperty(String propertyName) {
    if (!filtersProperties()) {
      return true;
    }
    return this.properties.contains(propertyName);
  }

  public void setProperties(String commaSeparatedPropertyNames) {
    if (commaSeparatedPropertyNames == null) {
      this.properties = null;
    } else {
      this.properties = new HashSet<>();
      for (String property : commaSeparatedPropertyNames.split(",")) {
        this.properties.add(property.trim());
      }
    }
  }

  public boolean isReload() {
    return reload;
  }

  public void setReload(boolean reload) {
    this.reload = reload;
  }

  public void setConnection(Connection connection) {
    this.connection = connection;
  }

  public void setLocales(List<Locale> locales) {
    this.locales = locales;
    // Localize using the current weblogic version until we find
    // out the actual domain version.
    this.localizer =
      new Localizer(
        WebLogicLocalizationUtils.getResourceBundleName(
          WebLogicVersions.getCurrentVersion().getDomainVersion()
        ),
        this.locales
    );
  }

  public void setUriInfo(UriInfo uriInfo) {
    this.uriInfo = uriInfo;
  }

  public UriInfo getUriInfo() {
    return uriInfo;
  }

  private String getDomainVersion() {
    return (this.connection != null) ? this.connection.getWebLogicVersion().getDomainVersion() : null;
  }

  public Connection getConnection() {
    return this.connection;
  }

  private static Connection getConnection(ResourceContext resourceContext) {
    String connectionId = getConnectionId(resourceContext);
    if (connectionId == null) {
      // there's no connection
      return null;
    }
    ConnectionManager cm = ConsoleBackendRuntime.INSTANCE.getConnectionManager();
    if (!cm.isValidConnection(connectionId)) {
      throw new AssertionError("Invalid connection id: " + connectionId);
    }
    Connection connection = cm.getConnection(connectionId);
    if (connection == null) {
      throw new AssertionError("Connection not found: " + connectionId);
    }
    return connection;
  }

  private static String getConnectionId(ResourceContext resourceContext) {
    if (ConsoleBackendRuntime.INSTANCE.getMode() == ConsoleBackendRuntime.Mode.CREDENTIALS) {
      return getCredentialsModeConnectionId();
    } else {
      return getStandaloneModeConnectionId(resourceContext);
    }
  }

  private static String getCredentialsModeConnectionId() {
    if (ConsoleBackendRuntime.INSTANCE.getState() == ConsoleBackendRuntime.State.DISCONNECTED) {
      // there is no connection
      return null;
    } else {
      return ConsoleBackendRuntime.INSTANCE.getConnection().getId();
    }
  }

  private static String getStandaloneModeConnectionId(ResourceContext resourceContext) {
    if (resourceContext == null) {
      throw new AssertionError("Null ResourceContext");
    }
    ContainerRequestContext reqCtx = resourceContext.getResource(ContainerRequestContext.class);
    if (reqCtx == null) {
      throw new AssertionError("Null ContainerRequestContext");
    }
    // Look for the Session ID set by CBE ConnectionFilter
    Object id = reqCtx.getProperty(CONSOLE_BACKEND_SESSION_ID);
    if (id == null) {
      throw
        new AssertionError(
          "Null "
          + CONSOLE_BACKEND_SESSION_ID
        );
    }
    if (!(id instanceof String)) {
      throw
        new AssertionError(
          "Non-String "
          + CONSOLE_BACKEND_SESSION_ID
          + " : "
          + id
        );
    }
    return (String) id;
  }

  private static List<Locale> getLocales(HttpHeaders httpHeaders) {
    return (httpHeaders != null) ? httpHeaders.getAcceptableLanguages() : null;
  }

  public List<Locale> getLocales() {
    return locales;
  }

  @Override
  public String toString() {
    String connection = (getConnection() != null) ? getConnection().getId() : "disconnected";
    String domainVersion = getDomainVersion();
    if (domainVersion == null) {
      domainVersion = "unknown";
    }
    Locale locale = (getLocalizer() != null) ? getLocalizer().getLocale() : null;
    return
      "InvocationContext(connection="
        + connection
        + ", domainVersion="
        + domainVersion
        + ", locale="
        + locale
        + ")";
  }
}

// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.logging.Logger;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.HttpHeaders;

import weblogic.console.backend.ConsoleBackendRuntime;
import weblogic.console.backend.connection.Connection;
import weblogic.console.backend.connection.ConnectionManager;
import weblogic.console.backend.filter.ConnectionFilter;
import weblogic.console.backend.pagedesc.Localizer;
import weblogic.console.backend.pagedesc.PagesPath;
import weblogic.console.backend.typedesc.WeblogicBeanIdentity;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;
import weblogic.console.backend.typedesc.WeblogicVersions;
import weblogic.console.backend.utils.StringUtils;

/**
 * Holds info needed to process the current REST request
 * <ul>
 *   <li>the connection</li>
 *   <li>versioned weblogic pages for the connection's wls server's version</li>
 *   <li>the client's preferred locale (for i18n)</li>
 * </ul>
 */
public class InvocationContext {

  private static final Logger LOGGER = Logger.getLogger(InvocationContext.class.getName());

  // the connection to a weblogic domain
  // null if not connected to a domain
  private Connection connection;

  // information about the weblogic pages for that domain's version
  // null if not connected to a domain
  private VersionedWeblogicPages versionedWeblogicPages;

  // localizes strings based on the connection's weblogic version
  // and the client's preferred language.
  // null if not connected to a domain.
  private Localizer localizer;

  public Localizer getLocalizer() {
    return this.localizer;
  }

  // used by per-perspective pages (e.g. api/configuration/..., api/monitoring/...)
  // null if not connected to a domain or not a per-perspective resource
  private PagesPath rootPagesPath;

  public PagesPath getRootPagesPath() {
    return this.rootPagesPath;
  }

  public void setRootPagesPath(PagesPath rootPagesPath) {
    this.rootPagesPath = rootPagesPath;
  }

  // identifies a bean or a collection of beans
  // used by per-perspective pages that manage beans (e.g. api/configuration/Domain/...)
  // null if not connected to a domain or not a resource that manages beans
  private WeblogicBeanIdentity identity;

  public WeblogicBeanIdentity getIdentity() {
    return this.identity;
  }

  public void setIdentity(WeblogicBeanIdentity identity) {
    this.identity = identity;
  }

  // Lists the form/table properties that a GET operation should return.
  // If null, all of the form/table properties are returned.
  // If not, only properties that are on the form/table AND in
  // this list are returned.
  private HashSet<String> properties;

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

  // convenience method:
  public WeblogicBeanTypes getWeblogicBeanTypes() {
    return getVersionedWeblogicPages().getWeblogicBeanTypes();
  }

  public InvocationContext(
    ResourceContext resourceContext,
    HttpHeaders httpHeaders
  ) throws Exception {
    this.connection = getConnection(resourceContext);
    this.versionedWeblogicPages = getVersionedWeblogicPages(getConnection());
    if (getVersionedWeblogicPages() != null) {
      this.localizer =
        new Localizer(
          getVersionedWeblogicPages().getWeblogicVersion(),
          getLocales(httpHeaders)
        );
    }
  }

  public VersionedWeblogicPages getVersionedWeblogicPages() {
    return this.versionedWeblogicPages;
  }

  private static VersionedWeblogicPages getVersionedWeblogicPages(Connection connection) {
    if (connection == null) {
      return null; // since there's no connection, we can figure out the domain's weblogic version
    }
    String domainVersion = connection.getDomainVersion();
    if (StringUtils.isEmpty(domainVersion)) {
      throw new AssertionError("domain version not available for " + connection.getId());
    }
    // Find the version of weblogic that we have pages for
    String weblogicVersion =
      WeblogicVersions.getWeblogicVersion(domainVersion).getDomainVersion();
    return VersionedWeblogicPagesFactory.INSTANCE.getVersionedWeblogicPages(weblogicVersion);
  }

  public Connection getConnection() {
    return this.connection;
  }

  private static Connection getConnection(ResourceContext resourceContext) throws Exception {
    String connectionId = getConnectionId(resourceContext);
    if (connectionId == null) {
      // there's no connection
      return null;
    }
    ConnectionManager cm = ConsoleBackendRuntime.INSTANCE.getConnectionManager();
    if (!cm.isValidConnection(connectionId)) {
      throw new BadRequestException("Invalid connection id: " + connectionId);
    }
    Connection connection = cm.getConnection(connectionId);
    if (connection == null) {
      throw new AssertionError("Connection not found: " + connectionId);
    }
    return connection;
  }

  private static String getConnectionId(ResourceContext resourceContext) throws Exception {
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

  private static String getStandaloneModeConnectionId(
    ResourceContext resourceContext
  ) throws Exception {
    if (resourceContext == null) {
      throw new AssertionError("Null ResourceContext");
    }
    ContainerRequestContext reqCtx = resourceContext.getResource(ContainerRequestContext.class);
    if (reqCtx == null) {
      throw new AssertionError("Null ContainerRequestContext");
    }
    // Look for the Session ID set by CBE ConnectionFilter
    Object id = reqCtx.getProperty(ConnectionFilter.CONSOLE_BACKEND_SESSION_ID);
    if (id == null) {
      throw
        new BadRequestException(
          "Null "
          + ConnectionFilter.CONSOLE_BACKEND_SESSION_ID
        );
    }
    if (!(id instanceof String)) {
      throw
        new BadRequestException(
          "Non-String "
          + ConnectionFilter.CONSOLE_BACKEND_SESSION_ID
          + " : "
          + id
        );
    }
    return (String) id;
  }

  private static List<Locale> getLocales(HttpHeaders httpHeaders) {
    return (httpHeaders != null) ? httpHeaders.getAcceptableLanguages() : null;
  }

  @Override
  public String toString() {
    String connection = (getConnection() != null) ? getConnection().getId() : "disconnected";
    String weblogicVersion =
      (getVersionedWeblogicPages() != null)
      ? getVersionedWeblogicPages().getWeblogicVersion()
      : "unknown";
    Locale locale = (getLocalizer() != null) ? getLocalizer().getLocale() : null;
    StringBuilder sb = new StringBuilder();
    return
      "InvocationContext(connection="
        + connection
        + ", weblogicVersion="
        + weblogicVersion
        + ", identity="
        + getIdentity()
        + ", locale="
        + locale
        + ")";
  }
}

// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import javax.ws.rs.Path;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import weblogic.remoteconsole.server.providers.Root;
import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * This class is the console's root JAXRS resource. All resources are children of this resource.
 * <p>
 * This resource, and all its children, are request scoped.
 * <p>
 * They all reference a request-specific InvocationContext instance that holds information that
 * is needed to process this request:
 * <ul>
 *   <li>the connection (to a weblogic domain)</li>
 *   <li>the locale (the client's preferred language, used for i18n)</li>
 *   <li>the set of pages for this domain's version and the preferred locale</li>
 * </ul>
 */
@Path(UriUtils.API_URI)
public class RemoteConsoleResource extends BaseResource {
  public static final String ABOUT_PATH = "about";
  public static final String GROUP_PATH = "group";
  public static final String PROJECT_PATH = "project";
  public static final String BOOKMARKS_PATH = "bookmarks";
  public static final String HISTORY_PATH = "history";
  public static final String LOGOUT_PATH = "logout";
  public static final String SSO_TOKEN_PATH = "token";
  public static final String EVENT_PATH = "events";
  public static final String STATUS_PATH = "status";
  private static final Set<String> reserved = new HashSet<>(
    Arrays.asList(ABOUT_PATH, GROUP_PATH, PROJECT_PATH, BOOKMARKS_PATH,
      EVENT_PATH, HISTORY_PATH, LOGOUT_PATH, SSO_TOKEN_PATH,
      STATUS_PATH));

  @Context ResourceContext resourceContext;
  @Context HttpHeaders headers;
  @Context UriInfo uriInfo;

  @Path(LOGOUT_PATH)
  public LogoutResource getLogoutResource() {
    return new LogoutResource();
  }

  @Path(PROJECT_PATH)
  public ProjectResource getProjectResource() {
    return new ProjectResource();
  }

  @Path(EVENT_PATH)
  public EventResource getEventResource() {
    return new EventResource();
  }

  @Path(ABOUT_PATH)
  public AboutResource getAboutResource() {
    return new AboutResource();
  }

  @Path(STATUS_PATH)
  public StatusResource getStatusResource() {
    return new StatusResource();
  }

  @Path(GROUP_PATH)
  public GroupResource getGroupResourceNew() {
    return new GroupResource();
  }

  @Path(BOOKMARKS_PATH)
  public BookmarksResource getBookmarksResourceNew() {
    return new BookmarksResource();
  }

  @Path(HISTORY_PATH)
  public HistoryResource getHistory() {
    return new HistoryResource();
  }

  @Path(SSO_TOKEN_PATH)
  public SsoTokenResource getSsoTokenResource() {
    return new SsoTokenResource();
  }

  @Path(Root.EDIT_NAME)
  public PageRepoResource getWebLogicRestEditTreeConfigurationResource() {
    if (!getInvocationContext().setPageRepoByName(Root.EDIT_NAME)) {
      throw new FailedRequestException(
        Status.NOT_FOUND.getStatusCode(),
        "There is no " + Root.EDIT_NAME + " in "
          + getInvocationContext().getProvider().getName()
      );
    }
    updateLastRootUsed(Root.EDIT_NAME);
    return copyContext(new PageRepoResource());
  }

  @Path(Root.COMPOSITE_CONFIGURATION_NAME)
  public PageRepoResource getWDTCompositeConfigurationResource() {
    if (!getInvocationContext().setPageRepoByName(Root.COMPOSITE_CONFIGURATION_NAME)) {
      throw new FailedRequestException(
        Status.NOT_FOUND.getStatusCode(),
        "There is no " + Root.COMPOSITE_CONFIGURATION_NAME + " in "
          + getInvocationContext().getProvider().getName()
      );
    }
    return copyContext(new PageRepoResource());
  }

  @Path(Root.PROPERTY_LIST_CONFIGURATION_NAME)
  public BaseResource getPropertyListConfigurationResource() {
    return copyContext(new PropertyListPageRepoResource());
  }

  @Path(Root.SERVER_CONFIGURATION_NAME)
  public PageRepoResource getWebLogicRestRuntimeTreeConfigurationResource() {
    if (!getInvocationContext().setPageRepoByName(Root.SERVER_CONFIGURATION_NAME)) {
      throw new FailedRequestException(
        Status.NOT_FOUND.getStatusCode(),
        "There is no " + Root.SERVER_CONFIGURATION_NAME + " in "
          + getInvocationContext().getProvider().getName()
      );
    }
    updateLastRootUsed(Root.SERVER_CONFIGURATION_NAME);
    return copyContext(new PageRepoResource());
  }

  @Path(Root.SECURITY_DATA_NAME)
  public PageRepoResource getWebLogicRestSecurityDataResource() {
    if (!getInvocationContext().setPageRepoByName(Root.SECURITY_DATA_NAME)) {
      throw new FailedRequestException(
        Status.NOT_FOUND.getStatusCode(),
        "There is no " + Root.SECURITY_DATA_NAME + " in "
          + getInvocationContext().getProvider().getName()
      );
    }
    updateLastRootUsed(Root.SECURITY_DATA_NAME);
    return copyContext(new PageRepoResource());
  }

  @Path(Root.DOMAIN_RUNTIME_NAME)
  public PageRepoResource getWebLogicRestRuntimeTreeMonitoringResource() {
    if (!getInvocationContext().setPageRepoByName(Root.DOMAIN_RUNTIME_NAME)) {
      throw new FailedRequestException(
        Status.NOT_FOUND.getStatusCode(),
        "There is no " + Root.DOMAIN_RUNTIME_NAME + " in "
          + getInvocationContext().getProvider().getName()
      );
    }
    updateLastRootUsed(Root.DOMAIN_RUNTIME_NAME);
    return copyContext(new WebLogicRestRuntimeTreeMonitoringResource());
  }

  /**
   * Ideally, we'd initialize the invocation context in the constructor. But we need
   * the resource context and headers to do that, and they're injected after the constructor.
   * <p>
   * So, initialize the invocation context the first time someone tries to get it.
   * Unfortunately, this forces us to use synchronization.
   */
  @Override
  protected synchronized InvocationContext getInvocationContext() {
    InvocationContext ret = super.getInvocationContext();
    if (ret != null) {
      return ret;
    }
    ret = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    if (ret == null) {
      ret = new InvocationContext(resourceContext, headers, uriInfo);
    }
    synchronized (this) {
      setInvocationContext(ret);
    }
    return ret;
  }

  private void updateLastRootUsed(String root) {
    getInvocationContext().getProvider().updateLastRootUsed(root);
  }

  public static boolean isReserved(String string) {
    return reserved.contains(string);
  }
}

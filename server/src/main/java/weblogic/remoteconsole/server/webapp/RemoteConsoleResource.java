// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

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
  public static final String PROVIDER_MANAGEMENT_PATH = "providers";
  public static final String ABOUT_PATH = "about";

  @Context ResourceContext resourceContext;
  @Context HttpHeaders headers;
  @Context UriInfo uriInfo;

  @Path(ABOUT_PATH)
  public AboutResource getAboutResourceNew() {
    return new AboutResource();
  }

  @Path(PROVIDER_MANAGEMENT_PATH)
  public ProviderResource getProviderResource() {
    return new ProviderResource();
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
    return copyContext(new PageRepoResource());
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
}

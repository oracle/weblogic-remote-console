// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.PathSegment;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.providers.Root;
import weblogic.remoteconsole.server.repo.BeanRepo;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.DownloadBeanRepo;
import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * Top level JAXRS resource for a page repo of a provider.
 */
public class PageRepoResource extends BaseResource {
  private static final Logger LOGGER = Logger.getLogger(PageRepoResource.class.getName());

  /**
   * Computes the identity of the bean, or collection of beans, for this
   * request from the URL's path segments and stores it in this request's
   * invocation context.
   */
  protected void setBeanTreePath(List<PathSegment> pathSegments) {
    getInvocationContext().setIdentity(
      BeanTreePath.create(
        getInvocationContext().getPageRepo().getBeanRepo(),
        getPathFromPathSegments(pathSegments)
      )
    );
  }

  // Get the JAXRS resource for a bean, or collection of beans, in the page repo.
  @Path("data/{pathSegments: .+}")
  public Object getDataResource(
    @PathParam("pathSegments") List<PathSegment> pathSegments,
    @QueryParam("properties") String properties
  ) {
    getInvocationContext().setProperties(properties);
    setBeanTreePath(pathSegments);
    if (getInvocationContext().getBeanTreePath() == null) {
      // not found because the path is referring to a bean child (v.s. instance) that doesn't exist
      // e.g. Domain/Clocks/MyClock where DomainMBean doesn't have a Clocks collection.
      return null;
    }
    BaseResource resource = createCustomResource();
    if (resource == null) {
      resource = createStandardResource();
    }
    return copyContext(resource);
  }

  private BaseResource createCustomResource() {
    String methodName =
      getInvocationContext().getBeanTreePath().getTypeDef().getCreateResourceMethod();
    if (StringUtils.isEmpty(methodName)) {
      return null;
    }
    Method method = CustomizerInvocationUtils.getMethod(methodName);
    CustomizerInvocationUtils.checkSignature(method, BaseResource.class, InvocationContext.class);
    List<Object> args = new ArrayList<>();
    args.add(getInvocationContext());
    Object resourceAsObject = CustomizerInvocationUtils.invokeMethod(method, args);
    return (BaseResource)resourceAsObject;
  }

  private BaseResource createStandardResource() {
    BeanTreePath beanTreePath = getInvocationContext().getBeanTreePath();
    if (beanTreePath.isCollection()) {
      if (beanTreePath.isCreatable()) {
        return new CreatableBeanCollectionResource();
      } else {
        return new ReadOnlyBeanCollectionResource();
      }
    } else if (beanTreePath.isCollectionChild()) {
      if (beanTreePath.isDeletable()) {
        return new DeletableCollectionChildBeanResource();
      } else if (beanTreePath.isEditable()) {
        return new EditableCollectionChildBeanResource();
      } else {
        return new ReadOnlyCollectionChildBeanResource();
      }
    } else if (beanTreePath.isOptionalSingleton()) {
      if (beanTreePath.isCreatable()) {
        return new CreatableOptionalSingletonBeanResource();
      } else if (beanTreePath.isEditable()) {
        return new EditableOptionalSingletonBeanResource();
      } else {
        return new ReadOnlyOptionalSingletonBeanResource();
      }
    } else if (beanTreePath.isMandatorySingleton()) {
      if (beanTreePath.isEditable()) {
        return new EditableMandatorySingletonBeanResource();
      } else {
        return new ReadOnlyMandatorySingletonBeanResource();
      }
    } else {
      throw new AssertionError("Not a collection, optional singleton or mandatory singleton: " + beanTreePath);
    }
  }

  // Get the JAXRS resource that describes the pages in the page repo.
  @Path("pages")
  public Object getPagesResource() {
    return copyContext(new PageDescriptionsResource());
  }

  // Get the JAXRS resource that returns the nav tree contents for the beans in the page repo.
  @Path(Root.NAV_TREE_RESOURCE)
  public Object getNavTreeResource() {
    return copyContext(new NavTreeResource());
  }

  @Path("search")
  public Object getSearchResource() {
    return copyContext(new SearchResource());
  }

  @Path(Root.SIMPLE_SEARCH_RESOURCE)
  public Object getSimpleSearchResource() {
    return copyContext(new SimpleSearchResource());
  }

  // Get the JAXRS resource for the page repo's change manager.
  @Path(Root.CHANGE_MANAGER_RESOURCE)
  public Object getChangeManagerResource() {
    if (!getInvocationContext().getPageRepo().supportsChangeManager()) {
      LOGGER.info(
        "BAD REQUEST: tried to get a change manager for a repo without one");
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(),
          "There is no change manager support for this type of repository"
      ).build());

    }
    return copyContext(new ChangeManagerResource());
  }

  // Get the JAXRS resource for downloading the contents of the page repo.
  @Path(Root.DOWNLOAD_RESOURCE)
  public Object getDownloadResource() {
    BeanRepo beanRepo = getInvocationContext().getPageRepo().getBeanRepo();
    if (!(beanRepo instanceof DownloadBeanRepo)) {
      LOGGER.info(
        "BAD REQUEST: BeanRepo does not support download");
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(),
          "There is no download support for this type of repository"
      ).build());
    }
    return copyContext(new DownloadResource());
  }
}

// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.ws.rs.core.PathSegment;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * Base class for all console JAXRS resources.
 *
 * <p>It manages the InvocationContext for the request.
 */
public abstract class BaseResource {
  private InvocationContext invocationContext;

  protected InvocationContext getInvocationContext() {
    return this.invocationContext;
  }

  protected void setInvocationContext(InvocationContext invocationContext) {
    this.invocationContext = invocationContext;
  }

  // Normally this would be done via a constructor,
  // but I was trying to find a syntax that requires
  // minimal code.
  //
  // Here's the pattern for how child resources are created:
  //
  // class ParentResource extends BaseResource {
  //   @Path("child")
  //   ChildResource getChild() { return copyContext(new ChildResource()); }
  // }
  //
  // classs ChildResource extends BaseResource {
  //   @GET
  //   Response get(...) { ... use getInvocationContext() ... }
  // }
  //
  // Note: JAXRS only injects into member variables of instances
  // it directly creates, v.s. ones created by resources.
  //
  // The pattern we'll use is that ConsoleResource is the root
  // resource that gets instantiated directly by JAXRS (per request).
  //
  // It will have JAXRS inject the ResourceContext and HttpHeader
  // into member variables so that it can figure out the connection and locale.
  // Then it will use them to construct an InvocationContext for the request.
  //
  // It will have @Path annotated methods to create the next level of
  // resources, and as it creates each one, it call copyContext
  // to copy the invocation context to the new child resource.
  // And, when those resources need to create child resources,
  // they'll use the same pattern to copy the request's
  // invocation context down so that its available to
  // the leaf resource with the actual GET, POST, DELETE methods
  // that need it.
  protected <T extends BaseResource> T copyContext(T newResource) {
    newResource.setInvocationContext(getInvocationContext());
    return newResource;
  }

  // Convert a JAXRS path into a Path instance since all of the
  // utilities to deal with pages use Path instances.
  protected Path getPathFromPathSegments(List<PathSegment> pathSegments) {
    Path path = new Path();
    for (PathSegment pathSegment : pathSegments) {
      path.addComponent(pathSegment.getPath());
    }
    return path;
  }
}

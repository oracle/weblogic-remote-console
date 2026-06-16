// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.filter;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.ws.rs.HttpMethod;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.PathSegment;

import weblogic.remoteconsole.server.providers.Root;
import weblogic.remoteconsole.server.webapp.RemoteConsoleResource;
import weblogic.remoteconsole.server.webapp.UriUtils;

class SessionRequestGuard {
  private static final String SEARCH_RESOURCE = "search";
  private static final Set<String> READ_STYLE_POST_RESOURCES =
    Set.of(Root.NAV_TREE_RESOURCE, SEARCH_RESOURCE, Root.SIMPLE_SEARCH_RESOURCE);

  private SessionRequestGuard() {
  }

  static boolean requiresExistingFrontend(ContainerRequestContext reqContext) {
    return requiresExistingFrontend(
      reqContext.getMethod(),
      getPathSegmentStrings(reqContext.getUriInfo().getPathSegments(false))
    );
  }

  static boolean requiresExistingFrontend(String method, List<String> pathSegments) {
    if (!isStateChangingMethod(method)) {
      return false;
    }
    if (HttpMethod.POST.equals(method) && isReadStylePost(pathSegments)) {
      return false;
    }
    return true;
  }

  private static boolean isStateChangingMethod(String method) {
    return HttpMethod.POST.equals(method)
      || HttpMethod.PUT.equals(method)
      || HttpMethod.DELETE.equals(method)
      || "PATCH".equals(method);
  }

  private static boolean isReadStylePost(List<String> pathSegments) {
    if (pathSegments == null) {
      return false;
    }
    if (pathSegments.size() == 3) {
      return UriUtils.API_URI.equals(pathSegments.get(0))
        && RemoteConsoleResource.PROJECT_PATH.equals(pathSegments.get(1))
        && Root.NAV_TREE_RESOURCE.equals(pathSegments.get(2));
    }
    if (pathSegments.size() == 4) {
      return UriUtils.API_URI.equals(pathSegments.get(0))
        && !RemoteConsoleResource.PROJECT_PATH.equals(pathSegments.get(1))
        && READ_STYLE_POST_RESOURCES.contains(pathSegments.get(3));
    }
    return false;
  }

  private static List<String> getPathSegmentStrings(List<PathSegment> pathSegments) {
    List<String> result = new ArrayList<>();
    for (PathSegment segment : pathSegments) {
      result.add(segment.getPath());
    }
    return result;
  }
}

// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * Utilities to help construct remote console backend relative URIs.
 */
public class UriUtils {

  public static final String API_URI = "api";

  private UriUtils() {
  }

  public static String getBackendRelativeUri(InvocationContext invocationContext, Path connectionRelativePath) {
    return "/" + getBackendRelativePath(invocationContext, connectionRelativePath).getRelativeUri();
  }

  private static Path getBackendRelativePath(InvocationContext invocationContext, Path connectionRelativePath) {
    Path path = new Path();
    path.addComponent(API_URI);
    path.addComponent(StringUtils.urlEncode(invocationContext.getProvider().getName()));
    path.addPath(connectionRelativePath);
    return path;
  }
}

// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import weblogic.remoteconsole.common.repodef.PagePath;
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

  public static String getBackendRelativePDJUri(InvocationContext ic, PagePath pagePath) {
    Path connectionRelativePath = new Path();
    String pageRepoName = ic.getPageRepo().getPageRepoDef().getName();
    connectionRelativePath.addComponent(pageRepoName);
    connectionRelativePath.addComponent("pages");
    return getBackendRelativeUri(ic, connectionRelativePath) + "/" + pagePath.getPDJUri();
  }

  public static String getBackendRelativeUri(InvocationContext ic, Path connectionRelativePath) {
    return "/" + getBackendRelativePath(ic, connectionRelativePath).getRelativeUri();
  }

  private static Path getBackendRelativePath(InvocationContext ic, Path connectionRelativePath) {
    Path path = new Path();
    path.addComponent(API_URI);
    path.addComponent(StringUtils.urlEncode(ic.getProvider().getName()));
    path.addPath(connectionRelativePath);
    return path;
  }
}
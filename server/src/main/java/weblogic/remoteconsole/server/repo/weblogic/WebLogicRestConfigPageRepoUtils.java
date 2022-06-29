// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.providers.Root;
import weblogic.remoteconsole.server.repo.BeanTreePathSegment;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Link;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Utilities shared by the pages for the WebLogic Rest edit and server config pages.
 */
public class WebLogicRestConfigPageRepoUtils {

  // Add a link from this bean (or collection of beans) it its parallel bean/collection
  // in the other config tree
  // e.g. edit/Servers/Server1 -> serverConfig/Servers/Server1
  // e.g. serverConfig/Servers -> edit/Servers
  public static Response<Page> addConfigLink(
    String rootName,
    InvocationContext ic,
    Response<Page> response
  ) {
    if (response.isSuccess()) {
      addConfigLink(rootName, ic, response.getResults());
    }
    return response;
  }

  private static void addConfigLink(
    String rootName,
    InvocationContext ic,
    Page page
  ) {
    if (ic.getPagePath().isCreateFormPagePath()) {
      // Don't add the config link to create forms
      return;
    }
    // How should we weed out non-mbean types?
    if ("RecentSearchMBean".equals(ic.getBeanTreePath().getTypeDef().getTypeName())) {
      // Don't add the config link for non-mbean types
      return;
    }
    Root root = ic.getProvider().getRoots().get(rootName);
    if (root == null) {
      // Don't add the config link if the root doesn't exist.
      // For example, an operator or monitoring user can't see the edit tree
      // so don't add the link from the server config tree to the edit tree.
      return;
    }
    Path resourceData = new Path(root.getName());
    resourceData.addComponent("data");
    resourceData.addPath(ic.getBeanTreePath().getPath());
    String label =
      getLastBreadCrumbLabel(ic)
      + " - "
      + ic.getLocalizer().localizeString(root.getLabel());
    Link link = new Link();
    link.setResourceData(resourceData);
    link.setLabel(label);
    page.getLinks().add(0, link);
  }

  private static String getLastBreadCrumbLabel(InvocationContext ic) {
    BeanTreePathSegment lastSegment = ic.getBeanTreePath().getLastSegment();
    BeanChildDef childDef = lastSegment.getChildDef();
    if (childDef.isCollection() && lastSegment.isKeySet()) {
      return lastSegment.getKey();
    } else {
      return ic.getLocalizer().localizeString(childDef.getLabel());
    }
  }
}

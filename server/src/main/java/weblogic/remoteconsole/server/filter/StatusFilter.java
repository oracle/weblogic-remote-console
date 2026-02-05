// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.filter;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.PathSegment;
import javax.ws.rs.ext.Provider;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.server.HistoryManager;
import weblogic.remoteconsole.server.providers.ProjectManager;
import weblogic.remoteconsole.server.repo.Frontend;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.NavTreePath;
import weblogic.remoteconsole.server.repo.NavTreePathSegment;
import weblogic.remoteconsole.server.webapp.RemoteConsoleResource;
import weblogic.remoteconsole.server.webapp.WebAppUtils;

@Provider
public class StatusFilter implements ContainerResponseFilter {
  @Context ResourceContext resourceContext;

  @Override
  public void filter(
    ContainerRequestContext reqContext,
    ContainerResponseContext responseContext) throws IOException {
    List<PathSegment> segs = reqContext.getUriInfo().getPathSegments(false);
    if ((segs.size() < 1) || !segs.get(0).getPath().equals("api")) {
      return;
    }
    if ((segs.size() >= 2) && segs.get(1).getPath().equals("events")) {
      return;
    }
    if (!responseContext.hasEntity()
      || !(responseContext.getEntity() instanceof JsonObject)) {
      return;
    }
    JsonObject orig = (JsonObject) responseContext.getEntity();
    ProjectManager projManager = ProjectManager.getFromContext(resourceContext);
    if (projManager == null) {
      return;
    }
    weblogic.remoteconsole.server.providers.Provider prov =
      projManager.getCurrentLiveProvider();
    // DO THIS BETTER This is a bit of a kludge for now.  Since we are
    // still supporting the old protocol, we're not going to rework the old
    // way of getting change manager status.  For now, we'll just snoop on
    // our own data and store it.
    if (orig.containsKey("changeManager")) {
      JsonObject changeManagerInfo = orig.getJsonObject("changeManager");
      boolean full = false;
      if (changeManagerInfo.containsKey("hasChanges")) {
        if (changeManagerInfo.getBoolean("hasChanges")) {
          full = true;
        }
      }
      prov.setIsShoppingCartEmpty(!full);
    }
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    JsonObject providerStatus = projManager.getProviderStatus(ic);

    JsonObjectBuilder statusBuilder = Json.createObjectBuilder()
      .add("shoppingcart", projManager.getShoppingCartStatus(ic))
      .add("providers", providerStatus);

    JsonObjectBuilder contextBuilder = null;
    List<String> contexts = reqContext.getUriInfo().getQueryParameters().get("context");

    JsonObjectBuilder builder = Json.createObjectBuilder(orig);
    // Is it an RDJ?
    if (orig.containsKey("breadCrumbs") && orig.containsKey("self")) {
      JsonArray breadCrumbs = enhanceBreadCrumbs(ic, orig);
      builder.add("breadCrumbs", breadCrumbs);
      if (contexts != null) {
        for (String context : contexts) {
          if (contextBuilder == null) {
            contextBuilder = Json.createObjectBuilder(ic.getFrontend().getContexts());
          }
          JsonObjectBuilder thisContext = Json.createObjectBuilder();
          thisContext.add("navigation", orig.getString("navigation"));
          thisContext.add("currentProvider", providerStatus.getJsonObject("current"));
          thisContext.add("shoppingcart", projManager.getShoppingCartStatus(ic));
          JsonObject self = orig.getJsonObject("self");
          if (self.containsKey("resourceData")) {
            Frontend frontend = ic.getFrontend();
            thisContext.add("isBookmarked",
              frontend.getBookmarkManager().check(ic, self.getString("resourceData")));
            HistoryManager.BackAndForward backAndForward =
              frontend.getHistoryManager().record(
                ic,
                addBreadCrumbsToString(self.getString("label"), breadCrumbs),
                self.getString("resourceData"),
                reqContext.getUriInfo());
            if (backAndForward.getBack() != null) {
              thisContext.add("back-resource-data", backAndForward.getBack());
            }
            if (backAndForward.getForward() != null) {
              thisContext.add("forward-resource-data", backAndForward.getForward());
            }
          }
          contextBuilder.add(context, thisContext);
        }
        ic.getFrontend().setContexts(contextBuilder.build());
      }
    }
    statusBuilder.add("contexts", ic.getFrontend().getContexts());
    builder.add("statusData", statusBuilder);
    JsonObject ret = builder.build();
    responseContext.setEntity(ret);
  }

  private static String addBreadCrumbsToString(String base, JsonArray breadCrumbs) {
    // Skip the provider name
    String ret = null;
    for (int i = 1; i < breadCrumbs.size(); i++) {
      String label = breadCrumbs.getJsonObject(i).getString("label");
      if (ret != null) {
        ret += " / " + label;
      } else {
        ret = label;
      }
    }
    if (ret != null) {
      ret = ret + " / " + base;
    } else {
      ret = base;
    }
    return ret;
  }

  // Okay, walk through the navigation and whatever is missing from
  // the breadcrumbs, fill them in with shoWlist, with a param that
  // says the path
  private static JsonArray enhanceBreadCrumbs(
    InvocationContext ic,
    JsonObject orig) {
    weblogic.remoteconsole.server.providers.Provider prov =
      ic.getProjectManager().getCurrentLiveProvider();
    JsonArray origBreadCrumbs = orig.getJsonArray("breadCrumbs");
    if (prov.getRoots().size() == 0) {
      return origBreadCrumbs;
    }
    // If the breadcrumbs already have the provider, then they don't need
    // enhancement
    if ((origBreadCrumbs.size() > 0)
      && origBreadCrumbs.getJsonObject(0).getString("label").equals(prov.getName())) {
      return origBreadCrumbs;
    }
    if (!orig.containsKey("self")
      || !orig.getJsonObject("self").containsKey("resourceData")) {
      return origBreadCrumbs;
    }
    String[] splitSelf =
      orig.getJsonObject("self").getString("resourceData").split("/");
    if (RemoteConsoleResource.isReserved(splitSelf[2])) {
      return origBreadCrumbs;
    }
    String rootName = splitSelf[3];
    boolean isRoot = false;
    if (rootName.equals("group")) {
      // This is the null case.  We are the root of the provider, which means
      // that there really are no breadcrums to add.
      if (splitSelf.length == 4) {
        return origBreadCrumbs;
      }
      rootName = splitSelf[4];
      isRoot = (splitSelf.length == 5);
    }
    if (!prov.getRoots().containsKey(rootName)) {
      return origBreadCrumbs;
    }
    JsonArrayBuilder ret = Json.createArrayBuilder();
    // We are trying to put in a breadcrumb for the provider (to select a
    // tree) and for the current tree.  But if there is only one tree, just
    // have the provider one refer to what the only tree points to.
    if (prov.getRoots().size() == 1) {
      if (!isRoot) {
        // Skip right to the tree
        ret.add(Json.createObjectBuilder()
          .add("label", prov.getName())
          .add("resourceData", 
              "/api/-current-/group"));
      }
    } else {
      ret.add(Json.createObjectBuilder()
        .add("label", prov.getName())
        .add("resourceData", 
            "/api/-current-/group"));
      // Now, add a breadcrumb for the root, unless we are the root
      if (!isRoot) {
        ret.add(Json.createObjectBuilder()
          .add("label", ic.getLocalizer().localizeString(
            prov.getRoots().get(rootName).getLabel()))
          .add("resourceData", 
              "/api/-current-/group"
            + "/" + rootName));
      }
    }
    // Now we have to insert group nodes in the breadcrumbs.  So, we walk
    // through the navigation path and see where there are elements that are
    // missing from the existing breadcrumbs and create a group breadcrumb for
    // it.
    String[] navParts = orig.getString("navigation").split("/");
    Path path = new Path();
    Path decodedPath = new Path();
    int curCrumbRead = 0;
    // We use length - 1 because the last part of the navigation is not
    // part of breadcrumbs, but the object itself
    for (int i = 0; i < navParts.length - 1; i++) {
      path.addComponents(navParts[i]);
      decodedPath.addComponents(URLDecoder.decode(navParts[i], StandardCharsets.UTF_8));
      boolean found = false;
      for (int walk = curCrumbRead; walk < origBreadCrumbs.size(); walk++) {
        String tryRDJ =
          origBreadCrumbs.getJsonObject(walk).getString("resourceData");
        if (tryRDJ.endsWith('/' + navParts[i])) {
          curCrumbRead = walk + 1;
          ret.add(origBreadCrumbs.getJsonObject(walk));
          found = true;
          break;
        }
      }
      if (found) {
        continue;
      }
      NavTreePath fullNavTreePath = new NavTreePath(ic.getPageRepo(), decodedPath);
      NavTreePathSegment segment = fullNavTreePath.getLastSegment();
      LocalizableString labelLocalizable = segment.getNavTreeNodeDef().getLabel();
      String label = ic.getLocalizer().localizeString(labelLocalizable);
      ret.add(Json.createObjectBuilder()
        .add("label", label)
        .add("resourceData", "/api/-current-/group/" + rootName
          + '/' + path.getSlashSeparatedPath()));
    }
    return ret.build();
  }
}

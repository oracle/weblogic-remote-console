// Copyright (c) 2020, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.LinkedList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.PathSegment;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.NavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.yaml.BaseBeanTypeDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.HelpHTMLUtils;
import weblogic.remoteconsole.server.providers.Provider;
import weblogic.remoteconsole.server.providers.Root;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.NavTreeNode;
import weblogic.remoteconsole.server.repo.ResponseException;
import weblogic.remoteconsole.server.webapp.project.ProviderTable;

public class GroupResource {
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/{pathSegments: .*}")
  public Response getList(
    @Context ResourceContext resContext,
    @PathParam("pathSegments") List<PathSegment> pathSegments) {
    // Things can disappear, due to WebLogic Server failure.  Just return a 503
    try {
      List<String> segs = new LinkedList<>();
      for (PathSegment in : pathSegments) {
        segs.add(in.getPath());
      }
      return getListFromStrings(resContext, segs);
    } catch (ResponseException e) {
      throw new WebApplicationException(Response.status(
        Status.SERVICE_UNAVAILABLE.getStatusCode(),
         e.getMessage()).build());
    }
  }

  public Response getListFromStrings(ResourceContext resContext, List<String> segs) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    List<NavTreeNode> parentPath = new LinkedList<>();
    List<NavTreeNode> result = getParentsAndChildrenFromPath(ic, segs, parentPath);
    NavTreeNode me = null;
    String myLabel = null;
    if (parentPath.size() > 0) {
      me = parentPath.get(parentPath.size() - 1);
      myLabel = me.getLabel();
    } else {
      if (ic.getProvider().getRoots().size() == 1) {
        myLabel = ic.getProvider().getName();
      } else {
        myLabel = ic.getLocalizer().localizeString(
          ic.getProvider().getRoots().get(segs.get(0)).getLabel());
      }
    }
    ic.getProvider().updateLastRootUsed(segs.get(0));
    String path = null;
    for (String seg : segs) {
      if (path == null) {
        path = seg;
      } else {
        path += '/' + seg;
      }
    }
    JsonArrayBuilder dataBuilder = Json.createArrayBuilder();
    for (NavTreeNode node : result) {
      String label = node.getLabel();
      String resourceData;
      if (node.getResourceData() != null) {
        resourceData = "/api/-current-"
          + '/' + segs.get(0)
          + "/data/" + node.getResourceData().getPath().getSlashSeparatedPath();
      } else {
        resourceData = "/api/-current-/group"
          + "/" + path
          + "/" + node.getName();
      }
      dataBuilder.add(Json.createObjectBuilder()
        .add("type", node.getType().toString())
        .add("label", label)
        .add("description", getDescription(ic, node))
        .add("resourceData", Json.createObjectBuilder()
          .add("label", label)
          .add("resourceData", resourceData)));
    }
    builder.add("data", dataBuilder);

    builder.add("self", Json.createObjectBuilder()
      .add("kind", "list")
      .add("label", myLabel)
      .add("resourceData",
        "/api/-current-/group/" + path));
    int slash = path.indexOf('/');
    if (slash == -1) {
      builder.add("navigation", "");
    } else {
      builder.add("navigation", path.substring(slash + 1));
    }
    JsonArrayBuilder breadCrumbs = Json.createArrayBuilder();
    String buildPath = segs.get(0);
    int pathIndex = 1;
    for (NavTreeNode node : parentPath) {
      buildPath += "/" + segs.get(pathIndex++);
      if (node == me) {
        break;
      }
      String resourceData;
      if (node.getResourceData() != null) {
        resourceData = "/api/-current-"
          + '/' + segs.get(0)
          + "/data/" + node.getResourceData().getPath().getSlashSeparatedPath();
      } else {
        resourceData = "/api/-current-/group/" + buildPath;
      }
      breadCrumbs.add(Json.createObjectBuilder()
        .add("label", node.getLabel())
        .add("resourceData", resourceData));
    }
    builder.add("breadCrumbs", breadCrumbs);
    builder.add("inlinePageDescription", Json.createObjectBuilder()
      .add("presentationHint", "cards"));
    return
      WebAppUtils.addCookieFromContext(resContext,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }

  private static String getDescription(InvocationContext ic, NavTreeNode node) {
    if (node.getNavTreePath() == null) {
      return "";
    }
    NavTreeNodeDef navTreeNodeDef =
      node.getNavTreePath().getLastSegment().getNavTreeNodeDef();
      
    String ret;
    if (navTreeNodeDef.isGroupNodeDef()) {
      LocalizableString groupDescription = navTreeNodeDef.asGroupNodeDef().getDescription();
      ret = ic.getLocalizer().localizeString(groupDescription);
    } else {
      BeanChildDef childDef = navTreeNodeDef.asChildNodeDef().getLastChildDef();
      BeanTypeDef childTypeDef = childDef.getChildTypeDef();
      LocalizableString typeDescription =
        ((BaseBeanTypeDefImpl)childTypeDef).getDescriptionHTML();
      ret = ic.getLocalizer().localizeString(typeDescription);
    }
    return HelpHTMLUtils.getSummary(ret);
  }

  // Return the children and build up the parentList
  private static List<NavTreeNode> getParentsAndChildrenFromPath(
    InvocationContext ic,
    List<String> path,
    List<NavTreeNode> parentPath) {
    ic.setPageRepoByName(path.get(0));
    JsonObjectBuilder build = Json.createObjectBuilder();
    addToQuery(build, path, 1);
    JsonObject built = build.build();
    List<NavTreeNode> nodes =
      NavTreeNodeRequestBodyMapper.fromRequestBody(ic, built).getResults();
    weblogic.remoteconsole.server.repo.Response<List<NavTreeNode>> response = ic
      .getPageRepo().asPageReaderRepo()
      .expandNavTreeNodes(ic, nodes);
    return findPath(path, 1, response.getResults(), parentPath);
  }

  private static List<NavTreeNode> findPath(
    List<String> path,
    int offset,
    List<NavTreeNode> navTree,
    List<NavTreeNode> parentPath) {
    if (path.size() == offset) {
      return navTree;
    }
    String find = path.get(offset);
    for (NavTreeNode walk : navTree) {
      if (walk.getName().equals(find)) {
        parentPath.add(walk);
        return findPath(path, offset + 1, walk.getContents(), parentPath);
      }
    }
    throw new WebApplicationException(Response.status(
      Status.NOT_FOUND.getStatusCode(), "Cannot find: " + path
    ).build());
  }

  /*
    private static void printNavTrees(String path, List<NavTreeNode> list) {
      for (NavTreeNode walk : list) {
        String newPath;
        if (path == null) {
          newPath = walk.getLabel();
        } else {
          newPath = path + '/' + walk.getLabel();
        }
        System.out.println(newPath);
        printNavTrees(newPath, walk.getContents());
      }
    }
  */

  private static void addToQuery(
    JsonObjectBuilder builder,
    List<String> path,
    int offset) {
    if (offset == path.size()) {
      return;
    }
    JsonArrayBuilder newContents = Json.createArrayBuilder();
    JsonObjectBuilder newEntry = Json.createObjectBuilder()
      .add("name", path.get(offset))
      .add("expandable", true)
      // .add("type", "group")
      // .add("contents", Json.createArrayBuilder())
      .add("expanded", true);
    addToQuery(newEntry, path, offset + 1);
    newContents.add(newEntry);
    builder.add("contents", newContents);
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getRootList(@Context ResourceContext resContext) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    Provider prov = ic.getProvider();
    prov.updateLastRootUsed(null);
    JsonArrayBuilder dataBuilder = Json.createArrayBuilder();
    if (prov.getRoots().size() == 0) {
      ic.getProvider().updateLastRootUsed(null);
      return WebAppUtils.addCookieFromContext(resContext,
        Response.ok(
          ProviderTable.getDefaultTableRDJ(ic), MediaType.APPLICATION_JSON)
      ).build();
    }
    if (prov.getRoots().size() == 1) {
      List<String> segs = new LinkedList<>(prov.getRoots().keySet());
      return getListFromStrings(resContext, segs);
    }
    for (Root root : prov.getRoots().values()) {
      String label = ic.getLocalizer().localizeString(root.getLabel());
      dataBuilder.add(Json.createObjectBuilder()
        .add("type", root.getName() + "-tree")
        .add("label", label)
        .add("description", 
          ic.getLocalizer().localizeString(root.getDescription()))
        .add("resourceData", Json.createObjectBuilder()
          .add("label", label)
          .add("resourceData", 
            "/api/-current-/group"
              + "/" + root.getName())));
    }
    builder.add("data", dataBuilder);

    builder.add("self", Json.createObjectBuilder()
      .add("kind", "list")
      .add("label", prov.getName())
      .add("resourceData",
        "/api/-current-/group"));
    builder.add("navigation", "");
    builder.add("breadCrumbs", Json.createArrayBuilder());
    builder.add("inlinePageDescription", Json.createObjectBuilder()
      .add("presentationHint", "cards"));

    return
      WebAppUtils.addCookieFromContext(resContext,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }
}

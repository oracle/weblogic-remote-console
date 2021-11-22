// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.NavTreeNode;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Converts a Response<NavTreeNode> to a JAXRS Response.
 * Used to return the nav tree contents to the CFE.
 */
public class NavTreeNodeResponseMapper extends ResponseMapper<List<NavTreeNode>> {

  public static javax.ws.rs.core.Response toResponse(
    InvocationContext invocationContext,
    Response<List<NavTreeNode>> response
  ) {
    return new NavTreeNodeResponseMapper(invocationContext, response).toResponse();
  }

  private NavTreeNodeResponseMapper(InvocationContext invocationContext, Response<List<NavTreeNode>> response) {
    super(invocationContext, response);
  }

  @Override
  protected void addResults() {
    getEntityBuilder().add("contents", navTreeNodesToJson(getResponse().getResults()));
  }

  private JsonArray navTreeNodesToJson(List<NavTreeNode> nodes) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (NavTreeNode node : nodes) {
      if (node.getResourceData() != null) {
        if (!getInvocationContext().getProvider().isValidPath(node.getResourceData().getPath().getDotSeparatedPath())) {
          // Rejected path
          continue;
        }
      }
      builder.add(navTreeNodeToJson(node));
    }
    return builder.build();
  }

  private JsonObject navTreeNodeToJson(NavTreeNode node) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfNotEmpty(builder, "name", node.getName());
    addIfNotEmpty(builder, "label", node.getLabel());
    addIfNotFalse(builder, "expanded", node.isExpanded());
    addIfNotTrue(builder, "expandable", node.isExpandable());
    addIfNotTrue(builder, "selectable", node.isSelectable());
    addIfNotEmpty(builder, "type", getType(node));
    addIfNotEmpty(builder, "contents", navTreeNodesToJson(node.getContents()));
    if (node.getType() != NavTreeNode.Type.GROUP) {
      builder.add("resourceData", beanTreePathToJson(node.getResourceData()));
    }
    return builder.build();
  }

  private String getType(NavTreeNode node) {
    NavTreeNode.Type type = node.getType();
    if (NavTreeNode.Type.GROUP == type) {
      return "group";
    }
    if (NavTreeNode.Type.ROOT == type) {
      return "root";
    }
    if (NavTreeNode.Type.COLLECTION == type) {
      return "collection";
    }
    if (NavTreeNode.Type.COLLECTION_CHILD == type) {
      return "collectionChild";
    }
    if (NavTreeNode.Type.SINGLETON == type) {
      return "singleton";
    }
    throw new AssertionError("Unknown NavTreeNode.Type " + type);
  }

  private void addIfNotEmpty(JsonObjectBuilder builder, String key, String val) {
    if (StringUtils.notEmpty(val)) {
      builder.add(key, val);
    }
  }

  private void addIfNotEmpty(JsonObjectBuilder builder, String key, JsonArray val) {
    if (!val.isEmpty()) {
      builder.add(key, val);
    }
  }

  private void addIfNotTrue(JsonObjectBuilder builder, String key, boolean val) {
    if (!val) {
      builder.add(key, val);
    }
  }

  private void addIfNotFalse(JsonObjectBuilder builder, String key, boolean val) {
    if (val) {
      builder.add(key, val);
    }
  }
}

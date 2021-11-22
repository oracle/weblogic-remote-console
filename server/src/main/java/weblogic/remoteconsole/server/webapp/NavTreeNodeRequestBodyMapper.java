// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.ArrayList;
import java.util.List;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.NavTreeNode;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Converts a JAXRS Request body to a Response<List<NavTreeNode>>.
 *
 * Note: only fetch 'name', 'expanded' and 'contents' since that's all that we need.
 * The rest is computable from them.
 */
public class NavTreeNodeRequestBodyMapper extends RequestBodyMapper<List<NavTreeNode>> {

  public static Response<List<NavTreeNode>> fromRequestBody(
    InvocationContext ic,
    JsonObject requestBody
  ) {
    return (new NavTreeNodeRequestBodyMapper(ic, requestBody)).fromRequestBody();
  }

  private NavTreeNodeRequestBodyMapper(InvocationContext ic, JsonObject requestBody) {
    super(ic, requestBody, null);
  }

  @Override
  protected void parseRequestBody() {
    List<NavTreeNode> nodes = getNavTreeNodes(getRequestBody());
    if (isOK()) {
      getResponse().setSuccess(nodes);
    }
  }

  private List<NavTreeNode> getNavTreeNodes(JsonObject object) {
    List<NavTreeNode> nodes = new ArrayList<>();
    JsonArray array = getOptionalJsonArray(object, "contents");
    if (isOK() && array != null) {
      for (int i = 0; i < array.size(); i++) {
        JsonObject obj = asJsonObject("contents", array.get(i));
        if (isOK()) {
          NavTreeNode node = getNavTreeNode(obj);
          nodes.add(node);
        }
      }
    }
    return nodes;
  }

  private NavTreeNode getNavTreeNode(JsonObject object) {
    NavTreeNode node = new NavTreeNode();
    node.setName(getRequiredString(object, "name"));
    node.setExpanded(getOptionalBoolean(object, "expanded"));
    node.setContents(getNavTreeNodes(object));
    return node;
  }
}

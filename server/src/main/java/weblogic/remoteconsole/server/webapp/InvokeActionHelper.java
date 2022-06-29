// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.JsonObject;

import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.TableActionDef;
import weblogic.remoteconsole.common.repodef.TableDef;
import weblogic.remoteconsole.common.repodef.TablePagePath;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Utility code called by JAXRS resources to invoke an action.
 */
public class InvokeActionHelper {

  private InvokeActionHelper() {
  }

  public static javax.ws.rs.core.Response invokeAction(InvocationContext ic, String action, JsonObject requestBody) {
    // Today, we only support table row actions
    return invokeTableRowAction(ic, action);
  }

  // Table row actions don't take arguments and don't return values
  private static javax.ws.rs.core.Response invokeTableRowAction(InvocationContext ic, String action) {
    Response<Void> response = new Response<>();
    // Make sure the bean supports the action
    Response<TableActionDef> findActionResponse = findTableActionDef(ic, action);
    if (!findActionResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(findActionResponse);
      return VoidResponseMapper.toResponse(ic, response);
    }
    // Make sure the bean exists
    Response<Void> existsResponse =
      ic.getPageRepo().asPageReaderRepo().verifyExists(ic, ic.getBeanTreePath());
    if (!existsResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(existsResponse);
      return VoidResponseMapper.toResponse(ic, response);
    }
    // Invoke the action
    response = ic.getPageRepo().asPageReaderRepo().invokeTableRowAction(ic, findActionResponse.getResults());
    return VoidResponseMapper.toResponse(ic, response);
  }

  private static Response<TableActionDef> findTableActionDef(InvocationContext ic, String action) {
    Response<TableActionDef> response = new Response<>();
    // The action is invoked on a collection child, so we're passed a slice page path.
    // Get the corresponding table page path since that's where the action defs live.
    TablePagePath tablePagePath = PagePath.newTablePagePath(ic.getPagePath().getPagesPath());
    InvocationContext tableIc = new InvocationContext(ic);
    tableIc.setPagePath(tablePagePath);
    Response<PageDef> pageDefResponse = tableIc.getPageRepo().asPageReaderRepo().getPageDef(tableIc);
    if (!pageDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(pageDefResponse);
    }
    TableDef tableDef = pageDefResponse.getResults().asTableDef();
    List<TableActionDef> actionDefs = tableDef.getActionDefs();
    TableActionDef tableActionDef = findTableActionDef(actionDefs, new Path(action));
    if (tableActionDef != null) {
      response.setSuccess(tableActionDef);
    } else {
      response.addFailureMessage("Table action not found: " + action);
      response.setFrontEndBadRequest();
    }
    return response;
  }

  private static TableActionDef findTableActionDef(List<TableActionDef> tableActionDefs, Path actionPath) {
    for (TableActionDef tableActionDef : tableActionDefs) {
      if (tableActionDef.getActionDefs().isEmpty()) {
        if (actionPath.equals(tableActionDef.getActionPath())) {
          return tableActionDef;
        }
      } else {
        TableActionDef childTableActionDef =
          findTableActionDef(tableActionDef.getActionDefs(), actionPath);
        if (childTableActionDef != null) {
          return childTableActionDef;
        }
      }
    }
    return null;
  }
}

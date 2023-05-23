// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.ArrayList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonObject;

import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.TablePagePath;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Utility code called by JAXRS resources to invoke an action.
 */
public class InvokeActionHelper {
  private InvocationContext ic;
  private String action;
  private JsonObject requestBody;
  private PageActionDef pageActionDef;
  private List<FormProperty> formProperties;

  protected InvokeActionHelper(InvocationContext ic, String action, JsonObject requestBody) {
    this.ic = ic;
    this.action = action;
    this.requestBody = requestBody;
  }

  protected InvocationContext getInvocationContext() {
    return ic;
  }

  protected String getAction() {
    return action;
  }

  protected JsonObject getRequestBody() {
    return requestBody;
  }

  protected PageActionDef getPageActionDef() {
    return pageActionDef;
  }

  protected List<FormProperty> getFormProperties() {
    return formProperties;
  }

  public static javax.ws.rs.core.Response invokeAction(InvocationContext ic, String action, JsonObject requestBody) {
    return VoidResponseMapper.toResponse(ic, new InvokeActionHelper(ic, action, requestBody).invokeAction());
  }

  protected Response<Void> invokeAction() {
    Response<Void> response = new Response<>();
    // Note: might need to handle heterogeneous types (for slice table actions)
    // Make sure the bean supports the action
    {
      Response<PageActionDef> r = findPageActionDef();
      if (!r.isSuccess()) {
        return response.copyUnsuccessfulResponse(r);
      }
      pageActionDef = r.getResults();
    }
    // Unmarshal the request body (i.e. for action input forms)
    {
      Response<List<FormProperty>> r = unmarshalInputForm();
      if (!r.isSuccess()) {
        return response.copyUnsuccessfulResponse(r);
      }
      formProperties = r.getResults();
    }
    // Make sure the bean exists
    {
      Response<Void> r =
        getInvocationContext().getPageRepo().asPageReaderRepo().verifyExists(
          getInvocationContext(),
          getInvocationContext().getBeanTreePath()
        );
      if (!r.isSuccess()) {
        return response.copyUnsuccessfulResponse(r);
      }
    }
    // Invoke the action
    if (getInvocationContext().getBeanTreePath().isCollection()) {
      return invokeTableRowsAction();
    } else if (getPageActionDef().getPageDef().isSliceTableDef()) {
      return invokeSliceTableRowsAction();
    } else {
      return invokeBeanAction(getInvocationContext());
    }
  }

  private Response<Void> invokeTableRowsAction() {
    Response<Void> response = new Response<>();
    Response<List<BeanTreePath>> rbResponse =
      TableActionRequestBodyMapper.fromRequestBody(getInvocationContext(), getRequestBody());
    if (!rbResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(rbResponse);
    }
    List<Response<Void>> rowResponses = new ArrayList<>();
    for (BeanTreePath rowBTP : rbResponse.getResults()) {
      InvocationContext rowIC = new InvocationContext(getInvocationContext());
      rowIC.setIdentity(rowBTP);
      rowResponses.add(invokeBeanAction(rowIC));
    }
    return aggregateRowResponses(rowResponses);
  }

  protected Response<Void> invokeSliceTableRowsAction() {
    Response<Void> response = new Response<>();
    Response<List<String>> rbResponse =
      SliceTableActionRequestBodyMapper.fromRequestBody(getInvocationContext(), getRequestBody());
    if (!rbResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(rbResponse);
    }
    if ("none".equals(getPageActionDef().getRows())) {
      // Invoke the action against the bean
      return invokeBeanAction(getInvocationContext());
    }
    List<Response<Void>> rowResponses = new ArrayList<>();
    for (String rowIdentifier : rbResponse.getResults()) {
      InvocationContext rowIC = new InvocationContext(getInvocationContext());
      rowIC.setIdentifier(rowIdentifier);
      rowResponses.add(invokeBeanAction(rowIC));
    }
    return aggregateRowResponses(rowResponses);
  }

  private Response<Void> aggregateRowResponses(List<Response<Void>> rowResponses) {
    Response<Void> response = new Response<>();
    boolean someRowsSucceeded = false;
    for (Response<Void> rowResponse : rowResponses) {
      response.copyMessages(rowResponse);
      if (rowResponse.isSuccess()) {
        // This row succeeded.
        someRowsSucceeded = true;
        // Some of the work succeed - send back a 200.
        response.setSuccess(null);
      } else {
        // This row failed
        if (someRowsSucceeded) {
          // Send back a 200 because some of the rows succeeded.
        } else {
          // No actions have succeeded yet.
          if (response.isSuccess()) {
            // This is the first failure - send back its status
            response.copyStatus(rowResponse);
          } else {
            // There are multiple failures - send back a 400
            response.setUserBadRequest();
          }
        }
      }
    }
    return response;
  }

  protected Response<Void> invokeBeanAction(InvocationContext ic) {
    return ic.getPageRepo().asPageReaderRepo().invokeAction(ic, getPageActionDef(), getFormProperties());
  }

  private Response<PageActionDef> findPageActionDef() {
    Response<PageActionDef> response = new Response<>();
    if (StringUtils.isEmpty(action)) {
      response.addFailureMessage("Action not specified");
      response.setFrontEndBadRequest();
      return response;
    }
    Response<List<PageActionDef>> actionsResponse = getPageActionDefs();
    if (!actionsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(actionsResponse);
    }
    PageActionDef pageActionDef = findPageActionDef(actionsResponse.getResults());
    if (pageActionDef != null) {
      response.setSuccess(pageActionDef);
    } else {
      response.addFailureMessage("Action not found: " + getAction());
      response.setFrontEndBadRequest();
    }
    return response;
  }

  private PageActionDef findPageActionDef(List<PageActionDef> pageActionDefs) {
    Path actionPath = new Path(getAction());
    for (PageActionDef pageActionDef : pageActionDefs) {
      if (pageActionDef.isInvokable()) {
        if (actionPath.equals(pageActionDef.getActionPath())) {
          return pageActionDef;
        }
      } else {
        PageActionDef childPageActionDef =
          findPageActionDef(pageActionDef.getActionDefs());
        if (childPageActionDef != null) {
          return childPageActionDef;
        }
      }
    }
    return null;
  }

  private Response<List<PageActionDef>> getPageActionDefs() {
    Response<List<PageActionDef>> response = new Response<>();
    Response<PageDef> pageDefResponse = ic.getPageRepo().asPageReaderRepo().getPageDef(getInvocationContext());
    if (!pageDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(pageDefResponse);
    }
    PageDef pageDef = pageDefResponse.getResults();
    if (pageDef.isTableDef()) {
      // The action is invoked on a table.
      return response.setSuccess(pageDef.asTableDef().getActionDefs());
    }
    if (pageDef.isSliceTableDef()) {
      // The action is invoked on a row of a slice table.
      return response.setSuccess(pageDef.asSliceTableDef().getActionDefs());
    }
    // The action is invoked on a collection child, so we're passed a slice page path.
    // Get the corresponding table page path since that's where the action defs live.
    // Note: remove this once the CFE always invokes actions via the table / slice table
    // instead per-row, and replace it with returning the slice form's actions.
    TablePagePath tablePagePath = PagePath.newTablePagePath(getInvocationContext().getPagePath().getPagesPath());
    InvocationContext tableIc = new InvocationContext(getInvocationContext());
    tableIc.setPagePath(tablePagePath);
    Response<PageDef> tablePageDefResponse = tableIc.getPageRepo().asPageReaderRepo().getPageDef(tableIc);
    if (!tablePageDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(tablePageDefResponse);
    }
    return response.setSuccess(tablePageDefResponse.getResults().asTableDef().getActionDefs());
  }

  private Response<List<FormProperty>> unmarshalInputForm() {
    PageDef inputFormDef = pageActionDef.getInputFormDef();
    if (inputFormDef == null) {
      return new Response<List<FormProperty>>().setSuccess(List.of());
    }
    // Create an invocation context for the action's input form
    PagePath aifpp =
      PagePath.newActionInputFormPagePath(
        getInvocationContext().getPagePath(),
        pageActionDef.getActionName()
      );
    InvocationContext aifIC = new InvocationContext(getInvocationContext());
    aifIC.setPagePath(aifpp);
    // Strip the request body down to just the input form's properties:
    JsonObject inputFormRequestBody = Json.createObjectBuilder(getRequestBody()).remove("rows").build();
    return FormRequestBodyMapper.fromRequestBody(aifIC, inputFormRequestBody);
  }
}

// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.ArrayList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonObject;

import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
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
  private FormDataMultiPart parts;

  public InvokeActionHelper(
    InvocationContext ic,
    String action,
    JsonObject requestBody
  ) {
    this(ic, action, requestBody, null);
  }

  public InvokeActionHelper(
    InvocationContext ic,
    String action,
    JsonObject requestBody,
    FormDataMultiPart parts
  ) {
    this.ic = ic;
    this.action = action;
    this.requestBody = requestBody;
    this.parts = parts;
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

  protected FormDataMultiPart getParts() {
    return parts;
  }

  protected PageActionDef getPageActionDef() {
    return pageActionDef;
  }

  protected List<FormProperty> getFormProperties() {
    return formProperties;
  }

  public static javax.ws.rs.core.Response invokeAction(
    InvocationContext ic,
    String action,
    JsonObject requestBody
  ) {
    return (new InvokeActionHelper(ic, action, requestBody)).invokeAction();
  }

  public static javax.ws.rs.core.Response invokeAction(
    InvocationContext ic,
    String action,
    JsonObject requestBody,
    FormDataMultiPart parts
  ) {
    return (new InvokeActionHelper(ic, action, requestBody, parts)).invokeAction();
  }

  public javax.ws.rs.core.Response invokeAction() {
    return VoidResponseMapper.toResponse(ic, invokeActionReturnResponse());
  }

  public Response<Void> invokeActionReturnResponse() {
    Response<Void> response = new Response<>();
    // Make sure the bean exists
    {
      Response<Void> r = verifyExists();
      if (!r.isSuccess()) {
        return response.copyUnsuccessfulResponse(r);
      }
    }
    if (ic.getPagePath().isSlicePagePath()) {
      Response<InvocationContext> r =
        ic.getPageRepo().asPageReaderRepo().getActualSliceInvocationContext(ic);
      if (!r.isSuccess()) {
        return response.copyUnsuccessfulResponse(r);
      }
      ic = r.getResults();
    }
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
    return invokePageAction();
  }

  private Response<Void> invokePageAction() {
    // Invoke the action
    if (!"none".equals(getPageActionDef().getRows())) {
      if (ic.getBeanTreePath().isCollection()) {
        return invokeTableRowsAction();
      }
      if (getPageActionDef().getPageDef().isSliceTableDef()) {
        if (getPageActionDef().getPageDef().asSliceTableDef().isUseRowIdentities()) {
          return invokeTableRowsAction();
        }
        return invokeSliceTableRowsAction();
      }
    }
    return invokeBeanAction(getInvocationContext());
  }

  protected Response<Void> invokeTableRowsAction() {
    Response<Void> response = new Response<>();
    Response<List<BeanTreePath>> rbResponse =
      TableActionRequestBodyMapper.fromRequestBody(getInvocationContext(), getRequestBody());
    if (!rbResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(rbResponse);
    }
    return invokeTableRowsAction(rbResponse.getResults());
  }

  protected Response<Void> invokeTableRowsAction(List<BeanTreePath> rowBTPs) {
    List<Response<Void>> rowResponses = new ArrayList<>();
    for (BeanTreePath rowBTP : rowBTPs) {
      rowResponses.add(invokeBeanAction(getTableRowIC(rowBTP)));
    }
    return aggregateRowResponses(rowResponses);
  }

  protected InvocationContext getTableRowIC(BeanTreePath rowBTP) {
    InvocationContext rowIC = new InvocationContext(getInvocationContext());
    rowIC.setIdentity(rowBTP);
    return rowIC;
  }

  protected Response<Void> invokeSliceTableRowsAction() {
    Response<Void> response = new Response<>();
    Response<List<String>> rbResponse =
      SliceTableActionRequestBodyMapper.fromRequestBody(getInvocationContext(), getRequestBody());
    if (!rbResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(rbResponse);
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
    Response<Void> successesResponse = new Response<>();
    Response<Void> failuresResponse = new Response<>();
    boolean someRowsSucceeded = false;
    for (Response<Void> rowResponse : rowResponses) {
      if (rowResponse.isSuccess()) {
        // This row succeeded.
        successesResponse.copyMessages(rowResponse);
        someRowsSucceeded = true;
        // Some of the work succeed - send back a 200.
        response.setSuccess(null);
      } else {
        // This row failed
        failuresResponse.copyMessages(rowResponse);
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
    // Display the failure messages first:
    response.copyMessages(failuresResponse);
    response.copyMessages(successesResponse);
    return response;
  }

  protected Response<Void> invokeBeanAction(InvocationContext beanIC) {
    return beanIC.getPageRepo().asPageReaderRepo().invokeAction(beanIC, getPageActionDef(), getFormProperties());
  }

  public static javax.ws.rs.core.Response getActionInputForm(
    InvocationContext ic,
    String action,
    JsonObject requestBody
  ) {
    return (new InvokeActionHelper(ic, action, requestBody)).getActionInputForm();
  }

  public javax.ws.rs.core.Response getActionInputForm() {
    return
      GetPageResponseMapper.toResponse(
        getActionInputFormIC(),
        getActionInputFormReturnResponse()
      );
  }

  public Response<Page> getActionInputFormReturnResponse() {
    Response<Page> response = new Response<>();
    // Make sure the bean exists
    {
      Response<Void> r = verifyExists();
      if (!r.isSuccess()) {
        return response.copyUnsuccessfulResponse(r);
      }
    }
    if (ic.getPagePath().isSlicePagePath()) {
      Response<InvocationContext> r =
        ic.getPageRepo().asPageReaderRepo().getActualSliceInvocationContext(ic);
      if (!r.isSuccess()) {
        return response.copyUnsuccessfulResponse(r);
      }
      ic = r.getResults();
    }
    {
      Response<PageActionDef> r = findPageActionDef();
      if (!r.isSuccess()) {
        return response.copyUnsuccessfulResponse(r);
      }
      pageActionDef = r.getResults();
    }
    // Get the action input form
    if ("none".equals(getPageActionDef().getRows())) {
      return getActionInputFormFromIC();
    } else if (getInvocationContext().getBeanTreePath().isCollection()) {
      return getTableRowsActionInputForm();
    } else if (getPageActionDef().getPageDef().isSliceTableDef()) {
      return getSliceTableRowsActionInputForm();
    } else {
      return getBeanActionInputForm();
    }
  }

  protected Response<Void> verifyExists() {
    return
      getInvocationContext().getPageRepo().asPageReaderRepo().verifyExists(
        getInvocationContext(),
        getInvocationContext().getBeanTreePath()
      );
  }

  private Response<Page> getTableRowsActionInputForm() {
    Response<Page> response = new Response<>();
    Response<List<BeanTreePath>> rbResponse =
      TableActionRequestBodyMapper.fromRequestBody(getInvocationContext(), getRequestBody());
    if (!rbResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(rbResponse);
    }
    getInvocationContext().setIdentities(rbResponse.getResults());
    return getActionInputFormFromIC();
  }

  protected Response<Page> getSliceTableRowsActionInputForm() {
    Response<Page> response = new Response<>();
    Response<List<String>> rbResponse =
      SliceTableActionRequestBodyMapper.fromRequestBody(getInvocationContext(), getRequestBody());
    if (!rbResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(rbResponse);
    }
    getInvocationContext().setIdentifiers(rbResponse.getResults());
    return getActionInputFormFromIC();
  }

  protected Response<Page> getBeanActionInputForm() {
    return getActionInputFormFromIC();
  }

  protected Response<Page> getActionInputFormFromIC() {
    InvocationContext aifIC = getActionInputFormIC();
    return aifIC.getPageRepo().asPageReaderRepo().getPage(aifIC);
  }

  public InvocationContext getActionInputFormIC() {
    InvocationContext inputFormIC = new InvocationContext(ic);
    inputFormIC.setPagePath(
      PagePath.newActionInputFormPagePath(ic.getPagePath(), action)
    );
    return inputFormIC;
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
    return response.setSuccess(pageDefResponse.getResults().getActionDefs());
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
    return FormRequestBodyMapper.fromRequestBody(aifIC, inputFormRequestBody, getParts());
  }
}

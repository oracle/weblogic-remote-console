// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.JsonObject;

import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Utility code called by JAXRS resources to modify a bean.
 */
public class UpdateHelper {

  protected UpdateHelper() {
  }

  public static javax.ws.rs.core.Response update(InvocationContext ic, JsonObject requestBody) {
    return (new UpdateHelper()).updateBean(ic, requestBody);
  }

  public javax.ws.rs.core.Response updateBean(InvocationContext ic, JsonObject requestBody) {
    Response<Void> response = new Response<>();
    // Make sure the bean exists
    Response<Void> existsResponse =
      ic.getPageRepo().asPageReaderRepo().verifyExists(ic, ic.getBeanTreePath());
    if (!existsResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(existsResponse);
      return VoidResponseMapper.toResponse(ic, response);
    }
    Response<InvocationContext> icResponse =
      ic.getPageRepo().asPageReaderRepo().getActualSliceInvocationContext(ic);
    if (!icResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(icResponse);
      return VoidResponseMapper.toResponse(ic, response);
    }
    InvocationContext actualIc = icResponse.getResults();
    // If this page is read-only, return MethodNotAllowed
    Response<Boolean> readOnlyResponse = isReadOnly(actualIc);
    if (!readOnlyResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(readOnlyResponse);
      return VoidResponseMapper.toResponse(actualIc, response);
    }
    if (readOnlyResponse.getResults()) {
      return javax.ws.rs.core.Response.status(javax.ws.rs.core.Response.Status.METHOD_NOT_ALLOWED).build();
    }
    // Unmarshal the request body.
    Response<List<FormProperty>> unmarshalResponse = FormRequestBodyMapper.fromRequestBody(actualIc, requestBody);
    if (!unmarshalResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(unmarshalResponse);
      return VoidResponseMapper.toResponse(actualIc, response);
    }
    // Customize the form properties
    Response<List<FormProperty>> customizeResponse =
      customizeFormProperties(actualIc, unmarshalResponse.getResults());
    if (!customizeResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(customizeResponse);
      return VoidResponseMapper.toResponse(actualIc, response);
    }
    // Update the underlying beans
    response = updateUnderlyingBeans(actualIc, customizeResponse.getResults());

    return VoidResponseMapper.toResponse(actualIc, response);
  }

  protected Response<Void> updateUnderlyingBeans(InvocationContext ic, List<FormProperty> properties) {
    return ic.getPageRepo().asPageEditorRepo().update(ic, properties);
  }

  protected Response<List<FormProperty>> customizeFormProperties(
    InvocationContext ic,
    List<FormProperty> formProperties
  ) {
    Response<List<FormProperty>> response = new Response<>();
    return response.setSuccess(formProperties);
  }

  public static Response<Boolean> isReadOnly(InvocationContext ic) {
    Response<Boolean> response = new Response<>();
    Response<InvocationContext> icResponse =
      ic.getPageRepo().asPageReaderRepo().getActualSliceInvocationContext(ic);
    if (!icResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(icResponse);
    }
    InvocationContext actualIc = icResponse.getResults();
    Response<PageDef> pageDefResponse = actualIc.getPageRepo().asPageReaderRepo().getPageDef(actualIc);
    if (!pageDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(pageDefResponse);
    }
    PageDef pageDef = pageDefResponse.getResults();
    boolean readOnly = true;
    if (pageDef.isSliceFormDef() && !pageDef.asSliceFormDef().isReadOnly()) {
      readOnly = false;
    }
    if (pageDef.isSliceTableDef() && !pageDef.asSliceTableDef().isReadOnly()) {
      readOnly = false;
    }
    return response.setSuccess(readOnly);
  }
}

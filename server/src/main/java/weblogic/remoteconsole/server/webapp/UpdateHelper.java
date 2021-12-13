// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.JsonObject;

import weblogic.remoteconsole.common.repodef.SliceFormPagePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Utility code called by JAXRS resources to modify a bean.
 */
public class UpdateHelper {

  private UpdateHelper() {
  }

  public static javax.ws.rs.core.Response update(InvocationContext ic, JsonObject requestBody) {
    Response<Void> response = new Response<>();
    // Make sure the bean exists
    Response<Void> existsResponse =
      ic.getPageRepo().asPageReaderRepo().verifyExists(ic, ic.getBeanTreePath());
    if (!existsResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(existsResponse);
      return VoidResponseMapper.toResponse(ic, response);
    }
    // Get the actual slice for this bean.
    // i.e. if the type is heterogeneous, we need to get the instance's type
    // to figure out which page to use so that we can unmarshal the request body.
    Response<SliceFormPagePath> sliceResponse =
      ic.getPageRepo().asPageReaderRepo().getActualSliceFormPagePath(ic);
    if (!existsResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(existsResponse);
      return VoidResponseMapper.toResponse(ic, response);
    }
    ic.setPagePath(sliceResponse.getResults());
    // If this page is read-only, return MethodNotAllowed
    if (ic.getPageRepo().getPageRepoDef().getPageDef(ic.getPagePath()).asSliceFormDef().isReadOnly()) {
      return javax.ws.rs.core.Response.status(javax.ws.rs.core.Response.Status.METHOD_NOT_ALLOWED).build();
    }
    // Unmarshal the request body.
    Response<List<FormProperty>> unmarshalResponse = FormRequestBodyMapper.fromRequestBody(ic, requestBody);
    if (!unmarshalResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(unmarshalResponse);
      return VoidResponseMapper.toResponse(ic, response);
    }
    // Update the underlying beans
    response = ic.getPageRepo().asPageEditorRepo().update(ic, unmarshalResponse.getResults());
    return VoidResponseMapper.toResponse(ic, response);
  }
}

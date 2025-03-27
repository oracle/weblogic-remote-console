// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.JsonObject;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.customizers.JMSMessageManagementRuntimeMBeanCustomizer;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Utility code called by the JMSMessageManagementRuntimeMBeanCollectionChildResource
 * JAXRS resource to update its message filters.
 */
public class JMSMessageManagementRuntimeMBeanUpdateHelper {

  private JMSMessageManagementRuntimeMBeanUpdateHelper() {
  }

  public static javax.ws.rs.core.Response update(InvocationContext ic, JsonObject requestBody) {
    Response<Void> response = new Response<>();
    Response<InvocationContext> icResponse =
      ic.getPageRepo().asPageReaderRepo().getActualSliceInvocationContext(ic);
    if (!icResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(icResponse);
      return VoidResponseMapper.toResponse(ic, response);
    }
    InvocationContext actualIc = icResponse.getResults();
    if (!isMessageFiltersSlice(actualIc)) {
      return javax.ws.rs.core.Response.status(javax.ws.rs.core.Response.Status.METHOD_NOT_ALLOWED).build();
    }
    response = doUpdate(actualIc, requestBody);
    return VoidResponseMapper.toResponse(actualIc, response);
  }

  private static boolean isMessageFiltersSlice(InvocationContext ic) {
    if (ic.getPagePath().isSlicePagePath()) {
      Path path = ic.getPagePath().asSlicePagePath().getSlicePath();
      if (path.equals(new Path("Messages.Criteria")) || path.equals(new Path("Messages.Filters"))) {
        return true;
      }
    }
    return false;
  }

  private static Response<Void> doUpdate(InvocationContext ic, JsonObject requestBody) {
    Response<Void> response = new Response<>();
    // Unmarshal the request body
    Response<List<FormProperty>> unmarshalResponse = FormRequestBodyMapper.fromRequestBody(ic, requestBody);
    if (!unmarshalResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(unmarshalResponse);
    }
    return JMSMessageManagementRuntimeMBeanCustomizer.updateMessageFilters(ic, unmarshalResponse.getResults());
  }
}

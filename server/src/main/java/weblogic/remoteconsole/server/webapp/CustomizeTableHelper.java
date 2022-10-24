// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.JsonObject;

import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Utility code called by JAXRS resources to customize a table.
 */
public class CustomizeTableHelper {

  protected CustomizeTableHelper() {
  }

  public static javax.ws.rs.core.Response customizeTable(
    InvocationContext ic,
    JsonObject requestBody
  ) {
    return
      VoidResponseMapper.toResponse(
        ic,
        (new CustomizeTableHelper()).customize(ic, requestBody)
      );
  }

  public Response<Void> customize(
    InvocationContext ic,
    JsonObject requestBody
  ) {
    Response<Void> response = new Response<>();
    // Unmarshal the request body.
    Response<List<String>> unmarshalResponse =
      DisplayedColumnsRequestBodyMapper.fromRequestBody(ic, requestBody);
    if (!unmarshalResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(unmarshalResponse);
    }
    List<String> newDisplayedColumns = unmarshalResponse.getResults();
    if (ic.getPagePath().isSlicePagePath()) {
      Response<InvocationContext> icResponse =
        ic.getPageRepo().asPageReaderRepo().getActualSliceInvocationContext(ic);
      if (!icResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(icResponse);
      }
      ic = icResponse.getResults();
    }
    Response<PageDef> pageDefResponse = ic.getPageRepo().asPageReaderRepo().getPageDef(ic);
    if (!pageDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(pageDefResponse);
    }
    PageDef pageDef = pageDefResponse.getResults();
    ic
      .getPageRepo()
      .asPageReaderRepo()
      .getTableCustomizationsManager()
      .setTableCustomizations(ic, pageDef, newDisplayedColumns);
    response.setSuccess(null);
    return response;
  }
}

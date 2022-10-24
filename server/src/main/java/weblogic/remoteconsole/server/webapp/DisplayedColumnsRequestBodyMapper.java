// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.ArrayList;
import java.util.List;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Converts a JAXRS Request body to a list of displayed columns (customizing a table)
 */
public class DisplayedColumnsRequestBodyMapper extends RequestBodyMapper<List<String>> {

  private static final String DISPLAYED_COLUMNS = "displayedColumns";

  public static Response<List<String>> fromRequestBody(
    InvocationContext ic,
    JsonObject requestBody
  ) {
    return (new DisplayedColumnsRequestBodyMapper(ic, requestBody)).fromRequestBody();
  }

  private DisplayedColumnsRequestBodyMapper(InvocationContext ic, JsonObject requestBody) {
    super(ic, requestBody, null);
  }

  @Override
  protected void parseRequestBody() {
    if (getRequestBody() == null) {
      getResponse().setSuccess(null); // do a 'reset'
      return;
    }
    JsonArray arr = getOptionalJsonArray(getRequestBody(), DISPLAYED_COLUMNS);
    if (!isOK()) {
      return;
    }
    if (arr == null) {
      getResponse().setSuccess(null); // do a 'reset'
      return;
    }
    List<String> displayedColumns = new ArrayList<>();
    for (int i = 0; isOK() && i < arr.size(); i++) {
      displayedColumns.add(asString(DISPLAYED_COLUMNS, arr.get(i)));
    }
    if (!isOK()) {
      return;
    }
    getResponse().setSuccess(displayedColumns);
  }
}

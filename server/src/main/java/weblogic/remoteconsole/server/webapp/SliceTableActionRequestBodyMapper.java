// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.ArrayList;
import java.util.List;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Converts a JAXRS Request body to a Response<List<String>>
 * containing the identifiers of the rows on which to invoke the action.
 */
public class SliceTableActionRequestBodyMapper extends RequestBodyMapper<List<String>> {

  private static final String ROWS = "rows";
  private static final String VALUE = "value";

  public static Response<List<String>> fromRequestBody(InvocationContext ic, JsonObject requestBody) {
    return (new SliceTableActionRequestBodyMapper(ic, requestBody)).fromRequestBody();
  }

  private SliceTableActionRequestBodyMapper(InvocationContext ic, JsonObject requestBody) {
    super(ic, requestBody);
  }

  @Override
  protected void parseRequestBody() {
    List<String> identifiers = new ArrayList<>();
    JsonObject rows = getOptionalJsonObject(getRequestBody(), ROWS);
    if (isOK() && rows != null) {
      JsonArray values = getRequiredJsonArray(rows, VALUE);
      for (int i = 0; isOK() && i < values.size(); i++) {
        JsonObject row = asJsonObject(VALUE, values.get(i));
        if (isOK()) {
          String identifier = getRequiredString(row, VALUE);
          if (isOK()) {
            identifiers.add(identifier);
          }
        }
      }
    }
    if (isOK()) {
      getResponse().setSuccess(identifiers);
    }
  }
}

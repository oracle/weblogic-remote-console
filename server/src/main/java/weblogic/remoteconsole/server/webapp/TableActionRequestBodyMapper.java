// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.ArrayList;
import java.util.List;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Converts a JAXRS Request body to a Response<List<BeanTreePath>>
 * containing the identities of the rows on which to invoke the action.
 */
public class TableActionRequestBodyMapper extends RequestBodyMapper<List<BeanTreePath>> {

  private static final String ROWS = "rows";
  private static final String VALUE = "value";

  public static Response<List<BeanTreePath>> fromRequestBody(InvocationContext ic, JsonObject requestBody) {
    return (new TableActionRequestBodyMapper(ic, requestBody)).fromRequestBody();
  }

  private TableActionRequestBodyMapper(InvocationContext ic, JsonObject requestBody) {
    super(ic, requestBody);
  }

  @Override
  protected void parseRequestBody() {
    List<BeanTreePath> identities = new ArrayList<>();
    JsonObject rows = getOptionalJsonObject(getRequestBody(), ROWS);
    if (isOK() && rows != null) {
      JsonArray values = getRequiredJsonArray(rows, VALUE);
      for (int i = 0; isOK() && i < values.size(); i++) {
        JsonObject row = asJsonObject(VALUE, values.get(i));
        if (isOK()) {
          BeanTreePath btp = getRequiredBeanTreePath(row, VALUE);
          if (isOK()) {
            identities.add(btp);
          }
        }
      }
    }
    if (isOK()) {
      getResponse().setSuccess(identities);
    }
  }
}

// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;

/** 
 * Custom code for processing the ServerRuntimeMBean
 */
public class ServerRuntimeMBeanCustomizer {

  private ServerRuntimeMBeanCustomizer() {
  }

  public static Response<List<TableRow>> getJNDISliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<List<TableRow>> response = new Response<>();
    Response<JsonArray> getResponse = getBindings(ic);
    if (!getResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(getResponse);
    }
    response.setSuccess(processBindings(getResponse.getResults()));
    return response;
  }

  private static Response<JsonArray> getBindings(InvocationContext ic) {
    Response<JsonArray> response = new Response<>();
    // The console rest extension jndi url is domainRuntime/JNDI/<Server>:
    String serverName = ic.getBeanTreePath().getLastSegment().getKey();
    Path path = new Path("domainRuntime.JNDI");
    path.addComponent(serverName);
    boolean expandedValues = false;
    Response<JsonObject> getResponse = WebLogicRestInvoker.get(ic, path, expandedValues);
    if (!getResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(getResponse);
    }
    return response.setSuccess(getResponse.getResults().getJsonArray("jndi"));
  }

  private static List<TableRow> processBindings(JsonArray bindings) {
    // The console REST extension already sorted the rows
    List<TableRow> rows = new ArrayList<>();
    for (int i = 0; i < bindings.size(); i++) {
      JsonObject binding = bindings.getJsonObject(i);
      String context = binding.getString("context");
      String name = binding.getString("name");
      String clazz = binding.getString("class");
      String toString = binding.getString("toString");
      TableRow row = new TableRow();
      row.getCells().add(new TableCell("Context", new StringValue(context)));
      row.getCells().add(new TableCell("Name", new StringValue(name)));
      row.getCells().add(new TableCell("Class", new StringValue(clazz)));
      row.getCells().add(new TableCell("toString", new StringValue(toString)));
      rows.add(row);
    }
    return rows;
  }
}

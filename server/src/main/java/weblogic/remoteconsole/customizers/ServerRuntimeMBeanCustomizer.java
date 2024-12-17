// Copyright (c) 2023, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.InvocationContext;
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

  public static List<TableRow> getJNDISliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return processBindings(getBindings(ic));
  }

  private static JsonArray getBindings(InvocationContext ic) {
    // The console rest extension jndi url is domainRuntime/JNDI/<Server>:
    String serverName = ic.getBeanTreePath().getLastSegment().getKey();
    Path path = new Path("domainRuntime.JNDI");
    path.addComponent(serverName);
    boolean expandedValues = false;
    JsonObject getResponse = WebLogicRestInvoker.get(ic, path, expandedValues).getResults();
    return getResponse.getJsonArray("jndi");
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
      String error = binding.getString("error", ""); // optional: added in version 7 of the console rest extension
      TableRow row = new TableRow();
      row.getCells().add(new TableCell("Context", new StringValue(context)));
      row.getCells().add(new TableCell("Name", new StringValue(name)));
      row.getCells().add(new TableCell("Class", new StringValue(clazz)));
      row.getCells().add(new TableCell("toString", new StringValue(toString)));
      row.getCells().add(new TableCell("error", new StringValue(error)));
      rows.add(row);
    }
    return rows;
  }
}

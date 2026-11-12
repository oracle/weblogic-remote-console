// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.weblogic.DelegatedServerRuntimeMBeanNameHandler;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.DateAsLongValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.LongValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;
import weblogic.remoteconsole.server.utils.WebLogicRestRequest;

/** Custom code for processing WebAppComponentRuntimeMBean. */
public class WebAppComponentRuntimeMBeanCustomizer {

  static final Path SESSIONS_PATH = new Path("domainRuntime.webAppSessions");

  private static final DelegatedServerRuntimeMBeanNameHandler NAME_HANDLER =
    DelegatedServerRuntimeMBeanNameHandler.INSTANCE;

  private WebAppComponentRuntimeMBeanCustomizer() {
  }

  /** Returns one row for each active HTTP session monitoring identifier. */
  public static List<TableRow> getSessionsSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    JsonArray sessions = WebLogicRestInvoker.get(
      ic, SESSIONS_PATH, false, getSessionsRequestBuilder(ic.getBeanTreePath())
    ).getResults().getJsonArray("sessions");
    return toTableRows(sessions);
  }

  static WebLogicRestRequest.Builder getSessionsRequestBuilder(BeanTreePath beanTreePath) {
    if (NAME_HANDLER.isFabricatedBeanTreePath(beanTreePath)) {
      beanTreePath = NAME_HANDLER.getUnfabricatedBeanTreePath(beanTreePath);
    }
    // DomainRuntime / ServerRuntimes / ApplicationRuntimes / ComponentRuntimes.
    // Pass the runtime keys unchanged; the REST client encodes the query parameters.
    return WebLogicRestInvoker.builder()
      .queryParam("serverName", beanTreePath.getSegments().get(1).getKey())
      .queryParam("applicationName", beanTreePath.getSegments().get(2).getKey())
      .queryParam("componentName", beanTreePath.getSegments().get(3).getKey());
  }

  static List<TableRow> toTableRows(JsonArray sessions) {
    List<TableRow> rows = new ArrayList<>();
    for (int i = 0; i < sessions.size(); i++) {
      JsonObject session = sessions.getJsonObject(i);
      TableRow row = new TableRow();
      row.getCells().add(new TableCell("ContextRoot", new StringValue(session.getString("contextRoot", ""))));
      row.getCells().add(
        new TableCell("TimeLastAccessed", new DateAsLongValue(session.getJsonNumber("timeLastAccessed").longValue()))
      );
      row.getCells().add(
        new TableCell("MaxInactiveInterval", new LongValue(session.getJsonNumber("maxInactiveInterval").longValue()))
      );
      row.getCells().add(
        new TableCell("MonitoringId", new StringValue(session.getString("monitoringId")))
      );
      rows.add(row);
    }
    return rows;
  }
}

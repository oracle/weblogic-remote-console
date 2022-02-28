// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.SliceTableDef;
import weblogic.remoteconsole.common.repodef.weblogic.AggregatedRuntimeMBeanNameHandler;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.Value;

/** 
 * Custom code for processing slice tables that aggregate results across server runtime mbeans
 */
public class AggregatedMBeanCustomizer {

  private static final AggregatedRuntimeMBeanNameHandler NAME_HANDLER = AggregatedRuntimeMBeanNameHandler.INSTANCE;

  private AggregatedMBeanCustomizer() {
  }

  public static Response<List<TableRow>> getSliceTableRows(InvocationContext ic) {
    Response<List<TableRow>> response = new Response<>();

    // The path to the server runtimes collection
    BeanTreePath serverRuntimes =
      BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), new Path("DomainRuntime.ServerRuntimes"));

    // e.g. DomainRuntime.ServerRuntimes.*.Foo.Bar
    Path unaggPath = NAME_HANDLER.getUnfabricatedBeanTreePath(ic.getBeanTreePath()).getPath();
    
    // The path from a server runtime mbean to the unaggregated mbean
    // i.e. Domain.ServerRuntimes.*.Foo.Bar -> Foo.Bar
    Path serverRelativePath = unaggPath.subPath(3, unaggPath.length());
  
    SliceTableDef sliceTableDef =
      ic.getPageRepo().getPageRepoDef().getPageDef(ic.getPagePath()).asSliceTableDef();
    Response<BeanReaderRepoSearchResults> searchResponse =
      findPerServerInstances(ic, sliceTableDef, serverRuntimes, serverRelativePath);
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    return
      response.setSuccess(
        createRows(sliceTableDef, serverRuntimes, serverRelativePath, searchResponse.getResults())
      );
  }

  private static Response<BeanReaderRepoSearchResults> findPerServerInstances(
    InvocationContext ic,
    SliceTableDef sliceTableDef,
    BeanTreePath serverRuntimes,
    Path serverRelativePath
  ) {
    // The path to all per-server instances of the bean
    BeanTreePath allInstances = serverRuntimes.childPath(serverRelativePath);
    // Create a cross-server-runtime search request based on the columns
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    for (PagePropertyDef propertyDef : sliceTableDef.getAllPropertyDefs()) {
      builder.addProperty(allInstances, propertyDef);
    }
    // Do the search
    return builder.search();
  }

  private static List<TableRow> createRows(
    SliceTableDef sliceTableDef,
    BeanTreePath serverRuntimes,
    Path serverRelativePath,
    BeanReaderRepoSearchResults searchResults
  ) {
    // Sort the rows by the server name
    Map<String,TableRow> sortedRows = new TreeMap<>();

    // make a row for each server runtime that has the bean
    for (BeanSearchResults serverResults : searchResults.getCollection(serverRuntimes)) {
      // The path to this server runtime mbean
      BeanTreePath server =
        serverResults.getValue(serverRuntimes.getTypeDef().getIdentityPropertyDef()).asBeanTreePath();
      // The results for the bean on this server
      BeanSearchResults rowResults =
        searchResults.getBean(server.childPath(serverRelativePath));
      if (rowResults == null) {
        // This bean isn't present on this server.  Don't make a row for it.
      } else {
        // Make a row for this bean (sorted by server name)
        TableRow row = createRow(sliceTableDef, server, rowResults);
        String serverName = server.getLastSegment().getKey();
        sortedRows.put(serverName, row);
      }
    }
    // Return the sorted rows
    List<TableRow> rows = new ArrayList<>();
    for (TableRow row : sortedRows.values()) {
      rows.add(row);
    }
    return rows;
  }

  private static TableRow createRow(SliceTableDef sliceTableDef, BeanTreePath server, BeanSearchResults rowResults) {
    TableRow row = new TableRow();
    // Add a cell for each property that exists in this instance on this server
    for (PagePropertyDef propertyDef : sliceTableDef.getAllPropertyDefs()) {
      // The value of the Server property is the server runtime's identity.
      // The value of any other property is the one from the search results.
      Value value =
        "Server".equals(propertyDef.getPropertyName())
          ? server
          : rowResults.getValue(propertyDef);
      if (value != null) {
        row.getCells().add(new TableCell(propertyDef.getFormPropertyName(), value));
      } else {
        // This bean doesn't have a value for this property (e.g. heterogeneous types)
      }
    }
    return row;
  }
}

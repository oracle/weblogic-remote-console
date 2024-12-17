// Copyright (c) 2022, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.SliceTableDef;
import weblogic.remoteconsole.common.repodef.weblogic.AggregatedRuntimeMBeanNameHandler;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PageReaderHelper;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.BaseResource;

/** 
 * Custom code for processing slice tables that aggregate results across server runtime mbeans
 */
public class AggregatedMBeanCustomizer {

  private static final AggregatedRuntimeMBeanNameHandler NAME_HANDLER = AggregatedRuntimeMBeanNameHandler.INSTANCE;

  private AggregatedMBeanCustomizer() {
  }

  public static BaseResource createResource(InvocationContext ic) {
    if (ic.getBeanTreePath().isCollectionChild()) {
      // e.g. ApplicationRuntimes for App1 across servers
      return new AggregatedMBeanCollectionChildBeanResource();
    } else if (ic.getBeanTreePath().isMandatorySingleton()) {
      // e.g. JTARuntime across servers
      return new AggregatedMBeanMandatorySingletonBeanResource();
    }
    return null;
  }

  public static List<TableRow> getSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults overallSearchResults
  ) {
    if (overallSearchResults.getBean(ic.getBeanTreePath()) == null) {
      throw Response.notFoundException();
    }

    // e.g. DomainRuntime.ServerRuntimes.*.Foo.Bar
    Path unfabPath = NAME_HANDLER.getUnfabricatedBeanTreePath(ic.getBeanTreePath()).getPath();

    // The path from a server runtime mbean to the unfabricated mbean
    // i.e. DomainRuntime.ServerRuntimes.*.Foo.Bar -> Foo.Bar
    Path serverRelativePath = unfabPath.subPath(3, unfabPath.length());
  
    PageDef pageDef = ic.getPageRepo().asPageReaderRepo().getPageDef(ic).getResults();
    SliceTableDef sliceTableDef = pageDef.asSliceTableDef();
    BeanReaderRepoSearchResults searchResults =
      findPerServerInstances(ic, sliceTableDef, serverRelativePath);
    return createRows(ic, sliceTableDef, serverRelativePath, searchResults);
  }

  private static BeanReaderRepoSearchResults findPerServerInstances(
    InvocationContext ic,
    SliceTableDef sliceTableDef,
    Path serverRelativePath
  ) {
    BeanTreePath combinedServerRuntimesBTP = getCombinedServerRuntimesBTP(ic);
    // The path to all per-server instances of the bean
    // i.e. DomainRuntime.CombinedServerRuntimes.*.ServerRuntime.Foo.Bar
    BeanTreePath allInstances =
      combinedServerRuntimesBTP
        .childPath(new Path("ServerRuntime"))
        .childPath(serverRelativePath);
    // Create a cross-server-runtime search request based on the columns
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    // Force the query to get something from the server lifecycle runtime
    // otherwise we don't be able to get any search results later:
    builder.addProperty(combinedServerRuntimesBTP, combinedServerRuntimesBTP.getTypeDef().getIdentityPropertyDef());
    for (PagePropertyDef propertyDef : sliceTableDef.getAllPropertyDefs()) {
      builder.addProperty(allInstances, propertyDef);
      getPageReaderHelper(ic).addParamsToSearch(builder, allInstances, propertyDef.getGetValueCustomizerDef());
    }
    // Do the search
    return builder.search().getResults();
  }

  private static List<TableRow> createRows(
    InvocationContext ic,
    SliceTableDef sliceTableDef,
    Path serverRelativePath,
    BeanReaderRepoSearchResults searchResults
  ) {
    // Sort the rows by the server name
    Map<String,TableRow> sortedRows = new TreeMap<>();

    // make a row for each server runtime that has the bean
    for (BeanSearchResults combinedServerResults : searchResults.getCollection(getCombinedServerRuntimesBTP(ic))) {
      BeanTreePath combinedServerRuntimeBTP = combinedServerResults.getBeanTreePath();
      BeanTreePath rowBTP = 
        combinedServerRuntimeBTP
          .childPath(new Path("ServerRuntime"))
          .childPath(serverRelativePath);
      // The results for the bean on this server
      BeanSearchResults rowResults = searchResults.getBean(rowBTP);
      if (rowResults == null) {
        // This bean isn't present on this server.  Don't make a row for it.
      } else {
        // Make a row for this bean (sorted by server name)
        TableRow row = createRow(ic, sliceTableDef, combinedServerRuntimeBTP, rowResults);
        String serverName = combinedServerRuntimeBTP.getLastSegment().getKey();
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

  private static TableRow createRow(
    InvocationContext ic,
    SliceTableDef sliceTableDef,
    BeanTreePath combinedServerRuntimeBTP,
    BeanSearchResults rowResults
  ) {
    TableRow row = new TableRow();
    String serverName = combinedServerRuntimeBTP.getLastSegment().getKey();
    // Add a cell for each property that exists in this instance on this server
    for (PagePropertyDef propertyDef : sliceTableDef.getAllPropertyDefs()) {
      boolean isServer = "Server".equals(propertyDef.getPropertyName());
      // The value of the Server property is the server runtime's identity.
      // The value of any other property is the one from the search results.
      Value value = null;
      if (isServer) {
        value = combinedServerRuntimeBTP;
      } else {
        value =
          getPageReaderHelper(ic).getPropertyValue(
            propertyDef,
            rowResults.getBeanTreePath(),
            rowResults,
            rowResults.getSearchResults(),
            false
          ).getResults();
      }
      if (value != null) {
        row.getCells().add(
          new TableCell(
            propertyDef.getFormFieldName(),
            value
          )
        );
        if (isServer && !sliceTableDef.getActionDefs().isEmpty()) {
          // This slice table has actions and this is the server property.
          // Add an "identifier" property too that's set to the server's name.
          row.setIdentifier(serverName);
        }
      } else {
        // This bean doesn't have a value for this property (e.g. heterogeneous types)
      }
    }
    row.getCells().add(new TableCell("identity", rowResults.getBeanTreePath()));
    return row;
  }

  private static BeanTreePath getCombinedServerRuntimesBTP(InvocationContext ic) {
    return BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), new Path("DomainRuntime.CombinedServerRuntimes"));
  }

  private static PageReaderHelper getPageReaderHelper(InvocationContext ic) {
    return new PageReaderHelper(ic);
  }
}

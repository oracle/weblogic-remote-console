// Copyright (c) 2022, Oracle and/or its affiliates.
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
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.ArrayValue;
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

  public static Response<List<TableRow>> getSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<List<TableRow>> response = new Response<>();
    if (searchResults.getBean(ic.getBeanTreePath()) == null) {
      return response.setNotFound();
    }

    // The path to the server runtimes collection
    BeanTreePath serverRuntimes =
      BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), new Path("DomainRuntime.ServerRuntimes"));

    // e.g. DomainRuntime.ServerRuntimes.*.Foo.Bar
    Path unaggPath = NAME_HANDLER.getUnfabricatedBeanTreePath(ic.getBeanTreePath()).getPath();
    
    // The path from a server runtime mbean to the unaggregated mbean
    // i.e. Domain.ServerRuntimes.*.Foo.Bar -> Foo.Bar
    Path serverRelativePath = unaggPath.subPath(3, unaggPath.length());
  
    Response<PageDef> pageDefResponse = ic.getPageRepo().asPageReaderRepo().getPageDef(ic);
    if (!pageDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(pageDefResponse);      
    }
    SliceTableDef sliceTableDef = pageDefResponse.getResults().asSliceTableDef();
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
        row.getCells().add(
          new TableCell(
            propertyDef.getFormPropertyName(),
            getCellValue(propertyDef, value)
          )
        );
      } else {
        // This bean doesn't have a value for this property (e.g. heterogeneous types)
      }
    }
    return row;
  }

  private static Value getCellValue(PagePropertyDef propertyDef, Value value) {
    if (propertyDef.isReference()) {
      if (propertyDef.isArray()) {
        ArrayValue unfixedReferences = value.asArray();
        List<Value> fixedReferences = new ArrayList<>();
        for (Value unfixedReference : unfixedReferences.getValues()) {
          fixedReferences.add(fixReference(unfixedReference));
        }
        return new ArrayValue(fixedReferences);
      } else {
        return fixReference(value);
      }
    } else {
      return value;
    }
  }

  private static Value fixReference(Value unfixedReference) {
    if (unfixedReference.isBeanTreePath()) {
      BeanTreePath btp = unfixedReference.asBeanTreePath();
      Path path = btp.getPath();
      if (path.length() > 1) {
        if ("DomainRuntime".equals(path.getFirstComponent())) {
          String child = path.getComponents().get(1);
          if ("ServerRuntimes".equals(child) || "ServerLifeCycleRuntimes".equals(child)) {
            return BeanTreePath.create(btp.getBeanRepo(), fixCombinedServerRuntimeReference(path));
          }
        }
      }
    }
    return unfixedReference;
  }

  private static Path fixCombinedServerRuntimeReference(Path unfixedPath) {
    // e.g. convert from
    //   DomainRuntime/ServerRuntimes/Server1/...
    // to
    //   DomainRuntime/CombinedServerRuntimes/Server1/ServerRuntime/...

    Path fixedPath = new Path();
    // DomainRuntime :
    fixedPath.addComponent(unfixedPath.getFirstComponent());
    // DomainRuntime/CombinedServerRuntimes :
    fixedPath.addComponent("CombinedServerRuntimes");
    if (unfixedPath.length() > 2) {
      // We have a server name.  Add it.
      // DomainRuntime/CombinedServerRuntimes/Server1 :
      fixedPath.addComponent(unfixedPath.getComponents().get(2));
    }
    if (unfixedPath.length() > 3) {
      // We have stuff after the server name.
      // Add add the singular name of the uncombined collection and the rest of the stuff
      // after the server name.
  
      // ServerRuntimes or ServerLifeCycleRuntimes :
      String uncombinedCollection = unfixedPath.getComponents().get(1);

      // DomainRuntime/CombinedServerRuntimes/Server1/ServerRuntime :
      fixedPath.addComponent(StringUtils.getSingular(uncombinedCollection));

      // DomainRuntime/CombinedServerRunties/Server1/ServerRuntime/... :
      fixedPath.addPath(unfixedPath.subPath(0, unfixedPath.length()));
    }
    return fixedPath;
  }
}

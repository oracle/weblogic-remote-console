// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.TableDef;

/**
 * This class manages reading a bean tree's table pages and invoking the corresponding actions.
 * It's an internal detail of a PageRepo.
 */
public class TableReader extends PageReader {

  TableReader(InvocationContext invocationContext) {
    super(invocationContext);
  }

  Response<Page> getTable() {
    Response<TableDef> tableDefResponse = getTableDef();
    if (!tableDefResponse.isSuccess()) {
      return new Response<Page>().copyUnsuccessfulResponse(tableDefResponse);
    }
    TableDef tableDef = tableDefResponse.getResults();
    List<BeanPropertyDef> propDefs = createPropertyDefList();
    addPropertyDefsToReturn(propDefs, tableDef);
    return processTableSearchResults(tableDef, propDefs, performTableSearch(propDefs));
  }

  private Response<TableDef> getTableDef() {
    Response<TableDef> response = new Response<>();
    Response<PageDef> pageDefResponse = getPageDef();
    if (!pageDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(pageDefResponse);
    }
    return response.setSuccess(pageDefResponse.getResults().asTableDef());
  }

  private void addPropertyDefsToReturn(List<BeanPropertyDef> propDefs, TableDef tableDef) {
    TableCustomizations customizations = getTableCustomizations(tableDef);
    List<String> displayedColumns =
      customizations != null
        ? customizations.getDisplayedColumns()
        : getTableCustomizationsManager().getDefaultDisplayedColumns(tableDef);
    for (PagePropertyDef propDef : tableDef.getAllPropertyDefs()) {
      if (displayedColumns.contains(propDef.getFormPropertyName()) || !propDef.isDontReturnIfHiddenColumn()) {
        propDefs.add(propDef);
      }
    }
  }

  private Response<BeanReaderRepoSearchResults> performTableSearch(List<BeanPropertyDef> propDefs) {
    // Since tables never display whether a property is set, we don't need to fetch it
    boolean includeIsSet = false;
    BeanReaderRepoSearchBuilder builder =
      getBeanRepo().asBeanReaderRepo().createSearchBuilder(getInvocationContext(), includeIsSet);
    addCollectionToSearch(builder, getBeanTreePath(), propDefs);
    if (builder.isChangeManagerBeanRepoSearchBuilder()) {
      builder.asChangeManagerBeanRepoSearchBuilder().addChangeManagerStatus();
    }
    return builder.search();
  }

  private Response<Page> processTableSearchResults(
    TableDef tableDef,
    List<BeanPropertyDef> propDefs,
    Response<BeanReaderRepoSearchResults> searchResponse
  ) {
    Response<Page> response = new Response<>();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanReaderRepoSearchResults searchResults = searchResponse.getResults();
    Response<PageDef> pageDefResponse = getPageDef();
    if (!pageDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(pageDefResponse);
    }
    Table table = new Table();
    setTableCustomizations(table, tableDef);
    setPageDef(table, pageDefResponse.getResults());
    addPageInfo(table);
    addChangeManagerStatus(table, searchResults);
    addLinks(table, false); // false since it's a collection
    Response<List<BeanSearchResults>> getCollectionResponse =
      getCollectionResults(searchResults, getBeanTreePath(), propDefs);
    if (!getCollectionResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(getCollectionResponse);
    }
    List<BeanSearchResults> collectionResults = getCollectionResponse.getResults();
    if (collectionResults == null) {
      response.setNotFound();
      return response;
    }
    for (BeanSearchResults beanResults : collectionResults) {
      Response<TableRow> rowResponse = createTableRow(beanResults, searchResults, propDefs);
      if (!rowResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(rowResponse);
      }
      table.getRows().add(rowResponse.getResults());
    }
    return response.setSuccess(table);
  }

  private void setTableCustomizations(Table table, TableDef tableDef) {
    TableCustomizations customizations = getTableCustomizations(tableDef);
    if (customizations != null) {
      table.getDisplayedColumns().addAll(customizations.getDisplayedColumns());
    }
  }

  private TableCustomizations getTableCustomizations(TableDef tableDef) {
    return getTableCustomizationsManager().getTableCustomizations(getInvocationContext(), tableDef);
  }

  private TableCustomizationsManager getTableCustomizationsManager() {
    return getInvocationContext().getPageRepo().asPageReaderRepo().getTableCustomizationsManager();
  }

  private Response<TableRow> createTableRow(
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    List<BeanPropertyDef> propDefs
  ) {
    Response<TableRow> response = new Response<>();
    boolean includeIsSet = false;
    Response<BeanTypeDef> rowTypeDefResponse = getRowTypeDef(beanResults, searchResults);
    if (!rowTypeDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(rowTypeDefResponse);
    }
    BeanTypeDef rowTypeDef = rowTypeDefResponse.getResults();
    TableRow row = new TableRow();
    for (BeanPropertyDef propDef : propDefs) {
      Value rowValue = null;
      if (getBeanTreePath().getTypeDef().isHomogeneous() || rowTypeDef.hasPropertyDef(propDef.getPropertyPath())) {
        // The row supports the property.  Get its value.
        Response<Value> valueResponse =
          getPropertyValue(propDef, beanResults, searchResults, includeIsSet);
        if (!valueResponse.isSuccess()) {
          return response.copyUnsuccessfulResponse(valueResponse);
        }
        rowValue = valueResponse.getResults();
      } else {
        // The table is heterogeneous and this row doesn't support the property.
        rowValue = UnknownValue.INSTANCE;
      }
      row.getCells().add(
        new TableCell(propDef.getFormPropertyName(), rowValue)
      );
    }
    return response.setSuccess(row);
  }

  private Response<BeanTypeDef> getRowTypeDef(
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults
  ) {
    return getActualTypeDef(beanResults.getBeanTreePath(), beanResults, searchResults);
  }
}

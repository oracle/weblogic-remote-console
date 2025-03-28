// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.TableDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;

/**
 * This class manages reading a bean tree's table pages and invoking the corresponding actions.
 * It's an internal detail of a PageRepo.
 */
public class TableReader extends PageReader {

  private static final Type GET_TABLE_ROWS_CUSTOMIZER_RETURN_TYPE =
    (new TypeReference<List<TableRow>>() {}).getType();

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
    return processTableSearchResults(tableDef, propDefs, performTableSearch(tableDef, propDefs));
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
      if (displayedColumns.contains(propDef.getFormFieldName()) || !propDef.isDontReturnIfHiddenColumn()) {
        propDefs.add(propDef);
      }
    }
  }

  private Response<BeanReaderRepoSearchResults> performTableSearch(
    TableDef tableDef,
    List<BeanPropertyDef> propDefs
  ) {
    // Since tables never display whether a property is set, we don't need to fetch it
    boolean includeIsSet = false;
    BeanReaderRepoSearchBuilder builder =
      getBeanRepo().asBeanReaderRepo().createSearchBuilder(getInvocationContext(), includeIsSet);
    if (populateRows(tableDef)) {
      addCollectionToSearch(builder, getBeanTreePath(), propDefs);
    }
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
    Response<List<TableRow>> rowsResponse =
      populateRows(tableDef)
        ? getRowsStandard(propDefs, searchResults)
        : getRowsCustom(tableDef, searchResults);
    if (!rowsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(rowsResponse);
    }
    table.getRows().clear();
    table.getRows().addAll(rowsResponse.getResults());
    return response.setSuccess(table);
  }

  private Response<List<TableRow>> getRowsStandard(
    List<BeanPropertyDef> propDefs,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<List<TableRow>> response = new Response<>();
    List<TableRow> rows = new ArrayList<>();
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
      rows.add(rowResponse.getResults());
    }
    return response.setSuccess(rows);
  }

  private boolean populateRows(TableDef tableDef) {
    return StringUtils.isEmpty(tableDef.getGetTableRowsMethod());
  }

  private Response<List<TableRow>> getRowsCustom(
    TableDef tableDef,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<List<TableRow>> response = new Response<>();
    Method method = CustomizerInvocationUtils.getMethod(tableDef.getGetTableRowsMethod());
    CustomizerInvocationUtils.checkSignature(
      method,
      GET_TABLE_ROWS_CUSTOMIZER_RETURN_TYPE,
      InvocationContext.class,
      BeanReaderRepoSearchResults.class
    );
    InvocationContext actualIc = new InvocationContext(getInvocationContext());
    actualIc.setPagePath(tableDef.getPagePath());
    List<Object> args = List.of(actualIc, searchResults);
    try {
      Object responseAsObject = CustomizerInvocationUtils.invokeMethod(method, args);
      @SuppressWarnings("unchecked")
      List<TableRow> rows = (List<TableRow>)responseAsObject;
      return response.setSuccess(rows);
    } catch (ResponseException e) {
      return response.copyUnsuccessfulResponse(e.getResponse());
    }
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
    InvocationContext ic = getInvocationContext();
    return ic.getPageRepo().asPageReaderRepo().getTableCustomizationsManager(ic);
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
        new TableCell(propDef.getFormFieldName(), rowValue)
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

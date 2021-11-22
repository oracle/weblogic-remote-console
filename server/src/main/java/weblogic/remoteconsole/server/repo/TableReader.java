// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
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
    List<BeanPropertyDef> propDefs = getTablePropertyDefs();
    return processTableSearchResults(propDefs, performTableSearch(propDefs));
  }

  private List<BeanPropertyDef> getTablePropertyDefs() {
    List<BeanPropertyDef> propDefs = createPropertyDefList();
    propDefs.addAll(getTableDef().getAllPropertyDefs());
    return propDefs;
  }

  private TableDef getTableDef() {
    return getPageRepoDef().getPageDef(getPagePath()).asTableDef();
  }

  private Response<BeanReaderRepoSearchResults> performTableSearch(
    List<BeanPropertyDef> propDefs
  ) {
    // Since tables never display whether a property is set, we don't need to fetch it
    boolean includeIsSet = false;
    BeanReaderRepoSearchBuilder builder =
      getBeanRepo().asBeanReaderRepo().createSearchBuilder(getInvocationContext(), includeIsSet);
    for (BeanPropertyDef propDef : propDefs) {
      builder.addProperty(getBeanTreePath(), propDef);
      addParamsToSearch(builder, getBeanTreePath(), propDef.getGetValueCustomizerDef());
    }
    if (getBeanTreePath().getTypeDef().isHeterogeneous()) {
      addSubTypeDiscriminatorToSearch(getBeanTreePath(), builder);
    }
    if (builder.isChangeManagerBeanRepoSearchBuilder()) {
      builder.asChangeManagerBeanRepoSearchBuilder().addChangeManagerStatus();
    }
    return builder.search();
  }

  private Response<Page> processTableSearchResults(
    List<BeanPropertyDef> propDefs,
    Response<BeanReaderRepoSearchResults> searchResponse
  ) {
    Response<Page> response = new Response<>();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanReaderRepoSearchResults searchResults = searchResponse.getResults();
    Table table = new Table();
    table.setPageDef(getTableDef());
    addPageInfo(table);
    addChangeManagerStatus(table, searchResults);
    addLinks(table, false); // false since it's a collection
    List<BeanSearchResults> collectionResults =
      searchResults.getCollection(getBeanTreePath());
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
    Response<BeanTypeDef> response = new Response<>();
    if (getBeanTreePath().getTypeDef().isHomogeneous()) {
      return response.setSuccess(getBeanTreePath().getTypeDef());
    }
    BeanTreePath rowBeanTreePath = beanResults.getBeanTreePath();
    Response<String> discResponse = getSubTypeDiscriminatorValue(rowBeanTreePath, searchResults);
    if (!discResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(discResponse);
    }
    String subTypeDiscriminator = discResponse.getResults();
    return response.setSuccess(getBeanTreePath().getTypeDef().getSubTypeDef(subTypeDiscriminator));
  }
}

// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SearchBeanFilter;
import weblogic.remoteconsole.server.repo.SearchBeanFinder;
import weblogic.remoteconsole.server.repo.SearchBeanPropertyResults;
import weblogic.remoteconsole.server.repo.SearchBeanResults;
import weblogic.remoteconsole.server.repo.SearchCriteria;
import weblogic.remoteconsole.server.repo.SearchValueFilter;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.SearchResponseMapper;

/** 
 * Custom code for processing a bean that can be referenced by another bean
 */
public class ReferenceableBeanCustomizer {

  private ReferenceableBeanCustomizer() {
  }

  public static Response<List<TableRow>> getReferencedBySliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<List<TableRow>> response = new Response<>();
    Response<List<SearchBeanResults>> findResponse = findReferrers(ic);
    if (!findResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(findResponse);
    }
    return response.setSuccess(formatReferrers(ic, findResponse.getResults()));
  }
  
  private static List<TableRow> formatReferrers(InvocationContext ic, List<SearchBeanResults> referrers) {
    Map<Path,TableRow> sorter = new TreeMap<>();
    for (SearchBeanResults referrer : referrers) {
      TableRow row = new TableRow();
      String name = SearchResponseMapper.getBeanName(ic, referrer);
      String type = SearchResponseMapper.getBeanType(ic, referrer);
      String path = SearchResponseMapper.getBeanPath(ic, referrer);
      row.getCells().add(new TableCell("identity", referrer.getBeanTreePath()));
      row.getCells().add(new TableCell("Name", new StringValue(name)));
      row.getCells().add(new TableCell("Type", new StringValue(type)));
      row.getCells().add(new TableCell("Properties", getReferrerProperties(ic, referrer)));
      row.getCells().add(new TableCell("Path", new StringValue(path)));
      sorter.put(SearchResponseMapper.getSortingKey(ic, referrer), row);
    }
    List<TableRow> rows = new ArrayList<>();
    rows.addAll(sorter.values());
    return rows;
  }

  private static ArrayValue getReferrerProperties(InvocationContext ic, SearchBeanResults referrer) {
    Map<String,Value> sorter = new TreeMap<>();
    for (SearchBeanPropertyResults property : referrer.getPropertiesResults()) {
      String label = ic.getLocalizer().localizeString(property.getPropertyDef().getLabel());
      sorter.put(label, new StringValue(label));
    }
    List<Value> properties = new ArrayList<>();
    properties.addAll(sorter.values());
    return new ArrayValue(properties);
  }

  private static Response<List<SearchBeanResults>> findReferrers(InvocationContext ic) {
    Response<List<SearchBeanResults>> response = new Response<>();
    SearchValueFilter valueFilter = new SearchValueFilter();
    valueFilter.setEquals(ic.getBeanTreePath());
    SearchBeanFilter beanFilter = new SearchBeanFilter();
    beanFilter.setPropertyType(SearchBeanFilter.PropertyType.REFERENCE);
    beanFilter.setValueFilter(valueFilter);
    SearchCriteria criteria = new SearchCriteria();
    criteria.setFilters(List.of(beanFilter));
    criteria.setProperties(new ArrayList<>());
    SearchBeanFinder finder = new SearchBeanFinder(ic, criteria);
    boolean includeIsSet = false;
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, includeIsSet);
    finder.addToSearchBuilder(builder);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    List<SearchBeanResults> searchResults = finder.getResults(searchResponse.getResults());
    return response.setSuccess(searchResults);
  }
}

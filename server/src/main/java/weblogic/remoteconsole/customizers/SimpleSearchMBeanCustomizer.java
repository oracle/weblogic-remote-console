// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.CustomBeanSearchResults;
import weblogic.remoteconsole.server.repo.DateValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.LongValue;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SearchBeanResults;
import weblogic.remoteconsole.server.repo.SimpleSearch;
import weblogic.remoteconsole.server.repo.SimpleSearchManager;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.webapp.SearchResponseMapper;

/** 
 * Custom code for processing SimpleSearchMBean
 */
public class SimpleSearchMBeanCustomizer {

  private SimpleSearchMBeanCustomizer() {
  }

  public static Response<Void> customizePage(InvocationContext ic, Page page) {
    Response<Void> response = new Response<>();
    String searchName = getRecentSearchName(ic);
    if (searchName == null) {
      return response.setNotFound();
    }
    Response<SimpleSearch> resultsResponse =
      getSimpleSearchManager(ic).getSearchResults(ic, searchName);
    if (!resultsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(resultsResponse);
    }
    Map<Path,TableRow> sorter = new TreeMap<>();
    SimpleSearch search = resultsResponse.getResults();
    for (SearchBeanResults beanResults : search.getResults()) {
      TableRow row = new TableRow();
      String name =  SearchResponseMapper.getBeanName(ic, beanResults);
      String path = SearchResponseMapper.getBeanPath(ic, beanResults);
      String type = SearchResponseMapper.getBeanType(ic, beanResults);
      row.getCells().add(new TableCell("Name", new StringValue(name)));
      row.getCells().add(new TableCell("Type", new StringValue(type)));
      row.getCells().add(new TableCell("Path", new StringValue(path)));
      row.getCells().add(new TableCell("identity", beanResults.getBeanTreePath()));
      sorter.put(SearchResponseMapper.getSortingKey(ic, beanResults), row);
    }
    page.asTable().getRows().addAll(sorter.values());
    page.setLocalizedIntroductionHTML(
      ic.getLocalizer().localizeString(
        page.getPageDef().getIntroductionHTML(),
        search.getName(),
        ic.getLocalizer().formatDate(search.getResultsDate())
      )
    );
    return response.setSuccess(null);
  }

  public static Response<List<BeanSearchResults>> getCollection(
    InvocationContext ic,
    BeanTreePath collectionPath,
    BeanReaderRepoSearchResults searchResults,
    List<BeanPropertyDef> propertyDefs
  ) {
    BeanTypeDef typeDef = collectionPath.getTypeDef();
    List<BeanSearchResults> collectionResults = new ArrayList<>();
    String language = getSimpleSearchManager(ic).getLanguage(ic);
    for (SimpleSearch search : getRecentSearches(ic)) {
      String searchName = search.getName();
      BeanTreePath childPath =
        BeanTreePath.create(
          collectionPath.getBeanRepo(),
          collectionPath.getPath().childPath(searchName)
        );
      CustomBeanSearchResults beanResults = new CustomBeanSearchResults(searchResults, childPath);
      beanResults.addPropertyResults(
        typeDef.getIdentityPropertyDef(),
        childPath
      );
      beanResults.addPropertyResults(
        typeDef.getPropertyDef(new Path("Name")),
        new StringValue(searchName)
      );
      if (search.getResults() != null && search.getLanguage().equals(language)) {
        // We've done this search earlier
        // Return when it was last done and how many matches there were
        beanResults.addPropertyResults(
          typeDef.getPropertyDef(new Path("Date")),
          new DateValue(search.getResultsDate())
        );
        beanResults.addPropertyResults(
          typeDef.getPropertyDef(new Path("NumberOfMatches")),
          new LongValue(search.getResults().size())
        );
      } else {
        // We haven't done this search yet (i.e. it's been created but now displayed yet)
      }
      collectionResults.add(beanResults);
    }
    return new Response<List<BeanSearchResults>>().setSuccess(collectionResults);
  }

  private static String getRecentSearchName(InvocationContext ic) {
    String search = ic.getBeanTreePath().getLastSegment().getKey();
    for (SimpleSearch s : getRecentSearches(ic)) {
      if (s.getName().equals(search)) {
        return search;
      }
    }
    return null; // not found
  }

  private static List<SimpleSearch> getRecentSearches(InvocationContext ic) {
    return getSimpleSearchManager(ic).getRecentSearches(ic);
  }

  private static SimpleSearchManager getSimpleSearchManager(InvocationContext ic) {
    return ic.getPageRepo().asPageReaderRepo().getSimpleSearchManager();
  }
}

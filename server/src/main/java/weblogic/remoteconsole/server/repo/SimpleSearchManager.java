// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import weblogic.remoteconsole.server.PersistableFeature;
import weblogic.remoteconsole.server.PersistenceManager;

/**
 * Utility class for managing recent simple searches, including their persistence.
 */
public class SimpleSearchManager extends PersistableFeature<PersistedRecentSearches> {

  private static final PersistenceManager<PersistedRecentSearches> PERSISTENCE_MANAGER =
    new PersistenceManager<>(PersistedRecentSearches.class, "recent-searches");

  private List<SimpleSearch> recentSearches = new ArrayList<>();

  private static final int MAX_CACHED_SEARCHES = 25;

  // Search results are not cached when they take less that this amount of time to fetch:
  private static final int MINIMUM_CACHEABLE_SEARCH_TIME = 3 * 1000; // milliseconds

  // Cache search results for this many times how long it took to compute them.
  // For example, if it takes 10 seconds to do a search, don't bother redoing the search
  // for 50 seconds (unless the user explicitly does a reload)
  private static final int SEARCH_TIME_TO_EXPIRATION_TIME = 5;

  SimpleSearchManager() {
  }

  @Override
  protected PersistenceManager<PersistedRecentSearches> getPersistenceManager() {
    return PERSISTENCE_MANAGER;
  }

  @Override
  protected void fromPersistedData(InvocationContext ic, PersistedRecentSearches persistedData) {
    List<SimpleSearch> newRecentSearches = new ArrayList<>();
    if (persistedData != null) {
      for (String recentSearch : persistedData.getRecentSearches()) {
        if (newRecentSearches.size() >= MAX_CACHED_SEARCHES) {
          break;
        }
        SimpleSearch search = findSimpleSearch(ic, recentSearch, false); // don't move to top
        if (search == null) {
          SimpleSearchCriteria criteria = new SimpleSearchCriteria();
          criteria.setContains(recentSearch);
          search = new SimpleSearch(criteria, "unknown", null, null, null); // unknown language
        }
        newRecentSearches.add(search);
      }
    }
    recentSearches.clear();
    recentSearches.addAll(newRecentSearches);
  }

  @Override
  protected PersistedRecentSearches toPersistedData(InvocationContext ic) {
    List<String> searchNames = new ArrayList<>();
    for (SimpleSearch recentSearch : recentSearches) {
      searchNames.add(recentSearch.getName());
    }
    PersistedRecentSearches rtn = new PersistedRecentSearches();
    rtn.setRecentSearches(searchNames);
    return rtn;
  }

  public synchronized List<SimpleSearch> getRecentSearches(InvocationContext ic) {
    refresh(ic);
    return List.copyOf(recentSearches);
  }

  // Create a new simple search.
  //
  // 'contains' is the localized pattern to search for.  It is also used to name the search.
  //
  // the search finds any bean whose nav tree node name (or the bean's collection's
  // nav tree node name) contains 'contains' (any case, white space insensitve)
  //
  // Returns whether the search was successful as well as the new search's name.
  public synchronized Response<String> createSearch(InvocationContext ic, SimpleSearchCriteria criteria) {
    refresh(ic);
    Response<String> response = new Response<>();
    // Add the search to the list of recent searches but don't actually do it yet.
    // That will happen later when getSearchResults is called.
    SimpleSearch search = new SimpleSearch(criteria, getLanguage(ic), null, null, null);
    recordSearch(ic, search);
    return response.setSuccess(search.getName());
  }

  private void recordSearch(InvocationContext ic, SimpleSearch newSearch) {
    List<SimpleSearch> newSearches = new ArrayList<>();
    newSearches.add(newSearch);
    for (SimpleSearch oldSearch : recentSearches) {
      if (newSearches.size() >= MAX_CACHED_SEARCHES) {
        break;
      }
      if (!oldSearch.getName().equals(newSearch.getName())) {
        newSearches.add(oldSearch);
      }
    }
    recentSearches.clear();
    recentSearches.addAll(newSearches);
    update(ic);
  }

  // Get the results for a recent search.
  //
  // Returns NotFound if 'searchName' is not the name of a recent search in ic's locale.
  public synchronized Response<SimpleSearch> getSearchResults(InvocationContext ic, String searchName) {
    refresh(ic);
    Response<SimpleSearch> response = new Response<>();
    SimpleSearch search = findSimpleSearch(ic, searchName, true); // move to top
    if (search == null) {
      return response.setNotFound();
    }
    String language = getLanguage(ic);
    if (!ic.isReload() && search.isCurrent() && language.equals(search.getLanguage())) {
      // Reuse the cached search results
      return response.setSuccess(search);
    }
    // Do the search, cache it and return it.
    long startTime = System.currentTimeMillis();
    Response<List<SearchBeanResults>> searchResponse = doSearch(ic, search.getCriteria());
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    long endTime = System.currentTimeMillis();
    SimpleSearch newSearch =
      new SimpleSearch(
        search.getCriteria(),
        language,
        searchResponse.getResults(),
        new Date(endTime), // results date
        getExpirationDate(startTime, endTime)
      );
    recordSearch(ic, newSearch);
    return response.setSuccess(newSearch);
  }

  private SimpleSearch findSimpleSearch(InvocationContext ic, String searchName, boolean moveToTop) {
    for (int i = 0; i < recentSearches.size(); i++) {
      SimpleSearch search = recentSearches.get(i);
      if (search.getName().equals(searchName)) {
        if (i != 0 && moveToTop) {
          // Move it to the top of the list since it's the most recently used one now
          recentSearches.remove(i);
          recentSearches.add(0, search);
          update(ic);
        }
        return search;
      }
    }
    return null;
  }

  public String getLanguage(InvocationContext ic) {
    // close enough, i.e. en and en_US are considered the same:
    return ic.getLocalizer().getLocale().getLanguage();
  }

  private Response<List<SearchBeanResults>> doSearch(InvocationContext ic, SimpleSearchCriteria criteria) {
    Response<List<SearchBeanResults>> response = new Response<>();
    SearchBeanFilter filter = new SearchBeanFilter();
    filter.setPathContains(criteria.getContains());
    SearchCriteria genericCriteria = new SearchCriteria();
    genericCriteria.setFilters(List.of(filter));
    genericCriteria.setProperties(new ArrayList<>());
    SearchBeanFinder finder = new SearchBeanFinder(ic, genericCriteria);
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

  private Date getExpirationDate(long startTime, long endTime) {
    long searchTime = endTime - startTime;
    if (searchTime < MINIMUM_CACHEABLE_SEARCH_TIME) {
      return new Date(endTime);
    } else {
      long expirationTime = endTime + (SEARCH_TIME_TO_EXPIRATION_TIME  * searchTime);
      return new Date(expirationTime);
    }
  }
}

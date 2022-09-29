// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import weblogic.remoteconsole.common.repodef.BeanChildNavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.NavTreeDef;
import weblogic.remoteconsole.common.repodef.NavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Perform a general search.
 * 
 * The caller passes in  SearchCriteria indicating which beans and properties to return.
 * 
 * Returns the search results as a List<SearchBeanResults>.
 */
public class SearchBeanFinder extends PageReader {
  private SearchCriteria criteria;
  private List<SearchBeanFilterHandler> filterHandlers = new ArrayList<>();
  private List<SearchPropertyHandler> propertyHandlers = new ArrayList<>();

  // base type -> instantiable types:
  private Map<String,List<BeanTypeDef>> typeNameToTypeDefs = new HashMap<>();

  public SearchBeanFinder(
    InvocationContext ic,
    SearchCriteria criteria
  ) {
    super(ic);
    this.criteria = criteria;
    for (SearchBeanFilter filter : criteria.getFilters()) {
      filterHandlers.add(SearchBeanFilterHandler.getHandler(this, filter));
    }
    for (SearchProperty property : criteria.getProperties()) {
      propertyHandlers.add(SearchPropertyHandler.getHandler(this, property));
    }
  }

  public void addToSearchBuilder(BeanReaderRepoSearchBuilder searchBuilder) {
    new FinderSearchBuilder(
      BeanTreePath.create(getInvocationContext().getPageRepo().getBeanRepo(), new Path()),
      searchBuilder
    ).addToSearchBuilder();
  }

  public List<SearchBeanResults> getResults(BeanReaderRepoSearchResults searchResults) {
    List<SearchBeanResults> unsortedResults = new ArrayList<>();
    new FinderResults(
      BeanTreePath.create(getInvocationContext().getPageRepo().getBeanRepo(), new Path()),
      searchResults,
      unsortedResults
    ).findResults();
    Map<String,SearchBeanResults> sorter = new TreeMap<>();
    for (SearchBeanResults beanResults : unsortedResults) {
      sorter.put(beanResults.getBeanTreePath().getPath().getDotSeparatedPath(), beanResults);
    }
    return List.copyOf(sorter.values());
  }

  SearchCriteria getCriteria() {
    return criteria;
  }

  private class FinderSearchBuilder {
    private String indent;
    private BeanReaderRepoSearchBuilder searchBuilder;
    private BeanTreePath beanTreePath;
    private boolean addedThisOrChildToSearch = false;

    private FinderSearchBuilder(BeanTreePath beanTreePath, BeanReaderRepoSearchBuilder searchBuilder) {
      this.indent = "";
      this.beanTreePath = beanTreePath;
      this.searchBuilder = searchBuilder;
    }

    private FinderSearchBuilder(BeanTreePath beanTreePath, FinderSearchBuilder parent) {
      this.beanTreePath = beanTreePath;
      this.indent = parent.indent + "  ";
      this.searchBuilder = parent.searchBuilder;
    }

    private void addToSearchBuilder() {
      if (isRecursive()) {
        return;
      }
      if (matchesDesiredBeanType(beanTreePath)) {
        addedThisOrChildToSearch = true;
        addProperties();
      }
      addChildrenToSearch();
      if (addedThisOrChildToSearch && beanTreePath.getTypeDef().isHeterogeneous()) {
        addSubTypeDiscriminatorToSearch(beanTreePath, searchBuilder);
      }
    }

    private boolean matchesDesiredBeanType(BeanTreePath beanTreePath) {
      boolean matchedAFilter = false;
      for (SearchBeanFilterHandler handler : filterHandlers) {
        if (handler.beanTypePassesFilter(beanTreePath)) {
          matchedAFilter = true;
        } else {
          if (handler.getFilter().isRequired()) {
            return false; // skip the bean
          }
        }
      }
      if (!matchedAFilter) {
        return false; // skip the bean
      }
      return true;
    }

    private boolean isRecursive() {
      int count = 0;
      List<BeanTreePathSegment> segments = beanTreePath.getSegments();
      String currentType = beanTreePath.getTypeDef().getTypeName();
      for (int i = 0; i < segments.size() - 1; i++) { // don't check the last segment
        String segmentType = segments.get(i).getChildDef().getChildTypeDef().getTypeName();
        if (segmentType.equals(currentType)) {
          count++;
          if (count > 1) {
            // allow .../foo/.../foo
            // don't allow .../foo/.../foo/.../foo
            return true;
          }
        }
      }
      return false;
    }

    private void addProperties() {
      BeanTypeDef thisTypeDef = beanTreePath.getTypeDef();
      addProperty(thisTypeDef.getIdentityPropertyDef());
      addProperty(thisTypeDef.getKeyPropertyDef());
      for (SearchBeanFilterHandler handler : filterHandlers) {
        for (PagePropertyDef propertyDef : handler.getPropertyDefs(beanTreePath)) {
          addProperty(propertyDef);
        }
      }
      for (SearchPropertyHandler handler : propertyHandlers) {
        for (PagePropertyDef propertyDef : handler.getPropertyDefs(beanTreePath)) {
          addProperty(propertyDef);
        }
      }
    }

    private void addProperty(BeanPropertyDef propertyDef) {
      if (propertyDef != null) {
        searchBuilder.addProperty(beanTreePath, propertyDef);
        addParamsToSearch(searchBuilder, beanTreePath, propertyDef.getGetValueCustomizerDef());
      }
    }

    private void addChildrenToSearch() {
      if (beanTreePath.getPath().isEmpty()) {
        addNavTreeNodesToSearch(
          getInvocationContext().getPageRepo().getPageRepoDef().getRootNavTreeDef()
        );
      } else {
        for (BeanTypeDef typeDef : getTypeDefs(beanTreePath)) {
          addNavTreeNodesToSearch(
            getInvocationContext().getPageRepo().getPageRepoDef().getNavTreeDef(typeDef)
          );
        }
      }
    }

    private void addNavTreeNodesToSearch(NavTreeDef navTreeDef) {
      if (navTreeDef != null) {
        addNavTreeNodesToSearch(navTreeDef.getContentDefs());      
      }
    }
  
    private void addNavTreeNodesToSearch(List<NavTreeNodeDef> nodeDefs) {
      for (NavTreeNodeDef nodeDef : nodeDefs) {
        addNavTreeNodeToSearch(nodeDef);
      }
    }

    private void addNavTreeNodeToSearch(NavTreeNodeDef nodeDef) {
      if (nodeDef.isGroupNodeDef()) {
        addNavTreeNodesToSearch(nodeDef.asGroupNodeDef().getContentDefs());
        return;
      }
      BeanChildNavTreeNodeDef childNodeDef = nodeDef.asChildNodeDef();
      FinderSearchBuilder childBuilder =
        new FinderSearchBuilder(beanTreePath.childPath(childNodeDef.getChildNodePath()), this);
      childBuilder.addToSearchBuilder();
      if (childBuilder.addedThisOrChildToSearch) {
        addedThisOrChildToSearch = true;
      }
    }
  }

  private class FinderResults {
    private String indent;
    private BeanTreePath beanTreePath;
    private BeanReaderRepoSearchResults searchResults;
    private BeanSearchResults beanResults;
    List<SearchBeanResults> results;

    private FinderResults(
      BeanTreePath beanTreePath,
      BeanReaderRepoSearchResults searchResults,
      List<SearchBeanResults> results
    ) {
      this.indent = "";
      this.beanTreePath = beanTreePath;
      this.searchResults = searchResults;
      this.results = results;
    }

    private FinderResults(BeanTreePath beanTreePath, FinderResults parent) {
      this.beanTreePath = beanTreePath;
      this.indent = parent.indent + "  ";
      this.searchResults = parent.searchResults;
      this.beanResults = parent.beanResults;
      this.results = parent.results;
    }

    private void findResults() {
      if (beanTreePath.isCollection()) {
        List<BeanSearchResults> collectionResults = searchResults.getCollection(beanTreePath);
        if (collectionResults != null) {
          for (BeanSearchResults br : collectionResults) {
            findBeanResults(br);
          }
        }
      } else {
        BeanSearchResults br = searchResults.getBean(beanTreePath);
        if (br != null) {
          findBeanResults(br);
        }
      }
    }

    private void findBeanResults(BeanSearchResults br) {
      this.beanResults = br;
      findProperties();
      findChildrenResults();
    }

    private void findProperties() {
      boolean haveAnOptionalFilter = false;
      boolean passedAnOptionalFilter = false;
      // in case more than one handler returns the same property:
      Map<String,SearchBeanPropertyResults> propertyNameToPropertyResults = new HashMap<>();
      for (SearchBeanFilterHandler handler : filterHandlers) {
        boolean required = handler.getFilter().isRequired();
        boolean passes = handler.beanPassesFilter(beanResults);
        if (!required) {
          haveAnOptionalFilter = true;
          if (passes) {
            passedAnOptionalFilter = true;
          }
        } else {
          if (!passes) {
            return; // skip the bean
          }
        }
        collectPropertyResults(propertyNameToPropertyResults, handler.getResults());
      }
      if (haveAnOptionalFilter && !passedAnOptionalFilter) {
        return; // skip the bean
      }
      for (SearchPropertyHandler handler : propertyHandlers) {
        collectPropertyResults(propertyNameToPropertyResults, handler.getResults(beanResults));
      }
      Response<BeanTypeDef> typeResponse =
        getActualTypeDef(beanResults.getBeanTreePath(), beanResults.getSearchResults());
      if (!typeResponse.isSuccess()) {
        // There was a problem fetching this value.
        // Should we log the problem and keep going?
        // Should we return the problem to the user and fail the entire search?
        // Should we return the problem(s) to the user and keep going?
        return; // skip the bean
      }
      SearchBeanResults searchBeanResults =
        new SearchBeanResults(beanResults.getBeanTreePath(), typeResponse.getResults());
      searchBeanResults.getPropertiesResults().addAll(propertyNameToPropertyResults.values());
      results.add(searchBeanResults);
    }
  
    private void collectPropertyResults(
      Map<String,SearchBeanPropertyResults> propertyNameToPropertyResults,
      List<SearchBeanPropertyResults> propertiesResults
    ) {
      for (SearchBeanPropertyResults propertyResults : propertiesResults) {
        String propertyName = propertyResults.getPropertyDef().getPropertyPath().toString();
        propertyNameToPropertyResults.put(propertyName, propertyResults);
      }
    }

    private void findChildrenResults() {
      if (beanTreePath.getPath().isEmpty()) {
        findNavTreeNodesResults(
          getInvocationContext().getPageRepo().getPageRepoDef().getRootNavTreeDef()
        );
      } else {
        for (BeanTypeDef typeDef : getTypeDefs(beanTreePath)) {
          findNavTreeNodesResults(
            getInvocationContext().getPageRepo().getPageRepoDef().getNavTreeDef(typeDef)
          );
        }
      }
    }

    private void findNavTreeNodesResults(NavTreeDef navTreeDef) {
      if (navTreeDef != null) {
        findNavTreeNodesResults(navTreeDef.getContentDefs());
      }
    }
  
    private void findNavTreeNodesResults(List<NavTreeNodeDef> nodeDefs) {
      for (NavTreeNodeDef nodeDef : nodeDefs) {
        findNavTreeNodeResults(nodeDef);
      }
    }

    private void findNavTreeNodeResults(NavTreeNodeDef nodeDef) {
      if (nodeDef.isGroupNodeDef()) {
        findNavTreeNodesResults(nodeDef.asGroupNodeDef().getContentDefs());
        return;
      }
      BeanChildNavTreeNodeDef childNodeDef = nodeDef.asChildNodeDef();
      new FinderResults(
        beanResults.getBeanTreePath().childPath(childNodeDef.getChildNodePath()),
        this
      ).findResults();
    }
  }

  SearchBeanPropertyResults findProperty(PagePropertyDef propertyDef, BeanSearchResults beanResults) {
    if (propertyDef == null) {
      return null;
    }
    Response<Value> response = getPropertyValue(propertyDef, beanResults, beanResults.getSearchResults(), false);
    if (!response.isSuccess()) {
      // There was a problem fetching this value.
      // Should we log the problem and keep going?
      // Should we return the problem to the user and fail the entire search?
      // Should we return the problem(s) to the user and keep going?
      return null;
    }
    Value value = response.getResults();
    if (value == null) {
      // This bean doesn't have this property
      return null;
    }
    return new SearchBeanPropertyResults(propertyDef, value);
  }

  void addPropertyDefMatchingPropertyName(
    BeanTreePath beanTreePath,
    List<PagePropertyDef> propertyDefs,
    String want
  ) {
    if (StringUtils.isEmpty(want)) {
      return;
    }
    for (BeanTypeDef typeDef : getTypeDefs(beanTreePath)) {
      PagePropertyDef propertyDef = getPagePropertyDefs(typeDef).get(want);
      if (propertyDef != null) {
        propertyDefs.add(propertyDef);
        return; // the first match is good enough
      }
    }
  }

  void addPropertyDefsMatchingPropertyNameContains(
    BeanTreePath beanTreePath,
    List<PagePropertyDef> propertyDefs,
    String want
  ) {
    if (StringUtils.isEmpty(want)) {
      return;
    }
    for (BeanTypeDef typeDef : getTypeDefs(beanTreePath)) {
      for (PagePropertyDef propertyDef : getPagePropertyDefs(typeDef).values()) {
        if (contains(propertyDef.getPropertyName(), want)) {
          propertyDefs.add(propertyDef);
        }
      }
    }
  }

  void addPropertyDefsMatchingPropertyLabelContains(
    BeanTreePath beanTreePath,
    List<PagePropertyDef> propertyDefs,
    String want
  ) {
    if (StringUtils.isEmpty(want)) {
      return;
    }
    for (BeanTypeDef typeDef : getTypeDefs(beanTreePath)) {
      for (PagePropertyDef propertyDef : getPagePropertyDefs(typeDef).values()) {
        String localizedPropertyLabel =
          getInvocationContext().getLocalizer().localizeString(propertyDef.getLabel());
        if (contains(localizedPropertyLabel, want)) {
          propertyDefs.add(propertyDef);
        }
      }
    }
  }

  private Map<String,PagePropertyDef> getPagePropertyDefs(BeanTypeDef typeDef) {
    return SearchUtils.getPagePropertyDefs(getPageRepoDef(), typeDef);
  }

  void addPropertyDefsMatchingPropertyType(
    BeanTreePath beanTreePath,
    List<PagePropertyDef> propertyDefs,
    SearchBeanFilter.PropertyType want
  ) {
    if (want == null) {
      return;
    }
    for (BeanTypeDef typeDef : getTypeDefs(beanTreePath)) {
      for (PagePropertyDef propertyDef : getPagePropertyDefs(typeDef).values()) {
        if (propertyDefIsPropertyType(propertyDef, want)) {
          propertyDefs.add(propertyDef);
        }
      }
    }
  }

  private boolean propertyDefIsPropertyType(PagePropertyDef propertyDef, SearchBeanFilter.PropertyType want) {
    if (want == SearchBeanFilter.PropertyType.HEALTH_STATE) {
      return propertyDef.isHealthState();
    }
    if (want == SearchBeanFilter.PropertyType.REFERENCE) {
      return !propertyDef.isIdentity() && propertyDef.isReference();
    }
    throw new AssertionError("Unknown property type: " + want);
  }

  private List<BeanTypeDef> getTypeDefs(BeanTreePath beanTreePath) {
    String typeName = beanTreePath.getTypeDef().getTypeName();
    List<BeanTypeDef> rtn = typeNameToTypeDefs.get(typeName);
    if (rtn == null) {
      rtn = SearchUtils.getTypeDefs(beanTreePath.getTypeDef());
      typeNameToTypeDefs.put(typeName, rtn);
    }
    return rtn;
  }

  boolean contains(String have, String want) {
    return normalize(have).contains(normalize(want));
  }

  private String normalize(String str) {
    // make sure the string isn't null, convert it to lower case then remove any whitespace
    return StringUtils.nonNull(str).toLowerCase().replaceAll("\\s","");
  }
}

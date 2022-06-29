// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.SearchBeanFilter.IncludeInResults;

/**
 * Handle filtering a bean as part of a general search
 */
public abstract class SearchBeanFilterHandler {

  private SearchBeanFinder finder;
  private SearchBeanFilter filter;
  private Map<String,List<PagePropertyDef>> typeNameToPropertyDefs = new HashMap<>();

  private List<SearchBeanPropertyResults> results = new ArrayList<>();

  static SearchBeanFilterHandler getHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
    if (filter.getBeanTreePath() != null) {
      return new BeanTreePathHandler(finder, filter);
    }
    if (filter.getNavTreePath() != null) {
      return new NavTreePathHandler(finder, filter);
    }
    if (filter.getBeanTypeDef() != null) {
      return new BeanTypeDefHandler(finder, filter);
    }
    if (StringUtils.notEmpty(filter.getBeanTypeContains())) {
      return new BeanTypeContainsHandler(finder, filter);
    }
    if (StringUtils.notEmpty(filter.getPathContains())) {
      return new PathContainsHandler(finder, filter);
    }
    if (StringUtils.notEmpty(filter.getKey())) {
      return new KeyHandler(finder, filter);
    }
    if (StringUtils.notEmpty(filter.getKeyContains())) {
      return new KeyContainsHandler(finder, filter);
    }
    if (StringUtils.notEmpty(filter.getPropertyName())) {
      return new PropertyNameHandler(finder, filter);
    }
    if (StringUtils.notEmpty(filter.getPropertyLabelContains())) {
      return new PropertyLabelContainsHandler(finder, filter);
    }
    if (filter.getPropertyType() != null) {
      return new PropertyTypeHandler(finder, filter);
    }
    throw new AssertionError("Unknown filter type: " + filter);
  }

  protected SearchBeanFilterHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
    this.finder = finder;
    this.filter = filter;
  }

  protected SearchBeanFinder getFinder() {
    return finder;
  }

  protected SearchBeanFilter getFilter() {
    return filter;
  }

  List<PagePropertyDef> getPropertyDefs(BeanTreePath beanTreePath) {
    String typeName = beanTreePath.getTypeDef().getTypeName();
    List<PagePropertyDef> rtn = typeNameToPropertyDefs.get(typeName);
    if (rtn == null) {
      rtn = new ArrayList<>();
      findPropertyDefs(beanTreePath, rtn);
      typeNameToPropertyDefs.put(typeName, rtn);
    }
    return rtn;
  }

  protected void findPropertyDefs(BeanTreePath beanTreePath, List<PagePropertyDef> propertyDefs) {
    // by default, a filter doesn't need any properties to see whether the filter passes
  }

  List<SearchBeanPropertyResults> getResults() {
    return results;
  }

  boolean beanPassesFilter(BeanSearchResults beanResults) {
    results.clear();
    boolean matches = beanMatchesFilter(beanResults);
    IncludeInResults include = getFilter().getIncludeInResults();
    if (include == IncludeInResults.NEVER || (include == IncludeInResults.IF_MATCHES && !matches)) {
      // don't return the properties used to determine if the filter passed
      results.clear();
    }
    return matches;
  }

  boolean beanTypePassesFilter(BeanTreePath beanTreePath) {
    return beanTypeMatchesFilter(beanTreePath);
  }

  protected abstract boolean beanTypeMatchesFilter(BeanTreePath beanTreePath);

  protected abstract boolean beanMatchesFilter(BeanSearchResults beanResults);

  private static class BeanTreePathHandler extends SearchBeanFilterHandler {
    private BeanTreePathHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
    }

    @Override
    protected boolean beanTypeMatchesFilter(BeanTreePath beanTreePath) {
      boolean haveKeys = false;
      return beanTreePathMatchesFilter(beanTreePath, haveKeys) == getFilter().isMatches();
    }

    @Override
    protected boolean beanMatchesFilter(BeanSearchResults beanResults) {
      boolean haveKeys = true;
      return beanTreePathMatchesFilter(beanResults.getBeanTreePath(), haveKeys) == getFilter().isMatches();
    }

    boolean beanTreePathMatchesFilter(BeanTreePath beanTreePath, boolean haveKeys) {
      if (beanTreePath.isRoot()) {
        return false;
      }
      List<SearchPathSegmentFilter> segmentFilters = getSegmentFilters();      
      int filterCount = segmentFilters.size();
      int filterIndex = 0;
      for (BeanTreePathSegment segment : beanTreePath.getSegments()) {
        BeanChildDef childDef = segment.getChildDef();
        // Check the segment's property name (e.g. Servers)
        if (filterIndex >= filterCount) {
          return false; // The bean tree path is too long to match.
        }
        if (!segmentMatches(segmentFilters.get(filterIndex), getSegmentValue(segment))) {
          return false;
        }
        filterIndex++;
        if (childDef.isCollection()) {
          // There should also be a segment filter for this collection's children's keys
          if (filterIndex >= filterCount) {
            return false; // The bean tree path is too long to match.
          }
          if (segment.isKeySet()) {
            // The segment is for a collection child (i.e. Server1).
            if (haveKeys) {
              // Check whether the child's key (name) matches.
              if (!segmentMatches(segmentFilters.get(filterIndex), segment.getKey())) {
                return false;
              }
            }
          } 
          filterIndex++;
        }
      }
      if (filterIndex < filterCount) {
        // the bean tree path is too short, i.e. we still have more filters to evaluate.
        return false;
      }
      return true;
    }

    private boolean segmentMatches(SearchPathSegmentFilter segmentFilter, String segmentHave) {
      if (segmentFilter.isAnyValue()) {
        return true;
      }
      String equals = segmentFilter.getEquals();
      if (StringUtils.notEmpty(equals)) {
        return equals.equals(segmentHave);
      }
      String contains = segmentFilter.getContains();
      if (StringUtils.notEmpty(contains)) {
        return getFinder().contains(segmentHave, contains);
      }
      throw new AssertionError("Unsupported path segment filter: " + segmentFilter);
    }

    private String getSegmentValue(BeanTreePathSegment segment) {
      return segment.getChildDef().getChildPath().getDotSeparatedPath();
    }

    private List<SearchPathSegmentFilter> getSegmentFilters() {
      return getFilter().getBeanTreePath();
    }
  }

  private static class NavTreePathHandler extends SearchBeanFilterHandler {
    private NavTreePathHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
    }

    @Override
    protected boolean beanTypeMatchesFilter(BeanTreePath beanTreePath) {
      boolean haveKeys = false;
      return beanTreePathMatchesFilter(beanTreePath, haveKeys) == getFilter().isMatches();
    }

    @Override
    protected boolean beanMatchesFilter(BeanSearchResults beanResults) {
      boolean haveKeys = true;
      return beanTreePathMatchesFilter(beanResults.getBeanTreePath(), haveKeys) == getFilter().isMatches();
    }

    boolean beanTreePathMatchesFilter(BeanTreePath beanTreePath, boolean haveKeys) {
      if (beanTreePath.isRoot()) {
        return false;
      }
      List<SearchPathSegmentFilter> segmentFilters = getSegmentFilters();      
      int filterCount = segmentFilters.size();
      int filterIndex = 0;
      NavTreePath navTreePath = getNavTreePath(beanTreePath);
      for (NavTreePathSegment segment : navTreePath.getSegments()) {
        // Check the segment's label (e.g. Servers)
        if (filterIndex >= filterCount) {
          return false; // The nav tree path is too long to match.
        }
        if (!segmentMatches(segmentFilters.get(filterIndex), getSegmentValue(segment))) {
          return false;
        }
        filterIndex++;
        if (segment.getNavTreeNodeDef().isChildNodeDef()) {
          BeanTreePath segmentBTP = segment.getBeanTreePath();
          if (haveKeys) {
            if (segmentBTP.isCollectionChild()) {
              // The segment is for a collection child (i.e. Server1).
              // Check whether the child's key (name) matches.
              if (filterIndex >= filterCount) {
                return false; // The nav tree path is too long to match.
              }
              if (!segmentMatches(segmentFilters.get(filterIndex), segmentBTP.getLastSegment().getKey())) {
                return false;
              }
              filterIndex++;
            }
          } else {
            if (segmentBTP.isCollection()) {
              // There should also be a segment filter for this collection's children's keys
              if (filterIndex >= filterCount) {
                return false; // The nav tree path is too long to match.
              }
              filterIndex++;
            }
          }
        }
      }
      if (filterIndex < filterCount) {
        // the nav tree path is too short, i.e. we still have more filters to evaluate.
        return false;
      }
      return true;
    }

    private boolean segmentMatches(SearchPathSegmentFilter segmentFilter, String segmentHave) {
      if (segmentFilter.isAnyValue()) {
        return true;
      }
      String equals = segmentFilter.getEquals();
      if (StringUtils.notEmpty(equals)) {
        return equals.equals(segmentHave);
      }
      String contains = segmentFilter.getContains();
      if (StringUtils.notEmpty(contains)) {
        return getFinder().contains(segmentHave, contains);
      }
      throw new AssertionError("Unsupported nav tree path segment filter: " + segmentFilter);
    }

    private String getSegmentValue(NavTreePathSegment segment) {
      return
        getFinder().getInvocationContext().getLocalizer().localizeString(
          segment.getNavTreeNodeDef().getLabel()
        );
    }
  
    private NavTreePath getNavTreePath(BeanTreePath beanTreePath) {
      return new NavTreePath(getFinder().getInvocationContext().getPageRepo(), beanTreePath);
    }

    private List<SearchPathSegmentFilter> getSegmentFilters() {
      return getFilter().getNavTreePath();
    }
  }

  private static class BeanTypeDefHandler extends SearchBeanFilterHandler {
    private BeanTypeDefHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
    }

    @Override
    protected boolean beanTypeMatchesFilter(BeanTreePath beanTreePath) {
      boolean matches = beanTreePath.getTypeDef().isTypeDef(getFilter().getBeanTypeDef());
      return matches == getFilter().isMatches();
    }

    @Override
    protected boolean beanMatchesFilter(BeanSearchResults beanResults) {
      return beanTypeMatchesFilter(beanResults.getBeanTreePath());
    }
  }

  private static class BeanTypeContainsHandler extends SearchBeanFilterHandler {
    private BeanTypeContainsHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
    }

    @Override
    protected boolean beanTypeMatchesFilter(BeanTreePath beanTreePath) {
      String typeLabel =
        getFinder().getInvocationContext().getLocalizer().localizeString(
          beanTreePath.getTypeDef().getInstanceNameLabel()
        );
      boolean matches =
        getFinder().contains(typeLabel, getFilter().getBeanTypeContains());
      return matches == getFilter().isMatches();
    }

    @Override
    protected boolean beanMatchesFilter(BeanSearchResults beanResults) {
      return beanTypeMatchesFilter(beanResults.getBeanTreePath());
    }
  }

  private static class PathContainsHandler extends SearchBeanFilterHandler {
    private PathContainsHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
    }

    @Override
    protected boolean beanTypeMatchesFilter(BeanTreePath beanTreePath) {
      if (beanTreePath.isCollection()) {
        return true; // since there might be a child whose key matches the filter
      }
      if (beanTreePath.isCollectionChild()) {
        throw new AssertionError("beanTreePath must not be a collection child:" + beanTreePath);
      }
      return lastNavTreePathSegmentLabelMatchesFilter(beanTreePath) == getFilter().isMatches();
    }

    @Override
    protected boolean beanMatchesFilter(BeanSearchResults beanResults) {
      boolean matches = false;
      BeanTreePath beanTreePath = beanResults.getBeanTreePath();
      if (beanTreePath.isCollectionChild()) {
        if (getFinder().contains(beanTreePath.getLastSegment().getKey(), getFilter().getPathContains())) {
          matches = true;
        }
      }
      if (!matches) {
        matches = lastNavTreePathSegmentLabelMatchesFilter(beanTreePath);
      }
      return matches == getFilter().isMatches();
    }

    private boolean lastNavTreePathSegmentLabelMatchesFilter(BeanTreePath beanTreePath) {
      boolean matches = false;
      NavTreePathSegment lastSegment =
        new NavTreePath(getFinder().getPageRepo(), beanTreePath).getLastSegment();
      if (lastSegment != null) {
        String lastSegmentLabel =
          getFinder().getInvocationContext().getLocalizer().localizeString(
            lastSegment.getNavTreeNodeDef().getLabel()
          );
        matches = getFinder().contains(lastSegmentLabel, getFilter().getPathContains());
      }
      return matches;
    }
  }


  private static class KeyHandler extends SearchBeanFilterHandler {
    private KeyHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
    }

    @Override
    protected boolean beanTypeMatchesFilter(BeanTreePath beanTreePath) {
      return beanTreePath.isCollection();
    }

    @Override
    protected boolean beanMatchesFilter(BeanSearchResults beanResults) {
      BeanTreePath beanTreePath = beanResults.getBeanTreePath();
      if (!beanTreePath.isCollectionChild()) {
        return false;
      }
      String keyHave = beanTreePath.getLastSegment().getKey();
      boolean matches = getFilter().getKey().equals(keyHave);
      return matches == getFilter().isMatches();
    }
  }

  private static class KeyContainsHandler extends SearchBeanFilterHandler {
    private KeyContainsHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
    }

    @Override
    protected boolean beanTypeMatchesFilter(BeanTreePath beanTreePath) {
      return beanTreePath.isCollection();
    }

    @Override
    protected boolean beanMatchesFilter(BeanSearchResults beanResults) {
      BeanTreePath beanTreePath = beanResults.getBeanTreePath();
      if (!beanTreePath.isCollectionChild()) {
        return false;
      }
      String keyHave = beanTreePath.getLastSegment().getKey();
      boolean matches = getFinder().contains(keyHave, getFilter().getKeyContains());
      return matches == getFilter().isMatches();
    }
  }

  private abstract static class PropertyHandler extends SearchBeanFilterHandler {

    private SearchValueFilterHandler valueHandler;

    private PropertyHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
      valueHandler = SearchValueFilterHandler.getHandler(finder, filter);
    }

    @Override
    protected boolean beanTypeMatchesFilter(BeanTreePath beanTreePath) {
      // If there are no matching properties, then the filter never passes
      // for this type since we can't even compute if a property value matches
      return !getPropertyDefs(beanTreePath).isEmpty();
    }

    @Override
    protected boolean beanMatchesFilter(BeanSearchResults beanResults) {
      getResults().clear();
      IncludeInResults include = getFilter().getIncludeInResults();
      List<PagePropertyDef> propertyDefs = getPropertyDefs(beanResults.getBeanTreePath());
      if (propertyDefs.isEmpty()) {
        return false;
      }
      // Return true if any of the properties has an acceptable value.
      boolean matches = false;
      for (PagePropertyDef propertyDef : propertyDefs) {
        SearchBeanPropertyResults propertyResults = getFinder().findProperty(propertyDef, beanResults);
        if (propertyResults != null) {
          boolean valueMatches = valueMatchesFilter(propertyResults);
          if (include == IncludeInResults.ALWAYS || (valueMatches && include == IncludeInResults.IF_MATCHES)) {
            getResults().add(propertyResults);
          }
          if (valueMatches) {
            matches = true;
          }
        }
      }
      return matches;
    }

    private boolean valueMatchesFilter(SearchBeanPropertyResults propertyResults) {
      if (valueHandler != null) {
        // There is a value filter.  See if the value passes it.
        return valueHandler.valuePassesFilter(propertyResults) == getFilter().isMatches();
      } else {
        // There is no value filter - accept any value
        return true;
      }
    }
  }

  private static class PropertyNameHandler extends PropertyHandler {
    private PropertyNameHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
    }

    @Override
    protected void findPropertyDefs(BeanTreePath beanTreePath, List<PagePropertyDef> propertyDefs) {
      getFinder().addPropertyDefMatchingPropertyName(
        beanTreePath,
        propertyDefs,
        getFilter().getPropertyName()
      );
    }
  }

  private static class PropertyLabelContainsHandler extends PropertyHandler {
    private PropertyLabelContainsHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
    }

    @Override
    protected void findPropertyDefs(BeanTreePath beanTreePath, List<PagePropertyDef> propertyDefs) {
      getFinder().addPropertyDefsMatchingPropertyLabelContains(
        beanTreePath,
        propertyDefs,
        getFilter().getPropertyLabelContains()
      );
    }
  }

  private static class PropertyTypeHandler extends PropertyHandler {
    private PropertyTypeHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
    }

    @Override
    protected void findPropertyDefs(BeanTreePath beanTreePath, List<PagePropertyDef> propertyDefs) {
      getFinder().addPropertyDefsMatchingPropertyType(
        beanTreePath,
        propertyDefs,
        getFilter().getPropertyType()
      );
    }
  }
}

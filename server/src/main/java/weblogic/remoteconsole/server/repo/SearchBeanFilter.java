// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;

/**
 * Specifies a filter that controls which beans a general search returns.
 * 
 * There are several kinds of filters:
 * 
 * - filter by a bean's nav tree path
 *
 * - filter by a collection child's exact key (typically name)
 * 
 * - filter by whether a collection child's key contains a string (any case)
 *
 * - filter by a bean's type (derived types are returned too)
 * 
 * - filter by whether a bean's type contains a string (any case)
 *   (doesn't return derived types)
 * 
 * - filter by whether the bean has a property whose name or type matches
 *   a name or pattern and whose value passes a value filter
 *
 *   If there are multiple matching properties (e.g. selecting all HealthState properties)
 *   then the filter passes if any of the properties' values pass the value filter
 * 
 *   property filters also let the caller specify if/when the property value
 *   is included in the bean's search results (never, always, if the filter passes)
 * 
 * Additionally, all filters let the caller configure:
 *
 * - whether the filter passes or fails if the filter isn't matched
 *
 * - whether the bean must not be returned if the filter fails
 *   (v.s. the bean is returned if any filter passes)
 */
public class SearchBeanFilter {

  // Whether the filter passes or fails if the filter isn't matched:
  private boolean matches = true;

  // Whether the bean must not be returned if the filter isn't passed:
  // (otherwise the bean is returned if any of the filters pass):
  private boolean required = false;

  // Used to select beans by their bean tree path:
  private List<SearchPathSegmentFilter> beanTreePath;

  // Used to select beans by their nav tree path:
  private List<SearchPathSegmentFilter> navTreePath;

  // Used to select collection children by their exact key:
  private String key;

  // Used to select collection children whose key contains a string (any case):
  private String keyContains;

  // Use to select beans by their exact type (derived types are included too):
  private BeanTypeDef beanTypeDef;

  // Used to select beans whose type contains a string (any case).
  // Does not include derived types.
  private String beanTypeContains;

  // Used to select beans that have a page that has an exact property (e.g. SSL.ListenPort)
  // and whose value passes a value filter:
  private String propertyName;

  // Used to select beans who nav tree path contains a string (any case)
  // and whose value passes a value filter.
  // If the bean is a collection child, then the last two parts of the path
  // are considered (e.g. .../Servers/S123).
  // If the bean is a singleton, then just the last part of the path is considered
  // (e.g. .../JTAMigratableTarget).
  private String pathContains;

  // Used to select beans that have a page with a property whose localized label
  // contains a string (any case) and whose value passes a value filter:
  private String propertyLabelContains;

  // Used to select beans that have a property that is a specific property type
  // (currently only HealthState and Reference supported):
  public enum PropertyType {
    HEALTH_STATE,
    REFERENCE
  }

  private PropertyType propertyType = null;

  // Used to define when a property's value passes the filter:
  private SearchValueFilter valueFilter;

  // Whether to include the properties used by the filter in the search results.
  public enum IncludeInResults {
    ALWAYS,     // Always include them in the results, regardless of whether the filter passes
    IF_MATCHES, // Only include the ones that passed the filter
    NEVER       // Never include them in the results
  }

  private IncludeInResults includeInResults = IncludeInResults.IF_MATCHES;

  public boolean isRequired() {
    return required;
  }

  public void setRequired(boolean val) {
    required = val;
  }

  public boolean isMatches() {
    return matches;
  }

  public void setMatches(boolean val) {
    matches = val;
  }

  public IncludeInResults getIncludeInResults() {
    return includeInResults;
  }

  public void setIncludeInResults(IncludeInResults val) {
    includeInResults = val;
  }

  public List<SearchPathSegmentFilter> getBeanTreePath() {
    return beanTreePath;
  }

  public void setBeanTreePath(List<SearchPathSegmentFilter> val) {
    beanTreePath = val;
  }

  public List<SearchPathSegmentFilter> getNavTreePath() {
    return navTreePath;
  }

  public void setNavTreePath(List<SearchPathSegmentFilter> val) {
    navTreePath = val;
  }

  public String getKey() {
    return key;
  }

  public void setKey(String val) {
    key = val;
  }

  public String getKeyContains() {
    return keyContains;
  }

  public void setKeyContains(String val) {
    keyContains = val;
  }

  public BeanTypeDef getBeanTypeDef() {
    return beanTypeDef;
  }

  public void setBeanTypeDef(BeanTypeDef val) {
    beanTypeDef = val;
  }

  public String getBeanTypeContains() {
    return beanTypeContains;
  }

  public void setBeanTypeContains(String val) {
    beanTypeContains = val;
  }

  public String getPathContains() {
    return pathContains;
  }

  public void setPathContains(String val) {
    pathContains = val;
  }

  public String getPropertyName() {
    return propertyName;
  }

  public void setPropertyName(String val) {
    propertyName = val;
  }

  public String getPropertyLabelContains() {
    return propertyLabelContains;
  }

  public void setPropertyLabelContains(String val) {
    propertyLabelContains = val;
  }

  public PropertyType getPropertyType() {
    return propertyType;
  }

  public void setPropertyType(PropertyType val) {
    propertyType = val;
  }

  public SearchValueFilter getValueFilter() {
    return valueFilter;
  }

  public void setValueFilter(SearchValueFilter val) {
    valueFilter = val;
  }
}

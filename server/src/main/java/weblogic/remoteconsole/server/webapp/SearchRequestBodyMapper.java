// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonValue;
import javax.json.JsonValue.ValueType;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.LongValue;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SearchBeanFilter;
import weblogic.remoteconsole.server.repo.SearchCriteria;
import weblogic.remoteconsole.server.repo.SearchPathSegmentFilter;
import weblogic.remoteconsole.server.repo.SearchProperty;
import weblogic.remoteconsole.server.repo.SearchValueFilter;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Converts a JAXRS Request body to a SearchCriteria (for performing a general search)
 */
public class SearchRequestBodyMapper extends RequestBodyMapper<SearchCriteria> {

  private static final String CRITERIA_FILTERS = "filters";
  private static final String CRITERIA_PROPERTIES = "properties";

  private static final String FILTER_REQUIRED = "required";
  private static final String FILTER_MATCHES = "matches";
  private static final String FILTER_BEAN_TREE_PATH = "beanTreePath";
  private static final String FILTER_NAV_TREE_PATH = "navTreePath";
  private static final String FILTER_KEY = "key";
  private static final String FILTER_KEY_CONTAINS = "keyContains";
  private static final String FILTER_BEAN_TYPE = "beanType";
  private static final String FILTER_BEAN_TYPE_CONTAINS = "beanTypeContains";
  private static final String FILTER_PATH_CONTAINS = "pathContains";
  private static final String FILTER_PROPERTY_NAME = "propertyName";
  private static final String FILTER_PROPERTY_LABEL_CONTAINS = "propertyLabelContains";

  private static final String FILTER_PROPERTY_TYPE = "propertyType";
  private static final String FILTER_VALUE_FILTER = "valueFilter";
  private static final String FILTER_INCLUDE_IN_RESULTS = "includeInResults";

  private static final String INCLUDE_IN_RESULTS_ALWAYS = "always";
  private static final String INCLUDE_IN_RESULTS_IF_MATCHES = "ifMatches";
  private static final String INCLUDE_IN_RESULTS_NEVER = "never";

  private static final String PROPERTY_TYPE_HEALTH_STATE = "healthState";
  private static final String PROPERTY_TYPE_REFERENCE = "reference";

  private static final String SEGMENT_ANY_VALUE = "anyValue";
  private static final String SEGMENT_EQUALS = "equals";
  private static final String SEGMENT_CONTAINS = "contains";

  private static final String VALUE_EQUALS = "equals";
  private static final String VALUE_LESS_THAN = "lessThan";
  private static final String VALUE_LESS_THAN_OR_EQUALS = "lessThanOrEquals";
  private static final String VALUE_GREATER_THAN = "greaterThan";
  private static final String VALUE_GREATER_THAN_OR_EQUALS = "greaterThanOrEquals";
  private static final String VALUE_ONE_OF = "oneOf";
  private static final String VALUE_CONTAINS = "contains";

  private static final String PROPERTY_PROPERTY_NAME = "propertyName";
  private static final String PROPERTY_PROPERTY_LABEL_CONTAINS = "propertyLabelContains";

  public static Response<SearchCriteria> fromRequestBody(
    InvocationContext ic,
    JsonObject requestBody
  ) {
    return (new SearchRequestBodyMapper(ic, requestBody)).fromRequestBody();
  }

  private SearchRequestBodyMapper(InvocationContext ic, JsonObject requestBody) {
    super(ic, requestBody, null);
  }

  @Override
  protected void parseRequestBody() {
    SearchCriteria criteria = getSearchCriteria();
    if (isOK()) {
      getResponse().setSuccess(criteria);
    }
  }

  private SearchCriteria getSearchCriteria() {
    JsonObject object = getRequestBody();
    SearchCriteria criteria = new SearchCriteria();
    criteria.setFilters(getFilters(object));
    criteria.setProperties(getProperties(object));
    return criteria;
  }

  private List<SearchBeanFilter> getFilters(JsonObject object) {
    List<SearchBeanFilter> filters = new ArrayList<>();
    JsonArray array = getOptionalJsonArray(object, CRITERIA_FILTERS);
    if (array != null) {
      for (int i = 0; isOK() && i < array.size(); i++) {
        filters.add(getFilter(array.get(i)));
      }
    }
    // TBD - there needs to be at least one filter!
    return filters;
  }

  private SearchBeanFilter getFilter(JsonValue value) {
    JsonObject object = asJsonObject(CRITERIA_FILTERS, value);
    if (!isOK()) {
      return null;
    }
    SearchBeanFilter filter = new SearchBeanFilter();
    filter.setRequired(getOptionalBoolean(object, FILTER_REQUIRED, false));
    filter.setMatches(getOptionalBoolean(object, FILTER_MATCHES, true));
    validateSpecifiesOneOf(
      object,
      FILTER_BEAN_TREE_PATH,
      FILTER_NAV_TREE_PATH,
      FILTER_KEY,
      FILTER_KEY_CONTAINS,
      FILTER_BEAN_TYPE,
      FILTER_BEAN_TYPE_CONTAINS,
      FILTER_PATH_CONTAINS,
      FILTER_PROPERTY_NAME,
      FILTER_PROPERTY_LABEL_CONTAINS,
      FILTER_PROPERTY_TYPE
    );
    getBeanTreePath(filter, object);
    getNavTreePath(filter, object);
    filter.setKey(getOptionalString(object, FILTER_KEY));
    filter.setKeyContains(getOptionalString(object, FILTER_KEY_CONTAINS));
    filter.setBeanTypeContains(getOptionalString(object, FILTER_BEAN_TYPE_CONTAINS));
    filter.setPathContains(getOptionalString(object, FILTER_PATH_CONTAINS));
    filter.setPropertyName(getOptionalString(object, FILTER_PROPERTY_NAME));
    filter.setPropertyLabelContains(getOptionalString(object, FILTER_PROPERTY_LABEL_CONTAINS));
    getBeanTypeDef(filter, object);
    getPropertyType(filter, object);
    getValueFilter(filter, object);
    getIncludeInResults(filter, object);
    return isOK() ? filter : null;
  }

  private void getBeanTreePath(SearchBeanFilter filter, JsonObject object) {
    List<SearchPathSegmentFilter> segmentFilters = getPathSegmentFilters(object, FILTER_BEAN_TREE_PATH);
    if (isOK()) {
      filter.setBeanTreePath(segmentFilters);
    }
  }

  private void getNavTreePath(SearchBeanFilter filter, JsonObject object) {
    List<SearchPathSegmentFilter> segmentFilters = getPathSegmentFilters(object, FILTER_NAV_TREE_PATH);
    if (isOK()) {
      filter.setNavTreePath(segmentFilters);
    }
  }

  private List<SearchPathSegmentFilter> getPathSegmentFilters(JsonObject object, String key) {
    JsonArray segmentFilterObjects = getOptionalJsonArray(object, key);
    if (!isOK() || segmentFilterObjects == null) {
      return null;
    }
    List<SearchPathSegmentFilter> segmentFilters = new ArrayList<>();
    for (JsonValue value : segmentFilterObjects) {
      JsonObject segmentFilterObject = asJsonObject(key, value);
      if (!isOK()) {
        return null;
      }
      SearchPathSegmentFilter segmentFilter = getPathSegmentFilter(segmentFilterObject);
      if (!isOK()) {
        return null;
      }
      segmentFilters.add(segmentFilter);
    }
    return segmentFilters;
  }

  private SearchPathSegmentFilter getPathSegmentFilter(JsonObject object) {
    validateSpecifiesOneOf(
      object,
      SEGMENT_ANY_VALUE,
      SEGMENT_EQUALS,
      SEGMENT_CONTAINS
    );
    SearchPathSegmentFilter segmentFilter = new SearchPathSegmentFilter();
    segmentFilter.setAnyValue(getOptionalBoolean(object, SEGMENT_ANY_VALUE));
    if (!isOK()) {
      return null;
    }
    segmentFilter.setEquals(getOptionalString(object, SEGMENT_EQUALS));
    if (!isOK()) {
      return null;
    }
    segmentFilter.setContains(getOptionalString(object, SEGMENT_CONTAINS));
    if (!isOK()) {
      return null;
    }
    return segmentFilter;
  }

  private void getBeanTypeDef(SearchBeanFilter filter, JsonObject object) {
    String beanType = getOptionalString(object, FILTER_BEAN_TYPE);
    if (!isOK() || StringUtils.isEmpty(beanType)) {
      return;
    }
    BeanTypeDef beanTypeDef =
      getInvocationContext().getPageRepo().getBeanRepo().getBeanRepoDef().getTypeDef(beanType);
    if (beanTypeDef == null) {
      badFormat("Unknown type: " + beanType + " : " + object);
    } else {
      filter.setBeanTypeDef(beanTypeDef);
    }
  }

  private void getPropertyType(SearchBeanFilter filter, JsonObject object) {
    String propertyType = getOptionalString(object, FILTER_PROPERTY_TYPE);
    if (!isOK() || StringUtils.isEmpty(propertyType)) {
      return;
    }
    validateMatchesOneOf(
      propertyType,
      PROPERTY_TYPE_HEALTH_STATE,
      PROPERTY_TYPE_REFERENCE
    );
    if (PROPERTY_TYPE_HEALTH_STATE.equals(propertyType)) {
      filter.setPropertyType(SearchBeanFilter.PropertyType.HEALTH_STATE);
    } else if (PROPERTY_TYPE_REFERENCE.equals(propertyType)) {
      filter.setPropertyType(SearchBeanFilter.PropertyType.REFERENCE);
    }
  }

  private void getValueFilter(SearchBeanFilter filter, JsonObject object) {
    validatePropertyFilterParameter(filter, object, FILTER_VALUE_FILTER);
    JsonObject valueFilterObject = getOptionalJsonObject(object, FILTER_VALUE_FILTER);
    if (!isOK() || valueFilterObject == null) {
      return;
    }
    SearchValueFilter valueFilter = new SearchValueFilter();
    validateSpecifiesOneOf(
      valueFilterObject,
        VALUE_EQUALS,
        VALUE_LESS_THAN,
        VALUE_LESS_THAN_OR_EQUALS,
        VALUE_GREATER_THAN,
        VALUE_GREATER_THAN_OR_EQUALS,
        VALUE_ONE_OF,
        VALUE_CONTAINS
    );
    valueFilter.setEquals(getOptionalValue(valueFilterObject, VALUE_EQUALS));
    valueFilter.setLessThan(getOptionalValue(valueFilterObject, VALUE_LESS_THAN));
    valueFilter.setLessThanOrEquals(getOptionalValue(valueFilterObject, VALUE_LESS_THAN_OR_EQUALS));
    valueFilter.setGreaterThan(getOptionalValue(valueFilterObject, VALUE_GREATER_THAN));
    valueFilter.setGreaterThanOrEquals(getOptionalValue(valueFilterObject, VALUE_GREATER_THAN_OR_EQUALS));
    valueFilter.setOneOf(getOptionalValues(valueFilterObject, VALUE_ONE_OF));
    valueFilter.setContains(getOptionalString(valueFilterObject, VALUE_CONTAINS));
    if (isOK()) {
      filter.setValueFilter(valueFilter);
    }
  }

  private void getIncludeInResults(SearchBeanFilter filter, JsonObject object) {
    // FortifyIssueSuppression Key Management: Hardcoded Encryption Key
    // This is normal variable, not an encryption key.  It's fine.
    String key = FILTER_INCLUDE_IN_RESULTS;
    validatePropertyFilterParameter(filter, object, key);
    if (!isOK() || !object.containsKey(key)) {
      return;
    }
    String include = getOptionalString(object, key, INCLUDE_IN_RESULTS_IF_MATCHES);
    validateMatchesOneOf(
      include,
      INCLUDE_IN_RESULTS_ALWAYS,
      INCLUDE_IN_RESULTS_IF_MATCHES,
      INCLUDE_IN_RESULTS_NEVER
    );
    if (INCLUDE_IN_RESULTS_ALWAYS.equals(include)) {
      filter.setIncludeInResults(SearchBeanFilter.IncludeInResults.ALWAYS);
    } else if (INCLUDE_IN_RESULTS_NEVER.equals(include)) {
      filter.setIncludeInResults(SearchBeanFilter.IncludeInResults.NEVER);
    }
  }

  private void validatePropertyFilterParameter(
    SearchBeanFilter filter,
    JsonObject object,
    String key
  ) {
    boolean isPropertyFilter =
      StringUtils.notEmpty(getOptionalString(object, FILTER_PROPERTY_NAME))
       || StringUtils.notEmpty(getOptionalString(object, FILTER_PROPERTY_LABEL_CONTAINS))
       || StringUtils.notEmpty(getOptionalString(object, FILTER_PROPERTY_TYPE));
    boolean haveValueFilter = object.containsKey(FILTER_VALUE_FILTER);
    if (!isPropertyFilter && haveValueFilter) {
      badFormat(key + " must not be specified: " + object);
    }
  }

  private List<SearchProperty> getProperties(JsonObject object) {
    List<SearchProperty> properties = new ArrayList<>();
    JsonArray array = getOptionalJsonArray(object, CRITERIA_PROPERTIES);
    if (isOK() && array != null) {
      for (int i = 0; isOK() && i < array.size(); i++) {
        properties.add(getProperty(array.get(i)));
      }
    }
    return isOK() ? properties : null;
  }

  private SearchProperty getProperty(JsonValue value) {
    JsonObject object = asJsonObject(CRITERIA_PROPERTIES, value);
    if (!isOK()) {
      return null;
    }
    SearchProperty property = new SearchProperty();
    validateSpecifiesOneOf(
      object,
      PROPERTY_PROPERTY_NAME,
      PROPERTY_PROPERTY_LABEL_CONTAINS
    );
    property.setPropertyName(getOptionalString(object, PROPERTY_PROPERTY_NAME));
    property.setPropertyLabelContains(getOptionalString(object, PROPERTY_PROPERTY_LABEL_CONTAINS));
    return isOK() ? property : null;
  }

  private void validateSpecifiesOneOf(JsonObject object, String... options) {
    int count = 0;
    for (String option : options) {
      if (object.containsKey(option)) {
        count++;
      }
    }
    if (count != 1) {
      badFormat("Must specify exactly one of " + Arrays.toString(options) + " : " + object);
    }
  }

  private void validateMatchesOneOf(String value, String... options) {
    for (String option : options) {
      if (option.equals(value)) {
        return;
      }
    }
    badFormat("Must specify one of " + Arrays.toString(options) + " : " + value);
  }

  private List<Value> getOptionalValues(JsonObject object, String key) {
    List<Value> values = new ArrayList<>();
    JsonArray array = getOptionalJsonArray(object, key);
    if (isOK() && array != null) {
      if (array.isEmpty()) {
        badFormat(key + " must not be an empty array: " + object);
      }
      for (int i = 0; isOK() && i < array.size(); i++) {
        values.add(asValue(array.get(i), key));
      }
    }
    return !isOK() || values.isEmpty() ? null : values;
  }

  private Value getOptionalValue(JsonObject object, String key) {
    // Just handle 
    JsonValue value = getOptionalJsonValue(object, key);
    if (value == null) {
      return null;
    }
    return asValue(value, key);
  }

  private Value asValue(JsonValue value, String key) {
    ValueType typeHave = value.getValueType();
    if (typeHave == ValueType.STRING) {
      return new StringValue(asString(key, value));
    }
    if (typeHave == ValueType.NUMBER) {
      return new LongValue(asLong(key, value));
    }
    if (typeHave == ValueType.TRUE || typeHave == ValueType.FALSE) {
      return new BooleanValue(asBoolean(key, value));
    }
    BeanTreePath btp = asBeanTreePath(key, value);
    if (btp != null) {
      return btp;
    }
    badFormat(key + " must be a string, number, boolean or bean tree path: " + typeHave);
    return null;
  }
}

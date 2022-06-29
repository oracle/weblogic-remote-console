// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Handle filtering a property value as part of a general search
 */
public abstract class SearchValueFilterHandler {

  private SearchBeanFinder finder;
  private SearchBeanFilter filter;

  static SearchValueFilterHandler getHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
    SearchValueFilter valueFilter = filter.getValueFilter();
    if (valueFilter == null) {
      // No value filter - the presence of a matching property means the BeanFilter passes.
      return null;
    }
    if (valueFilter.getEquals() != null) {
      return new EqualsHandler(finder, filter);
    }
    if (valueFilter.getOneOf() != null && !valueFilter.getOneOf().isEmpty()) {
      return new OneOfHandler(finder, filter);
    }
    if (valueFilter.getLessThan() != null) {
      return new LessThanHandler(finder, filter);
    }
    if (valueFilter.getLessThanOrEquals() != null) {
      return new LessThanOrEqualsHandler(finder, filter);
    }
    if (valueFilter.getGreaterThan() != null) {
      return new GreaterThanHandler(finder, filter);
    }
    if (valueFilter.getGreaterThanOrEquals() != null) {
      return new GreaterThanOrEqualsHandler(finder, filter);
    }
    if (StringUtils.notEmpty(valueFilter.getContains())) {
      return new ContainsHandler(finder, filter);
    }
    throw new AssertionError("Unknown value filter type: " + valueFilter);
  }

  protected SearchValueFilterHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
    this.finder = finder;
    this.filter = filter;
  }

  protected SearchBeanFinder getFinder() {
    return finder;
  }

  protected SearchBeanFilter getFilter() {
    return filter;
  }

  boolean valuePassesFilter(SearchBeanPropertyResults propertyResults) {
    Value value = propertyResults.getValue();
    if (value.isArray()) {
      for (Value val : value.asArray().getValues()) {
        if (valueMatchesFilter(val)) {
          return true; // if any array element passes the filter, then we've passed the filter
        }
      }
      return false;
    } else {
      return valueMatchesFilter(value);
    }
  }

  protected abstract boolean valueMatchesFilter(Value value);

  protected StringValue getValueAsString(Value value) {
    if (value.isString()) {
      return value.asString();
    }
    if (value.isBoolean()) {
      return new StringValue("" + value.asBoolean().getValue());
    }
    if (value.isLong()) {
      return new StringValue("" + value.asLong().getValue());
    }
    if (value.isInt()) {
      return new StringValue("" + value.asInt().getValue());
    }
    if (value.isDouble()) {
      return new StringValue("" + value.asDouble().getValue());
    }
    if (value.isHealthState()) {
      return new StringValue("" + value.asHealthState().getValue());
    }
    if (value.isBeanTreePath()) {
      return new StringValue("" + value.asBeanTreePath().toString());
    }
    // value.isDate ?
    // value.isDateAsLong ?
    // value.isProperties ?
    return null;
  }

  protected BooleanValue getValueAsBoolean(Value value) {
    return value.isBoolean() ? value.asBoolean() : null;
  }

  protected LongValue getValueAsLong(Value value) {
    if (value.isLong()) {
      return value.asLong();
    }
    if (value.isInt()) {
      return new LongValue(value.asInt().getValue());
    }
    return null;
  }

  protected DoubleValue getValueAsDouble(Value value) {
    if (value.isDouble()) {
      return value.asDouble();
    }
    if (value.isLong()) {
      return new DoubleValue(value.asLong().getValue());
    }
    if (value.isInt()) {
      return new DoubleValue(value.asInt().getValue());
    }
    return null;
  }

  protected BeanTreePath getValueAsBeanTreePath(Value value) {
    return value.isBeanTreePath() ? value.asBeanTreePath() : null;
  }

  private static class EqualsHandler extends SearchValueFilterHandler {
    private String want;

    private EqualsHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
      this.want = getValueAsString(filter.getValueFilter().getEquals()).getValue();
    }

    @Override
    protected boolean valueMatchesFilter(Value value) {
      StringValue have = getValueAsString(value);
      if (have == null) {
        return false;
      }
      return want.equals(have.getValue());
    }
  }

  private static class OneOfHandler extends SearchValueFilterHandler {
    List<String> want = new ArrayList<>();

    private OneOfHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
      for (Value w : filter.getValueFilter().getOneOf()) {
        this.want.add(getValueAsString(w).getValue());
      }
    }
  
    @Override
    protected boolean valueMatchesFilter(Value value) {
      StringValue have = getValueAsString(value);
      if (have == null) {
        return false;
      }
      for (String w : want) {
        if (w.equals(have.getValue())) {
          return true;
        }
      }
      return false;
    }
  }

  private abstract static class NumberHandler extends SearchValueFilterHandler {
    private long want; // Handle Double too?

    protected NumberHandler(SearchBeanFinder finder, SearchBeanFilter filter, Value want) {
      super(finder, filter);
      this.want = getValueAsLong(want).getValue();
    }
  
    @Override
    protected boolean valueMatchesFilter(Value value) {
      LongValue have = getValueAsLong(value);
      if (have == null) {
        return false;
      }
      return valueMatches(have.getValue(), want);
    }

    protected abstract boolean valueMatches(long have, long want);
  }

  private static class LessThanHandler extends NumberHandler {

    private LessThanHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter, filter.getValueFilter().getLessThan());
    }

    @Override
    protected boolean valueMatches(long have, long want) {
      return have < want;
    }
  }

  private static class LessThanOrEqualsHandler extends NumberHandler {

    private LessThanOrEqualsHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter, filter.getValueFilter().getLessThanOrEquals());
    }

    @Override
    protected boolean valueMatches(long have, long want) {
      return have <= want;
    }
  }

  private static class GreaterThanHandler extends NumberHandler {

    private GreaterThanHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter, filter.getValueFilter().getGreaterThan());
    }

    @Override
    protected boolean valueMatches(long have, long want) {
      return have > want;
    }
  }

  private static class GreaterThanOrEqualsHandler extends NumberHandler {

    private GreaterThanOrEqualsHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter, filter.getValueFilter().getGreaterThanOrEquals());
    }

    @Override
    protected boolean valueMatches(long have, long want) {
      return have >= want;
    }
  }

  private static class ContainsHandler extends SearchValueFilterHandler {
    String want;

    private ContainsHandler(SearchBeanFinder finder, SearchBeanFilter filter) {
      super(finder, filter);
      this.want = filter.getValueFilter().getContains().toLowerCase();
    }
  
    @Override
    protected boolean valueMatchesFilter(Value value) {
      StringValue have = getValueAsString(value);
      if (have == null) {
        return false;
      }
      return getFinder().contains(have.getValue(), want);
    }
  }
}


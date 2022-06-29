// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;

/**
 * This interface returns information a bean that is returned from a search.
*/
public interface BeanSearchResults {

  // Get the overall search results.
  public BeanReaderRepoSearchResults getSearchResults();

  // Get this bean's path
  public BeanTreePath getBeanTreePath();

  // Get a property of this bean. If it's an array, don't
  // sort the values (whic means the order can change each
  // time a search is made).
  // Returns null if the search results don't include this property.
  public Value getUnsortedValue(BeanPropertyDef propertyDef);

  // Get a property of this bean.  If it's an array, sort the array elements
  // just enough to make the output predictable, e.g. for everypage.
  // Returns null if the property is not present in the search results.
  public default Value getValue(BeanPropertyDef propertyDef) {
    Value unsorted = getUnsortedValue(propertyDef);
    if (unsorted == null) {
      return null;
    }
    if (!(propertyDef.isArray() && propertyDef.isReference())) {
      // we only sort arrays of references currently
      return unsorted;
    }
    if (propertyDef.isReferenceAsReferences()) {
      // either null or one reference
      return unsorted;
    }
    Value unsortedValue = Value.unsettableValue(unsorted);
    if (unsortedValue.isUnknown()) {
      // we cannot sort an unknown value
      return unsorted;
    }
    if (unsortedValue.isModelToken()) {
      // model token used for the entire array value
      return unsorted;
    }
    ArrayValue unsortedArray = unsortedValue.asArray();
    if (unsortedArray.getValues().size() < 2) {
      // no need to sort empty or single items arrays
      return unsorted;
    }
    Map<String,Value> sorter = new TreeMap<>();
    for (Value refValue : Value.unsettableValue(unsorted).asArray().getValues()) {
      String sortingKey = null;
      if (refValue.isBeanTreePath()) {
        sortingKey = refValue.asBeanTreePath().toString();
      } else if (refValue.isUnresolvedReference()) {
        sortingKey = refValue.asUnresolvedReference().getKey();
      } else if (refValue.isModelToken()) {
        sortingKey = refValue.asModelToken().getToken();
      } else if (refValue.isNullReference()) {
        sortingKey = "None";
      } else {
        throw
          new AssertionError(
            "Array of references child is not a bean tree path, model token, unresolved or null reference:"
            + " " + propertyDef
            + " " + refValue
          );
      }
      sorter.put(sortingKey, refValue);
    }
    List<Value> sortedRefs = new ArrayList<>();
    for (Value refValue : sorter.values()) {
      sortedRefs.add(refValue);
    }
    ArrayValue sortedArray = new ArrayValue(sortedRefs);
    if (unsorted.isSettable()) {
      return new SettableValue(sortedArray, unsorted.asSettable().getState());
    } else {
      return sortedArray;
    }
  }
}

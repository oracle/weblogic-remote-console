// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * This interface returns the requested beans/properties from a search request.
 */
public interface BeanReaderRepoSearchResults {

  // Get the search results for a bean from the overall search results.
  // Returns null if the bean is not present in the search results.
  public BeanSearchResults getBean(BeanTreePath beanPath);

  // Get the search results for a collection of beans from the overall search results.
  // It does not sort the results, so their order can vary each time a search is made.
  // Returns null if the collection is not present in the search results.
  public List<BeanSearchResults> getUnsortedCollection(BeanTreePath collectionPath);

  // Get the search results for a collection of beans from the overall search results.
  // Sorts the collection by bean tree path if the collection isn't ordered.
  // This is just enough sorting to make the output predictable, e.g. for everypage.
  // Note: the CFE has its own sorting where the user selects the column.
  // Returns null if the collection is not present in the search results.
  public default List<BeanSearchResults> getCollection(BeanTreePath collectionPath) {
    List<BeanSearchResults> unsorted = getUnsortedCollection(collectionPath);
    if (unsorted == null || collectionPath.getLastSegment().getChildDef().isOrdered()) {
      return unsorted;
    }
    Map<String,BeanSearchResults> sorter = new TreeMap<>();
    for (BeanSearchResults beanResults : unsorted) {
      sorter.put(beanResults.getBeanTreePath().toString(), beanResults);
    }
    List<BeanSearchResults> sorted = new ArrayList<>();
    for (BeanSearchResults beanResults : sorter.values()) {
      sorted.add(beanResults);
    }
    return sorted;
  }

  // Specifies whether this builder is a change manager search results.
  // (since that one lets the caller access more info).
  public default boolean isChangeManagerBeanRepoSearchResults() {
    return this instanceof ChangeManagerBeanRepoSearchResults;
  }

  // Convert this builder into a change manager search response.
  // Throws a ClassCastException if this builder is not a ChangeManagetBeanRepoSearchResponse.
  public default ChangeManagerBeanRepoSearchResults asChangeManagerBeanRepoSearchResults() {
    return (ChangeManagerBeanRepoSearchResults)this;
  }
}

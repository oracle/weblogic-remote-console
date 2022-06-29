// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;

/**
 * POJO for persisting the remote console's recent searches
 */
public class PersistedRecentSearches {

  private List<String> recentSearches = List.of();

  public List<String> getRecentSearches() {
    return recentSearches;
  }

  public void setRecentSearches(List<String> val) {
    recentSearches = (val != null) ? val : List.of();
  }
}

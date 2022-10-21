// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * POJO for persisting a table's customizations
 */
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class PersistedTableCustomizations {

  private List<String> displayedColumns = List.of();

  public List<String> getDisplayedColumns() {
    return displayedColumns;
  }

  public void setDisplayedColumns(List<String> val) {
    displayedColumns = (val != null) ? val : List.of();
  }
}

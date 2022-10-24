// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.HashMap;
import java.util.Map;

/**
 * POJO for persisting the remote console's tables' customizations
 */
public class PersistedTablesCustomizations {

  private Map<String,PersistedTableCustomizations> tableCustomizations = new HashMap<>();

  public Map<String,PersistedTableCustomizations> getTableCustomizations() {
    return tableCustomizations;
  }

  public void setTableCustomizations(Map<String,PersistedTableCustomizations> val) {
    tableCustomizations = (val != null) ? val : Map.of();
  }
}

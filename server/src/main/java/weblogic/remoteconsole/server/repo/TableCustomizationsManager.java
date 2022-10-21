// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.server.PersistableFeature;
import weblogic.remoteconsole.server.PersistenceManager;

/**
 * Utility class for managing table customizations, including their persistence.
 */
public class TableCustomizationsManager extends PersistableFeature<PersistedTablesCustomizations> {

  private static final PersistenceManager<PersistedTablesCustomizations> PERSISTENCE_MANAGER =
    new PersistenceManager<>(PersistedTablesCustomizations.class, "table-customizations");

  private PersistedTablesCustomizations customizations = new PersistedTablesCustomizations();

  TableCustomizationsManager() {
  }

  @Override
  protected PersistenceManager<PersistedTablesCustomizations> getPersistenceManager() {
    return PERSISTENCE_MANAGER;
  }

  @Override
  protected void fromPersistedData(InvocationContext ic, PersistedTablesCustomizations persistedData) {
    if (persistedData != null) {
      customizations = persistedData;
    } else {
      customizations = new PersistedTablesCustomizations();
    }
  }

  @Override
  protected PersistedTablesCustomizations toPersistedData(InvocationContext ic) {
    return customizations;
  }

  public TableCustomizations getTableCustomizations(InvocationContext ic, PageDef pageDef) {
    String tableId = getTableId(ic, pageDef);
    List<PagePropertyDef> defaultDisplayedColumnDefs = getDefaultDisplayedColumnDefs(pageDef);
    List<PagePropertyDef> defaultHiddenColumnDefs = getDefaultHiddenColumnDefs(pageDef);
    refresh(ic);
    PersistedTableCustomizations persisted = getTableIdToCustomizations().get(tableId);
    if (persisted == null) {
      return null;
    }
    List<String> persistedDisplayedColumns = persisted.getDisplayedColumns();
    List<String> defaultDisplayedColumns = getColumns(defaultDisplayedColumnDefs);
    List<String> defaultHiddenColumns = getColumns(defaultHiddenColumnDefs);
    return
      new TableCustomizations(
        tableId,
        getDisplayedColumns(
          persistedDisplayedColumns,
          defaultDisplayedColumns,
          defaultHiddenColumns
        )
      );
  }

  public List<String> getDefaultDisplayedColumns(PageDef pageDef) {
    return getColumns(getDefaultDisplayedColumnDefs(pageDef));
  }

  private static List<String> getDisplayedColumns(
    List<String> persistedDisplayedColumns,
    List<String> defaultDisplayedColumns,
    List<String> defaultHiddenColumns
  ) {
    List<String> displayedColumns = new ArrayList<>();
    for (String column : persistedDisplayedColumns) {
      if (defaultDisplayedColumns.contains(column) || defaultHiddenColumns.contains(column)) {
        displayedColumns.add(column);
      }
    }
    return displayedColumns;
  }

  private static List<String> getPersistedDisplayedColumns(
    List<String> newDisplayedColumns,
    List<PagePropertyDef> defaultDisplayedColumnDefs,
    List<PagePropertyDef> defaultHiddenColumnDefs,
    List<String> oldPersistedDisplayedColumns
  ) {
    List<String> defaultDisplayedColumns = getColumns(defaultDisplayedColumnDefs);
    List<String> defaultHiddenColumns = getColumns(defaultHiddenColumnDefs);
    List<String> newPersistedDisplayedColumns = new ArrayList<>();
    for (String column : newDisplayedColumns) {
      // Add any new displayed columns that the table actually supports
      if (defaultDisplayedColumns.contains(column) || defaultHiddenColumns.contains(column)) {
        newPersistedDisplayedColumns.add(column);
      } else {
        // Throw an AssertionError? i.e. the CFE should never send in unknown columns
      }
    }
    for (String column : oldPersistedDisplayedColumns) {
      // Add any old persisted columns that the table doesn't support
      // (e.g. if the user customized the table in a newer WebLogic version
      // that has properties this version doesn't support)
      if (!defaultDisplayedColumns.contains(column) && !defaultHiddenColumns.contains(column)) {
        newPersistedDisplayedColumns.add(column);
      }
    }
    return newPersistedDisplayedColumns;
  }

  private static List<String> getColumns(List<PagePropertyDef> columnDefs) {
    List<String> columns = new ArrayList<>();
    for (PagePropertyDef columnDef : columnDefs) {
      columns.add(columnDef.getFormPropertyName());
    }
    return columns;
  }

  public void setTableCustomizations(
    InvocationContext ic,
    PageDef pageDef,
    List<String> newDisplayedColumns
  ) {
    String tableId = getTableId(ic, pageDef);
    List<PagePropertyDef> defaultDisplayedColumnDefs = getDefaultDisplayedColumnDefs(pageDef);
    List<PagePropertyDef> defaultHiddenColumnDefs = getDefaultHiddenColumnDefs(pageDef);
    refresh(ic);
    if (newDisplayedColumns == null) {
      // Remove the customization (i.e. do a 'reset')
      if (getTableIdToCustomizations().containsKey(tableId)) {
        getTableIdToCustomizations().remove(tableId);
        update(ic);
      }
      return;
    }
    PersistedTableCustomizations oldPersisted = getTableIdToCustomizations().get(tableId);
    List<String> oldPersistedDisplayedColumns =
      (oldPersisted != null) ? oldPersisted.getDisplayedColumns() : List.of();
    List<String> newPersistedDisplayedColumns =
      getPersistedDisplayedColumns(
        newDisplayedColumns,
        defaultDisplayedColumnDefs,
        defaultHiddenColumnDefs,
        oldPersistedDisplayedColumns
      );
    PersistedTableCustomizations newPersisted = new PersistedTableCustomizations();
    newPersisted.setDisplayedColumns(newPersistedDisplayedColumns);
    getTableIdToCustomizations().put(tableId, newPersisted);
    update(ic);
  }

  public synchronized void deleteTableCustomizations(InvocationContext ic, String tableId) {
    refresh(ic);
    if (getTableIdToCustomizations().containsKey(tableId)) {
      getTableIdToCustomizations().remove(tableId);
      update(ic);
    }
  }

  private String getTableId(InvocationContext ic, PageDef pageDef) {
    String typeName = pageDef.getPagePath().getPagesPath().getTypeDef().getTypeName();
    if (pageDef.isTableDef()) {
      return typeName;
    }
    if (pageDef.isSliceTableDef()) {
      String slice = pageDef.getPagePath().asSlicePagePath().getSlicePath().getDotSeparatedPath();
      // Currently, only the custom filtering dashboards' 'View' slice table needs
      // a non-standard table id. For expedience, special case it here.
      // If, in the future, another table needs a non-standard table id,
      // we can add a way for a page to customize its table id
      // (v.s. special casing it here too).
      if ("CustomFilteringDashboardMBean".equals(typeName) && "View".equals(slice)) {
        return getCustomFilteringDashboardTableId(ic);
      }
      return typeName + "?slice=" + slice;
    }
    throw new AssertionError(pageDef.getPagePath() + " is not a table or a slice table");
  }

  String getCustomFilteringDashboardTableId(InvocationContext ic) {
    return "CustomFilteringDashboard=" + ic.getBeanTreePath().getLastSegment().getKey();
  }

  private List<PagePropertyDef> getDefaultDisplayedColumnDefs(PageDef pageDef) {
    if (pageDef.isTableDef()) {
      return pageDef.asTableDef().getDisplayedColumnDefs();
    }
    if (pageDef.isSliceTableDef()) {
      return pageDef.asSliceTableDef().getDisplayedColumnDefs();
    }
    throw new AssertionError(pageDef.getPagePath() + " is not a table or a slice table");
  }

  private List<PagePropertyDef> getDefaultHiddenColumnDefs(PageDef pageDef) {
    if (pageDef.isTableDef()) {
      return pageDef.asTableDef().getHiddenColumnDefs();
    }
    if (pageDef.isSliceTableDef()) {
      return pageDef.asSliceTableDef().getHiddenColumnDefs();
    }
    throw new AssertionError(pageDef.getPagePath() + " is not a table or a slice table");
  }

  private Map<String,PersistedTableCustomizations> getTableIdToCustomizations() {
    return customizations.getTableCustomizations();
  }
}

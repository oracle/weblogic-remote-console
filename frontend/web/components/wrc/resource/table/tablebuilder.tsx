/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { Action, Polling } from "../../shared/typedefs/pdj";
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { KeySetImpl } from "ojs/ojkeyset";
import "ojs/ojtable";
import { ojTable, TableElement } from "ojs/ojtable";
import { PropertyValue, Reference, Resource } from "../../shared/typedefs/rdj";
import Translations = require("ojs/ojtranslation");

import { Builder } from "../../shared/controller/builder";
import { cellCompare, SORT_ORDER, TableContentModel } from "../../shared/model/tablecontentmodel";

import "ojs/ojmenu";
import "ojs/ojnavigationlist";
import "ojs/ojselector";
import { Dispatch, useContext, useEffect, useRef, useState } from "preact/hooks";
import { Response } from "wrc/shared/typedefs/common";
import { Help } from "../shared/help";
import { TableIntro } from "./tableintro";
import { UserContext } from "../resource";
import Breadcrumbs from "../breadcrumbs";
import TableToolbar from "./table-toolbar";
import { Actions } from "../actions";
import { broadcastMessageResponse } from "wrc/shared/controller/notification-utils";
import { ComponentChildren } from "preact";
import { JSX } from "preact";
import { subscribeToRefresh, RefreshDetail } from "wrc/shared/refresh";
import { isSuccessful } from "wrc/shared/messages";

type Props = { tableContent?: TableContentModel; pageContext?: string; bare?: boolean; onSelectionChanged?: (keys: KeySetImpl<string>) => void };

export class TableBuilder extends Builder {
  readonly type = "table";
  tableContent: TableContentModel | undefined;
  pageContext?: string;
  bare?: boolean;
  onSelectionChanged?: (keys: KeySetImpl<string>) => void;

  public getHTML() {
    return <Table tableContent={this.tableContent} pageContext={this.pageContext} bare={this.bare} onSelectionChanged={this.onSelectionChanged} />;
  }

  /**
   *
   * @param tableContent
   * @param renderCB
   */
  constructor(tableContent: TableContentModel | undefined, pageContext?: string, bare?: boolean, onSelectionChanged?: (keys: KeySetImpl<string>) => void) {
    super();
    this.tableContent = tableContent;
    this.pageContext = pageContext;
    this.bare = bare;
    this.onSelectionChanged = onSelectionChanged;
  }

  public getPageTitle(): string | undefined {
    return this.tableContent?.getPageTitle?.();
  }
}

const Table = ({ tableContent, pageContext, bare, onSelectionChanged }: Props) => {
  let displayColumns: ojTable.Column<string, string>[] | undefined;
  const actions =  tableContent?.getActions();
  const [_1, setRefresh] = useState(false);
  const [_2, setModel] = useState<TableContentModel | undefined>(tableContent);
  const [showHelp, setShowHelp] = useState(false);
  const [enabledActions, setEnabledActions] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState({
    row: new KeySetImpl<string>(),
    column: new KeySetImpl<string>(),
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(0);

  // Server-sorted tables: backend controls row order; frontend must not re-sort
  const serverSorted = !!tableContent?.isServerSorted?.();

  // Ensure that any actionPolling is stopped when DOM destroyed
  useEffect(() => { return () => tableContent?.stopPolling(); }, []);

  // Listen for global refresh requests (content scope) to refresh the table
  useEffect(() => {
    const unsubscribe = subscribeToRefresh((detail: RefreshDetail) => {
      if (detail?.scope?.content) {
        
        try {
          if (tableContent) {
            Promise
              .resolve(tableContent.refresh())
              .finally(() => {
                setRefresh((prev) => !prev);
                updateActionsDisabled();
              });
          } else {
            setRefresh((prev) => !prev);
            updateActionsDisabled();
          }
        } catch (_e) {
          setRefresh((prev) => !prev);
          updateActionsDisabled();
        }
      }
    });
    return unsubscribe;
  }, [tableContent]);

  let rowDataProvider: ArrayDataProvider<Reference, Record<string, Reference | PropertyValue | File>> | undefined;

  const selectedChangedListener = (
    event: ojTable.selectedChanged<any, any>,
  ) => {
    const row = event.detail.value.row as KeySetImpl<any>;
    const column = event.detail.value.column as KeySetImpl<any>;

    if (row.isAddAll()) {
      selectedItems.row = new KeySetImpl(allAvailableKeys);
    } else {
      selectedItems.row = row;
    }

    selectedItems.column = column;

    setSelectedItems(selectedItems);
    onSelectionChanged?.(selectedItems.row);

    updateActionsDisabled();
  };

  const getSelectionCount = (keys: KeySetImpl<string>) => Array.from(keys?.values?.() || []).length;

  const updateActionsDisabled = () => {
    const newEnabledActions: string[] = [];
   
    const updateActionDisabled = (action: Action) => {
      const count = getSelectionCount(selectedItems.row);
      let isEnabled: boolean;

      switch (action.rows) {
        case "multiple":
          isEnabled = count > 0;
          break;
        case "one":
          isEnabled = count === 1;
          break;
        case "none":
        default:
          isEnabled = true;
      }

      if (isEnabled) newEnabledActions.push(action.name);   
        return isEnabled;
      }
    


    // for each action, evaluate whether it is enabled and set the DOM element accordingly
    // for each action that includes a submenu, disable it only if all of its children are disabled
    actions?.forEach((action) => {
      if (action.actions) {
        let isMenuButtonEnabled = true;

        action.actions.forEach((subaction) => {
          isMenuButtonEnabled =
            updateActionDisabled(subaction) && isMenuButtonEnabled;
        });

        if (isMenuButtonEnabled) newEnabledActions.push(action.name);
      } else {
        updateActionDisabled(action);
      }
    });

    setEnabledActions(newEnabledActions);
  };

  useEffect(() => { updateActionsDisabled(); }, []);

  // Check drawer state periodically to update table container width
  useEffect(() => {
    const checkDrawerState = () => {
      const drawer = document.getElementById('drawer-layout') as any;
      if (drawer) {
        const isOpen = !!drawer.startOpened;
        setDrawerOpen(isOpen);
        if (isOpen) {
          const width = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--wrc-start-width')) || 0;
          setDrawerWidth(width);
          document.documentElement.style.setProperty('--table-container-width', `calc(100vw - ${width}px)`);
        } else {
          document.documentElement.style.setProperty('--table-container-width', '100vw');
        }
      }
    };

    // Check immediately
    checkDrawerState();

    // Check every 100ms to catch drawer open/close events
    const interval = setInterval(checkDrawerState, 100);

    return () => clearInterval(interval);
  }, []);

  const setupData = () => {
    setupColumns();
    setupRowDataProvider();
  };

  // remove any selected items that do not have a corresponding row..
  // consider the use case where you delete an Mbean, when the table rerenders the non-existent MBean needs to be unselected
  const cleanupSelected = (rowArray: Record<string, PropertyValue | File>[]) => {
    let changedSelectedItems = false;

    [...selectedItems?.row?.values()].forEach((row) => { 
      const ix = rowArray.findIndex(r => r['_rowSelector'] === row);

      if (ix === -1) {
        selectedItems.row = selectedItems.row.delete([row]);
        changedSelectedItems = true;
      } 
    });

    if (changedSelectedItems) {
      // make sure the oj-table sees the change:
      setSelectedItems({ ...selectedItems });
      updateActionsDisabled();
    }
  }

  let allAvailableKeys: string[]|undefined;

  const setupRowDataProvider = () => {
    const rowArray: Record<string, Reference | PropertyValue | File>[] = [];

    const rows = tableContent?.getRows();

    // list of resourceData of the preselected rows
    const preSelectedRows = tableContent?.getPreSelectedRows(); 
    const preSelectedRowKeys = [] as string[];

    rows?.forEach((row) => {
      const cell: Record<string, Reference | PropertyValue | File> = {};

      displayColumns?.forEach((column) => {
        const columnId = column["id"];

        if (columnId) {
          if (!row[columnId]) {
            cell[columnId] = "";
          } else if (!Array.isArray(row[columnId].value)) {
            if (typeof row[columnId].value != "object") {
              const rawVal = (row[columnId] as any).value;
              cell[columnId] = typeof rawVal === "boolean" ? String(rawVal) : rawVal;
            } else {
              cell[columnId] = (row[columnId].value as Reference)?.label || "";
            }
          } else {
            cell[columnId] = (row[columnId] as any).value.map(
              (v: { value: any }) => v.value.label,
            ).join(", ");
          }
        }
      });

      cell["identity"] = JSON.stringify(row["identity"]?.value);
      cell["identifier"] = typeof row["identifier"]?.value !== 'string' ? JSON.stringify( row["identifier"]?.value) : row["identifier"]?.value;

      // specifies the key for row selection -- this affects what gets sent to actions
      const rowSelectionProperty = tableContent?.getRowSelectionProperty();
      if (!rowSelectionProperty || rowSelectionProperty === 'none') {
        cell["_rowSelector"] = cell["identity"];
      } else {
        cell["_rowSelector"] = cell[rowSelectionProperty];
      }
      rowArray.push(cell);

      // preselect the row if indicated..
      if (preSelectedRowKeys && preSelectedRowKeys.length > 0) {
        const rowSelector = cell["_rowSelector"] as string;
        const resourceToMatch = JSON.parse(rowSelector);

        if (
          preSelectedRows?.find(
            (r) => r === (resourceToMatch.resourceData as Resource),
          ) ||
          preSelectedRows?.find((r) => r === resourceToMatch)
        ) {
          preSelectedRowKeys.push(rowSelector);
        }
      }
    });

    if (preSelectedRowKeys.length > 0) {
      setSelectedItems({ row: new KeySetImpl<string>(preSelectedRowKeys), column: new KeySetImpl() });
    }

    // wire each column to the sortComparator in the tableContentModel (disabled when serverSorted)
    const comparators = new Map(displayColumns?.map(i => [i.id, cellCompare] as [string, () => number]));
   
    cleanupSelected(rowArray);
    
    allAvailableKeys = rowArray.map(r => r['_rowSelector']) as string[];
    
    const providerOptions: any = { keyAttributes: "_rowSelector" };
    if (!serverSorted) {
      providerOptions.sortComparators = { comparators };
      providerOptions.implicitSort = [
        {
          attribute: tableContent?.sortProperty || "",
          direction: tableContent?.sortOrder || SORT_ORDER.ASCENDING,
        },
      ];
    }

    rowDataProvider = new ArrayDataProvider(rowArray, providerOptions);
  };

  const setupColumns = () => {
    const rawColumns = tableContent?.getColumnsCustomizedForDisplay().displayed;

    displayColumns = rawColumns?.map((column) => {
      return {
        id: column.name || null,
        field: column.name || null,
        headerText: column.label,
      } as ojTable.Column<any, any>;
    });

    return displayColumns;
  };

  const beginPolling = (polling: Polling) => {
    tableContent?.startPolling(polling, () => setRefresh(prev => !prev));
    setRefresh(prev => !prev); // Toolbar needs to know action polling has started
  };

  const actionHandler = (action: Action) => {
    const references = [...selectedItems.row.values()].map(
      (r) => {
        try {
          return JSON.parse(r as string) as Reference
        } catch (error) {
          return r;
        }
       }
    );

    tableContent
      ?.invokeAction(action, references as any)
      .then((response) => response.json())
      .then((messageResponse: Response) => {
        if (action.polling) {
          beginPolling(action.polling);
        }

        broadcastMessageResponse(ctx, messageResponse);

        if (isSuccessful(messageResponse)) {
          ctx?.onActionCompleted?.({ action, messages: messageResponse.messages });
        }

        if (messageResponse.reinit) {
          ctx?.context?.applicationController?.resetDisplay();
        }

        if (messageResponse.resourceData) {
          ctx?.context?.routerController?.navigateToAbsolutePath(messageResponse.resourceData.resourceData || '');
        }
      });
  };

  const ctx = useContext(UserContext);

  setupData();

  const totalRowString = Translations.applyParameters(
    t["wrc-table"].labels.totalRows.value,
    [tableContent?.getRows()?.length || 0],
  );

  const isMainWindow = pageContext === 'main';
  const isBare = !!bare;
  const hasSelectionActions = (() => {
    const requires = (act: Action): boolean => {
      if (act.actions && act.actions.length) return act.actions.some(requires);
      return act.rows === 'one' || act.rows === 'multiple';
    };
    return actions?.some(requires) || false;
  })();

  const cellClickHandler = (event: MouseEvent) => {    
    const key = (event?.currentTarget as TableElement<any,any>)?.currentRow?.rowKey;

    if (key) {

      const target = event?.target as HTMLSpanElement;

      // if they click on the text within a cell, target will be the span containing the text. need to get parent cell
      let cellIndex = (target.offsetParent as HTMLTableCellElement)?.cellIndex;

      // if they click on the space around the span containing text rather than on the text itself, 
      // get target will be the cell
      if (!cellIndex) {
        cellIndex = (target as HTMLTableCellElement).cellIndex;
      }

      if (cellIndex || !hasSelectionActions) {
        event.stopImmediatePropagation();

        const reference = JSON.parse(key) as Reference;

        ctx?.context?.routerController?.navigateToAbsolutePath(reference.resourceData || '');
      }
    }
  }

  const cellRenderer = ( cell: ojTable.CellTemplateContext<any, any>) => {
    return (<span>{cell.data}</span>);
  }

  const selectorCellRenderer = (cell: any) => {
    const key = (cell?.row?._rowSelector) ?? (cell?.data?._rowSelector);
    const onSelectorKeysChanged = (e: any) => {
      const newKeys = e?.detail?.value;
      if (newKeys) {
        setSelectedItems({ ...selectedItems, row: newKeys });
        onSelectionChanged?.(newKeys);
        updateActionsDisabled();
      }
    };
    return (
      <oj-selector
        selection-mode="multiple"
        row-key={key as any}
        selectedKeys={selectedItems.row as any}
        onselectedKeysChanged={onSelectorKeysChanged as any}
        data-oj-clickthrough="disabled"
        aria-label="checkbox"
      ></oj-selector>
    );
  }
  
  return (
    <div id="table-container" class="oj-flex-item cfe-table-content">
      {(isMainWindow && !isBare) ? <Breadcrumbs model={tableContent!} /> : <></>}
      {!isBare ? (
        <TableToolbar
          tableContent={tableContent!}
          setTableContent={setModel}
          showHelp={showHelp}
          onHelpClick={() => setShowHelp(!showHelp)}
          pageContext={pageContext}
          onPageRefresh={() => setRefresh(prev => !prev)}
        />
      ) : <></>}
      {(!showHelp && !isBare) ? <TableIntro tableContent={tableContent!} /> : <></>}
      {showHelp ? (
        <Help model={tableContent!} />
      ) : (
        <>
          {!isBare ? (
          <div id="table-actions-strip-container" class="cfe-actions-strip-container">
            <Actions
              model={tableContent!}
              onActionSelected={actionHandler}
              onActionPolling={beginPolling}
              enabledActions={enabledActions}
              selectedKeys={selectedItems.row}
            />
          </div>
          ) : (
            <></>
            )}
            <div className="cfe-table-container-scrollable">
          <oj-table
            id="table"
            aria-labelledby="intro"
            class="wlstable"
            display="grid"
            scroll-policy="loadMoreOnScroll"
            scroll-policy-options='{"fetchSize": 10000}'
            selected={selectedItems}
            selectionMode={{ row: hasSelectionActions ? "multiple" : "single", column: "none", }}
            onselectedChanged={selectedChangedListener}
            columns={displayColumns}
            data={rowDataProvider}
            onClick={cellClickHandler}
            columnsDefault={serverSorted ? { sortable: 'disabled' } : {}}
          >
            {hasSelectionActions ? <template slot="selectorCellTemplate" render={selectorCellRenderer} /> : <></>}
            <template slot="cellTemplate" render={cellRenderer} />
              </oj-table>
              </div>
          {(isMainWindow && !isBare) ? (
            <div id="totalRows">
              <span>{totalRowString}</span>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import "oj-c/button";
import {
  Dispatch,
  StateUpdater,
  useContext,
  useEffect,
  useState,
} from "preact/hooks";
import MultiSelect, { ChangeEvent, SelectOption } from "wrc/multiselect";
import { requireAsset } from "wrc/shared/url";
import { Column } from "wrc/shared/typedefs/pdj";
import { WeightedSort } from "wrc/shared/weighted-sort";
import { buildToolbarButtons } from "../shared/toolbar-render";
import type { ToolbarButtonConfig, ToolbarActionEvent } from "../shared/toolbar-types";
import { ActionRedwoodMap } from "../action-redwood-map";
import { TableContentModel } from "../../shared/model/tablecontentmodel";
import { UserContext } from "../resource";
import ToolbarIcons from "../shared/toolbaricons";
import * as Logger from "ojs/ojlogger";

type Props = Readonly<{
  tableContent: TableContentModel;
  setTableContent: Dispatch<TableContentModel>;
  showHelp: boolean;
  onHelpClick: () => void;
  pageContext?: string;
  pageLoading?: boolean;
  onPageRefresh?: () => void;
}>;

export enum BUTTONS {
  New = "new",
  Write = "write",
  Dashboard = "dashboard",
}

const TableToolbar = ({ tableContent, setTableContent, showHelp, onHelpClick, pageContext, pageLoading = false, onPageRefresh }: Props) => {
  const ctx = useContext(UserContext);

  const buttons: Record<BUTTONS, ToolbarButtonConfig> = {
    [BUTTONS.New]: {
      accesskey: undefined,
      isEnabled: () => true,
      action: (event: ToolbarActionEvent) => {
        const createForm = tableContent?.getCreateForm();
        if (createForm) {
          ctx?.context?.routerController?.navigateToAbsolutePath(
            createForm.resourceData || ""
          );
        }
      },
      isVisible: () => !!tableContent?.canCreate(),
      label: t["wrc-table-toolbar"].buttons.new.label,
      iconClass: ActionRedwoodMap[BUTTONS.New as unknown as string],
      iconFile: "new-icon-blk_24x24",
    },
    [BUTTONS.Write]: {
      accesskey: undefined,
      isEnabled: () => true,
      action: (event: ToolbarActionEvent) => {
        // Placeholder for WDT write action
        Logger.info("write");
      },
      isVisible: () => false,
      label: t["wrc-common"].buttons.write.label,
      iconClass: ActionRedwoodMap[BUTTONS.Write as unknown as string],
      iconFile: "write-wdt-model-blk_24x24",
    },
    [BUTTONS.Dashboard]: {
      accesskey: undefined,
      isEnabled: () => true,
      action: (event: ToolbarActionEvent) => {
        const form = tableContent?.getDashboardCreateForm();
        if (form?.resourceData) {
          ctx?.context?.routerController?.navigateToAbsolutePath(form.resourceData);
        }
      },
      isVisible: () => !!tableContent?.canCreateDashboard(),
      label: tableContent?.getDashboardCreateForm()?.label || "",
      iconClass: ActionRedwoodMap[BUTTONS.Dashboard as unknown as string],
      weight: 99, // Should always appear at the end of the toolbar
    },
  };

  const columnToSelectOptionMapper = (column: Column): SelectOption => {
    return { key: column.name, label: column.label };
  };

  const columns = tableContent?.getColumnsCustomizedForDisplay();

  const modelDisplayColumns = [...(columns?.displayed || [])].map(
    columnToSelectOptionMapper,
  );
  const modelHiddenColumns = [...(columns?.hidden || [])].map(
    columnToSelectOptionMapper,
  );

  // columns that are currently applied to the table -- these reflect what is in the model
  const [currentColumns, setCurrentColumns] = useState({
    available: modelHiddenColumns,
    display: modelDisplayColumns,
  });

  // columns that are currently under edit -- will either be committed to the model or discarded on reset/cancel.. not visible in the table yet
  const [pendingColumns, setPendingColumns] = useState({
    available: modelHiddenColumns,
    display: modelDisplayColumns,
  });

  // flag to indicate whether there are changes yet to be committed to the model -- for controlling apply/cancel button enablement
  const [hasCustomizerChanges, setHasCustomizerChanges] = useState(false);

  // when edits are made to pendingColumns, ensure hasCustomizerChanges gets updated so buttons can activate/deactivate
  useEffect(() => {
    // compare the keys in the selected columns to the keys recorded in the model
    const newKeys = pendingColumns.display.map((c) => c.key);
    const existingKeys = tableContent
      ?.getColumnsCustomizedForDisplay()
      ?.displayed?.map(columnToSelectOptionMapper)
      .map((c) => c.key);

    setHasCustomizerChanges(
      JSON.stringify(newKeys) !== JSON.stringify(existingKeys),
    );
  }, [pendingColumns.display]);


  const [customizerDisplayState, setCustomizerDisplayState] = useState(false);

  const toggleCustomizeDisplayAction = () => {
    setCustomizerDisplayState(!customizerDisplayState);
  };

  // discard the current state of the multiselect and refresh it with the model..
  // this will either be the state after they clicked Apply last
  // or the default if they have never clicked Apply
  const syncMultiSelectWithModel = () => {
    const columns = tableContent?.getColumnsCustomizedForDisplay();

    const modelDisplayColumns = JSON.parse(
      JSON.stringify(
        [...(columns?.displayed || [])].map(columnToSelectOptionMapper),
      ),
    );
    const modelHiddenColumns = JSON.parse(
      JSON.stringify(
        [...(columns?.hidden || [])].map(columnToSelectOptionMapper),
      ),
    );

    setCurrentColumns({
      available: modelHiddenColumns,
      display: modelDisplayColumns,
    });
    setPendingColumns({
      available: modelHiddenColumns,
      display: modelDisplayColumns,
    });
  };

  // force a refresh of all table components
  function refreshTable() {
    if (setTableContent && tableContent) setTableContent(tableContent.clone());
  }

  // Discard all of the table customizations that have been applied, restoring to default
  const customizeResetButtonAction = (event: ToolbarActionEvent) => {
    tableContent?.resetColumnsForDisplay();

    syncMultiSelectWithModel();

    refreshTable();
  };

  // Discard current state and return to last applied state...
  const customizeCancelButtonAction = (event: ToolbarActionEvent) => {
    syncMultiSelectWithModel();
  };

  // send desired columns to the model
  const customizeApplyButtonAction = (event: ToolbarActionEvent) => {
    const newDisplayColumns: Column[] = [];

    const allColumns = [
      ...(tableContent?.getDisplayedColumns() || []),
      ...(tableContent?.getHiddenColumns() || []),
    ];

    pendingColumns.display.forEach((column) => {
      const columnElement = allColumns.find((c) => c.name === column.key);

      if (columnElement) {
        newDisplayColumns.push(columnElement);
      }
    });
    tableContent?.selectColumnsForDisplay(newDisplayColumns);

    syncMultiSelectWithModel();

    refreshTable();
  };
  const columnChangeHandler = (event: ChangeEvent) => {
    setPendingColumns({ available: event.available, display: event.chosen });
  };

  const renderCustomizer = () => {
    if (customizerDisplayState) {
      return (
        <div
          class="oj-flex oj-sm-align-items-center"
          style={{ display: "inline-flex" }}
        >
          <MultiSelect
            chosen={currentColumns.display}
            available={currentColumns.available}
            changeHandler={columnChangeHandler}
          />

          <div class="oj-flex oj-sm-flex-direction-column oj-sm-align-self-center">
            <oj-c-button
              data-testid='customizer-reset'
              aria-label={t["wrc-common"].buttons.reset.label}
              label={t["wrc-common"].buttons.reset.label}
              class="table-customizer-button"
              chroming="outlined"
              onojAction={customizeResetButtonAction}
              disabled={!tableContent?.hasColumnDisplayCustomizations()}
            />

            <oj-c-button
              data-testid='customizer-apply'
              aria-label={t["wrc-common"].buttons.apply.label}
              label={t["wrc-common"].buttons.apply.label}
              class="table-customizer-button"
              chroming="outlined"
              onojAction={customizeApplyButtonAction}
              disabled={!hasCustomizerChanges}
            />

            <oj-c-button
              data-testid='customizer-cancel'
              aria-label={t["wrc-common"].buttons.cancel.label}
              label={t["wrc-common"].buttons.cancel.label}
              class="table-customizer-button"
              chroming="outlined"
              onojAction={customizeCancelButtonAction}
              disabled={!hasCustomizerChanges}
            />
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const customizerImageSrc = requireAsset("wrc/assets/images/table-customizer-icon-blk_24x24.png");
  const customizerLabel = t["wrc-table-toolbar"].buttons.customize.label;
  const expanderIconClassList = customizerDisplayState
    ? "oj-fwk-icon oj-fwk-icon-caret03-n"
    : "oj-fwk-icon oj-fwk-icon-caret03-s";

  const syncAction = () => {
    if (pageLoading) return;
    if (tableContent.isPolling()) {
      tableContent.stopPolling();
      onPageRefresh?.();
    } else {
      tableContent.refresh().then(() => {
        onPageRefresh?.();
      });
    }
  };

  const isMainWindow = pageContext === 'main';

  return (
    <>
      <div id="table-toolbar-container" class="oj-flex" style="max-width: 75rem;">
        <div id="table-toolbar-buttons" class="oj-flex-bar">
          <div class="oj-flex-bar-start">
            {!showHelp ? (
              <WeightedSort>
                {buildToolbarButtons(buttons as any)}
                {isMainWindow ? (
                  <div data-weight="0" class="cfe-table-customizer">
                    <a
                      accesskey="."
                      class="table-customizer-expander"
                      data-state="collapsed"
                      href="#"
                      onClick={toggleCustomizeDisplayAction}
                    >
                      <img
                        class="button-icon"
                        src={customizerImageSrc}
                        alt={customizerLabel}
                      />
                      <span aria-hidden="true" class="button-label">
                        {customizerLabel}
                      </span>
                      <span class={expanderIconClassList}></span>
                    </a>
                  </div>
                ) : (
                  <></>
                )}
              </WeightedSort>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div id="table-toolbar-icons" class="oj-flex-item">
        {isMainWindow ? (
          <ToolbarIcons
            showHelp={showHelp}
            onHelpClick={onHelpClick}
            syncEnabled={true}
            onSyncClick={syncAction}
            actionPolling={tableContent.isPolling() || pageLoading}
            pageContext={pageContext}
          />
        ) : (
          <></>
        )}
        </div>
      </div>
      {renderCustomizer()}
    </>
  );
};

export default TableToolbar;

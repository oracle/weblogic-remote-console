/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { Action, Column } from "../typedefs/pdj";
import { HelpData } from "../typedefs/common";
import { Datum, PropertyValue, PropertyValueArrayMember, RDJ, Reference } from '../typedefs/rdj';
import { extractHelpData } from "./model-utils";
import { getData } from "./transport";
import { Model } from "./common";
import { UnresolvedReference } from "./formcontentmodel";

const DELETE_ACTION = {
  name: "__DELETE",
  label: "Delete",
  rows: "multiple",
  polling: {
    reloadSeconds: 1,
    maxAttempts: 1,
  },
} as Action;

export enum SORT_ORDER  {
  ASCENDING='ascending',
  DESCENDING='descending'
};

export class TableContentModel extends Model {
  selectedColumnsForDisplay: Column[] | undefined;

  canCreate() {
    return this.getCreateForm() !== undefined;
  }

  getCreateForm() {
    return this.rdj.createForm;
  }

  canCreateDashboard() {
    return this.getDashboardCreateForm() !== undefined;
  }

  getDashboardCreateForm() {
    return this.rdj.dashboardCreateForm;
  }

  sortOrder = SORT_ORDER.ASCENDING;
  sortProperty = this.pdj.table?.defaultSortProperty;

  // Server-driven sort flag: when true, rows come pre-ordered from the server
  // and the frontend must not re-sort.
  isServerSorted() {
    return !!this.pdj.table?.ordered;
  }

  getRows() {
    let rows = TableContentModel._clone(this.rdj.data) as Datum[];

    if (this.sortProperty && !this.isServerSorted()) {
      rows.sort((a, b) => {
        return cellCompare(
          a[this.sortProperty!].value || a[this.sortProperty!].modelToken || "",
          b[this.sortProperty!].value || a[this.sortProperty!].modelToken || "",
        );
      });
    }

    return rows;
  }

  getDisplayedColumns() {
    const columns =
      this.pdj.table?.displayedColumns || this.pdj.sliceTable?.displayedColumns;

    return columns;
  }

  getHiddenColumns() {
    return this.pdj.table?.hiddenColumns;
  }

  public selectColumnsForDisplay(columns: Column[]) {
    this.selectedColumnsForDisplay = columns;
  }

  public resetColumnsForDisplay() {
    delete this.selectedColumnsForDisplay;
  }

  public hasColumnDisplayCustomizations() {
    return this.selectedColumnsForDisplay !== undefined;
  }

  public getColumnsCustomizedForDisplay() {
    if (this.selectedColumnsForDisplay) {
      const allColumns = [
        ...(this.getDisplayedColumns() || []),
        ...(this.getHiddenColumns() || []),
      ];
      const displayed = allColumns.filter((c) =>
        this.selectedColumnsForDisplay?.find((s) => s.name === c.name),
      );
      const hidden = allColumns.filter(
        (c) => !this.selectedColumnsForDisplay?.find((s) => s.name === c.name),
      );

      return { displayed, hidden };
    } else {
      return {
        displayed: this.getDisplayedColumns(),
        hidden: this.getHiddenColumns(),
      };
    }
  }

  getSlices() {
    return this.pdj.sliceTable?.slices;
  }

  showAdvanced: boolean = false;

  /*
      - the page is displayed
    - it includes buttons for the actions
      - actions that require that the user select one or more rows will be disabled
      - actions that don't use rows will be enabled
    - if any of the actions require rows, each row will have a checkbox icon too
  - if the user selects one row
    - actions that require one or multiple rows will be enabled
    - actions that don't use rows will be disabled
  - if the user selects multiple rows
    - actions that require multiple rows will be enabled
    - actions requiring exactly one row will be disabled
    - actions that don't use rows will be disabled
  - if the user deselects all the rows
    - actions that require rows will be disabled
    - actions that don't use rows will be enabled
  - if the user clicks an action
    - if the action doesn't have an input form
      - the action will be immediately started (for all selected rows if applicable)
    - if the action has an input form
      - the input form is displayed (it doesn't include the selected rows)
      - the user fills out the form and submits it
      - the action will be started (for all selected rows if applicable)
  */

  public static _clone(object: any) {
    return object ? JSON.parse(JSON.stringify(object)) : object;
  }

  public getActions() {
    let actions: Action[] = [];

    // Delete
    if (this.rdj.deletable) {
      actions.push(DELETE_ACTION);
    }

    const definedActions =
      this.pdj.table?.actions || this.pdj.sliceTable?.actions;

    if (definedActions) {
      actions.push(...definedActions);
    }

    return actions;
  }

  getHelpTopics() {
    return this.pdj.helpTopics;
  }

  getDetailedHelp(): HelpData[] {
    const everyColumn = [
      ...(this.getDisplayedColumns() || []),
      ...(this.getHiddenColumns() || []),
    ];

    return extractHelpData(everyColumn);
  }

  getIntroductionHTML() {
    return this.rdj.introductionHTML || this.pdj.introductionHTML;
  }

  getRowSelectionProperty() {
    return (
      this.pdj.table?.rowSelectionProperty ||
      this.pdj.sliceTable?.rowSelectionProperty
    );
  }

  // get a list of rows that have been preselected by the backend in the rdj
  getPreSelectedRows() {
    return this.rdj.selected;
  }

  async refresh() {
    if (this.rdjUrl) {
      let reloadRdjUrl = new URL(this.rdjUrl, window.origin);
      reloadRdjUrl.searchParams.set("reload", "true");

      return getData(reloadRdjUrl.pathname + reloadRdjUrl.search + reloadRdjUrl.hash, undefined).then(([rdj, pdj]) => {
        this.rdj = rdj;

        if (pdj) {
          this.pdj = pdj;
        }
      });
    }
  }

  clone() {
    const clonedModel = Object.create(Object.getPrototypeOf(this));
    Object.assign(clonedModel, this);
    return clonedModel;
  }
}

// compare function to compare two cells... used to sort rows  
export function cellCompare(value1: string | number | boolean | Reference | UnresolvedReference | PropertyValueArrayMember | PropertyValue[] | File |null, value2: string | number | boolean | Reference | PropertyValueArrayMember | PropertyValue[] | File | null): number {
  let result = 0;
  
  if (typeof value1 === typeof value1 && value1 !== null && value2 !== null) {
    if (typeof value1 === 'string') {
      result = value1.localeCompare(value2 as string);
    } else if (typeof value1 === 'boolean') {
     result = (value1 === value2) ? 0 : value1 ? -1 : 1
    } else if (typeof value1 === 'number') {
      result = value1 - (value2 as number); 
    } else if (typeof value1 === 'object' && typeof value2 === 'object') {
      // Reference
      if ('label' in value1 && 'label' in value2) {
        result = value1['label']?.localeCompare(value2['label']||'') || 0;
      }

      // Not yet supported: PropertyValueArrayMember | PropertyValue[] | File
    }
  }

  return result;
}
